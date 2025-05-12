export interface Plan {
  name: string;
  description: string;
  price: number;
  features: string[];
  maxForms?: number;
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}