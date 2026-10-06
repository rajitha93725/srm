// ============================================================================
//  STARGAZERS CONSTITUTION — EDITABLE CONTENT
//  Edit the text below, then run:  npm run build   (inside the Stargazers folder)
//  Output: output/Stargazers_Constitution.pdf and output/Stargazers_Constitution.docx
//
//  Section `body` items can be:
//    'plain string'                 -> paragraph
//    { bullets: ['a', 'b'] }        -> bullet list
//    { numbered: ['a', 'b'] }       -> numbered list
//  Logos: put PNG/JPG files in ./assets and set `logo: 'assets/orion.png'`.
//         Leave logo empty ('') to show a colour swatch instead.
// ============================================================================

module.exports = {
  meta: {
    title: 'STARGAZERS CONSTITUTION',
    organization: 'GAPSTARS PRIVATE LIMITED',
    reference: 'SG-CONST-2027-V1',
    fileName: 'Stargazers_Constitution',
  },

  articles: [
    {
      title: 'ARTICLE I: ENTITY, NAME & PURPOSE',
      sections: [
        {
          num: '1.1', heading: 'Official Identity',
          body: ['The official name of the organization is the Stargazers Club (hereinafter referred to as "Stargazers").'],
        },
        {
          num: '1.2', heading: 'Corporate Entity',
          body: ['Stargazers operates as the official employee event organizing club within Gapstars Private Limited.'],
        },
        {
          num: '1.3', heading: 'Mandate & Mission',
          body: ['Stargazers is dedicated to driving employee engagement, corporate culture, team cohesion, and well-being through structured sports tournaments, festive celebrations, cultural engagements, and employee recreation programs.'],
        },
        {
          num: '1.4', heading: 'Foundational House System Architecture',
          body: [
            'The internal culture and competitive structure of Gapstars Private Limited are built around a permanent Four-House System consisting of Orion, Aquila, Cygnus, and Draco.',
            'The House System serves as the primary mechanism to promote cross-departmental integration, healthy camaraderie, team spirit, and continuous year-round employee engagement across all business units and client teams.',
            'Every employee joining Gapstars Private Limited is permanently assigned to one of the four houses yearly upon onboarding to ensure balanced competition, equal participation, and representation across the organization.',
          ],
        },
      ],
    },

    {
      title: 'ARTICLE II: GOVERNANCE, COMPOSITION & IMPARTIALITY',
      sections: [
        {
          num: '2.1', heading: 'Core Committee Composition (8-Member Structure)',
          body: [
            'To ensure operational efficiency while maintaining equal representation, the Stargazers Core Committee shall consist of exactly eight (8) Office Bearers, including the President.',
            'The President holds full responsibility for selecting the Core Committee members and for allocating roles and responsibilities among them, subject to the house representation rules in Section 2.2. The following structure is provided as an example only and may be adapted by the President:',
            {
              bullets: [
                'President (Executive Lead & Strategic Liaison)',
                'Vice President (Operations & Internal Governance Lead)',
                'Secretary (Communications & Administration Lead)',
                'Treasurer (Financial Controller)',
                '4 x Event & Logistics Leads (Dedicated Coordinators)',
              ],
            },
          ],
        },
        {
          num: '2.2', heading: 'Mandatory House Representation Equity & Impartiality Rules',
          body: [
            'The 8-member committee must strictly consist of two (2) members from each of the four houses (2 from Orion, 2 from Aquila, 2 from Cygnus, and 2 from Draco) to guarantee structural equity.',
            'Under no circumstances shall any single House hold more than three (3) office bearer seats in a given operational term.',
            'Office Bearers maintain their house affiliation and remain fully eligible to compete in house events. However, when acting in their capacity as Stargazers Office Bearers, members must act with absolute impartiality, strictly recusing themselves from scoring, refereeing, or adjudicating any match directly involving their own House.',
          ],
        },
        {
          num: '2.3', heading: 'Presidential Reporting Lines',
          body: [
            'The Stargazers President reports directly to two executive authorities:',
            {
              numbered: [
                'Country Director (for local operational strategy, country-level oversight, and event execution)',
                'Chief Executive Officer (CEO) (for global alignment, company culture direction, and macro-level governance)',
              ],
            },
            'The President works closely with the Head of People & Culture / HR Lead for cross-departmental coordination, onboarding roster syncs, and official HR escalations.',
          ],
        },
        {
          num: '2.4', heading: 'Meeting Frequency & Modality',
          body: [{
            bullets: [
              'The Core Committee convenes monthly to review operational execution, budgets, and schedules. Additional meetings may be called by the President when required.',
              'A monthly alignment session is held between Stargazers and all four House Captains.',
              'Meetings may be held in-person, fully online (MS Teams / Google Meet), or in a hybrid format. Virtual attendance carries equal standing and voting power.',
            ],
          }],
        },
      ],
    },

    {
      title: 'ARTICLE III: APPOINTMENT, TERM, ELIGIBILITY & REMOVAL',
      sections: [
        {
          num: '3.1', heading: 'Office Bearer Tenure',
          body: ['All Core Committee members serve a fixed term of one (1) calendar year (1 Nov – 31 Oct).'],
        },
        {
          num: '3.2', heading: 'Succession Protocol',
          body: ['The outgoing President recommends the incoming President, subject to formal conversation and endorsement by the Country Director, CEO, and Head of People & Culture. The incoming President nominates the remaining seven committee leads via an open internal application process, strictly enforcing the 2-member-per-house equity quota. The nominations are approved by the CEO, Country Head and the Head of People and Culture.'],
        },
        {
          num: '3.3', heading: 'Onboarding of the Incoming President & Committee',
          body: [
            'On taking office, the incoming President and Core Committee shall complete the following steps:',
            {
              numbered: [
                'Take over all processes, records, documents, vendor contacts, financial logs, and open items from the outgoing President, who is responsible for a complete handover.',
                'Decide whether the House System (Section 1.4) continues for the operational year. If it continues unchanged, no further approval is needed. If any change is proposed, the President must submit the plan for the year to the Country Director, CEO, and Head of People & Culture for approval before it is implemented.',
                'Prepare the Annual Master Budget for the year, broken down quarter-wise and event-wise, as set out in Section 4.1.',
                'Select the Core Committee and allocate roles as set out in Section 2.1.',
              ],
            },
          ],
        },
        {
          num: '3.4', heading: 'Committee Ineligibility Rule (Cooling-Off Period)',
          body: ['To encourage leadership rotation and ensure fresh perspectives, the outgoing President from the immediate past term is ineligible to serve on the incoming Stargazers Core Committee.'],
        },
        {
          num: '3.5', heading: 'Reappointment Limits',
          body: ['Committee members may be reappointed for a maximum of two (2) consecutive terms.'],
        },
        {
          num: '3.6', heading: 'Resignation & Voluntary Step-Down Process',
          body: [
            "Committee members stepping down mid-term must provide two (2) weeks' formal written notice to the President, alongside a complete handover of tasks, settled bills, information and financial log.",
            'Stepping down of President requires written notice directly to the Country Director and the CEO.',
            'Members leaving within the first nine (9) months of the term must return their committee T-shirt and key tag (Section 4.3).',
          ],
        },
        {
          num: '3.7', heading: 'Mid-Term Vacancies',
          body: ['Mid-term vacancies must be backfilled by appointing an employee from the same House as the departing member to preserve the 2-member-per-house balance across Orion, Aquila, Cygnus, and Draco.'],
        },
        {
          num: '3.8', heading: 'Removal of Members',
          body: ['Members may be removed for non-performance, missing 3 consecutive unexcused meetings, financial mismanagement, or Code of Conduct violations, executed jointly by the Head of People and Culture, Country Director and CEO.'],
        },
      ],
    },

    {
      title: 'ARTICLE IV: FINANCIAL & BUDGETARY GOVERNANCE',
      sections: [
        {
          num: '4.1', heading: 'Annual Master Budget',
          body: [
            'Drafted by the President, reviewed by the HR Lead / Operational Lead by December 15, and submitted for final executive sign-off and approval from both the Country Director and the CEO prior to Q1.',
            'The budget must be organized quarter-wise and event-wise so that spending can be tracked and maintained easily throughout the year. It must include the committee recognition items (Section 4.3) and the committee outing (Section 4.4).',
            'The budget plan is confidential. It is held by the President and shared only with the approving executives and the Finance Lead.',
          ],
        },
        {
          num: '4.2', heading: 'Event-Wise Budgeting & Approval',
          body: [
            'Every event requires an itemized budget, planned at the start of the year as part of the Annual Master Budget and formally signed off by the Country Director / CEO and Finance Lead before any financial commitments are made or vendor contracts are signed.',
            'Total spending for the year must not exceed the approved Annual Master Budget.',
          ],
        },
        {
          num: '4.3', heading: 'Committee Recognition',
          body: [
            'In appreciation of their commitment, each Core Committee member receives a Stargazers T-shirt and key tag. These items are issued to Core Committee members only, and their design is decided by the President.',
            'A member who resigns before completing nine (9) months of the term must return the T-shirt & key tag.',
          ],
        },
        {
          num: '4.4', heading: 'Committee Outing',
          body: [
            'The President may arrange one outing for the Core Committee. If the House System is active for the year, House leaders may also be invited.',
            'The outing budget is calculated for eight (8) persons only; inviting House leaders does not increase the allocation.',
          ],
        },
      ],
    },

    {
      title: 'ARTICLE V: HOUSE SYSTEM, EQUALIZATION & BRAND GOVERNANCE',
      sections: [
        {
          num: '5.1', heading: 'The Four Houses',
          body: ['Inter-team engagement is structured around four permanent houses: Orion, Aquila, Cygnus, and Draco.'],
        },
        {
          num: '5.2', heading: 'Mandatory Gender-Balanced Member Allocation Protocol',
          body: [{
            bullets: [
              'All four houses must maintain an equal number of total members, strictly balanced by gender (Male / Female ratios).',
              'HR is responsible for providing the Stargazers President with details of all new joiners and resignations, including house and gender category, in a timely manner.',
              'The house allocation mechanism is designed and operated by the Stargazers team to ensure fair allocation. The Stargazers President is fully responsible for this process.',
              'Incoming hires are assigned to replace leavers and fill deficits in houses with the lowest headcount in that gender category to preserve parity. This assignment is made strictly to balance house numbers and gender, irrespective of which client team, project, or department the new hire belongs to.',
              "House assignments remain permanent for the duration of an employee's tenure at Gapstars Private Limited.",
            ],
          }],
        },
        {
          num: '5.3', heading: 'Advance Pre-Publication of Games & Rules',
          body: [
            'If the House Concept is continued for the operational year, all competitive games, rules, scoring metrics, and event schedules for the entire year must be finalized and officially published to all employees prior to the launch of the first inter-house tournament.',
            'No unannounced or ad-hoc inter-house competitive events may be introduced mid-year without following the decision protocol in Section 5.6.',
          ],
        },
        {
          num: '5.4', heading: 'House Leadership',
          body: ['Each House unanimously selects one Captain and one Vice-Captain annually for a 1-year term.'],
        },
        {
          num: '5.5', heading: 'Communication Escalation Hierarchy',
          body: ['Stargazers President & Core Committee  →  House Captains  →  House Members'],
        },
        {
          num: '5.6', heading: 'Voting & Decision Protocols',
          body: [
            {
              bullets: [
                'Internal Stargazers decisions: decided by a simple majority of the Core Committee. In a tie, the President holds the casting vote.',
                'Proposals raised by Stargazers that affect the houses: all Core Committee members must agree first, followed by a majority (at least 3 of 4) of House Captains.',
                'Proposals raised by House Captains or from outside Stargazers: all Core Committee members and all four House Captains must agree before proceeding.',
              ],
            },
            'Example: a new event added mid-year. If proposed by Stargazers, the whole Core Committee must agree, then a majority of House Captains is sufficient. If proposed by a House Captain, the whole Core Committee and all four House Captains must agree.',
          ],
        },
        {
          num: '5.7', heading: 'Brand & Logo Governance',
          body: [
            'Official logos and color codes for Stargazers, Orion, Aquila, Cygnus, and Draco must be preserved without stretching, recoloring, or unauthorized altering across all media.',
            'Any logo change requires a formal proposal, design review by internal marketing, a 3/4 Captains vote, unanimous Core Committee approval, and final sign-off from the Country Director / CEO / Head of People & Culture.',
          ],
        },
      ],
    },

    {
      title: 'ARTICLE VI: DISCIPLINARY FRAMEWORK & HR ESCALATION',
      sections: [
        {
          num: '6.1', heading: 'On-Field Sportsmanship',
          body: ['Minor match disputes are resolved on-site by House Captains and the Stargazers Event Lead.'],
        },
        {
          num: '6.2', heading: 'Zero-Tolerance HR Escalation Triggers',
          body: [
            'The Stargazers President must immediately escalate an incident to Head of People & Culture for formal disciplinary action upon:',
            {
              bullets: [
                'Physical aggression, verbal abuse, or harassment toward organizers, referees, or participants.',
                'Vandalism or intentional damage to public/venue property.',
                'Intentional fraud, roster falsification, or cheating in inter-house competitions.',
              ],
            },
            'Where the incident occurs at a Stargazers event, the Stargazers President must be involved in the resulting disciplinary action.',
          ],
        },
      ],
    },
  ],

  // Last page of the document: a one-page summary of the whole constitution.
  summary: {
    title: 'Constitution at a Glance',
    facts: [
      { label: 'Core Committee', value: '8 members', note: '2 from each house · roles set by the President' },
      { label: 'Term', value: '1 Nov – 31 Oct', note: 'Max. 2 consecutive terms' },
      { label: 'Meetings', value: 'Monthly', note: 'Committee + House Captains alignment' },
      { label: 'Budget', value: 'Fixed yearly', note: 'Quarter-wise & event-wise · confidential' },
    ],
    decisions: {
      heading: 'Who must agree (Section 5.6)',
      columns: ['Type of decision', 'Stargazers Committee', 'House Captains'],
      rows: [
        ['Internal Stargazers matter', 'Simple majority (President breaks a tie)', 'Not required'],
        ['Proposal from Stargazers, e.g. a new mid-year event', 'All members', 'Majority (3 of 4)'],
        ['Proposal from House Captains or from outside', 'All members', 'All 4 Captains'],
        ['Logo or brand change', 'All members', '3 of 4 + executive sign-off'],
      ],
    },
    groups: [
      {
        heading: 'Onboarding a new President',
        items: [
          'Take over all processes and records from the outgoing President.',
          'Keep the House System, or send a changed plan for approval.',
          'Prepare the quarter-wise, event-wise budget.',
          'Select the committee and assign roles.',
        ],
      },
      {
        heading: 'Money',
        items: [
          'Every event is budgeted and approved at the start of the year.',
          'The annual budget must not be exceeded.',
          'The budget includes T-shirts, key tags and the committee outing.',
          'Outing budget is for 8 persons only.',
        ],
      },
      {
        heading: 'Houses',
        items: [
          'Four permanent houses: Orion, Aquila, Cygnus, Draco.',
          'Equal size and gender balance across houses.',
          'HR sends joiner and leaver details to the President.',
          'Stargazers run the house allocation process.',
        ],
      },
      {
        heading: 'Conduct',
        items: [
          'Office Bearers never judge matches involving their own house.',
          'Minor disputes are settled on-site.',
          'Aggression, vandalism, fraud or cheating go straight to HR.',
          'The President is involved in any action from a Stargazers event.',
        ],
      },
    ],
  },

  annex: {
    title: 'ANNEX A: STARGAZERS & HOUSE BRANDING GUIDELINES',
    purpose: {
      heading: 'A.1 PURPOSE & SCOPE',
      text: 'This Annex defines the official visual identity, logo specifications, color standards, and brand compliance guidelines for the Stargazers Event Club and the four permanent houses (Orion, Aquila, Cygnus, and Draco) of Gapstars Private Limited. All event collateral, jerseys, trophies, digital media, and physical merchandise must strictly adhere to these color codes and visual standards.',
    },
    brandsHeading: 'A.2 OFFICIAL HOUSE LOGOS & BRAND SPECIFICATIONS',
    // `hex` drives the colour swatch. Leave fields '' to show "TBD".
    brands: [
      { name: 'Stargazers Master Brand', logo: '', colorName: '', hex: '', pantone: '', cmyk: '', visual: '' },
      { name: 'House Cygnus', logo: '', colorName: 'Maroon / Crimson', hex: '#862633', pantone: 'Pantone 202 C', cmyk: 'C:29 M:96 Y:76 K:29', visual: 'Shield crest with swan motif.' },
      { name: 'House Draco',  logo: '', colorName: 'Emerald Green',    hex: '#00843D', pantone: 'Pantone 348 C', cmyk: 'C:96 M:0 Y:100 K:22', visual: 'Shield crest with dragon motif.' },
      { name: 'House Orion',  logo: '', colorName: 'Azure Blue',       hex: '#0066CC', pantone: 'Pantone 2935 C', cmyk: 'C:100 M:52 Y:0 K:0', visual: 'Shield crest with archer motif.' },
      { name: 'House Aquila', logo: '', colorName: 'Imperial Purple',  hex: '#5F259F', pantone: 'Pantone 2685 C', cmyk: 'C:80 M:100 Y:0 K:0', visual: 'Shield crest with eagle motif.' },
    ],
    rules: {
      heading: 'A.3 BRAND USAGE RULES & LOGO AMENDMENT PROCEDURE',
      items: [
        'Logos must always maintain their original proportions. Stretching, twisting, skewing, or modifying the colors outside of the official Pantone/HEX codes is strictly forbidden.',
        'For single-color printing (e.g., screen-printed jerseys or black backgrounds), approved solid white (#FFFFFF) or solid black (#000000) vector variations must be used.',
        'Any future changes to these logos or color specifications require a formal proposal, review by the Gapstars Internal Marketing Team, a 3/4 majority vote by House Captains, unanimous approval from the Stargazers Core Committee, and final endorsement from the Country Director, CEO, and Head of People & Culture.',
      ],
    },
  },
};
