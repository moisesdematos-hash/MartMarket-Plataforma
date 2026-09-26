// @ts-nocheck

import React, { useEffect } from 'react';

interface PixelTrackerProps {
  fbPixelId?: string;
  gaPixelId?: string;
  event: 'InitiateCheckout' | 'Purchase';
  value?: number;
  currency?: string;
}

export const PixelTracker: React.FC<PixelTrackerProps> = ({
  fbPixelId,
  gaPixelId,
  event,
  value,
  currency
}) => {
  useEffect(() => {
    // Inject Facebook Pixel
    if (fbPixelId) {
      if (!window.fbq) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', fbPixelId);
      }
      
      if (event === 'InitiateCheckout') {
        window.fbq('track', 'InitiateCheckout', {
          value: value || 0,
          currency: currency || 'AOA'
        });
      } else if (event === 'Purchase') {
        window.fbq('track', 'Purchase', {
          value: value || 0,
          currency: currency || 'AOA'
        });
      }
    }

    // Google Analytics (Simplified DataLayer push)
    if (gaPixelId) {
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function(){window.dataLayer.push(arguments);}
        window.gtag('js', new Date());
        window.gtag('config', gaPixelId);
      }
      if (event === 'InitiateCheckout') {
        window.gtag('event', 'begin_checkout', {
          value: value || 0,
          currency: currency || 'AOA'
        });
      } else if (event === 'Purchase') {
        window.gtag('event', 'purchase', {
          value: value || 0,
          currency: currency || 'AOA'
        });
      }
    }
  }, [fbPixelId, gaPixelId, event, value, currency]);

  return null;
};
