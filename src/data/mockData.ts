import { College, Lecture, RegionalLanguage, DoubtItem, ChatMessage } from '../types';

export const REGIONAL_LANGUAGES: RegionalLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'કન્નડ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'en', name: 'English', nativeName: 'English' }
];

export const COLLEGES: College[] = [
  {
    id: 'c1',
    name: 'MNIT Jaipur (Urban Host)',
    district: 'Jaipur',
    state: 'Rajasthan',
    type: 'urban-host',
    studentCount: 450,
    avgBandwidthKbps: 15000
  },
  {
    id: 'c2',
    name: 'Govt College Barmer',
    district: 'Barmer',
    state: 'Rajasthan',
    type: 'rural-partner',
    studentCount: 120,
    avgBandwidthKbps: 85
  },
  {
    id: 'c3',
    name: 'Govt College Jaisalmer',
    district: 'Jaisalmer',
    state: 'Rajasthan',
    type: 'rural-partner',
    studentCount: 95,
    avgBandwidthKbps: 60
  },
  {
    id: 'c4',
    name: 'Govt Degree College Dungarpur',
    district: 'Dungarpur',
    state: 'Rajasthan',
    type: 'rural-partner',
    studentCount: 140,
    avgBandwidthKbps: 110
  },
  {
    id: 'c5',
    name: 'Govt Polytechnic Jhalawar',
    district: 'Jhalawar',
    state: 'Rajasthan',
    type: 'rural-partner',
    studentCount: 88,
    avgBandwidthKbps: 70
  }
];

