const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const UserModel = require('./src/models/user.model');
const ProductModel = require('./src/models/product.model');

const productsData = [
  // ================= SEEDS (20) =================
  {
    title: 'Hybrid Wheat Seeds (Sharvati)',
    description: 'High-yield, disease-resistant Sharvati wheat seeds ideal for Indian soil conditions. Produces golden, premium grain.',
    price: 650,
    category: 'Seeds',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Basmati Rice Seeds (1121)',
    description: 'Aromatic long-grain 1121 Basmati seeds for organic farming. Known for superior length, aroma, and fast growth.',
    price: 1200,
    category: 'Seeds',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'High Yield Maize (Corn) Seeds',
    description: 'F1 Hybrid sweet corn seeds with high germination rate and resistance to stem borers.',
    price: 450,
    category: 'Seeds',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Hybrid Tomato Seeds (Namdhari)',
    description: 'Firm, uniform red tomato seeds suitable for both greenhouse and open field cultivation.',
    price: 380,
    category: 'Seeds',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Premium Cotton Hybrid Seeds (Bt)',
    description: 'Bollgard II technology cotton seeds providing outstanding protection against bollworms.',
    price: 850,
    category: 'Seeds',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Sunflower Seeds for Farming',
    description: 'Oil-rich hybrid sunflower seeds designed for high yield and drought resistance.',
    price: 520,
    category: 'Seeds',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Mustard (Sarson) Seeds High Oil Content',
    description: 'Pusa Bold mustard seeds with over 42% oil yield per quintal.',
    price: 320,
    category: 'Seeds',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'High-Yield Soybean Seeds (JS-335)',
    description: 'Certified JS-335 soybean seeds, quick maturing and pest tolerant.',
    price: 780,
    category: 'Seeds',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Hybrid Red Chilli Seeds (Teja 4)',
    description: 'Pungent, deep red chilli seeds offering early harvest and multi-pick capabilities.',
    price: 600,
    category: 'Seeds',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Premium Onion Seeds (Fursungi)',
    description: 'Red onion seeds with extended shelf life and resistance to bolting.',
    price: 950,
    category: 'Seeds',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Hybrid Potato Seed Tubers (Kufri Pukhraj)',
    description: 'High performance potato seed tubers, early maturing within 70-80 days.',
    price: 1100,
    category: 'Seeds',
    stock: 65,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Groundnut (Peanut) Seeds',
    description: 'Bold peanut seeds suitable for rainfed and irrigated farming.',
    price: 820,
    category: 'Seeds',
    stock: 130,
    image: 'https://images.unsplash.com/photo-1567051065604-b384ff6bb90d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Green Gram (Moong) Seeds (Samrat)',
    description: 'Short duration summer green gram seeds resistant to yellow mosaic virus.',
    price: 490,
    category: 'Seeds',
    stock: 160,
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Hybrid Watermelon Seeds (Sugar Baby)',
    description: 'Deep red flesh watermelon seeds with high Brix sweetness level.',
    price: 700,
    category: 'Seeds',
    stock: 85,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Brinjal (Eggplant) Hybrid Seeds',
    description: 'Glossy purple, thornless brinjal hybrid seeds with uniform shape.',
    price: 340,
    category: 'Seeds',
    stock: 170,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Spinach (Palak) Seeds (All Green 500g)',
    description: 'Fast germinating spinach seeds with broad dark green succulent leaves.',
    price: 220,
    category: 'Seeds',
    stock: 250,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Capsicum Bell Pepper Hybrid Seeds',
    description: 'Blocky green capsicum seeds for polyhouse and open shade net farming.',
    price: 880,
    category: 'Seeds',
    stock: 95,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Premium Cucumber Hybrid Seeds (Malini)',
    description: 'Crisp green cucumber seeds yielding high fruiting per vine.',
    price: 430,
    category: 'Seeds',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Coriander (Dhania) Seeds 1kg',
    description: 'Multi-cut aromatic coriander seeds with lush foliage.',
    price: 290,
    category: 'Seeds',
    stock: 210,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Sugarcane Tissue Culture Seedlings (Co 0238)',
    description: 'Disease-free tissue culture sugarcane setts for maximum sugar content.',
    price: 1500,
    category: 'Seeds',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
  },

  // ================= FERTILIZERS (20) =================
  {
    title: 'NPK 19-19-19 Water Soluble Fertilizer (5kg)',
    description: 'Balanced ratio water-soluble fertilizer providing nitrogen, phosphorus, and potassium.',
    price: 750,
    category: 'Fertilizers',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Vermicompost Fertilizer (25kg Bag)',
    description: '100% pure worm castings enriched with essential macro and micro nutrients.',
    price: 400,
    category: 'Fertilizers',
    stock: 300,
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Premium Granular Urea (45kg Bag)',
    description: 'High nitrogen 46% prilled urea for rapid crop growth and leaf greening.',
    price: 320,
    category: 'Fertilizers',
    stock: 500,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'DAP (Di-Ammonium Phosphate) 50kg',
    description: 'Root booster fertilizer packed with 18% Nitrogen and 46% Phosphate.',
    price: 1350,
    category: 'Fertilizers',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Liquid Bio-Fertilizer (Seaweed Extract 1L)',
    description: 'Concentrated natural seaweed bio-stimulant for root development and flowering.',
    price: 550,
    category: 'Fertilizers',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Zinc Sulphate 33% Micro-Nutrient (1kg)',
    description: 'Corrects zinc deficiency in paddy, wheat, maize, and citrus crops.',
    price: 180,
    category: 'Fertilizers',
    stock: 250,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'MOP (Muriate of Potash) Potassium 50kg',
    description: 'Enhances grain filling, fruit size, and disease immunity in plants.',
    price: 1700,
    category: 'Fertilizers',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Bone Meal Plant Food (5kg)',
    description: 'Slow release phosphorus and calcium source for strong roots and big blooms.',
    price: 350,
    category: 'Fertilizers',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1585314062637-b76e27303c20?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Neem Cake Powder Organic Fertilizer (10kg)',
    description: 'Dual benefit organic fertilizer and natural soil nematicide.',
    price: 480,
    category: 'Fertilizers',
    stock: 160,
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Calcium Nitrate Water Soluble (1kg)',
    description: 'Prevents blossom end rot and improves cell wall structure in fruits.',
    price: 240,
    category: 'Fertilizers',
    stock: 220,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Humic Acid 98% Liquid Plant Promoter',
    description: 'Improves soil structure, cation exchange capacity, and root uptake.',
    price: 420,
    category: 'Fertilizers',
    stock: 190,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Single Super Phosphate (SSP) 50kg',
    description: 'Contains 16% Phosphate and 11% Sulphur for oilseed and legume production.',
    price: 450,
    category: 'Fertilizers',
    stock: 280,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Sulfur 90% WDG Soil Fertilizer (3kg)',
    description: 'Elemental sulfur granules for adjusting soil pH and increasing oil yield.',
    price: 360,
    category: 'Fertilizers',
    stock: 175,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Cow Manure Compost (10kg)',
    description: 'Fully decomposed, odorless cow dung manure rich in beneficial soil microbes.',
    price: 280,
    category: 'Fertilizers',
    stock: 400,
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Epsom Salt (Magnesium Sulfate) 1kg',
    description: 'Boosts chlorophyll production and fixes yellowing leaves in crop plants.',
    price: 150,
    category: 'Fertilizers',
    stock: 310,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Bio-Phosphate Solubilizing Bacteria (1L)',
    description: 'Converts insoluble soil phosphorus into bio-available forms for plant roots.',
    price: 320,
    category: 'Fertilizers',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'NPK 12-61-00 Mono Ammonium Phosphate',
    description: 'High phosphorus starter fertilizer ideal for early root establishment.',
    price: 890,
    category: 'Fertilizers',
    stock: 95,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Ferrous Sulphate Iron Chelate (500g)',
    description: 'Rapid treatment for iron chlorosis and yellow vein disease.',
    price: 210,
    category: 'Fertilizers',
    stock: 165,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Mustard Cake Powder Organic Bio-fertilizer',
    description: 'Natural protein and nitrogen-rich organic top dressing for all crops.',
    price: 340,
    category: 'Fertilizers',
    stock: 210,
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Boron 20% Micronutrient Powder 250g',
    description: 'Crucial for flower pollination, fruit set, and sugar translocation.',
    price: 190,
    category: 'Fertilizers',
    stock: 240,
    image: 'https://images.unsplash.com/photo-1585314062637-b76e27303c20?auto=format&fit=crop&w=600&q=80'
  },

  // ================= PESTICIDES (20) =================
  {
    title: 'Broad-Spectrum Agricultural Insecticide (1L)',
    description: 'Controls aphids, thrips, whiteflies, and caterpillars efficiently on cotton and vegetables.',
    price: 680,
    category: 'Pesticides',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Neem Oil Bio-Pesticide (10000 PPM)',
    description: 'Cold-pressed pure neem oil for chemical-free insect and mite control.',
    price: 490,
    category: 'Pesticides',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Copper Oxychloride 50% WP Fungicide',
    description: 'Protective fungicide effective against leaf spot, blight, and downy mildew.',
    price: 380,
    category: 'Pesticides',
    stock: 130,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Glyphosate 41% Systemic Herbicide (1L)',
    description: 'Non-selective weed killer for clearing stubborn perennial grasses and broadleaf weeds.',
    price: 520,
    category: 'Pesticides',
    stock: 170,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Imidacloprid 17.8% SL Insecticide',
    description: 'Systemic insecticide targeted at sucking pests like planthoppers and jassids.',
    price: 430,
    category: 'Pesticides',
    stock: 190,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Mankozeb 75% WP Crop Fungicide (500g)',
    description: 'Contact fungicide with broad spectrum protective action against black rot and rust.',
    price: 290,
    category: 'Pesticides',
    stock: 210,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Chlorpyrifos 20% EC Termiticide',
    description: 'Soil termiticide and crop spray for root grubs and cutworms.',
    price: 410,
    category: 'Pesticides',
    stock: 160,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Organic Bio-Fungicide Trichoderma Viride',
    description: 'Antagonistic fungus for controlling soil-borne wilt and root rot disease.',
    price: 250,
    category: 'Pesticides',
    stock: 250,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Emamectin Benzoate 5% SG Caterpillar Control',
    description: 'Rapid knock-down insecticide against fruit borer and bollworm.',
    price: 610,
    category: 'Pesticides',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Atrazine 50% WP Maize Weedicide',
    description: 'Pre-emergence herbicide for controlling broadleaf weeds in corn and sugarcane.',
    price: 340,
    category: 'Pesticides',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Carbendazim 50% WP Broad Fungicide',
    description: 'Systemic fungicide for seed treatment and foliage spray against powdery mildew.',
    price: 270,
    category: 'Pesticides',
    stock: 230,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Cypermethrin 10% EC Insecticide Spray',
    description: 'Synthetic pyrethroid providing quick knock-down of biting insects.',
    price: 390,
    category: 'Pesticides',
    stock: 175,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Bio-Larvicide Organic Pest Control (250ml)',
    description: 'Natural botanical extract safe for beneficial pollinators like honeybees.',
    price: 460,
    category: 'Pesticides',
    stock: 135,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Hexaconazole 5% EC Sheath Blight Fungicide',
    description: 'Triazole systemic fungicide for paddy blast and sheath blight.',
    price: 480,
    category: 'Pesticides',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Paraquat Dichloride 24% SL Herbicide',
    description: 'Fast acting contact weedicide for non-crop areas and orchard weed management.',
    price: 440,
    category: 'Pesticides',
    stock: 160,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Thiamethoxam 25% WG Insecticide',
    description: 'Second-generation neonicotinoid for stem borer and gall midge control.',
    price: 570,
    category: 'Pesticides',
    stock: 105,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Metalaxyl 8% + Mancozeb 64% WP Fungicide',
    description: 'Dual action systemic and contact fungicide for late blight of potato.',
    price: 520,
    category: 'Pesticides',
    stock: 145,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Sticky Trap Yellow & Blue Plates (Pack of 20)',
    description: 'Chemical-free insect monitoring sticky cards for greenhouses.',
    price: 330,
    category: 'Pesticides',
    stock: 280,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Metarhizium Anisopliae Bio-Insecticide',
    description: 'Entomopathogenic fungus targeted against root grubs and termites.',
    price: 310,
    category: 'Pesticides',
    stock: 190,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Sulphur 80% WP Dusting Powder Fungicide',
    description: 'Micronized sulfur for controlling spider mites and powdery mildew.',
    price: 260,
    category: 'Pesticides',
    stock: 220,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
  },

  // ================= MACHINERY (20) =================
  {
    title: '45 HP Heavy Duty Agricultural Tractor',
    description: 'Fuel efficient 4-cylinder diesel engine tractor with high hydraulic lifting capacity.',
    price: 685000,
    category: 'Machinery',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Multi-Crop Combine Harvester',
    description: 'Self-propelled combine harvester designed for paddy, wheat, and soybean fields.',
    price: 1850000,
    category: 'Machinery',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '7 HP Petrol Power Tiller / Weeder',
    description: 'Versatile mini power cultivator for tilling soil between vegetable rows.',
    price: 42000,
    category: 'Machinery',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Battery Operated 16L Backpack Knapsack Sprayer',
    description: 'Dual pump rechargeable 12V 12Ah sprayer with stainless steel extendable lance.',
    price: 3200,
    category: 'Machinery',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '5 HP Submersible Agricultural Water Pump',
    description: 'High head 100% copper winding submersible pump for farm irrigation wells.',
    price: 24500,
    category: 'Machinery',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Rotary Tiller / Rotavator for 50 HP Tractor',
    description: 'Multi-speed gearbox rotavator with boron steel blades for smooth seedbed preparation.',
    price: 98000,
    category: 'Machinery',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty Paddy Thresher Machine',
    description: 'Engine driven grain thresher delivering clean separation without seed damage.',
    price: 75000,
    category: 'Machinery',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Petrol Engine Brush Cutter 2-Stroke 52cc',
    description: 'Heavy duty grass cutter equipped with 3-tooth metal blade and nylon tap-and-go head.',
    price: 9500,
    category: 'Machinery',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Automatic Seed Drill Machine 9-Tyne',
    description: 'Tractor drawn seed cum fertilizer drill with adjustable depth wheels.',
    price: 54000,
    category: 'Machinery',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Solar Powered Agriculture Water Pump 3 HP',
    description: 'DC brushless solar pump set complete with solar panels and MPPT controller.',
    price: 135000,
    category: 'Machinery',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '2-Stroke Petrol Earth Auger Hole Digger',
    description: '63cc engine post hole digger with 8 inch drill bit for plantation fencing.',
    price: 14500,
    category: 'Machinery',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Tractor Mounted Boom Sprayer 400L',
    description: 'High volume hydraulic folding boom sprayer with 12 meter spray coverage.',
    price: 110000,
    category: 'Machinery',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Chaff Cutter Fodder Machine 3 HP Motor',
    description: 'Cuts dry and green fodder rapidly for cattle feed preparation.',
    price: 28500,
    category: 'Machinery',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Automatic Rice Transplanter 4-Row',
    description: 'Walk-behind paddy transplanter saving time and manual labor during planting.',
    price: 240000,
    category: 'Machinery',
    stock: 4,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Disc Harrow Heavy Duty Frame',
    description: '16-disc gang harrow for breaking clods and turning soil prior to sowing.',
    price: 68000,
    category: 'Machinery',
    stock: 9,
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Electric Mini Power Weeder 1500W',
    description: 'Lightweight cordless garden tiller for weeding small homestead beds.',
    price: 18000,
    category: 'Machinery',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Commercial Grain Dryer Machine 5-Ton',
    description: 'Recirculating batch grain dryer reducing moisture levels safely.',
    price: 450000,
    category: 'Machinery',
    stock: 2,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Portable Gasoline Generator 3.5kVA',
    description: 'Self-start copper generator to power electric farm equipment off-grid.',
    price: 36000,
    category: 'Machinery',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Tractor Hydraulic Trailer 5-Ton',
    description: 'Tipping hydraulic trailer with reinforced steel body and twin tires.',
    price: 195000,
    category: 'Machinery',
    stock: 7,
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Drip Irrigation Automatic Controller Unit',
    description: 'Smart solenoid valve timer unit for programmed farm water management.',
    price: 12500,
    category: 'Machinery',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80'
  },

  // ================= TOOLS (20) =================
  {
    title: 'Stainless Steel Bypass Pruning Shears',
    description: 'Sharp Japanese SK5 steel blades for smooth branch trimming and grape harvesting.',
    price: 450,
    category: 'Tools',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty Farm Cultivator Hoe (Kudali)',
    description: 'Forged manganese steel hoe for hard ground soil digging.',
    price: 620,
    category: 'Tools',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Ergonomic Garden Weeding Trowel Tool',
    description: 'Rust-resistant aluminum alloy hand shovel with soft gel grip.',
    price: 280,
    category: 'Tools',
    stock: 250,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Carbon Steel Harvesting Sickle (Daranti)',
    description: 'Serrated curved blade ideal for harvesting wheat, paddy, and grass.',
    price: 190,
    category: 'Tools',
    stock: 300,
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty Square Point Digging Shovel',
    description: 'Tempered steel blade shovel with reinforced D-grip fiberglass handle.',
    price: 750,
    category: 'Tools',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Professional Extendable Tree Pruner (3m Pole)',
    description: 'Rope pulley branch lopper and saw attachment for high orchard trees.',
    price: 1450,
    category: 'Tools',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Steel Garden Rake with Ash Handle',
    description: '14-tine metal bow rake for leveling soil bed and collecting leaves.',
    price: 520,
    category: 'Tools',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Manual Hand Push Seeder Planter',
    description: 'Precision hand seeder tool with interchangeable seed discs.',
    price: 3800,
    category: 'Tools',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty Wheelbarrow 100 Liter',
    description: 'Pneumatic rubber wheel trolley with seamless steel tray.',
    price: 3400,
    category: 'Tools',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Manual Brass Nozzle Pressure Sprayer (2L)',
    description: 'Handheld pump pressure mister for liquid fertilizers and pesticide foliar spray.',
    price: 350,
    category: 'Tools',
    stock: 220,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Fruit Picker Basket with Telescopic Pole',
    description: 'Soft padded basket head to harvest mangoes, apples, and oranges without damage.',
    price: 890,
    category: 'Tools',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '4-Tine Digging Pitchfork Steel Tool',
    description: 'Forged steel tines for turning compost, manure, and lifting potato tubers.',
    price: 680,
    category: 'Tools',
    stock: 130,
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty Lawn & Garden Hedge Shears',
    description: 'Wavy blade shears designed for clean hedge sculpting and bush pruning.',
    price: 790,
    category: 'Tools',
    stock: 85,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Rubber Coated Farming Safety Work Gloves (3 Pairs)',
    description: 'Thorn-proof nitrile rubber palms with breathable flexible cotton knit wrist.',
    price: 260,
    category: 'Tools',
    stock: 400,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Manual Weed Puller Root Removal Tool',
    description: 'Stand-up deep claw weed extractor tool avoiding back strain.',
    price: 650,
    category: 'Tools',
    stock: 105,
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Professional Soil Sampling Probe Tube',
    description: 'Stainless steel core sampler rod for agronomists and soil testing.',
    price: 1200,
    category: 'Tools',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty Axe with Fiberglass Handle',
    description: 'Balanced 2.5kg wood splitting axe for farm clearing.',
    price: 980,
    category: 'Tools',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Agriculture Land Measuring Tape (50 Meter)',
    description: 'Fibre glass non-stretch measuring tape housed in durable ABS casing.',
    price: 490,
    category: 'Tools',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'High Pressure Hose Pipe 50m Heavy Duty',
    description: '3-layer braided PVC hose pipe for sprayers and irrigation pumps.',
    price: 1850,
    category: 'Tools',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Steel Crowbar & Trenching Chisel Bar',
    description: 'Solid hexagonal carbon steel rod for breaking rocks and digging fence posts.',
    price: 850,
    category: 'Tools',
    stock: 95,
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80'
  },

  // ================= OTHER (20) =================
  {
    title: 'Complete Drip Irrigation Kit for 1 Acre',
    description: 'Includes main line pipe, drippers, emitters, connectors, and flush valve kit.',
    price: 7800,
    category: 'Other',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Digital 4-in-1 Soil pH, Moisture & Sunlight Meter',
    description: 'Instant readout soil analyzer probe for monitoring pH, moisture, and lux levels.',
    price: 850,
    category: 'Other',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Anti-Bird Netting Mesh for Orchards (10m x 10m)',
    description: 'Durable nylon mesh protecting fruit trees from birds and pests.',
    price: 1200,
    category: 'Other',
    stock: 85,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'UV Stabilized Shade Net 75% (3m x 10m Green)',
    description: 'High-density polyethylene agro shade net for nurseries and polyhouses.',
    price: 1450,
    category: 'Other',
    stock: 95,
    image: 'https://images.unsplash.com/photo-1585314062637-b76e27303c20?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'HDPE Tarpaulin Waterproof Sheet 200 GSM',
    description: 'Heavy duty rainproof cover for protecting harvested grain and farm machinery.',
    price: 2100,
    category: 'Other',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Micro Sprinkler Irrigation System Kit',
    description: '360 degree rotating micro foggers ideal for polyhouse humidity control.',
    price: 2400,
    category: 'Other',
    stock: 65,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Agriculture Mulching Film Roll 25 Micron',
    description: 'Silver-black plastic mulch suppresses weed growth and conserves soil moisture.',
    price: 1850,
    category: 'Other',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Digital Electronic Grain Moisture Meter',
    description: 'Measures moisture percentage across 14 grain types including paddy and wheat.',
    price: 4500,
    category: 'Other',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Portable Digital Platform Weighing Scale 200kg',
    description: 'Heavy duty steel platform scale for weighing crop sacks and produce.',
    price: 3600,
    category: 'Other',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Vermicompost Bed HDPE UV Resistant (12x4x2 ft)',
    description: 'Portable heavy duty vermicomposting bin with aerated side windows.',
    price: 1650,
    category: 'Other',
    stock: 70,
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Pheromone Insect Traps for Fruit Fly (Pack of 10)',
    description: 'Attracts and catches male fruit flies in guava, mango, and melon orchards.',
    price: 650,
    category: 'Other',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Hydroponic Growing Trays (Pack of 10)',
    description: 'Food-grade plastic Dutch bucket seedling trays for soil-less farming.',
    price: 990,
    category: 'Other',
    stock: 130,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty Crop Support Trellis Netting',
    description: 'Polypropylene mesh for supporting climbing plants like tomatoes and cucumbers.',
    price: 480,
    category: 'Other',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Portable Solar Lantern & Mobile Charger',
    description: 'Waterproof solar emergency light with built-in USB powerbank for field work.',
    price: 1250,
    category: 'Other',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Cocopeat Block 5kg Expanded Substrate',
    description: 'High expansion coconut coir peat for germinating seeds and nursery pots.',
    price: 290,
    category: 'Other',
    stock: 350,
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Greenhouse Polyfilm UV Stabilized 200 Micron',
    description: 'Diffused light poly film designed for nursery houses and greenhouses.',
    price: 3200,
    category: 'Other',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1585314062637-b76e27303c20?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Solar Electric Fence Energizer Controller',
    description: 'Protects farm perimeter against wild animals with safe pulse electric shock.',
    price: 8900,
    category: 'Other',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heavy Duty HDPE Grain Storage Bag 50kg (Pack of 10)',
    description: 'Airtight hermetic grain storage bags protecting against moisture and beetles.',
    price: 550,
    category: 'Other',
    stock: 220,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Nursery Pro Grow Bags 100 Pack',
    description: 'UV treated black plastic poly bags with drainage holes for saplings.',
    price: 380,
    category: 'Other',
    stock: 300,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Water Quality Tester Meter (TDS, EC, Temp)',
    description: 'Precision digital meter for measuring irrigation water salinity and quality.',
    price: 690,
    category: 'Other',
    stock: 160,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80'
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 1. Register or find fake seller
    const sellerEmail = 'seller@greenharvest.com';
    const sellerUsername = 'greenharvest';

    let seller = await UserModel.findOne({ email: sellerEmail });

    if (!seller) {
      const hashedPassword = await bcrypt.hash('seller123', 10);
      seller = await UserModel.create({
        fullName: 'GreenHarvest Agri Solutions',
        username: sellerUsername,
        email: sellerEmail,
        password: hashedPassword,
        role: 'seller'
      });
      console.log('Created fake seller account:', seller.email);
    } else {
      console.log('Found existing fake seller account:', seller.email);
    }

    // 2. Prepare product objects attached to this seller
    const productsToInsert = productsData.map(prod => ({
      ...prod,
      seller: seller._id
    }));

    // Optionally clear existing products or insert new ones
    console.log(`Inserting ${productsToInsert.length} products (20 for each of the 6 categories)...`);
    const inserted = await ProductModel.insertMany(productsToInsert);

    console.log(`Successfully seeded ${inserted.length} products!`);
    console.log('\n--- Fake Seller Credentials ---');
    console.log('Email:', sellerEmail);
    console.log('Password: seller123');
    console.log('Role: seller');
    console.log('Seller ID:', seller._id);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
