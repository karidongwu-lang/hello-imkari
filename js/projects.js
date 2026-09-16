/* projects.js — all project data as window.PROJECTS */

window.PROJECTS = [

  /* ─── UI PROJECTS ────────────────────────────────────────────────────── */

  {
    id: 'previa',
    title: 'Preva',
    category: 'ui-projects',
    year: '2026',
    duration: 'Ongoing',
    blurb:
      'Preva is a supervised agentic AI prior authorization assistant for physical therapy clinics. It helps clinic staff prepare, review, submit, and track prior authorization requests by automating repetitive administrative work while keeping humans in control of final decisions.',
    featured: true,
    role: 'Designer & Co-Founder',
    timeline: '12 weeks',
    skills: ['User Research', 'Interaction Design', 'Prototyping', 'Systems Thinking'],
    tools: ['Figma', 'Claude Code', 'VS Code'],
    thumbnailImage: 'images/work/UI projects/Preva/prevabanner.webp',
    heroImage:      'images/work/UI projects/Preva/prevabanner.webp',
    demoVideo:      'images/work/UI projects/Preva/prevademo.mp4',
    sections: {
      problem:
        'Prior authorization is a time-consuming workflow.\n\nThe process involves insurance rules, patient documentation, form preparation, submission, and follow-up. Clinic staff spend hours searching across documents, checking payer requirements, and manually tracking incomplete cases.',
      solution:
        'From manual authorization to supervised automation.\n\nInstead of designing Preva as a traditional form-filling tool, I explored how an AI agent could move clinic staff from manual authorization work to supervised automation. The agent extracts patient and insurance information, identifies missing requirements, drafts the authorization packet, and asks for human approval before submission. My UX focus was the trust layer: plan preview, confidence states, missing-information alerts, review checkpoints, and an activity log.',
      process: { text: '', images: [] },
      customSections: [
        {
          label: 'Research Insights',
          heading: 'What we heard from clinic staff',
          text:
            'Staff need to know what is missing before they submit.\n\nPayer requirements vary and are difficult to track.\n\nCopying information across documents and forms creates repetitive work.\n\nStaff need confidence before submitting because mistakes can delay care.'
        },
        {
          label: 'Design Challenge',
          heading: 'How might we design a smarter authorization workflow?',
          text:
            'How might we design an AI agent that reduces repetitive prior authorization work while keeping clinic staff informed, confident, and in control?'
        },
        {
          label: 'Key UX Shift',
          heading: 'The UX challenge is designing a trustworthy delegation experience',
          text:
            'The challenge is not just making each step easy. It is: how do you design an experience where staff feel confident handing work off to an AI agent?\n\nAgentic AI UI should help users delegate repetitive steps, supervise the agent, review uncertain outputs, and approve high-impact actions.'
        },
        {
          label: 'Responsibility & Risk',
          heading: 'Deciding what the agent should — and shouldn\'t — do',
          text:
            'The AI should not handle everything automatically, especially in healthcare-adjacent workflows. I mapped the process into human-owned, agent-owned, and shared responsibilities. Because prior authorization affects care access and insurance approval, the agent is responsible for extraction, checking, drafting, and tracking — while final decisions and submissions stay under human control.\n\nLow-risk tasks (summarize, organize, classify, suggest): the agent acts automatically. Medium-risk tasks (draft, pre-fill, recommend): staff review and decide. High-risk tasks (submit, send, delete, approve, diagnose, reject): staff must explicitly approve.',
          layout: 'row',
          images: [
            { src: 'images/work/UI projects/Preva/agentflow.webp', caption: 'Agentic authorization flow — human vs. agent responsibility by risk level' }
          ]
        },
        {
          label: 'Final Design',
          heading: 'Redesigning the agentic AI experience around delegation, review, and trust',
          text:
            'The workflow covers five key screens, from the morning dashboard to post-submission tracking.\n\nDashboard — the agent pre-sorts work by urgency, so staff know exactly what to do without hunting or filtering.\n\nCase Detail — all patient, auth, and AI context in one place before staff touch anything, with an AI case summary of what the agent already understands.\n\nReview Draft Packet — the most important screen, where trust is built or broken: the AI shows its work (confidence scores, source evidence, flagged conflicts) and staff decide. Every editable field has a dashed underline; every flag has a resolution path.\n\nPost-Submission Tracking — the agent\'s job doesn\'t end at submission. One focused screen answers one question: where is it?\n\nActivity Log — the trust layer. Every agent action is logged, timestamped, and attributed, so staff, managers, and compliance teams can always answer what the AI did, and why.'
        }
      ],
      takeaways:
        'Designing for agentic AI means designing for trust.\n\nThis project clarified something important: designing for agentic AI is not about hiding the interface or replacing every human action. It is about building a trustworthy partnership — where the AI handles repetitive work and the human supervises decisions, exceptions, and approvals.\n\nGoing forward, I want to design human-AI interaction as a feedback loop — where staff corrections and approvals flow back into the system and make it more accurate over time.'
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
