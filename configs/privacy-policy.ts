export interface PrivacyList {
  intro?: string
  items: string[]
}

export interface PrivacySection {
  id: string
  title: string
  paragraphs?: string[]
  lists?: PrivacyList[]
  closingParagraphs?: string[]
  contactEmail?: string
}

export const privacyPolicySections: PrivacySection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'UFO Networks (collectively, “UFO,” “we” “us” or “our”) is an independent WiFi Hotspot service provider that operates the UFO WiFi hotspots, gaming zones and charging stations. UFO’s website is https://www.ufo-networks.org/. This Privacy Policy will explain how we use the personal data we collect from you when you use our UFO WiFi hotspots or when you visit our website. We respect the privacy of every person who visits our Site and/or uses our Services and we are committed to ensuring a safe online experience for all.',
      'This page is used to inform service consumers and website visitors regarding our policies with the collection, use, and disclosure of Personal Information.',
      'If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.',
    ],
  },
  {
    id: 'data-collection',
    title: 'How do we collect your data?',
    paragraphs: [
      'For a better experience while using our Service, we may require you to provide us with certain personally identifiable information. The information that we collect will be used to facilitate service delivery, or to contact, or identify you.',
      'You directly provide us with most of the data we collect. We collect data and process data when you:',
    ],
    lists: [
      {
        items: [
          'Log onto our WiFi hotspots',
          'Purchase WiFi access vouchers',
          'Sign up to create an account with us',
          'Subscribe for our updates',
          'Contact us for partnership',
          'Contact us with enquiries',
        ],
      },
      {
        intro: 'We may also receive your data indirectly from the following sources:',
        items: [
          'Third parties such as analytics providers, payment providers and third parties that provide technical services to us so that we can operate our Site and provide our Services.',
        ],
      },
    ],
  },
  {
    id: 'updates-subscription',
    title: 'Updates Subscription',
    paragraphs: [
      'When you subscribe for our updates, we collect your email address. This data is used exclusively to send you updates about our services. We process this information based on your consent. You can withdraw your consent at any time by clicking the "unsubscribe" link in any update email or by contacting us directly. Upon unsubscribing, your data will be promptly deleted from our updates distribution list.',
    ],
  },
  {
    id: 'log-data',
    title: 'Log Data',
    paragraphs: [
      'We want to inform you that whenever you use our Service, we collect information that your device and/or browser sends to us that is called Log Data. This Log Data may include information such as your device’s Media Access Control (MAC) address, Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.',
    ],
  },
  {
    id: 'service-providers',
    title: 'Service Providers',
    paragraphs: [
      'We employ third-party companies and individuals due to the following reasons:',
    ],
    lists: [
      {
        items: [
          'To assist by providing components of our Service;',
          'To provide the Service on our behalf;',
          'To perform Service-related services; or',
          'To assist us in analysing how our Service is used.',
        ],
      },
    ],
    closingParagraphs: [
      'We want to inform our Service users that these third parties may have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.',
    ],
  },
  {
    id: 'security',
    title: 'Security',
    paragraphs: [
      'We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.',
    ],
  },
  {
    id: 'other-sites',
    title: 'Access to Other Sites',
    paragraphs: [
      'Our Service facilitates access to various other sites. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to This Privacy Policy',
    paragraphs: [
      'We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    paragraphs: [
      'If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us through email on',
    ],
    contactEmail: 'info@ufo-networks.org',
  },
]

export const privacyPolicyMeta = {
  title: 'Privacy Policy of UFO Networks',
  website: 'https://www.ufo-networks.org/',
}
