import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export class StripeService {
  static async getStripe() {
    return await stripePromise
  }

  static async createCheckoutSession(priceId, userId, userEmail) {
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate the checkout process
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
          successUrl: `${window.location.origin}/settings?success=true`,
          cancelUrl: `${window.location.origin}/settings?canceled=true`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json()
      return session
    } catch (error) {
      console.error('Stripe checkout error:', error)
      throw new Error('Failed to create checkout session')
    }
  }

  static async redirectToCheckout(sessionId) {
    try {
      const stripe = await this.getStripe()
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Stripe redirect error:', error)
      throw new Error('Failed to redirect to checkout')
    }
  }

  static async createSubscription(userId, priceId) {
    try {
      // This would typically be handled by your backend
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create subscription')
      }

      const subscription = await response.json()
      return subscription
    } catch (error) {
      console.error('Stripe subscription error:', error)
      throw new Error('Failed to create subscription')
    }
  }

  static async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Stripe cancellation error:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  static async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      const status = await response.json()
      return status
    } catch (error) {
      console.error('Stripe status error:', error)
      throw new Error('Failed to get subscription status')
    }
  }

  // Pricing configuration
  static getPricingPlans() {
    return {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: null,
        features: [
          'Basic rights information',
          'Limited state coverage',
          'Basic incident recording',
          'English only'
        ],
        limitations: [
          'Limited to 3 incidents per month',
          'Basic rights information only',
          'No advanced scripting',
          'No multilingual support'
        ]
      },
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 3,
        interval: 'month',
        stripeId: 'price_premium_monthly', // This would be your actual Stripe price ID
        features: [
          'Complete state-specific rights',
          'Advanced conversation scripts',
          'Unlimited incident recording',
          'Multilingual support (English & Spanish)',
          'Incident analytics',
          'Shareable incident cards',
          'Priority support'
        ],
        popular: true
      }
    }
  }

  static async simulateCheckout(planId, userId, userEmail) {
    // Simulate checkout for development/demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          subscriptionId: `sub_${Date.now()}`,
          customerId: `cus_${Date.now()}`,
          status: 'active',
          planId
        })
      }, 2000)
    })
  }

  static async handlePaymentSuccess(sessionId) {
    try {
      // Verify the payment with your backend
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Payment verification error:', error)
      throw new Error('Failed to verify payment')
    }
  }

  static formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }
}

export default StripeService
