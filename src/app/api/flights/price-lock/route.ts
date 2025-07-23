import { NextRequest, NextResponse } from 'next/server';
import { PriceLock } from '@/types/flight';
import { addMinutes } from 'date-fns';

// In-memory storage for price locks (in production, use Redis or database)
const priceLocks = new Map<string, PriceLock>();

export async function POST(request: NextRequest) {
    try {
        const { flightId, price } = await request.json();

        if (!flightId || !price) {
            return NextResponse.json(
                { error: 'Flight ID and price are required' },
                { status: 400 }
            );
        }

        // Generate price lock
        const sessionId = generateSessionId();
        const now = new Date();
        const expiresAt = addMinutes(now, 15);

        const priceLock: PriceLock = {
            flightId,
            lockedPrice: price,
            lockedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            sessionId
        };

        // Store the price lock
        priceLocks.set(flightId, priceLock);

        // Auto-cleanup expired locks after 20 minutes
        setTimeout(() => {
            priceLocks.delete(flightId);
        }, 20 * 60 * 1000);

        return NextResponse.json({
            success: true,
            priceLock,
            message: 'Price locked for 15 minutes'
        });

    } catch (error) {
        console.error('Price lock error:', error);
        return NextResponse.json(
            { error: 'Failed to lock price' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const flightId = searchParams.get('flightId');

        if (!flightId) {
            return NextResponse.json(
                { error: 'Flight ID is required' },
                { status: 400 }
            );
        }

        const priceLock = priceLocks.get(flightId);

        if (!priceLock) {
            return NextResponse.json(
                { error: 'Price lock not found' },
                { status: 404 }
            );
        }

        // Check if lock has expired
        const now = new Date();
        const expiresAt = new Date(priceLock.expiresAt);

        if (now > expiresAt) {
            priceLocks.delete(flightId);
            return NextResponse.json(
                { error: 'Price lock has expired' },
                { status: 410 }
            );
        }

        return NextResponse.json({
            priceLock,
            remainingTime: Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))
        });

    } catch (error) {
        console.error('Price lock retrieval error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve price lock' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const flightId = searchParams.get('flightId');

        if (!flightId) {
            return NextResponse.json(
                { error: 'Flight ID is required' },
                { status: 400 }
            );
        }

        const wasDeleted = priceLocks.delete(flightId);

        if (!wasDeleted) {
            return NextResponse.json(
                { error: 'Price lock not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Price lock released'
        });

    } catch (error) {
        console.error('Price lock deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to release price lock' },
            { status: 500 }
        );
    }
}

function generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
