/* projects.js — all project data as window.PROJECTS */

window.PROJECTS = [

  /* ─── UI PROJECTS ────────────────────────────────────────────────────── */

  {
    id: 'previa',
    title: 'Preva',
    category: 'ui-projects',
    year: '2026',
    duration: 'Ongoing',
    blurb: 'Automating prior authorization workflows for physical therapy clinics.',
    featured: true,
    role: 'Designer & Co-Founder',
    timeline: '12 weeks',
    skills: ['User Research', 'Interaction Design', 'Prototyping', 'Systems Thinking'],
    tools: ['Figma', 'Claude Code', 'VS Code'],
    thumbnailImage: 'images/work/UI projects/Preva/prevabanner.webp',
    heroImage:      'images/work/UI projects/Preva/prevabanner.webp',
    demoVideo:      'images/work/UI projects/Preva/prevademo.mp4',
    sections: {
      context:
        '12-week incubator, founding team of two.\n\nBuilt during an 12-week incubator program as a founding team of two co-founders. Conducted extensive customer discovery before landing on physical therapy clinics as our space.',
      problem:
        'Insurance paperwork is killing PT clinics.\n\nPrior authorization — a mandatory insurance form for PT clinics — takes 20 hours/week of manual work per clinic. The burden is severe enough that 57% of PT clinics have dropped at least one insurance network entirely, turning away patients like my co-founder\'s friend Navin, who waited 4 extra weeks to begin ACL recovery.',
      solution:
        'A browser agent that handles prior auth end-to-end, without any manual steps.\n\nPreva automates prior authorization end-to-end. A browser agent pulls clinical data from any EMR, flags missing information, works with the therapist to resolve gaps, and submits directly to insurance portals — no manual steps, no integrations required.',
      process: {
        text:
          'Discovery → validation → pilot.\n\nCustomer discovery → identified prior auth as the core pain point → validated with clinic owners → built browser-agent architecture to avoid lengthy EMR integration → launched first pilot with Vargo Physical Therapy, with 4 partner clinics and 37 PTs onboarded.',
        layout: 'row',
        images: [
          { src: 'images/work/UI projects/Preva/clinicflow.webp' },
          { src: 'images/work/UI projects/Preva/agentflow.webp' }
        ]
      },
      results: [
        { image: 'https://placehold.co/400x300/FAF8F3/1A1A18?text=Tracking', title: 'Automated Tracking', caption: 'Automated visit tracking and reauthorization triggers.' },
        { image: 'https://placehold.co/400x300/FAF8F3/1A1A18?text=Integrations', title: 'Universal Integrations', caption: 'EMR + insurance portal integrations via browser agents.' },
        { image: 'https://placehold.co/400x300/FAF8F3/1A1A18?text=Resolution', title: 'Smart Gap Resolution', caption: 'Gap resolution with therapists, and tiered pricing ($350–$899/mo).' }
      ],
      takeaways:
        'Designing for async, agent-driven workflows required rethinking visibility and failure states from the ground up.\n\nDesigning for a browser-agent workflow introduced constraints I hadn\'t encountered before. Unlike typical SaaS products, Preva\'s core actions happen asynchronously in the background — which forced me to rethink how to surface status, progress, and errors to users who aren\'t watching the agent work in real time. A lot of my early wireframes assumed too much user visibility into the process, and I had to strip those back significantly.\n\nThe other challenge was designing around incomplete data. Because the agent sometimes hits missing clinical information mid-submission, I had to map out every failure state and design an interruption flow that pulled the therapist in at exactly the right moment — specific enough to be actionable, without overwhelming someone mid-session with a patient. Getting that interaction right required diagramming the full agent decision tree before touching any UI.',
      takeawayImage: 'images/work/UI projects/Preva/newdemo.webp',
      takeawayImageCaption: 'shoutout to my co-founder marcus'
    }
  },

  /* ─── PRODUCT DESIGN ─────────────────────────────────────────────────── */

  {
    id: 'smart-pill-dispenser',
    title: 'Smart Pill Dispenser',
    category: 'product-design',
    year: '2025',
    duration: '3 weeks',
    blurb: 'A 3D-designed smart device helping seniors take the right medicine at the right time — with caregiver smartphone tracking.',
    featured: false,
    role: 'Product Designer & Creator',
    timeline: '3 weeks',
    skills: ['3D Product Design', 'UX Research', 'Caregiver-Centered Design', 'Prototyping'],
    tools: ['CAD / 3D Modeling', 'Figma', 'Physical Prototyping'],
    thumbnailImage: 'images/work/Product Design/pillbanner.webp',
    heroImage:      'images/work/Product Design/pillbanner.webp',
    sections: {
      context:
        'A 3-week human-centered design project spanning research, industrial design, and prototyping.\n\nInspired by watching my grandmother struggle with pill bottles and rely on her daughter for weekly sorting, I designed a smart pill dispenser for older adults and their caregivers — built from scratch using interviews, paper prototyping, and 3D modeling in Rhino.',
      problem:
        'Medication routines fail older adults at every touchpoint.\n\nComplex multi-med schedules are easy to forget, standard packaging is physically inaccessible for people with low vision or limited dexterity, and there\'s no reliable way to confirm whether a dose was actually taken. Meanwhile, caregivers spend roughly 45 minutes a week sorting and checking — time that shouldn\'t be necessary.',
      solution:
        'A dispenser that supports independence first, and escalates help only when needed.\n\nA physical smart dispenser with a companion app concept. The device auto-rotates to the correct compartment at dose time, unlocks a one-handed drawer, and uses light and sound to confirm "taken" or flag a miss. Caregivers only get notified when something goes wrong.',
      process: {
        text: '',
        images: []
      },
      customSections: [
        {
          label: 'Iteration',
          layout: 'row',
          images: [
            { src: 'images/work/Product Design/pilliteration.webp' }
          ]
        },
        {
          label: 'Prototypes',
          layout: 'row',
          images: [
            { src: 'images/work/Product Design/pillv1.webp', caption: 'Prototype 1' },
            { src: 'images/work/Product Design/pillv2.webp', caption: 'Prototype 2' },
            { src: 'images/work/Product Design/pillv3.webp', caption: 'Prototype 3' }
          ]
        },
        {
          label: 'Final',
          layout: 'row',
          images: [
            { src: 'images/work/Product Design/pillfinal.webp' }
          ]
        }
      ],
      results: [
        { image: 'https://placehold.co/400x300/FAF8F3/1A1A18?text=Device',  title: 'One-button open',          caption: 'Modular rotating dose ring with an accessible drawer and anti-tip base.' },
        { image: 'https://placehold.co/400x300/FAF8F3/1A1A18?text=Status',  title: 'Light + sound status',     caption: 'Confirms "taken" or flags a miss without any screen required.' },
        { image: 'https://placehold.co/400x300/FAF8F3/1A1A18?text=App',     title: 'Caregiver companion app',  caption: 'Optional setup and missed-dose alerts — only when something goes wrong.' }
      ],
      takeaways:
        'Physical constraints forced me to be a more disciplined designer.\n\nWith screen-based work, it\'s easy to keep adding — another state, another interaction. With a physical object, every decision has a material consequence. When my first prototype came out too narrow to grip comfortably, I couldn\'t just adjust a padding value; I had to rethink the entire form. That constraint pushed me to prioritize ruthlessly and understand how much a single dimension change — width, button placement, drawer height — could make or break the experience for someone with limited dexterity. It was the most direct feedback loop I\'ve ever designed within.'
    }
  },

  /* ─── BRANDING CONCEPTS ──────────────────────────────────────────────── */

  {
    id: 'build-our-bridges',
    title: 'Build Our Bridges Academy',
    category: 'ui-projects',
    year: '2025',
    duration: '4 weeks',
    blurb: 'Brand identity and curriculum design for a youth education nonprofit serving underserved Bay Area communities.',
    featured: false,
    role: 'Art Director & Curriculum Designer',
    timeline: '4 weeks',
    skills: ['Brand Identity', 'Curriculum Design', 'Art Direction', 'Community Engagement'],
    tools: ['Figma', 'Illustrator', 'Photoshop'],
    thumbnailImage: 'images/work/UI projects/BOBA/bobabanner.webp',
    heroImage:      'images/work/UI projects/BOBA/bobabanner.webp',
    sections: {
      context: 'Two separate design projects for a nonprofit I co-lead.\n\nAs co-president of Build Our Bridges Tutoring — a global nonprofit partnering with care centers worldwide to deliver supplies and lessons — I identified two distinct gaps in our digital presence and tackled them as separate projects over the course of a semester.'
    },
    projects: [
      {
        label: 'Project 1 — Mobile App',
        problem: 'Our core users had no dedicated mobile experience.\n\nBusy parents booking tutors, tracking their child\'s progress, and contacting staff were stuck navigating a desktop-first website on their phones — a workflow it was never designed for.',
        solution: 'A dedicated app letting parents book sessions, browse tutor profiles, contact staff, and track progress — all from their phone.',
        process: {
          layout: 'row',
          planningImage: 'images/work/UI projects/BOBA/BOBAmobile/BOBAplanning.webp',
          text: 'Insider intuition backed by user research.\n\nRunning the org gave me a strong baseline, supplemented by interviews and observation to catch assumptions — especially around first-time users navigating the booking flow cold.',
          images: [
            { src: 'images/work/UI projects/BOBA/BOBAmobile/BOBA-1.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAmobile/BOBA-2.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAmobile/BOBA-3.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAmobile/BOBA-4.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAmobile/BOBA-5.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAmobile/BOBA-6.webp', caption: '' }
          ]
        },
        results: [
          { image: 'images/work/UI projects/BOBA/BOBAmobile/BOBA-2.webp', title: 'Booking + Progress Tracking', caption: 'Parents book sessions, browse tutors, and track their child\'s progress from their phone.' }
        ],
        takeaways: 'Designing from the inside accelerates decisions, but demands extra scrutiny.\n\nDeep organizational context sped up early decisions but made it harder to spot where I was designing for myself rather than a parent encountering the platform for the first time. Formal research was essential for catching those blind spots.'
      },
      {
        label: 'Project 2 — Website Redesign + Rebrand',
        problem: 'An unintuitive site and an outdated logo underselling a global org.\n\nThe existing website was difficult to navigate and didn\'t reflect the scale or credibility of an organization operating across care centers worldwide.',
        solution: 'A mid-fidelity website redesign and a refreshed brand identity.\n\nRestructured information architecture for clarity and ease of navigation, brought to mid-fidelity, paired with a modernized logo and visual identity — anchored in warm orange (#e66234) and growth green (#83b131) — better suited to BOB Tutor\'s global presence.',
        process: {
          text: 'Heuristic evaluation informed by co-president context.\n\nWith firsthand knowledge of where users got stuck, I conducted a structured audit of the existing site before moving into redesign, using both my organizational perspective and user feedback to prioritize changes.',
          brandImages: [
            { src: 'images/work/UI projects/BOBA/BOBAold.webp', caption: 'Original' },
            { src: 'images/work/UI projects/BOBA/BOBAlogo.webp',    caption: 'Redesign' }
          ],
          screenImages: [
            { src: 'images/work/UI projects/BOBA/BOBAdesktop/BOBAsite-1.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAdesktop/BOBAsite-2.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAdesktop/BOBAsite-4.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAdesktop/BOBAsite-5.webp', caption: '' },
            { src: 'images/work/UI projects/BOBA/BOBAdesktop/BOBAsite-6.webp', caption: '' }
          ]
        },
        results: [],
        takeaways: 'Rebranding forced a conversation about organizational identity, not just aesthetics.\n\nRedesigning the logo meant asking harder questions about how BOB Tutor wanted to present itself globally — which turned a visual task into a strategic one, and required more stakeholder alignment than I anticipated.'
      }
    ]
  },

  {
    id: '3miu',
    title: '3miu',
    category: 'branding-concepts',
    year: '2026',
    duration: '',
    blurb: 'Brand identity concept for 3miu.',
    featured: false,
    role: 'Brand Designer',
    timeline: '2 weeks',
    skills: ['Brand Identity', 'Visual Design', 'Typography'],
    tools: ['Procreate', 'Illustrator', 'Photoshop'],
    thumbnailImage: 'images/work/Branding Concepts/3miu/3miubanner.webp',
    heroImage:      'images/work/Branding Concepts/3miu/3miubanner.webp',
    sections: {
      context: 'Redesigning an everyday object to change how it feels, not just how it looks.\n\nThe brief was to redesign a common object. I chose Cup Noodles — not because the packaging was broken, but because it was missing an opportunity. The existing design signals speed and disposability, but the people eating it at 2am during finals deserve something that feels like a small act of care.',
      problem: 'The original design does function well — but warmth is completely absent.\n\nThe red band and fork icon communicate speed efficiently. But the beige cup body reads as accidental nostalgia, the side panels repeat without purpose, the lid and steam vents are ignored as design real estate, and the white label area feels sterile. Nothing about it acknowledges the ritual of the person eating it.',
      solution: 'I redesigned cup noodles as a late-night ramen cup made for broke, busy college students who are studying, working, or surviving finals on very little time and money. The design problem is to make instant ramen feel less like a cheap last resort and more like a small moment of care. The cup should feel warm, simple, comforting, and slightly playful — like a tiny break from stress rather than just a meal. The brand centers on the three-minute cooking time, turning it into a reminder to pause, breathe, stretch, rest your eyes, and reset before going back to work. 3MIU gives students a quick meal, but more importantly, three minutes to feel human again.',
      process: { text: '', images: [] },
      customSections: [
        {
          label: 'Branding',
          layout: 'row',
          images: [
            { src: 'images/work/Branding Concepts/3miu/3miubranding1.webp' },
            { src: 'images/work/Branding Concepts/3miu/3miubranding2.webp' }
          ]
        },
        {
          label: 'Packaging',
          layout: 'row',
          images: [
            { src: 'images/work/Branding Concepts/3miu/3miupackaging.webp' },
            { src: 'images/work/Branding Concepts/3miu/3miuposter.webp' }
          ]
        },
        {
          label: 'Mockups',
          layout: 'grid',
          images: [
            { src: 'images/work/Branding Concepts/3miu/image 10.webp' },
            { src: 'images/work/Branding Concepts/3miu/image 11.webp' },
            { src: 'images/work/Branding Concepts/3miu/image 12.webp' },
            { src: 'images/work/Branding Concepts/3miu/image 13.webp' },
            { src: 'images/work/Branding Concepts/3miu/image 14.webp' },
            { src: 'images/work/Branding Concepts/3miu/image 15.webp' }
          ]
        }
      ],
      results: [],
      takeaways: 'Redesigning something familiar is harder than designing from scratch.\n\nThe original Cup Noodles design carries decades of recognition — which means every departure has to be intentional enough to justify the distance. Early versions of 3MIU swung too far into "cute" and lost the exhausted-but-trying honesty that made the concept worth doing. Pulling it back meant being really specific about who I was designing for: not a student who wants whimsy, but one who just needs three quiet minutes.'
    }
  },

  {
    id: 'blink',
    title: 'Blink',
    category: 'branding-concepts',
    year: '2026',
    duration: '',
    blurb: 'Brand identity concept for Blink.',
    featured: false,
    role: 'Brand Designer',
    timeline: '2 weeks',
    skills: ['Brand Identity', 'Visual Design', 'Typography'],
    tools: ['Procreate', 'Illustrator', 'Photoshop'],
    thumbnailImage: 'images/work/Branding Concepts/blink/blinkbanner.webp',
    heroImage:      'images/work/Branding Concepts/blink/blinkbanner.webp',
    sections: {
      context: 'Designing a streetwear brand from the ground up.\n\nThe brief was to create an original streetwear brand. I built BLINK as an alternative sportswear label for young people who skate, run, and move through the world intentionally — where bold street style meets everyday function.',
      problem: '',
      solution: '"BLINK is an alternative sportswear brand for young people who skate, run, and live intentionally, where bold street style meets everyday function. We make pieces that move with you and stand out for you, because fitting in was never the goal."',
      process: { text: '', images: [] },
      customSections: [
        {
          label: 'Mockups',
          layout: 'grid',
          images: [
            { src: 'images/work/Branding Concepts/blink/image 15.webp' },
            { src: 'images/work/Branding Concepts/blink/image 16.webp' },
            { src: 'images/work/Branding Concepts/blink/image 17.webp' },
            { src: 'images/work/Branding Concepts/blink/image 18.webp' },
            { src: 'images/work/Branding Concepts/blink/image 19.webp' },
            { src: 'images/work/Branding Concepts/blink/image 20.webp' }
          ],
          subRow: [
            { src: 'images/work/Branding Concepts/blink/blinkposter 1.webp' },
            { src: 'images/work/Branding Concepts/blink/image 21.webp' }
          ]
        }
      ],
      results: [],
      takeaways: 'Building a brand system meant making decisions that constrained every decision after.\n\nEarly in the process, BLINK\'s identity kept shifting depending on which reference I looked at last. The turning point was locking the brand values first — intentional living, anti-conformity, functional movement — and using those as a filter for every visual choice after. Once the system had a backbone, the apparel mockups stopped feeling like styling exercises and started feeling like an actual brand.'
    }
  }

];
