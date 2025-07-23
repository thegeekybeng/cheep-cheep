'use client';

import { useState } from 'react';
import { Check, Star, Zap, Shield, Bell, BarChart3, Users, CreditCard } from 'lucide-react';

interface PricingTier {
    id: string;
    name: string;
    price: number;
    currency: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'outline';
}

interface MonetizationProps {
    market: 'PH' | 'ID' | 'VN';
    onSelectPlan: (planId: string) => void;
}

export default function MonetizationComponent({ market, onSelectPlan }: MonetizationProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');

    // Market-specific pricing
    const marketConfig = {
        PH: {
            currency: 'PHP',
            symbol: '₱',
            basicPrice: { monthly: 249, yearly: 2490 },
            proPrice: { monthly: 599, yearly: 5990 },
            businessPrice: { monthly: 1499, yearly: 14990 }
        },
        ID: {
            currency: 'IDR',
            symbol: 'Rp',
            basicPrice: { monthly: 75000, yearly: 750000 },
            proPrice: { monthly: 150000, yearly: 1500000 },
            businessPrice: { monthly: 350000, yearly: 3500000 }
        },
        VN: {
            currency: 'VND',
            symbol: '₫',
            basicPrice: { monthly: 120000, yearly: 1200000 },
            proPrice: { monthly: 250000, yearly: 2500000 },
            businessPrice: { monthly: 600000, yearly: 6000000 }
        }
    };

    const config = marketConfig[market];

    const pricingTiers: PricingTier[] = [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            currency: config.currency,
            period: 'month',
            description: 'Perfect for occasional travelers',
            features: [
                '5 flight searches per day',
                '15-minute price lock',
                'Basic anti-manipulation protection',
                'Carry-on guarantee',
                'Email support'
            ],
            buttonText: 'Get Started',
            buttonVariant: 'outline'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: config.proPrice[selectedPeriod],
            currency: config.currency,
            period: selectedPeriod === 'monthly' ? 'month' : 'year',
            description: 'Best for frequent travelers',
            features: [
                'Unlimited flight searches',
                '30-minute price lock',
                'Advanced anti-manipulation',
                'Price alerts & notifications',
                'Historical price analytics',
                'Multi-city trip planning',
                'Priority customer support',
                'Mobile app access'
            ],
            popular: true,
            buttonText: 'Start Free Trial',
            buttonVariant: 'primary'
        },
        {
            id: 'business',
            name: 'Business',
            price: config.businessPrice[selectedPeriod],
            currency: config.currency,
            period: selectedPeriod === 'monthly' ? 'month' : 'year',
            description: 'For teams and travel agencies',
            features: [
                'Everything in Pro',
                'Team management (up to 10 users)',
                'Corporate travel dashboard',
                'Expense reporting',
                'API access',
                'Custom integrations',
                'Dedicated account manager',
                'White-label options'
            ],
            buttonText: 'Contact Sales',
            buttonVariant: 'secondary'
        }
    ];

    const formatPrice = (price: number) => {
        if (market === 'ID') {
            return new Intl.NumberFormat('id-ID').format(price);
        } else if (market === 'VN') {
            return new Intl.NumberFormat('vi-VN').format(price);
        } else {
            return new Intl.NumberFormat('en-PH').format(price);
        }
    };

    const savings = Math.round((config.proPrice.monthly * 12 - config.proPrice.yearly) / config.proPrice.monthly * 100 / 12);

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Choose Your CheepCheep Plan
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get the best flight deals with our anti-manipulation technology.
                        Save more on every booking with transparent pricing.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setSelectedPeriod('monthly')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${selectedPeriod === 'monthly'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('yearly')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${selectedPeriod === 'yearly'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:text-gray-900'
                                }`}
                        >
                            Yearly
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                                -{savings}%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`bg-white rounded-lg shadow-lg p-8 relative ${tier.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                                        <Star className="w-4 h-4 mr-1" />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                                <p className="text-gray-600 text-sm">{tier.description}</p>
                            </div>

                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {config.symbol}{formatPrice(tier.price)}
                                    </span>
                                    {tier.price > 0 && (
                                        <span className="text-gray-600 ml-2">/{tier.period}</span>
                                    )}
                                </div>
                                {selectedPeriod === 'yearly' && tier.price > 0 && (
                                    <p className="text-sm text-green-600 mt-1">
                                        Save {config.symbol}{formatPrice(tier.price / 12 * 2)} per year
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => onSelectPlan(tier.id)}
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${tier.buttonVariant === 'primary'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : tier.buttonVariant === 'secondary'
                                            ? 'bg-gray-800 text-white hover:bg-gray-900'
                                            : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                {tier.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Value Propositions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Anti-Manipulation</h3>
                        <p className="text-gray-600 text-sm">
                            Bypass price tracking and get genuine airline prices
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Alerts</h3>
                        <p className="text-gray-600 text-sm">
                            Get notified when prices drop for your favorite routes
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Analytics</h3>
                        <p className="text-gray-600 text-sm">
                            Historical data and trends to find the best booking times
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Features</h3>
                        <p className="text-gray-600 text-sm">
                            Manage corporate travel and expense reporting
                        </p>
                    </div>
                </div>

                {/* Money-back Guarantee */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-12 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <CreditCard className="w-8 h-8 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">30-Day Money-Back Guarantee</h3>
                    </div>
                    <p className="text-gray-600">
                        Try CheepCheep Pro risk-free. If you're not satisfied, get a full refund within 30 days.
                    </p>
                </div>
            </div>
        </div>
    );
}
