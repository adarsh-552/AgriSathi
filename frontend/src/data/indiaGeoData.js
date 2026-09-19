// Comprehensive lookup for all 28 States and 8 Union Territories of India with major agricultural districts

export const INDIA_STATES_AND_UTS = [
  // 28 States
  {
    name: 'Andhra Pradesh',
    nameTe: 'ఆంధ్రప్రదేశ్',
    nameHi: 'आंध्र प्रदेश',
    type: 'STATE',
    districts: [
      'Kurnool', 'Nandyal', 'Anantapur', 'Sri Sathya Sai', 'YSR Kadapa', 'Annamayya',
      'Chittoor', 'Tirupati', 'SPS Nellore', 'Prakasam', 'Bapatla', 'Palnadu',
      'Guntur', 'Krishna', 'NTR', 'Eluru', 'West Godavari', 'East Godavari',
      'Kakinada', 'Dr. B.R. Ambedkar Konaseema', 'Visakhapatnam', 'Anakapalli',
      'Vizianagaram', 'Srikakulam', 'Parvathipuram Manyam', 'Alluri Sitharama Raju'
    ]
  },
  {
    name: 'Telangana',
    nameTe: 'తెలంగాణ',
    nameHi: 'तेलंगाना',
    type: 'STATE',
    districts: [
      'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Nalgonda', 'Mahabubnagar',
      'Sangareddy', 'Siddipet', 'Suryapet', 'Adilabad', 'Jagtial', 'Mancherial',
      'Kamareddy', 'Bhadradri Kothagudem', 'Vikarabad', 'Medak', 'Nagarkurnool',
      'Wanaparthy', 'Jogulamba Gadwal', 'Peddapalli', 'Jangaon', 'Yadadri Bhuvanagiri'
    ]
  },
  {
    name: 'Karnataka',
    nameTe: 'కర్ణాటక',
    nameHi: 'कर्नाटक',
    type: 'STATE',
    districts: [
      'Belagavi', 'Ballari', 'Kalaburagi', 'Vijayapura', 'Raichur', 'Dharwad',
      'Davanagere', 'Shivamogga', 'Mandya', 'Tumakuru', 'Haveri', 'Koppal',
      'Bagalkote', 'Mysuru', 'Chitradurga', 'Bidar', 'Gadag', 'Hassan', 'Kolar', 'Chikkaballapur'
    ]
  },
  {
    name: 'Maharashtra',
    nameTe: 'మహారాష్ట్ర',
    nameHi: 'महाराष्ट्र',
    type: 'STATE',
    districts: [
      'Nagpur', 'Nashik', 'Pune', 'Chhatrapati Sambhajinagar', 'Amravati', 'Kolhapur',
      'Solapur', 'Ahmednagar', 'Jalgaon', 'Yavatmal', 'Nanded', 'Satara',
      'Akola', 'Buldhana', 'Beed', 'Latur', 'Osmanabad', 'Parbhani', 'Wardha', 'Sangli'
    ]
  },
  {
    name: 'Tamil Nadu',
    nameTe: 'తమిళనాడు',
    nameHi: 'तमिलनाडु',
    type: 'STATE',
    districts: [
      'Thanjavur', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode',
      'Tirunelveli', 'Dindigul', 'Cuddalore', 'Villupuram', 'Tiruppur', 'Dharmapuri',
      'Theni', 'Nagapattinam', 'Tiruvarur', 'Thoothukudi', 'Pudukkottai', 'Ramanathapuram'
    ]
  },
  {
    name: 'Punjab',
    nameTe: 'పంజాబ్',
    nameHi: 'पंजाब',
    type: 'STATE',
    districts: [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Sangrur',
      'Firozpur', 'Hoshiarpur', 'Fazilka', 'Sri Muktsar Sahib', 'Moga', 'Barnala',
      'Kapurthala', 'Mansa', 'Tarn Taran', 'Gurdaspur', 'Faridkot', 'Fatehgarh Sahib'
    ]
  },
  {
    name: 'Haryana',
    nameTe: 'హర్యానా',
    nameHi: 'हरियाणा',
    type: 'STATE',
    districts: [
      'Karnal', 'Hisar', 'Ambala', 'Sirsa', 'Fatehabad', 'Jind', 'Rohtak',
      'Kurukshetra', 'Sonipat', 'Yamunanagar', 'Kaithal', 'Bhiwani', 'Panipat', 'Rewari', 'Palwal'
    ]
  },
  {
    name: 'Madhya Pradesh',
    nameTe: 'మధ్యప్రదేశ్',
    nameHi: 'मध्य प्रदेश',
    type: 'STATE',
    districts: [
      'Indore', 'Ujjain', 'Bhopal', 'Jabalpur', 'Gwalior', 'Sagar', 'Dewas',
      'Narmadapuram (Hoshangabad)', 'Khargone', 'Dhar', 'Sehore', 'Vidisha', 'Chhindwara',
      'Rewa', 'Satna', 'Ratlam', 'Mandsaur', 'Neemuch', 'Shajapur', 'Harda'
    ]
  },
  {
    name: 'Gujarat',
    nameTe: 'గుజరాత్',
    nameHi: 'गुजरात',
    type: 'STATE',
    districts: [
      'Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Bhavnagar', 'Jamnagar',
      'Junagadh', 'Amreli', 'Mehsana', 'Banaskantha', 'Sabarkantha', 'Kutch',
      'Surendranagar', 'Anand', 'Kheda', 'Bharuch', 'Patan', 'Morbi', 'Gir Somnath'
    ]
  },
  {
    name: 'Rajasthan',
    nameTe: 'రాజస్థాన్',
    nameHi: 'राजस्थान',
    type: 'STATE',
    districts: [
      'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Sri Ganganagar', 'Alwar', 'Nagaur',
      'Hanumangarh', 'Bharatpur', 'Sikar', 'Barmer', 'Pali', 'Chittorgarh', 'Udaipur',
      'Tonk', 'Ajmer', 'Bhilwara', 'Jhalawar', 'Baran', 'Bundi'
    ]
  },
  {
    name: 'Uttar Pradesh',
    nameTe: 'ఉత్తరప్రదేశ్',
    nameHi: 'उत्तर प्रदेश',
    type: 'STATE',
    districts: [
      'Varanasi', 'Prayagraj', 'Lucknow', 'Meerut', 'Agra', 'Bareilly', 'Gorakhpur',
      'Aligarh', 'Moradabad', 'Jhansi', 'Ayodhya', 'Muzaffarnagar', 'Bulandshahr',
      'Mathura', 'Budaun', 'Shahjahanpur', 'Sitapur', 'Lakhimpur Kheri', 'Hardoi', 'Barabanki'
    ]
  },
  {
    name: 'Bihar',
    nameTe: 'బీహార్',
    nameHi: 'बिहार',
    type: 'STATE',
    districts: [
      'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Nalanda', 'Purnia', 'Rohtas',
      'Samastipur', 'Begusarai', 'Vaishali', 'Darbhanga', 'Saran', 'Bhojpur', 'East Champaran', 'West Champaran'
    ]
  },
  {
    name: 'West Bengal',
    nameTe: 'పశ్చిమ బెంగాల్',
    nameHi: 'पश्चिम बंगाल',
    type: 'STATE',
    districts: [
      'Purba Bardhaman', 'Murshidabad', 'Nadia', 'Hooghly', 'North 24 Parganas',
      'South 24 Parganas', 'Malda', 'Birbhum', 'Paschim Medinipur', 'Purba Medinipur', 'Bankura', 'Jalpaiguri'
    ]
  },
  {
    name: 'Odisha',
    nameTe: 'ఒడిశా',
    nameHi: 'ओडिशा',
    type: 'STATE',
    districts: [
      'Cuttack', 'Ganjam', 'Balasore', 'Bargarh', 'Sambalpur', 'Puri',
      'Mayurbhanj', 'Bolangir', 'Kalahandi', 'Koraput', 'Bhadrak', 'Jajpur', 'Kendrapara', 'Angul'
    ]
  },
  {
    name: 'Kerala',
    nameTe: 'కేరళ',
    nameHi: 'केरल',
    type: 'STATE',
    districts: [
      'Palakkad', 'Wayanad', 'Idukki', 'Thrissur', 'Alappuzha', 'Kottayam',
      'Ernakulam', 'Kozhikode', 'Malappuram', 'Kollam', 'Kannur', 'Kasaragod'
    ]
  },
  {
    name: 'Assam',
    nameTe: 'అసోం',
    nameHi: 'असम',
    type: 'STATE',
    districts: [
      'Kamrup', 'Nagaon', 'Sonitpur', 'Cachar', 'Dibrugarh', 'Jorhat',
      'Golaghat', 'Barpeta', 'Dhubri', 'Tinsukia', 'Sivasagar', 'Darrang'
    ]
  },
  {
    name: 'Chhattisgarh',
    nameTe: 'ఛత్తీస్‌గఢ్',
    nameHi: 'छत्तीसगढ़',
    type: 'STATE',
    districts: [
      'Raipur', 'Durg', 'Bilaspur', 'Rajnandgaon', 'Janjgir-Champa', 'Bastar',
      'Korba', 'Raigarh', 'Dhamtari', 'Mahasamund', 'Kanker', 'Kabirdham'
    ]
  },
  {
    name: 'Jharkhand',
    nameTe: 'జార్ఖండ్',
    nameHi: 'झारखंड',
    type: 'STATE',
    districts: [
      'Ranchi', 'Dhanbad', 'Bokaro', 'East Singhbhum', 'Hazaribagh', 'Deoghar',
      'Giridih', 'Palamu', 'Dumka', 'Ramgarh', 'Godda', 'Gumla'
    ]
  },
  {
    name: 'Himachal Pradesh',
    nameTe: 'హిమాచల్ ప్రదేశ్',
    nameHi: 'हिमाचल प्रदेश',
    type: 'STATE',
    districts: [
      'Kangra', 'Mandi', 'Shimla', 'Solan', 'Sirmaur', 'Kullu',
      'Una', 'Hamirpur', 'Chamba', 'Bilaspur', 'Kinnaur', 'Lahaul and Spiti'
    ]
  },
  {
    name: 'Uttarakhand',
    nameTe: 'ఉత్తరాఖండ్',
    nameHi: 'उत्तराखंड',
    type: 'STATE',
    districts: [
      'Dehradun', 'Haridwar', 'Udham Singh Nagar', 'Nainital', 'Almora',
      'Pauri Garhwal', 'Tehri Garhwal', 'Chamoli', 'Pithoragarh', 'Uttarkashi'
    ]
  },
  {
    name: 'Goa',
    nameTe: 'గోవా',
    nameHi: 'गोवा',
    type: 'STATE',
    districts: ['North Goa', 'South Goa']
  },
  {
    name: 'Tripura',
    nameTe: 'త్రిపుర',
    nameHi: 'त्रिपुरा',
    type: 'STATE',
    districts: ['West Tripura', 'South Tripura', 'North Tripura', 'Dhalai', 'Gomati', 'Khowai', 'Sepahijala', 'Unakoti']
  },
  {
    name: 'Meghalaya',
    nameTe: 'మేఘాలయ',
    nameHi: 'मेघालय',
    type: 'STATE',
    districts: ['East Khasi Hills', 'West Garo Hills', 'Ri-Bhoi', 'West Jaintia Hills', 'East Garo Hills', 'South West Garo Hills']
  },
  {
    name: 'Manipur',
    nameTe: 'మణిపూర్',
    nameHi: 'मणिपुर',
    type: 'STATE',
    districts: ['Imphal West', 'Imphal East', 'Bishnupur', 'Thoubal', 'Churachandpur', 'Kakching', 'Senapati', 'Ukhrul']
  },
  {
    name: 'Nagaland',
    nameTe: 'నాగాలాండ్',
    nameHi: 'नागालैंड',
    type: 'STATE',
    districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha', 'Mon', 'Tuensang', 'Zunheboto', 'Phek']
  },
  {
    name: 'Mizoram',
    nameTe: 'మిజోరం',
    nameHi: 'मिजोरम',
    type: 'STATE',
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai', 'Siaha']
  },
  {
    name: 'Arunachal Pradesh',
    nameTe: 'అరుణాచల్ ప్రదేశ్',
    nameHi: 'अरुणाचल प्रदेश',
    type: 'STATE',
    districts: ['Papum Pare', 'Changlang', 'Lohit', 'West Kameng', 'East Siang', 'Namsai', 'Lower Subansiri', 'Tirap']
  },
  {
    name: 'Sikkim',
    nameTe: 'సిక్కిం',
    nameHi: 'सिक्किम',
    type: 'STATE',
    districts: ['Gangtok (East Sikkim)', 'Gyalshing (West Sikkim)', 'Mangan (North Sikkim)', 'Namchi (South Sikkim)', 'Pakyong', 'Soreng']
  },

  // 8 Union Territories
  {
    name: 'Jammu and Kashmir',
    nameTe: 'జమ్మూ కాశ్మీర్',
    nameHi: 'जम्मू और कश्मीर',
    type: 'UT',
    districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Pulwama', 'Udhampur', 'Kathua', 'Kupwara', 'Budgam', 'Rajouri']
  },
  {
    name: 'Ladakh',
    nameTe: 'లడఖ్',
    nameHi: 'लद्दाख',
    type: 'UT',
    districts: ['Leh', 'Kargil']
  },
  {
    name: 'Delhi',
    nameTe: 'ఢిల్లీ',
    nameHi: 'दिल्ली',
    type: 'UT',
    districts: ['North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North West Delhi', 'South West Delhi']
  },
  {
    name: 'Puducherry',
    nameTe: 'పుదుచ్చేరి',
    nameHi: 'पुदुच्चेरी',
    type: 'UT',
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  },
  {
    name: 'Chandigarh',
    nameTe: 'చండీగఢ్',
    nameHi: 'चंडीगढ़',
    type: 'UT',
    districts: ['Chandigarh']
  },
  {
    name: 'Andaman and Nicobar Islands',
    nameTe: 'అండమాన్ నికోబార్ దీవులు',
    nameHi: 'अंडमान और निकोबार द्वीप समूह',
    type: 'UT',
    districts: ['South Andaman', 'North and Middle Andaman', 'Nicobar']
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    nameTe: 'దాద్రా నగర్ హవేలీ డామన్ డయ్యూ',
    nameHi: 'दादरा और नगर हवेली और दमन और दीव',
    type: 'UT',
    districts: ['Daman', 'Diu', 'Dadra and Nagar Haveli']
  },
  {
    name: 'Lakshadweep',
    nameTe: 'లక్షద్వీప్',
    nameHi: 'लक्षद्वीप',
    type: 'UT',
    districts: ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy']
  }
];

