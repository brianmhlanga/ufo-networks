export interface TermsItem {
  number: string
  text: string
  emphasis?: boolean
  subItems?: TermsItem[]
}

export interface TermsSection {
  number: string
  title: string
  items: TermsItem[]
}

export const termsOfServiceSections: TermsSection[] = [
  {
    number: '1',
    title: 'TERMS OF USE OF UFO NETWORKS SERVICES',
    items: [
      {
        number: '1.1',
        text: 'The use of the Organisation’s products, software, services and web sites (collectively referred to as “the services” in this document and excluding any services provided to you by the Organisation under a separate written agreement) is subject to the terms and conditions of use as set out below and constitutes a legal agreement between you and the Organisation. The latest version of these terms and conditions apply each time you visit the web-site or use the services. IT IS IMPORTANT THAT YOU READ AND UNDERSTAND THE TERMS OF USE APPLICABLE TO THE SERVICES.',
      },
      {
        number: '1.2',
        text: 'The terms and conditions referred to in paragraph 1.1 are deemed accepted by you and becomes effective from the first time you access the web site and / or when you use the services for the first time, and is applicable each time you access the web site and / or use the services, and this constitutes a binding agreement between UFO Networks and the user.',
      },
      {
        number: '1.3',
        text: 'Unless otherwise agreed in writing with the Organisation, the user’s agreement with the Organisation will always include, at a minimum, the terms and conditions set out in this document. These are referred to below as “Universal Terms”.',
      },
      {
        number: '1.4',
        text: 'The user’s agreement with the Organisation will also include the terms of any Legal Notices applicable to the services, the standard terms and conditions of sale of the Organisation, including its fee structure, billing and credit rules as well as the terms of any Dealer / Distributor Agreement entered between you and the Organisation, in addition to the Universal Terms. All of these are referred to below as the “Additional Terms”. Where Additional Terms apply to a service, these will be accessible for you to read either within, or through the user’s use of, that service.',
      },
      {
        number: '1.5',
        text: 'The Universal Terms, together with the Additional Terms, form a legally binding agreement between you and the Organisation in relation to your use of the services. Collectively, this legal agreement is referred to below as the “Terms”.',
      },
      {
        number: '1.6',
        text: 'If there is any contradiction between what is reflected in the Additional Terms and what the Universal Terms reflect, then the Additional Terms shall take precedence in relation to that service.',
      },
      {
        number: '1.7',
        text: 'THE USER IS RESPONSIBLE FOR PREVENTING UNAUTHORISED USE OF UFO NETWORKS SERVICES INCLUDING ACCESS TO THE UFO NETWORKS WEBSITE BY SAFEGUARDING PHYSICAL ACCESS TO DEVICES, USERNAMES AND PASSWORDS, AND BY MANAGING APPLICATIONS PERMISSIONS.',
        emphasis: true,
      },
    ],
  },
  {
    number: '2',
    title: 'ACCEPTANCE',
    items: [
      {
        number: '2.1',
        text: 'The Organisation will provide you with the services only once you have accepted the Terms. You may not use the services if you do not accept the Terms.',
      },
      {
        number: '2.2',
        text: 'You can accept the Terms by:',
        subItems: [
          {
            number: '2.2.1',
            text: 'in the event of the purchasing of products, clicking to “submit order”, where this option is made available to you by the Organisation in the user interface for any service; or',
          },
          {
            number: '2.2.2',
            text: 'in the event of requesting contact with a dealer / distributor then by, clicking “contact us”, where this option is made available to you by the Organisation in the user interface for any service; or',
          },
          {
            number: '2.2.3',
            text: 'by actually using the services. In this case, the user understands and agrees that the Organisation will treat your use of the services as acceptance of the Terms from that point onwards.',
          },
        ],
      },
      {
        number: '2.3',
        text: 'You may not use the services and may not accept the Terms if you:',
        subItems: [
          {
            number: '2.3.1',
            text: 'are not of legal age to form a binding contract with the Organisation; or',
          },
          {
            number: '2.3.2',
            text: 'are a person barred from receiving the services under the law of the country in which the user is resident or from which the user uses the services; or',
          },
          {
            number: '2.3.3',
            text: 'are not authorized in terms of a Distributor Agreement or Employment Agreement to use the services.',
          },
        ],
      },
      {
        number: '2.4',
        text: 'BEFORE YOU CONTINUE, YOU SHOULD PRINT OFF OR SAVE A LOCAL COPY OF THE UNIVERSAL TERMS FOR YOUR RECORDS!',
        emphasis: true,
      },
    ],
  },
  {
    number: '3',
    title: 'DEFINITIONS',
    items: [
      { number: '3.1', text: '“Agreement” means the Terms, Additional Terms, Legal Notices and Privacy Statement;' },
      { number: '3.2', text: '“Buyer” means a person, firm, company or organisation or any other legal entity who orders or purchases any goods or services offered by UFO Networks.' },
      { number: '3.3', text: '“fees” means any charges which the Organisation charge as per the Package/ Invoice / Statement of Account;' },
      { number: '3.4', text: '“the Organisation” means UFO Networks.' },
      { number: '3.5', text: '“Indemnified Party” means each of the Organisation, its officers, contractors, consultants and agents from time to time, and any related entities, associates or affiliates of the Organisation, and each of their respective officers, employees, contractors, consultants and agents from time to time;' },
      { number: '3.6', text: '“Intellectual Property Rights” means industrial and intellectual property whether protected by common law or under statute, including (without limitation) copyright, all rights in relation to inventions (including registered patents and the benefit of any application for a patent), registered and unregistered trademarks, registered and unregistered designs, product design and packaging, and other rights resulting from intellectual activity in the industrial, scientific, literary or artistic fields anywhere in the world;' },
      { number: '3.7', text: '“user” or “users” for the purposes of clauses 12 and 13, means any Buyer, or someone who is otherwise using UFO Networks services and / or accessing the Site;' },
      { number: '3.8', text: '“we”, “us”, “our”, “ourselves” and “the Organisation” are used interchangeably in this Agreement and all mean “the Organisation”;' },
      { number: '3.9', text: '“you” or “your” means the Buyer, its successors and permitted assigns' },
    ],
  },
  {
    number: '4',
    title: 'OWNERSHIP OF WEBSITE DOMAIN AND SOURCE CODE',
    items: [
      { number: '4.1', text: 'This website domain and its contents are the property of UFO Networks.' },
      { number: '4.2', text: 'UFO Networks is the owner of the source code of this website.' },
    ],
  },
  {
    number: '5',
    title: 'INFORMATION ON THIS SITE',
    items: [
      { number: '5.1', text: 'All information on this site is only intended to provide the user with general information about the Organisation, the Organisation’s products and services.' },
      { number: '5.2', text: 'All information regarding the Organisation’s products and services including information in respect of the terms and conditions, package prices or any other matter, is subject to change without notice.' },
      { number: '5.3', text: 'The site and all information provided on this site and the services provided on this site, are provided “as is” and should not be treated as advice of any kind. The user should consult with a professional advisor before relying on any information on this site.' },
      { number: '5.4', text: 'The Organisation may use the services of other third-party organizations to provide information on this site. The Organisation has no control over the third-party information and makes no representations or warranties of any nature as to its accuracy, appropriateness or correctness. The Organisation will not be directly or indirectly liable for any damages that may arise from the user’s reliance on it. The Organisation shall endeavour to the best of its ability to reflect information that is accurate but as above is indemnified by yourself as to information provided by a third party.' },
    ],
  },
  {
    number: '6',
    title: 'PROVISION OF SERVICES',
    items: [
      {
        number: '6.1',
        text: 'We will provide you with the Services, which will enable the user to:',
        subItems: [
          { number: '6.1.1', text: 'Use our Wi-Fi internet services;' },
          { number: '6.1.2', text: 'Use our Mobile Device charging services;' },
          { number: '6.1.2', text: 'Use our Gaming services;' },
          { number: '6.1.2', text: 'Advertise on our platforms;' },
          { number: '6.1.3', text: 'Manage your existing internet to facilitate metering and billing;' },
          { number: '6.1.4', text: 'Make use of any other services offered on the web-site.' },
        ],
      },
      {
        number: '6.2',
        text: 'We may:',
        subItems: [
          { number: '6.2.1', text: 'set limits or conditions on the right to certain services, features or functions offered by UFO Networks;' },
          { number: '6.2.2', text: 'restrict access to parts of or all the services that we offer, including physical access to our premises;' },
          { number: '6.2.3', text: 'modify, suspend or discontinue this site or any of our services, whether temporarily or permanently, without notice.' },
        ],
      },
    ],
  },
  {
    number: '7',
    title: 'FEES AND PRODUCTS',
    items: [
      { number: '7.1', text: 'We reserve the right in our sole discretion to alter or remove any Services or withdraw any Services offered. If we introduce a new Service, any fees for that Service will take effect from the launch of that Service, unless otherwise stated.' },
      { number: '7.2', text: 'Users are given the right to purchase services on this Site by paying the relevant packages/fees. This does not involve purchasing the rights to the actual web pages or other proprietary rights, which remain the property of the Organisation. We reserve the right in our sole discretion to place third party advertisements on the pages without your consent or payment to you.' },
    ],
  },
  {
    number: '8',
    title: 'USER',
    items: [
      {
        number: '8.1',
        text: 'You agree and warrant that:',
        subItems: [
          {
            number: '8.1.1',
            text: 'your personal information:',
            subItems: [
              { number: '8.1.1.1', text: 'is accurate and not false, misleading, deceptive or fraudulent;' },
              { number: '8.1.1.2', text: 'does not breach any Intellectual Property Rights of a third party;' },
              { number: '8.1.1.3', text: 'is made in compliance with all applicable laws, government regulations and / or guidelines;' },
              { number: '8.1.1.4', text: 'is not forged, threatening or offensive or otherwise constitutes harassment;' },
              { number: '8.1.1.5', text: 'does not contain confidential information or trade secrets of a third party unless you have obtained the consent of the third-party owner;' },
              { number: '8.1.1.6', text: 'does not contain any viruses, worms, Trojan horses or other invidious programs or data, whether attached to or embedded in other programs or data or not;' },
              { number: '8.1.1.7', text: 'will not defame (libel or slander) another person or transmit misleading or inaccurate information of any kind, whether of a personal or commercial nature;' },
            ],
          },
          { number: '8.1.2', text: 'you have the legal capacity to purchase or use any goods or services that you purchase, and, will not otherwise be breaching any law in purchasing the goods or services;' },
          { number: '8.1.3', text: 'you will not order any goods or services on this Site or from a Distributor, unless you are able, and have enough, available capacity to pay for those goods or services;' },
          { number: '8.1.4', text: 'the purchase of any goods and / or services on this Site is absolutely at your own risk.' },
        ],
      },
    ],
  },
  {
    number: '9',
    title: 'CHANGE IN TERMS AND CONDITIONS',
    items: [
      { number: '9.1', text: 'We have an absolute discretion to change the terms and conditions of this Agreement at any time. If we do so, we will post details of any changes on this Site, which changes will be effective forthwith from date of publication.' },
      { number: '9.2', text: 'By accepting this Agreement, you also agree to accept and be bound by any changes made by us under this clause 9 above. In any event, your continued use of the Services after any changes to the terms of this Agreement have taken effect in accordance with clause 9.1 above, will be deemed to be your acceptance of those changes to the terms of this Agreement. The user agrees to view and abide by the version reflected on the web site each time that this site is visited.' },
      { number: '9.3', text: 'The reflected version of these terms and conditions will govern the respective rights and obligations of the Organisation and the user each time the user access this site.' },
    ],
  },
  {
    number: '10',
    title: 'LINKED THIRD PARTY SITES',
    items: [
      { number: '10.1', text: 'This site may contain certain images and links to other third-party websites (“linked sites”) with information and material produced / advertised by other parties. The linked sites are not under the control of the Organisation and the Organisation is not responsible for the content of any linked site, including without limitation any link contained in a linked site or any changes or updates to a linked site.' },
      { number: '10.2', text: 'The Organisation is not responsible, nor does it promote any webcasting or any other form of transmission from linked sites nor is the Organisation responsible if the linked site is not working appropriately.' },
      { number: '10.3', text: 'The Organisation is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by the Organisation of the site, their business or security practices or any association with its operators nor does it imply that the Organisation agree with, edit or sponsor the content on such web pages.' },
    ],
  },
  {
    number: '11',
    title: 'HYPERLINKS, DEEP LINKING, CRAWLERS, METATAGS AND FRAMING',
    items: [
      { number: '11.1', text: 'Save insofar as it is permitted by an e-trade agreement entered into with the Organisation, no third party may establish a hyperlink, deep-links, frames, metatags or similar reference, whether electronically or otherwise (collectively referred to as “linking”), to this site without the Organisation’s prior written permission.' },
      { number: '11.2', text: 'the Organisation’s consent may be withheld or granted in their absolute and sole discretion and subject to any conditions specified by the Organisation.' },
      { number: '11.3', text: 'No user or any third party may frame this site or any of the pages on this site in any way whatsoever.' },
      { number: '11.4', text: 'No user or any third party may use any technology to search and gain any information from this site without the prior written permission from the Organisation.' },
      { number: '11.5', text: 'Breach of these conditions entitles the Organisation to take legal action without prior notice to the user and the user agrees to reimburse the costs associated with such legal action to us on an attorney and own client scale.' },
    ],
  },
  {
    number: '12',
    title: 'COMPLIANCE WITH THE TERMS AND CONDITIONS',
    items: [
      {
        number: '12.1',
        text: 'You agree that we may and will monitor your conduct on the Organisation website, if we believe that you are not complying with the terms and conditions of this Agreement we reserve the right to suspend or restrict access to the site. If we believe you do not comply with the terms and conditions, we will continue to respect your confidentiality as per legislation, unless:',
        subItems: [
          { number: '12.1.1', text: 'doing so would or could implicate or make us an accomplice to illegal or criminal behaviour, a civil claim, or any other claim by a person for which we may have to pay compensation;' },
          { number: '12.1.2', text: 'the law compels, requires, or makes it prudent and desirable for us to divulge or disclose the information we hold or know or any documents we possess;' },
          { number: '12.1.3', text: 'we consider it necessary or desirable to make disclosures to preserve or enforce our interests or rights, within the confines of the law.' },
        ],
      },
      { number: '12.2', text: 'If we believe, whether we have conducted any monitoring, that you are not, or may be in danger of not, complying with any of the provisions of this Agreement, then we may send you a warning asking you to rectify your conduct (although we will not be obliged to do so).' },
      {
        number: '12.3',
        text: 'If you:',
        subItems: [
          { number: '12.3.1', text: 'infringe or are suspected of infringing the Intellectual Property Rights of any other person;' },
          { number: '12.3.2', text: 'are suspected of having, or are found by conviction, settlement insurance or otherwise, to have engaged in any fraudulent or other criminal activity in connection with this Site or any other web site; or' },
          {
            number: '12.3.3',
            text: 'otherwise breach this Agreement, we may, in our absolute discretion: (a) withhold from you, your use of any or all the Services, and access to your personal information; (b) delete or remove, without incurring any liability to you, any or all of your personal information and block incoming and out-going data or message transfers or internet traffic; (c) restore the Services if and when you can demonstrate a clear and complete adherence to the terms of this Agreement on a permanent and consistent basis; (d) terminate the Agreement that we have entered into with you, and cancel our obligations to provide the Services, if we are not satisfied that you will clearly and completely adhere to the terms of this Agreement, on a permanent and consistent basis, if the Services are restored to you; and (e) take immediately legal action without telling you, and you agree to repay us our costs of this legal action on the scale of attorney and own client.',
          },
        ],
      },
    ],
  },
  {
    number: '13',
    title: 'USE OF SITE',
    items: [
      {
        number: '13.1',
        text: 'In using the UFO Networks Site, you may and must not:',
        subItems: [
          { number: '13.1.1', text: 'illegally copy, store, use, alter, modify, impair, interfere with or attempt to interfere with, or distribute software or other data;' },
          { number: '13.1.2', text: 'alter, damage, destroy, erase, interfere with or attempt to interfere with, or infect our files, data and other computer systems and network resources or those of other users or any other person, or access, copy, modify, remove or impair the reliability, security or operation of, any data or files or other information stored in these systems or network resources;' },
          { number: '13.1.3', text: 'impair the electronic communications to or from, or interfere with or obstruct the lawful use of, otherwise cause any unauthorized computer functions to our computer systems or those of other users or any other persons;' },
          { number: '13.1.4', text: 'engage in any conduct that is unlawful under any laws applicable to you.' },
        ],
      },
      { number: '13.2', text: 'Any links or references (direct or indirect) to other web sites on this Site are provided for your convenience only and do not and are not an express or implied endorsements by us, of those web sites, or the products and services contained on those web sites.' },
      { number: '13.3', text: 'Notwithstanding, and in addition to any other provision of this Agreement, you agree to comply with any laws applicable to you when using this Site.' },
    ],
  },
  {
    number: '14',
    title: 'ENTERING INTO THIS AGREEMENT',
    items: [
      {
        number: '14.1',
        text: 'You represent and warrant to us: if you are an individual that you are eighteen (18) years of age or over and of full legal capacity and thus, capable of entering into this Agreement and performing your obligations under this Agreement; or',
      },
      {
        number: '14.2',
        text: 'if you are a juristic entity:',
        subItems: [
          { number: '14.2.1', text: 'that you are duly incorporated; and' },
          { number: '14.2.2', text: 'entering into this Agreement does not violate your Constitution; and' },
          { number: '14.2.3', text: 'you have the power and have taken all corporate and other actions required to enter into this Agreement and to authorize entering into this Agreement and performing your obligations under this Agreement.' },
        ],
      },
    ],
  },
  {
    number: '15',
    title: 'LICENCE OF, AND USE OF, YOUR PERSONAL INFORMATION',
    items: [
      {
        number: '15.1',
        text: 'The Organisation may electronically collect, store, and use the following personal information of Users:',
        subItems: [
          { number: '15.1.1', text: 'name and surname, business name and trading name;' },
          { number: '15.1.2', text: 'mobile phone number;' },
          { number: '15.1.3', text: 'non-personal browsing habits and click patterns;' },
          { number: '15.1.4', text: 'email address;' },
          { number: '15.1.5', text: 'Device Name and MAC (Media Access Control) address of devices used to access our services.' },
        ],
      },
      {
        number: '15.2',
        text: 'the Organisation shall be entitled to collect, store and use the personal information for the following purposes:',
        subItems: [
          { number: '15.2.1', text: 'subject to the user’s consent, to inform the user about competitions and special offers from the Organisation and / or its partners and affiliates;' },
          { number: '15.2.2', text: 'to compile non-personal statistical information about browsing habits, click patterns and access to the Organisation website;' },
          { number: '15.2.3', text: 'to deliver voucher codes to the user;' },
          { number: '15.2.4', text: 'any other purpose permitted by law.' },
        ],
      },
      { number: '15.3', text: 'The information detailed in clause 15.1 above is collected either electronically by using cookies or is provided voluntarily by the user. The user may determine cookie use independently through their browser settings.' },
      { number: '15.4', text: 'The user may elect not to receive any communications from the Organisation or its partners and affiliates in terms of clauses 15.2.1 above.' },
      {
        number: '15.5',
        text: 'the Organisation shall be entitled to collect, maintain, save, compile and share any information collected from users, subject to the following provisions:',
        subItems: [
          { number: '15.5.1', text: 'the Organisation shall not disclose personal information from users without their consent thereto;' },
          { number: '15.5.2', text: 'the Organisation shall disclose information without the user’s consent only through due legal process;' },
          { number: '15.5.3', text: 'the Organisation may compile, use and share any information that does not relate to any specific individual; and' },
          { number: '15.5.4', text: 'the Organisation owns and retains all rights to non-personal statistical information collected and compiled by the Organisation.' },
        ],
      },
      { number: '15.6', text: 'Subject to clause above, we agree to use your personal information only in accordance with the Privacy Statement. If you do not agree with the terms of the Privacy Statement, please do not accept these terms and conditions.' },
    ],
  },
  {
    number: '16',
    title: 'USER TRAFFIC AND ITS CONTENTS',
    items: [
      { number: '16.1', text: 'The user accepts that the Organisation cannot be held liable for any loss, or damage suffered by the user because of unlawful activities by persons beyond their control, as the Organisation cannot prevent such behaviour. The Organisation may request independent verification of any information submitted by the user through the site or email from time to time, to limit these risks.' },
      {
        number: '16.2',
        text: 'While we will endeavour to maintain ongoing access, and, prevent and correct disruptions and failures on this Site, we cannot and do not exercise complete control over the data, files and other information passing through our computer systems and network resources. Therefore, you agree that you:',
        subItems: [
          { number: '16.2.1', text: 'are responsible for the flow and storage of your personal information through our computer systems and network resources;' },
          { number: '16.2.2', text: 'take full responsibility for data, files and other information you own, send, or receive; and ensure that at all times you maintain adequate backup copies as appropriate;' },
          { number: '16.2.3', text: 'accept that certain content on this Site, despite any steps we may take may contain material that you may find inappropriate, offensive, inflammatory, or adult in nature and further accept that we do not endorse such material and disclaim any and all liability for their contents.' },
        ],
      },
      {
        number: '16.3',
        text: 'We cannot and do not know whether you have given access to the Organisation account to other people. You are therefore totally responsible for:',
        subItems: [
          { number: '16.3.1', text: 'how your account and your purchased services with us are used; and' },
          { number: '16.3.2', text: 'the actions of the people (if any) you allow to access your device, our services, or transmit information through this Site, our computer systems and network resources or otherwise utilize the Services (whether you have given them your device or your login and password details or not).' },
        ],
      },
      { number: '16.4', text: 'Any person that delivers or attempts to deliver any damaging code to this website or attempts to gain unauthorized access to any page on this website shall be prosecuted and civil damages shall be claimed if the Organisation suffers any loss or damages.' },
      {
        number: '16.5',
        text: 'The user warrants and agree that its log-in name and password shall:',
        subItems: [
          { number: '16.5.1', text: 'be used for intended business purposes only; and' },
          { number: '16.5.2', text: 'not be disclosed to any third party.' },
        ],
      },
      { number: '16.6', text: 'The user hereby agrees and insofar as it may be necessary in law, consents thereto that the Organisation may take all reasonable steps to ensure the integrity and security of the Organisation site and back-office applications.' },
    ],
  },
  {
    number: '17',
    title: 'RELYING UPON UFO NETWORKS SERVICES',
    items: [
      {
        number: '17.1',
        text: 'The quality and continuity of our Services depends on many factors over which we have no or little control. While we will always endeavour to maintain ongoing access, disruptions and failures of this Site, and or all computer systems, network resources and the Services, are probable in such operation environment. Recognizing this, you agree that:',
        subItems: [
          {
            number: '17.1.1',
            text: 'we cannot and do not guarantee, warrant or otherwise imply that:',
            subItems: [
              { number: '17.1.1.1', text: 'you will receive constant and uninterrupted access to this Site or the Services or' },
              { number: '17.1.1.2', text: 'you will receive unlimited access to all of the content available on the Site at any given time;' },
            ],
          },
          { number: '17.1.2', text: 'we cannot always ensure that this Site, its computer systems and network resources will be fully or continually protected from unlawful access by third parties, including the infection of data or other information by viruses, or the alteration, misuse, or stealing of data or other information or that any of these activities will be detected, however the Organisation will endeavour that the information contained on this site is protected.' },
        ],
      },
    ],
  },
  {
    number: '18',
    title: 'DISCLAIMER AND LIMITATION OF LIABILITY',
    items: [
      { number: '18.1', text: 'The use of this website and other UFO Networks services is entirely at the user’s own risk. The user assumes full responsibility for the risk of loss or damage resulting from the use of this site and other UFO Networks services.' },
      { number: '18.2', text: 'Notwithstanding, and in addition to any other provision in this Agreement, you agree that we will not be liable to you or any other person for any loss, damage (whether direct, indirect, special, incidental or consequential), expense, or other amounts incurred, inconveniences or hardship suffered, by any person however arising (including where the cause cannot be determined), or whether it arose directly or indirectly from any authorized or unauthorized use of, access to , reliance on , or any inability to use or access this Site, the Services, or as a consequence of such use, access, reliance, or inability to access, whether such loss, damage, expense or other amounts incurred, inconveniences or hardship suffered arose out of contract, or delict or.' },
      {
        number: '18.3',
        text: 'Without derogating from the generality of the above, and to the extent legally permitted, the Organisation will not be liable for any loss relating to one or more, or a combination, of the following:',
        subItems: [
          { number: '18.3.1', text: 'a failure, or error in the operation, of all or any part of this Site, our computer systems, network resources, the Services, or any other computer systems or network resources to which they may be connected or upon which they may rely, or the taking offline of any of those computers systems or networks resources for any reason;' },
          { number: '18.3.2', text: 'any circumstances which produce or have the consequence of producing a degradation, falloff, or complete severance of access to this Site or other UFO Network services or any other computer systems or network resources to which they may be connected;' },
          { number: '18.3.3', text: 'whether we or any other person could have foreseen such a loss or type of loss, or were negligent or reckless, whether or not the loss was suffered in connection with a business or commercial enterprise, including, but not limited to ,any economic or consequential loss or damage, any and all damage to , or loss of, any equipment, property, data, or other information possessed by you or any other person, any loss of profits, and any losses relating to contracts, business, revenue, goodwill, or any anticipated savings;' },
          { number: '18.3.4', text: 'any personal losses or hardship, stress and anxiety, nervous shock, or other personal suffering or condition;' },
          { number: '18.3.5', text: 'any errors or omission in any documentation or other literature provided by us, any errors or omission in any data, on this Site, or any breach of contract or negligence on the part of us, our employees, agents or authorized representatives;' },
          { number: '18.3.6', text: 'any reliance on, the information and material contained on this Site about any goods and services or any other information or material whatsoever, or any information and material contained on, and the privacy of, web sites linked to this Site;' },
          { number: '18.3.7', text: 'any one or more of the circumstances described in clauses 13.2, 13.3, 15.3, 16.1 or 17.1 above;' },
          { number: '18.3.8', text: 'any action taken by us under this Agreement, including, but not limited to, action taken under clauses 12.1 to 12.3 (inclusive); or' },
          { number: '18.3.9', text: 'any conduct, act or omission, whether negligent, reckless, or otherwise, whether within any actual, ostensible, or apparent authority or not, at all on the part of our employees, agents or authorized representatives;' },
          { number: '18.3.10', text: 'any loss or damage with regard to the user’s data or other data directly or indirectly caused by malfunction of the Organisation’s system, third party systems, power failures, unlawful access to or theft of data, computer viruses or destructive code on the Organisation’s system or third-party systems, or programming defects;' },
          { number: '18.3.11', text: 'any interruption, malfunction, downtime, or other failure of goods and services provided by third parties, including, without limitation, third party systems such as the public switched telecommunication service providers, internet service providers, electricity suppliers, local authorities and certification authorities, or any event over which we have no direct control.' },
        ],
      },
      { number: '18.4', text: 'To the extent permitted by law, all terms, conditions and warranties or representations, whether express, implied, statutory, common law or otherwise relating to the Services or anything in these terms and conditions, are excluded unless expressly included in this Agreement.' },
      { number: '18.5', text: 'the Organisation makes no representations or warranties regarding the accuracy, functionality, fitness for purpose or non-infringement in connection with this site and disclaims all liability in this regard.' },
      { number: '18.6', text: 'the Organisation does not warrant that this site or the online services will be error free but shall endeavour to minimize any errors on the site' },
      {
        number: '18.7',
        text: 'If any legislation or law implies in this agreement any term or warranty and prohibits provisions in a contract excluding the application of or exercise of that term or warranty then, to the maximum extent permitted by law, our liability for a breach of such a term or warranty will be limited, at our option any one or more of the following:',
        subItems: [
          {
            number: '18.7.1',
            text: 'if the breach relates to services:',
            subItems: [
              { number: '18.7.1.1', text: 'the supplying of the services again;' },
              { number: '18.7.1.2', text: 'the marketing or promotion of service or goods; or' },
              { number: '18.7.1.3', text: 'the payment of the cost of having the services supplied again.' },
            ],
          },
        ],
      },
      { number: '18.8', text: 'Notwithstanding anything else in this Agreement if an Indemnified Party is liable to you, whether in respect of negligence or other delict, breach of contract or warranty, breach of statute or statutory duty, equity or otherwise directly or indirectly in relation to the performance of or any delay or failure in the performance of its obligations under this Agreement, the maximum aggregate liability of an Indemnified Party, in respect to all claims made by you for every 12 month period commencing on the execution of this Agreement or the anniversary thereof shall be USD 50-00 (Fifty Dollars) or its equivalent.' },
    ],
  },
  {
    number: '19',
    title: 'RELEASE AND INDEMNITY',
    items: [
      {
        number: '19.1',
        text: 'Notwithstanding, and in addition to any other provision in this Agreement, to the maximum extent permitted by law, you agree to release from, and indemnify, each Indemnified Party, against any claims, losses, liabilities, suits, demands, proceedings, cots or expenses (including legal costs on a full indemnity basis) directly or indirectly related to, or arising out of:',
        subItems: [
          { number: '19.1.1', text: 'your use of the Services;' },
          { number: '19.1.2', text: 'the purchase of any goods and services because of you using the Services;' },
          { number: '19.1.3', text: 'the reproduction, broadcast, transmission communication or making available or any information or material (including log on information and passwords) by us or any users (other than you) made available by use of the Services;' },
          { number: '19.1.4', text: 'any one or more of the circumstances described in clause 17.1 above;' },
          { number: '19.1.5', text: 'any alleged breach of a person’s rights (including, but not limited to, defamation or misleading or deceptive conduct) by a communication, broadcast or transmission made available by means of the Services; or' },
          { number: '19.1.6', text: 'any claim by any person arising out of, or in connection with any cessation (temporary or permanent) of the supply of the Services in accordance with this Agreement.' },
        ],
      },
      {
        number: '19.2',
        text: 'The indemnity under clause 19.1 above does not extend to:',
        subItems: [
          { number: '19.2.1', text: 'expenses incurred by us that are unreasonable; or' },
          { number: '19.2.2', text: 'losses occasioned by us because of this Agreement proving not to be profitable to us.' },
        ],
      },
    ],
  },
  {
    number: '20',
    title: 'USER’S LIABILITY TO UFO NETWORKS',
    items: [
      { number: '20', text: 'The user shall be liable to the Organisation for any liabilities, losses or expenses incurred by the Organisation because of any breach by the user of these terms and conditions.' },
    ],
  },
  {
    number: '21',
    title: 'INTELLECTUAL PROPERTY RIGHTS',
    items: [
      { number: '21.1', text: 'This site contains copyright and other intellectual property including logos and other graphics and multimedia works belonging to the Organisation.' },
      {
        number: '21.2',
        text: 'The user is authorized to view and download one copy to a local hard drive or disk, print and make copies of such printouts; provided that:',
        subItems: [
          { number: '21.2.1', text: 'the material is used for considering the online services and for no other commercial purposes;' },
          { number: '21.2.2', text: 'any reproduction of our proprietary material from this site or portion of it, must include the Organisation’s copyright notice in its entirety;' },
        ],
      },
      { number: '21.3', text: 'The logos and trademarks shown on this site are the Organisation’s registered and unregistered trademarks, or that of third parties.' },
      { number: '21.4', text: 'Nothing on this site should be construed as granting any license or right to use any trademark without the Organisation’s prior written consent and / or that of third parties. The user may not, without the Organisation’s prior written consent, use the Organisation’s intellectual property or that of third parties for any purposes whatsoever.' },
    ],
  },
  {
    number: '22',
    title: 'DISPUTES',
    items: [
      { number: '22.1', text: 'You and the Organisation must follow the procedure for resolving any dispute in connection with or arising out of this Agreement, in accordance with this clause 23 before starting any proceedings (except proceedings seeking urgent interlocutory relief).' },
      {
        number: '22.2',
        text: 'The procedure for resolving a dispute is as follows:',
        subItems: [
          { number: '22.2.1', text: 'first, either you or the Organisation may give notice to the other about the nature of the dispute (“Notice”) and you and the Organisation will seek to negotiate a settlement within 14 (fourteen) working days;' },
        ],
      },
    ],
  },
  {
    number: '23',
    title: 'GENERAL',
    items: [
      { number: '23.1', text: 'This Agreement constitutes the entire agreement between you and the Organisation.' },
      { number: '23.2', text: 'All rights and remedies provided in this Agreement are cumulative and are not exclusive of any rights or remedies provided by law.' },
      { number: '23.3', text: 'Nothing in this Agreement shall be deemed to constitute any party as the agent, partner or joint venture of another party.' },
      { number: '23.4', text: 'A party shall take all such steps, execute all such documents and do all such acts and things as may be reasonably required by another party to give effect any of the transactions contemplated by this Agreement.' },
      { number: '23.5', text: 'Other than as otherwise specified in this Agreement, neither the failure of a party to enforce at any time any of the provisions of this Agreement nor the granting of any time or other indulgence shall be construed as a waiver of that provision or of the right of that party thereafter to enforce that or any other provision.' },
      { number: '23.6', text: 'This Agreement will be governed by the laws in force in the country where the services are consumed and each party unconditionally submits to the non-exclusive jurisdiction of the Courts of the respective country in relation to any legal action, suit or proceeding arising out of or with respect to this Agreement.' },
      { number: '23.7', text: 'The headings of the clauses are provided for convenience and ease of reference only and will not be used to interpret, modify or amplify the terms or conditions of this agreement.' },
      { number: '23.8', text: 'Where any dates or times need to be calculated in terms of this agreement, the international standard time (GMT plus two hours) shall be used.' },
      { number: '23.9', text: 'If any of these terms or conditions is held to be invalid, unlawful or unenforceable, the term or condition will be deleted from the remaining terms and conditions which will continue to be valid to the full extent permitted by law' },
    ],
  },
  {
    number: '24',
    title: 'DOMICILIUM AND NOTICES',
    items: [
      { number: '24.1', text: 'Any notice to be served by either party to the other must be in writing and will be sent by hand delivery, post or facsimile, or email to the relevant party to this Agreement at its respective address as specified on the application for registration on this Site and, in the case of the Organisation, Shop 1C , Sakubva Commercial Centre, 5896 Sakubva Bus Terminus, Mutare, Zimbabwe (Attention: The Financial Manager).' },
      { number: '24.2', text: 'The user acknowledges that the Organisation will use email and notices on this site as the Organisation’s main communication tool for all communications relating to this site, or these terms and conditions and consents that any notices, disclosures and other communications sent by the Organisation electronically will be deemed to satisfy any legal requirements, including without limitation, the requirement that such communications should be “in writing”.' },
      { number: '24.3', text: 'A notice will be deemed to be duly sent and received by any of the parties, in the case of mail, 5 (five) days after registered posting and in the case of a facsimile it will be deemed to have been served on receipt of a successful transmission notice.' },
      { number: '24.4', text: 'An email message will be deemed to be sent:' },
      { number: '24.4.1', text: 'by the user, at the time at which the Organisation can access such message;' },
      { number: '24.4.2', text: 'by the Organisation, at the time shown on the message as having been sent, or if not so shown, at the time shown on the Organisation’s computer system as having been sent. and in the case of email it will be deemed to have been serve if no return email stating that the email cannot be delivered is received.' },
      { number: '24.5', text: 'An email message is deemed to be received:' },
      { number: '24.5.1', text: 'by the user, once it becomes capable of being retrieved by the user;' },
      { number: '24.5.2', text: 'by the Organisation, once the Organisation has confirmed receipt thereof to the user, or responded thereto, whichever is the earlier.' },
      { number: '24.6', text: 'A message shall be attributed:' },
      { number: '24.6.1', text: 'to the user, if it purports to have originated from the user, irrespective of the fact that someone else may have impersonated the user or whether the message sent to the Organisation resulted from an error or malfunction in the communication system;' },
      { number: '24.6.2', text: 'to the Organisation, if it has been sent by a duly authorized representative and such representative acted within the scope of such authority or by an automated system programmed by the Organisation and such system operated without error or malfunction.' },
      { number: '24.7', text: 'A certificate signed by a manager of the Organisation will constitute enough proof of the operation or functionality of the online services or any part thereof and the contents of any information displayed on the site on a given date and will be regarded as correct unless the user proves the contrary.' },
    ],
  },
  {
    number: '25',
    title: 'ABOUT US',
    items: [
      { number: '25.1', text: 'Full Name: UFO Networks' },
      { number: '25.2', text: 'Main business: Democratisation of Technology services' },
      { number: '25.3', text: 'Address for receipt of legal service: Shop 1C , Sakubva Commercial Centre, 5896 Sakubva Bus Terminus, Mutare, Zimbabwe' },
      { number: '25.5', text: 'Website: https://www.ufo-networks.org/' },
      { number: '25.6', text: 'Official email address: info@ufo-networks.org' },
    ],
  },
]