export const MOCK_LECTURES: Lecture[] = [
  {
    id: 'lec-101',
    title: 'Solar Photovoltaic Microgrid Systems for Rural Electrification',
    subject: 'Renewable Energy Engineering',
    urbanHostCollege: 'MNIT Jaipur',
    professorName: 'Dr. Ramesh Sharma',
    isLive: true,
    scheduledTime: 'Today, 10:00 AM',
    durationMinutes: 45,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
    fileSizeAudioKb: 3200, // ~3.2 MB for 45 mins audio!
    fileSizeVideoKb: 48000, // ~48 MB for 240p video
    enrolledStudentsCount: 382,
    attendanceRate: 94,
    description: 'A comprehensive study on designing off-grid solar microgrids, battery energy storage systems, and MPPT charge controllers suitable for desert communities in Western Rajasthan.',
    tags: ['Solar Energy', 'Electrical', 'Rural Tech', 'Low-Bandwidth Stream'],
    slides: [
      {
        id: 's1',
        slideNumber: 1,
        title: 'Introduction to Off-Grid Solar PV Architecture',
        imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
        notesText: 'Solar panel array converts sunlight into DC electricity. Inverter converts DC to AC for local village loads.'
      },
      {
        id: 's2',
        slideNumber: 2,
        title: 'Maximum Power Point Tracking (MPPT) Algorithm',
        imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
        notesText: 'P = V * I. MPPT dynamically adjusts operating voltage to harvest maximum solar yield during peak heat.'
      },
      {
        id: 's3',
        slideNumber: 3,
        title: 'Battery Energy Storage System (BESS) Sizing Formula',
        imageUrl: 'https://images.unsplash.com/photo-1558441719-6782245b0a72?w=800&q=80',
        notesText: 'Battery Capacity (Ah) = (Daily Energy Demand in Wh * Days of Autonomy) / (System Voltage * Max Depth of Discharge).'
      }
    ],
    subtitles: [
      {
        id: 'sub-1',
        timestamp: 2,
        speaker: 'Dr. Ramesh Sharma',
        originalText: 'Welcome students from Barmer, Jaisalmer, and Dungarpur colleges.',
        translations: {
          hi: 'बाड़मेर, जैसलमेर और डूंगरपुर कॉलेजों के छात्रों का स्वागत है।',
          ta: 'பார்மர், ஜெய்சல்மர் மற்றும் தூங்கர்பூர் கல்லூரி மாணவர்களை வரவேற்கிறோம்.',
          te: 'బార్మర్, జైసల్మేర్ మరియు దుంగార్పూర్ కళాశాలల విద్యార్థులకు స్వాగతం.',
          mr: 'बाडमेर, जैसलमेर आणि डुंगरपूर कॉलेजमधील विद्यार्थ्यांचे स्वागत आहे.',
          bn: 'বারমের, জয়সলমীর এবং ডুঙ্গারপুর কলেজের ছাত্রদের স্বাগতম।',
          gu: 'બાડમેર, જેસલમેર અને ડુંગરપુર કોલેજના વિદ્યાર્થીઓનું સ્વાગત છે.'
        }
      },
      {
        id: 'sub-2',
        timestamp: 12,
        speaker: 'Dr. Ramesh Sharma',
        originalText: 'Today we discuss solar microgrid sizing for low-power village grids.',
        translations: {
          hi: 'आज हम कम बिजली वाले ग्रामीण ग्रिड के लिए सौर माइक्रोग्रिड के आकार पर चर्चा करेंगे।',
          ta: 'இன்று குறைந்த மின்சார கிராமப்புற கிரிட்களுக்கான சோலார் மைக்ரோ கிரிட் அளவைப் பற்றி விவாதிக்கிறோம்.',
          te: 'ఈ రోజు మనం తక్కువ పవర్ గ్రామీణ గ్రిడ్‌ల కోసం సోలార్ మైక్రోగ్రిడ్ పరిమాణం గురించి చర్చిస్తాము.',
          mr: 'आज आपण कमी दाबाच्या ग्रामीण ग्रीडसाठी सोलर मायक्रोग्रिडच्या आकारावर चर्चा करू.',
          bn: 'আজ আমরা কম শক্তির গ্রামীণ গ্রিডের জন্য সৌর মাইক্রোগ্রিড আকার নিয়ে আলোচনা করব।',
          gu: 'આજે આપણે ઓછી શક્તિ ધરાવતા ગ્રામીણ ગ્રીડ માટે સોલર માઇક્રોગ્રીડ માપ વિશે ચર્ચા કરીશું.'
        }
      },
      {
        id: 'sub-3',
        timestamp: 28,
        speaker: 'Dr. Ramesh Sharma',
        originalText: 'Remember the core equation for battery capacity in Ampere-hours.',
        translations: {
          hi: 'एम्पीयर-घंटे में बैटरी क्षमता का मुख्य समीकरण याद रखें।',
          ta: 'ஆம்பியர்-மணிநேரத்தில் பேட்டரி திறனுக்கான முக்கிய சமன்பாட்டை நினைவில் கொள்க.',
          te: 'ఆంపియర్-గంటలలో బ్యాటరీ సామర్థ్యం యొక్క ప్రధాన సమీకరణాన్ని గుర్తుంచుకోండి.',
          mr: 'अँपिअर-तासामध्ये बॅटरी क्षमतेचे मुख्य सूत्र लक्षात ठेवा.',
          bn: 'অ্যাম্পিয়ার-ঘণ্টায় ব্যাটারি ক্ষমতার মূল সমীকরণ মনে রাখবেন।',
          gu: 'એમ્પીયર-કલાકમાં બેટરી ક્ષમતાનું મુખ્ય સમીકરણ યાદ રાખો.'
        }
      }
    ]
  },
  {
    id: 'lec-102',
    title: 'Data Structures: Tree & Graph Traversals for Smart Irrigation',
    subject: 'Computer Science & Engineering',
    urbanHostCollege: 'IIT Jodhpur',
    professorName: 'Prof. Ananya Roy',
    isLive: false,
    scheduledTime: 'Yesterday, 2:00 PM',
    durationMinutes: 60,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    fileSizeAudioKb: 4100,
    fileSizeVideoKb: 62000,
    enrolledStudentsCount: 420,
    attendanceRate: 91,
    description: 'Graph BFS and DFS traversal algorithms applied to optimizing water pipeline networks across agricultural zones.',
    tags: ['Algorithms', 'Graphs', 'IoT', 'Python'],
    slides: [
      {
        id: 's201',
        slideNumber: 1,
        title: 'Representing Canal Pipelines as Adjacency Lists',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
        notesText: 'Nodes represent water pumps or junction valves; edges represent water flow rate capacities in liters/sec.'
      }
    ],
    subtitles: [
      {
        id: 'sub-201',
        timestamp: 5,
        speaker: 'Prof. Ananya Roy',
        originalText: 'BFS traversal ensures we find the shortest path for water distribution.',
        translations: {
          hi: 'BFS ट्रैवर्सल यह सुनिश्चित करता है कि हमें जल वितरण के लिए सबसे छोटा रास्ता मिले।',
          ta: 'BFS டிராவர்சல் நீர் விநியோகத்திற்கான குறுகிய பாதையைக் கண்டறிவதை உறுதி செய்கிறது.'
        }
      }
    ]
  },
  {
    id: 'lec-103',
    title: 'Drip Irrigation Automation using Embedded Microcontrollers',
    subject: 'Agricultural Engineering',
    urbanHostCollege: 'BITS Pilani',
    professorName: 'Dr. Suresh Kumar',
    isLive: false,
    scheduledTime: 'Tomorrow, 11:30 AM',
    durationMinutes: 50,
    thumbnailUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
    fileSizeAudioKb: 3800,
    fileSizeVideoKb: 51000,
    enrolledStudentsCount: 290,
    attendanceRate: 88,
    description: 'Low-cost soil moisture sensors interfacing with ESP32 microcontrollers over LoRA mesh networks for desert farming.',
    tags: ['Agriculture', 'ESP32', 'Sensors', 'Embedded Systems'],
    slides: [],
    subtitles: []
  }
];