export const SOIL_TYPES = [
  { id: 'BLACK_COTTON', nameEn: 'Black Cotton Soil (Regur)', nameTe: 'నల్లరేగడి నేల', nameHi: 'काली कपास मिट्टी' },
  { id: 'RED_SANDY_LOAM', nameEn: 'Red Sandy Loam Soil', nameTe: 'ఎర్ర ఇసుక గరప నేల', nameHi: 'लाल बलुई दोमट मिट्टी' },
  { id: 'ALLUVIAL', nameEn: 'Alluvial River Soil', nameTe: 'వరి ఒండ్రు నేల', nameHi: 'जलोढ़ मिट्टी' },
  { id: 'CLAY_LOAM', nameEn: 'Clay Loam Soil', nameTe: 'బంక నేల', nameHi: 'चिकनी दोमट मिट्टी' },
  { id: 'LATERITE', nameEn: 'Laterite Soil', nameTe: 'లేటరైట్ నేల', nameHi: 'लेटराइट मिट्टी' }
];

export const IRRIGATION_SOURCES = [
  { id: 'BOREWELL', nameEn: 'Borewell / Tube well', nameTe: 'బోరు బావి', nameHi: 'नलकूप / बोरवेल' },
  { id: 'CANAL', nameEn: 'Canal Water System', nameTe: 'కాలువ నీరు', nameHi: 'नहर का पानी' },
  { id: 'DRIP', nameEn: 'Drip / Micro-Irrigation', nameTe: 'బిందు సేద్యం (డ్రిప్)', nameHi: 'ड्रिप सिंचाई' },
  { id: 'RAINFED', nameEn: 'Rainfed (Monsoon Dependent)', nameTe: 'వర్షాధారం (మెట్ట)', nameHi: 'वर्षा आधारित' },
  { id: 'OPEN_WELL', nameEn: 'Open Farm Well / Pond', nameTe: 'బావి / చెరువు', nameHi: 'खुला कुआं / तालाब' }
];

export function getDistrictsForState(stateName) {
  const found = INDIA_STATES_AND_UTS.find(
    (s) => s.name.toLowerCase() === (stateName || '').toLowerCase()
  );
  return found ? found.districts : ['Kurnool'];
}