export const MOCK_DOUBTS: DoubtItem[] = [
  {
    id: 'd1',
    lectureId: 'lec-101',
    studentName: 'Vikram Singh',
    collegeName: 'Govt College Barmer',
    question: 'Sir, how does extreme desert temperature above 48°C affect MPPT efficiency?',
    timestamp: '10:14 AM',
    upvotes: 14,
    status: 'answered',
    answer: 'High temperature decreases PV open-circuit voltage (Voc) by roughly -0.3%/°C. MPPT controllers step down the voltage ratio to maintain peak wattage.',
    answeredBy: 'Dr. Ramesh Sharma',
    language: 'English'
  },
  {
    id: 'd2',
    lectureId: 'lec-101',
    studentName: 'Priya Rathore',
    collegeName: 'Govt College Jaisalmer',
    question: 'अगर गाँव में 2 दिन बादल रहे तो बैटरी का आकार कैसे तय करेंगे? (How to size battery for 2 cloudy days?)',
    timestamp: '10:22 AM',
    upvotes: 21,
    status: 'pending',
    language: 'Hindi'
  },
  {
    id: 'd3',
    lectureId: 'lec-101',
    studentName: 'Mohan Lal',
    collegeName: 'Govt Degree College Dungarpur',
    question: 'Can we use lithium iron phosphate (LiFePO4) instead of lead-acid in rural setups?',
    timestamp: '10:30 AM',
    upvotes: 9,
    status: 'ai-answered',
    answer: 'Yes! LiFePO4 batteries offer 3000+ cycle life compared to 500 cycles in lead-acid and tolerate heat up to 60°C, making them ideal despite higher initial cost.',
    answeredBy: 'Vidya AI Tutor',
    language: 'English'
  }
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    lectureId: 'lec-101',
    senderName: 'Suresh (Barmer Hub)',
    collegeName: 'Govt College Barmer',
    senderRole: 'student',
    message: 'Barmer classroom audio is super clear in 50 Kbps audio-mode!',
    timestamp: '10:02 AM'
  },
  {
    id: 'm2',
    lectureId: 'lec-101',
    senderName: 'Dr. Ramesh Sharma',
    collegeName: 'MNIT Jaipur',
    senderRole: 'teacher',
    message: 'Great! All partner colleges, please post your doubts in the priority queue.',
    timestamp: '10:05 AM'
  },
  {
    id: 'm3',
    lectureId: 'lec-101',
    senderName: 'Kavita Chawla',
    collegeName: 'Govt College Jaisalmer',
    senderRole: 'student',
    message: 'The Hindi live captions are working smoothly even with low internet speed.',
    timestamp: '10:11 AM'
  }
];
