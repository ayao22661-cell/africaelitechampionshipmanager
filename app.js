// --- UTILS ---
const formatMoney = (num) => {
    // FIX #34 : gestion des montants négatifs (affichait "-2500000 €" brut) et des décimales
    num = Math.round(num || 0);
    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    if (abs >= 1000000) return sign + (abs / 1000000).toFixed(1) + ' M€';
    if (abs >= 1000) return sign + (abs / 1000).toFixed(0) + ' K€';
    return sign + abs + ' €';
};

// --- DONNÉES ET GÉNÉRATION ---
const LEAGUES = [
    { id: 'CIV', region: 'francophone', name: 'Ligue 1 (Côte d\'Ivoire)', clubs: ['ASEC Mimosas', 'FC San Pédro', 'RCA', 'SOA', 'AFAD', 'Bouaké FC', 'Stella Club', 'SC Gagnoa', 'Stade d\'Abidjan', 'Zoman FC', 'LYS Sassandra', 'CO Korhogo', 'AS Denguélé', 'SOL FC', 'Mouna FC', 'ASI', 'ES Bafing', 'JCAT', 'Sewé Sport', 'Africa Sports'] },
    { id: 'MAR', region: 'arab', name: 'Botola Pro (Maroc)', clubs: ['Wydad AC', 'Raja CA', 'AS FAR', 'RS Berkane', 'FUS Rabat', 'Maghreb de Fès', 'Hassania Agadir', 'Olympique Safi', 'Ittihad Tanger', 'Moghreb Tétouan', 'JS Soualem', 'Mouloudia Oujda', 'SCC Mohammédia', 'Youssoufia Berrechid', 'RCA Zemamra', 'UTS Rabat', 'Difaâ El Jadidi', 'O. Khouribga', 'KAC Kénitra', 'COD Meknès'] },
    { id: 'RSA', region: 'anglophone', name: 'Betway Prem (Afr. Sud)', clubs: ['Mamelodi Sundowns', 'Orlando Pirates', 'Kaizer Chiefs', 'SuperSport Utd', 'Cape Town City', 'Stellenbosch FC', 'Sekhukhune Utd', 'AmaZulu', 'Golden Arrows', 'TS Galaxy', 'Royal AM', 'Richards Bay', 'Polokwane City', 'Chippa United', 'Moroka Swallows', 'Cape Town Spurs', 'Baroka FC', 'Maritzburg Utd', 'Black Leopards', 'Jomo Cosmos'] },
    { id: 'EGY', region: 'arab', name: 'Premier League (Égypte)', clubs: ['Al Ahly', 'Zamalek', 'Pyramids FC', 'Al Masry', 'Future FC', 'Smouha', 'Ittihad Alex', 'Enppi', 'Al Mokawloon', 'Ismaily', 'ZED FC', 'Ceramica Cleopatra', 'Tala\'ea El Gaish', 'National Bank', 'Pharco FC', 'El Gouna', 'Baladiyat', 'El Dakhleya', 'Ghazl El Mahalla', 'Aswan SC'] },
    { id: 'TUN', region: 'arab', name: 'Ligue 1 Pro (Tunisie)', clubs: ['Espérance Tunis', 'Club Africain', 'Étoile du Sahel', 'CS Sfaxien', 'US Monastir', 'Stade Tunisien', 'US Ben Guerdane', 'Olympique Béja', 'CA Bizertin', 'EGS Gafsa', 'AS Marsa', 'ES Métlaoui', 'US Tataouine', 'AS Soliman', 'JS Kairouan', 'CS Hammam-Lif', 'ES Zarzis', 'AS Rejiche', 'Stade Gabèsien', 'CO Médenine'] },
    { id: 'ALG', region: 'arab', name: 'Ligue 1 (Algérie)', clubs: ['CR Belouizdad', 'MC Alger', 'USM Alger', 'JS Kabylie', 'ES Sétif', 'CS Constantine', 'JS Saoura', 'Paradou AC', 'ASO Chlef', 'MC Oran', 'US Biskra', 'NC Magra', 'USM Khenchela', 'ES Ben Aknoun', 'MC El Bayadh', 'JS d\'El Biar', 'RC Arbaâ', 'NA Hussein Dey', 'JSM Béjaïa', 'USM El Harrach'] },
    { id: 'SEN', region: 'francophone', name: 'Ligue 1 (Sénégal)', clubs: ['Génération Foot', 'Casa Sports', 'Jaraaf', 'Teungueth FC', 'Diambars', 'AS Pikine', 'Guédiawaye FC', 'Dakar Sacré-Cœur', 'Sonacos', 'Linguère', 'US Gorée', 'Stade de Mbour', 'Jamono Fatick', 'Ouakam', 'Ndiambour', 'AS Douanes', 'NGB Niary Tally', 'Port Autonome', 'Mbour Petite-Côte', 'CNEPS'] },
    { id: 'NGA', region: 'anglophone', name: 'NPFL (Nigéria)', clubs: ['Enyimba FC', 'Remo Stars', 'Rivers United', 'Enugu Rangers', 'Shooting Stars', 'Plateau United', 'Kano Pillars', 'Akwa United', 'Lobi Stars', 'Kwara United', 'Bendel Insurance', 'Doma United', 'Sunshine Stars', 'Katsina United', 'Niger Tornadoes', 'Heartland FC', 'Gombe United', 'Sporting Lagos', 'Bayelsa United', 'Abia Warriors'] },
    { id: 'CMR', region: 'francophone', name: 'Elite One (Cameroun)', clubs: ['Coton Sport', 'Canon Yaoundé', 'Union Douala', 'Bamboutos', 'Colombe Sportive', 'PWD Bamenda', 'Astres FC', 'Fauve Azur', 'Dynamo Douala', 'Yong Sports', 'Gazelle FA', 'APEJES', 'UMS de Loum', 'Victoria United', 'Fovu de Baham', 'Avion Academy', 'Fortuna', 'Panthère du Ndé', 'Tonnerre Kalara', 'Racing'] },
    { id: 'COD', region: 'francophone', name: 'Linafoot (RDC)', clubs: ['TP Mazembe', 'AS Vita Club', 'DC Motema Pembe', 'FC Lupopo', 'Maniema Union', 'Don Bosco', 'AS Dauphins Noirs', 'JS Kinshasa', 'Lubumbashi Sport', 'Sanga Balende', 'FC Renaissance', 'Kuya Sport', 'Blessing FC', 'Etoile du Kivu', 'US Panda', 'Céleste FC', 'Rangers', 'Simba', 'Bazano', 'Tshinkunku'] }
];
// Poids économique relatif des 10 championnats (RSA et EGY sont de loin les plus riches).
// Sorti au niveau module au lot 8 : sert au budget des clubs IA (#92) ET à la qualité de
// leurs académies (#111).
const LEAGUE_TIER = { RSA: 1.8, EGY: 1.6, MAR: 1.5, ALG: 1.2, TUN: 1.1, NGA: 0.8, CIV: 0.7, COD: 0.7, SEN: 0.6, CMR: 0.5 };

const STAFF_TYPES = [
    { id: 'coach_adj', name: 'Entraîneur Adjoint', effect: 'Bonus Tactique +5%', cost: 150000, salary: 5000 },
    { id: 'physio', name: 'Kiné Chef', effect: 'Récupération Énergie +10%', cost: 100000, salary: 3500 },
    { id: 'scout', name: 'Recruteur Chef', effect: 'Précision Potentiel', cost: 120000, salary: 4000 },
    { id: 'doctor', name: 'Médecin du Sport', effect: 'Risque Blessure -15%', cost: 200000, salary: 8000 }
];
const REAL_PLAYERS = {
    // ==========================================
    // CÔTE D'IVOIRE (LIGUE 1) - PARTIE 1/2
    // ==========================================

    "ASEC Mimosas": [ // Top Club (83 - 87)
        { name: "Ayayi Folly", pos: "G", age: 33, ovr: 86, pot: 86 },
        { name: "Ahmadou Karidioula", pos: "G", age: 24, ovr: 82, pot: 87 },
        { name: "Wonlo Coulibaly", pos: "DG", age: 32, ovr: 85, pot: 85 },
        { name: "Anthony Tra Bi", pos: "DC", age: 25, ovr: 84, pot: 88 },
        { name: "Kouassi Attohoula", pos: "DD", age: 28, ovr: 83, pot: 83 },
        { name: "Souleymane Coulibaly", pos: "DC", age: 27, ovr: 84, pot: 85 },
        { name: "Bénédicte Yao", pos: "DC", age: 23, ovr: 82, pot: 87 },
        { name: "Essis Aka", pos: "MDC", age: 33, ovr: 85, pot: 85 },
        { name: "Christian Kouamé", pos: "MC", age: 31, ovr: 84, pot: 84 },
        { name: "Koffi Dakoi", pos: "MC", age: 24, ovr: 83, pot: 88 },
        { name: "Zouzoua Pacome", pos: "MOC", age: 26, ovr: 86, pot: 89 },
        { name: "Mohamed Zougrana", pos: "MDC", age: 22, ovr: 84, pot: 90 },
        { name: "Arthur Bada", pos: "MC", age: 25, ovr: 82, pot: 85 },
        { name: "Sankara Karamoko", pos: "BT", age: 20, ovr: 85, pot: 92 },
        { name: "Mofossé Trésor", pos: "BT", age: 24, ovr: 83, pot: 87 },
        { name: "Salifou Diarrassouba", pos: "MOD", age: 22, ovr: 84, pot: 89 },
        { name: "Kramo Aubin", pos: "MOG", age: 27, ovr: 84, pot: 84 },
        { name: "Serge Pokou", pos: "MOD", age: 24, ovr: 81, pot: 86 }
    ],

    "FC San Pédro": [ // Top Club (82 - 86)
        { name: "Ira Tapé Eliezer", pos: "G", age: 26, ovr: 85, pot: 89 },
        { name: "Issa Fofana", pos: "G", age: 21, ovr: 80, pot: 86 },
        { name: "Abdoulaye Niakate", pos: "DC", age: 24, ovr: 84, pot: 88 },
        { name: "Emile Kouassi", pos: "DC", age: 28, ovr: 83, pot: 83 },
        { name: "Guehi Guy", pos: "DC", age: 23, ovr: 82, pot: 87 },
        { name: "Yao Kévin", pos: "DG", age: 25, ovr: 81, pot: 85 },
        { name: "Oumar Sako", pos: "DC", age: 27, ovr: 83, pot: 85 },
        { name: "Youssouf Oumarou", pos: "MDC", age: 30, ovr: 85, pot: 85 },
        { name: "Alpha Bédié", pos: "MC", age: 29, ovr: 82, pot: 82 },
        { name: "Ariel Koffi", pos: "MC", age: 24, ovr: 82, pot: 86 },
        { name: "Garry Koné", pos: "MOC", age: 23, ovr: 81, pot: 87 },
        { name: "N'Guessan Jean", pos: "MC", age: 21, ovr: 80, pot: 87 },
        { name: "Wayou Constant", pos: "BT", age: 23, ovr: 84, pot: 88 },
        { name: "Alassane Doumbia", pos: "BT", age: 21, ovr: 83, pot: 89 },
        { name: "Bedi Guy", pos: "MOG", age: 26, ovr: 82, pot: 84 },
        { name: "Issouf Dosso", pos: "MOD", age: 25, ovr: 81, pot: 85 },
        { name: "Ibrahim Fofana", pos: "BT", age: 19, ovr: 79, pot: 88 },
        { name: "Yao Alphonse", pos: "MOD", age: 24, ovr: 80, pot: 85 }
    ],

    "RCA": [ // Upper Mid (80 - 84) - Jeunes à très fort potentiel
        { name: "Ousmane Zombra", pos: "G", age: 23, ovr: 82, pot: 88 },
        { name: "Hassan Sani", pos: "G", age: 20, ovr: 78, pot: 85 },
        { name: "Chamou Karaboué", pos: "DC", age: 21, ovr: 82, pot: 88 },
        { name: "Aboubacar Sylla", pos: "DC", age: 22, ovr: 81, pot: 87 },
        { name: "Souleymane Koné", pos: "DC", age: 24, ovr: 80, pot: 85 },
        { name: "Yao Aristide", pos: "DG", age: 20, ovr: 79, pot: 86 },
        { name: "N'Goran Junior", pos: "DD", age: 21, ovr: 79, pot: 84 },
        { name: "Abdoulaye Djiré", pos: "MDC", age: 22, ovr: 83, pot: 89 },
        { name: "Gilbert Bandama", pos: "MC", age: 20, ovr: 81, pot: 88 },
        { name: "Zokora Junior", pos: "MC", age: 19, ovr: 80, pot: 89 },
        { name: "Amani Romeo", pos: "MOC", age: 21, ovr: 82, pot: 88 },
        { name: "Kouadio Jean", pos: "MC", age: 18, ovr: 78, pot: 87 },
        { name: "Seydou Traoré", pos: "BT", age: 19, ovr: 83, pot: 91 },
        { name: "Valy Konaté", pos: "BT", age: 21, ovr: 81, pot: 87 },
        { name: "Wawa Christ", pos: "MOG", age: 20, ovr: 80, pot: 88 },
        { name: "Ouattara Brahima", pos: "MOD", age: 21, ovr: 81, pot: 86 },
        { name: "Bamba Souleymane", pos: "BT", age: 18, ovr: 77, pot: 86 },
        { name: "Kone Mohamed", pos: "MOG", age: 20, ovr: 79, pot: 85 }
    ],

    "Stade d'Abidjan": [ // Upper Mid (80 - 83)
        { name: "Drissa Bamba", pos: "G", age: 31, ovr: 82, pot: 82 },
        { name: "Boris Touré", pos: "G", age: 25, ovr: 79, pot: 83 },
        { name: "Kouassi Attohoula", pos: "DC", age: 28, ovr: 83, pot: 83 },
        { name: "Yao Fabrice", pos: "DC", age: 26, ovr: 81, pot: 84 },
        { name: "Brou Kpaho", pos: "DG", age: 29, ovr: 81, pot: 81 },
        { name: "Ibrahim Koné", pos: "DD", age: 24, ovr: 80, pot: 85 },
        { name: "Sylla Mohamed", pos: "DC", age: 27, ovr: 81, pot: 82 },
        { name: "Babou Diarra", pos: "MDC", age: 28, ovr: 82, pot: 82 },
        { name: "Traoré Issa", pos: "MC", age: 26, ovr: 81, pot: 83 },
        { name: "Koné Lancine", pos: "MC", age: 25, ovr: 80, pot: 84 },
        { name: "Aka Serge", pos: "MOC", age: 24, ovr: 81, pot: 85 },
        { name: "N'Dri Kouamé", pos: "MC", age: 22, ovr: 79, pot: 85 },
        { name: "Koné Koré", pos: "BT", age: 27, ovr: 83, pot: 83 },
        { name: "Traoré Ben Fortune", pos: "BT", age: 22, ovr: 81, pot: 87 },
        { name: "Yao Kouassi", pos: "MOG", age: 24, ovr: 80, pot: 84 },
        { name: "Diomandé Ahmed", pos: "MOD", age: 23, ovr: 79, pot: 85 },
        { name: "Coulibaly Kader", pos: "MOD", age: 25, ovr: 80, pot: 82 },
        { name: "Zougouri Alain", pos: "BT", age: 21, ovr: 78, pot: 84 }
    ],

    "SOA": [ // Upper Mid (80 - 83)
        { name: "Zadi Horthalin", pos: "G", age: 31, ovr: 83, pot: 83 },
        { name: "Kouadio Seraphin", pos: "G", age: 26, ovr: 79, pot: 81 },
        { name: "Mamoudou Gbané", pos: "DC", age: 29, ovr: 82, pot: 82 },
        { name: "Anatole Gboaze", pos: "DC", age: 27, ovr: 81, pot: 82 },
        { name: "Youan Bi", pos: "DC", age: 25, ovr: 80, pot: 84 },
        { name: "Voly Bi", pos: "DG", age: 28, ovr: 80, pot: 80 },
        { name: "Ouro-Agoro", pos: "DD", age: 26, ovr: 80, pot: 82 },
        { name: "Doumbia Aboubacar", pos: "MDC", age: 28, ovr: 82, pot: 82 },
        { name: "Oumar Sako", pos: "MC", age: 27, ovr: 81, pot: 82 },
        { name: "Mondésir Kouadio", pos: "MC", age: 25, ovr: 80, pot: 84 },
        { name: "Tidiane Diomandé", pos: "MOC", age: 26, ovr: 81, pot: 82 },
        { name: "Gbané Mohamed", pos: "MC", age: 24, ovr: 79, pot: 83 },
        { name: "Bamba Lassina", pos: "BT", age: 29, ovr: 83, pot: 83 },
        { name: "Pondé Junior", pos: "BT", age: 24, ovr: 81, pot: 85 },
        { name: "Koné Bakary", pos: "BT", age: 25, ovr: 80, pot: 83 },
        { name: "Yoboué Jean", pos: "MOG", age: 23, ovr: 79, pot: 84 },
        { name: "Dossou Ibrahim", pos: "MOD", age: 22, ovr: 79, pot: 84 },
        { name: "Koffi Serge", pos: "BT", age: 21, ovr: 78, pot: 84 }
    ],

    "AFAD": [ // Upper Mid (80 - 83)
        { name: "N'Drin Ulrich", pos: "G", age: 29, ovr: 82, pot: 82 },
        { name: "Trabi Christ", pos: "G", age: 21, ovr: 78, pot: 85 },
        { name: "Lasme Guy", pos: "DC", age: 25, ovr: 81, pot: 85 },
        { name: "Topé Archange", pos: "DC", age: 22, ovr: 80, pot: 86 },
        { name: "Séry Serge", pos: "DG", age: 24, ovr: 80, pot: 84 },
        { name: "Kouadio Franck", pos: "DD", age: 23, ovr: 79, pot: 84 },
        { name: "Mory Koné", pos: "DC", age: 21, ovr: 78, pot: 85 },
        { name: "N'Guessan Jean", pos: "MDC", age: 21, ovr: 83, pot: 89 },
        { name: "Koffi Constant", pos: "MC", age: 24, ovr: 81, pot: 85 },
        { name: "Amani Silas", pos: "MC", age: 22, ovr: 80, pot: 86 },
        { name: "Sery Dogbo", pos: "MOC", age: 26, ovr: 82, pot: 83 },
        { name: "Kakou Kouamé", pos: "MC", age: 23, ovr: 79, pot: 84 },
        { name: "Bolou Hermann", pos: "BT", age: 24, ovr: 82, pot: 86 },
        { name: "Datro Fofana", pos: "BT", age: 21, ovr: 84, pot: 90 },
        { name: "Sery Gnoukouri", pos: "MOG", age: 22, ovr: 80, pot: 86 },
        { name: "Aka Richmond", pos: "MOD", age: 21, ovr: 79, pot: 85 },
        { name: "Konan Joël", pos: "BT", age: 20, ovr: 78, pot: 85 },
        { name: "Cédric Kouadio", pos: "MOG", age: 19, ovr: 77, pot: 85 }
    ],

    "Africa Sports": [ // Upper Mid (Historique) (80 - 83)
        { name: "Horthalin Zadi", pos: "G", age: 31, ovr: 82, pot: 82 },
        { name: "Kouassi Blé", pos: "G", age: 23, ovr: 79, pot: 84 },
        { name: "Ousmane Comara", pos: "DC", age: 28, ovr: 83, pot: 83 },
        { name: "Koffi N'Gouan", pos: "DC", age: 26, ovr: 81, pot: 84 },
        { name: "Souleymane Bamba", pos: "DC", age: 25, ovr: 80, pot: 85 },
        { name: "Mohamed Diaby", pos: "DG", age: 23, ovr: 79, pot: 84 },
        { name: "Abdou Diallo", pos: "DD", age: 22, ovr: 79, pot: 85 },
        { name: "Serge Dogbo", pos: "MDC", age: 28, ovr: 82, pot: 82 },
        { name: "Ibrahim Sanogo", pos: "MC", age: 25, ovr: 81, pot: 85 },
        { name: "Kouamé Yéboua", pos: "MOC", age: 24, ovr: 80, pot: 84 },
        { name: "Moussa Sylla", pos: "MC", age: 22, ovr: 79, pot: 86 },
        { name: "Brahima Touré", pos: "MDC", age: 21, ovr: 78, pot: 85 },
        { name: "Louis Abrogoua", pos: "BT", age: 22, ovr: 82, pot: 87 },
        { name: "Salif Kéita", pos: "MOG", age: 25, ovr: 81, pot: 84 },
        { name: "Mohamed Camara", pos: "MOD", age: 23, ovr: 80, pot: 85 },
        { name: "Amadou Diabaté", pos: "BT", age: 21, ovr: 79, pot: 86 },
        { name: "Guy Gbagbo", pos: "BT", age: 20, ovr: 78, pot: 85 },
        { name: "Oumar Bamba", pos: "MOD", age: 19, ovr: 76, pot: 84 }
    ],

    "SC Gagnoa": [ // Mid Tier (78 - 81)
        { name: "Ali Fofana", pos: "G", age: 27, ovr: 80, pot: 82 },
        { name: "Moussa Sy", pos: "G", age: 22, ovr: 76, pot: 81 },
        { name: "Kouakou Goua", pos: "DD", age: 30, ovr: 79, pot: 79 },
        { name: "Saliou N'Diaye", pos: "DC", age: 26, ovr: 78, pot: 81 },
        { name: "Arnaud Kassi", pos: "DC", age: 24, ovr: 77, pot: 82 },
        { name: "Mamadou Kéita", pos: "DG", age: 23, ovr: 77, pot: 82 },
        { name: "Oumar Diakité", pos: "DC", age: 25, ovr: 78, pot: 81 },
        { name: "Brahima Diomandé", pos: "MDC", age: 28, ovr: 80, pot: 80 },
        { name: "Jean N'Da", pos: "MC", age: 25, ovr: 79, pot: 82 },
        { name: "Aboubacar Sangaré", pos: "MC", age: 23, ovr: 78, pot: 83 },
        { name: "Seydou Bamba", pos: "MOC", age: 22, ovr: 77, pot: 82 },
        { name: "Kouadio Konan", pos: "MDC", age: 21, ovr: 76, pot: 82 },
        { name: "Mohamed Sylla", pos: "BT", age: 26, ovr: 81, pot: 82 },
        { name: "Aliou Touré", pos: "MOG", age: 24, ovr: 79, pot: 83 },
        { name: "Guy N'Guessan", pos: "MOD", age: 22, ovr: 78, pot: 83 },
        { name: "Issa Sanogo", pos: "BT", age: 23, ovr: 78, pot: 82 },
        { name: "Moussa Bamba", pos: "BT", age: 20, ovr: 75, pot: 82 },
        { name: "Salif Fofana", pos: "MOD", age: 21, ovr: 76, pot: 81 }
    ],

    "Stella Club": [ // Mid Tier (78 - 81)
        { name: "Ousmane Kouakou", pos: "G", age: 28, ovr: 79, pot: 81 },
        { name: "Amara Diabaté", pos: "G", age: 23, ovr: 75, pot: 80 },
        { name: "Moussa Koné", pos: "DC", age: 29, ovr: 79, pot: 79 },
        { name: "Sékou Diallo", pos: "DC", age: 25, ovr: 78, pot: 82 },
        { name: "Ali Bamba", pos: "DG", age: 24, ovr: 77, pot: 81 },
        { name: "Kader Traoré", pos: "DD", age: 26, ovr: 78, pot: 80 },
        { name: "Ibrahim Sylla", pos: "DC", age: 22, ovr: 76, pot: 82 },
        { name: "Guy Yao", pos: "MDC", age: 27, ovr: 80, pot: 81 },
        { name: "Mamadou Kéita", pos: "MC", age: 24, ovr: 78, pot: 82 },
        { name: "Abdoulaye Fofana", pos: "MC", age: 23, ovr: 77, pot: 82 },
        { name: "Salif Diarrassouba", pos: "MOC", age: 25, ovr: 78, pot: 81 },
        { name: "Kouadio N'Goran", pos: "MDC", age: 21, ovr: 75, pot: 81 },
        { name: "Aboubacar Sanogo", pos: "BT", age: 26, ovr: 80, pot: 81 },
        { name: "Moussa Bamba", pos: "MOG", age: 23, ovr: 78, pot: 83 },
        { name: "Issouf Traoré", pos: "MOD", age: 22, ovr: 77, pot: 82 },
        { name: "Seydou Camara", pos: "BT", age: 24, ovr: 78, pot: 81 },
        { name: "Guy Koffi", pos: "BT", age: 20, ovr: 75, pot: 82 },
        { name: "Mamadou Diakité", pos: "MOD", age: 21, ovr: 76, pot: 81 }
    ],

    "Bouaké FC": [ // Mid Tier (78 - 81)
        { name: "Sékou Bamba", pos: "G", age: 29, ovr: 78, pot: 78 },
        { name: "Moussa Koné", pos: "G", age: 24, ovr: 75, pot: 79 },
        { name: "Aboubacar Sylla", pos: "DC", age: 27, ovr: 79, pot: 80 },
        { name: "Ibrahim Diabaté", pos: "DC", age: 25, ovr: 77, pot: 81 },
        { name: "Mamadou Traoré", pos: "DG", age: 26, ovr: 78, pot: 80 },
        { name: "Salif Kéita", pos: "DD", age: 23, ovr: 76, pot: 81 },
        { name: "Ali Fofana", pos: "DC", age: 22, ovr: 76, pot: 82 },
        { name: "Moussa Sanogo", pos: "MDC", age: 28, ovr: 79, pot: 79 },
        { name: "Guy Diallo", pos: "MC", age: 24, ovr: 78, pot: 82 },
        { name: "Amara Bamba", pos: "MC", age: 25, ovr: 77, pot: 81 },
        { name: "Seydou Touré", pos: "MOC", age: 23, ovr: 77, pot: 82 },
        { name: "Issouf Camara", pos: "MDC", age: 21, ovr: 75, pot: 81 },
        { name: "Koffi N'Guessan", pos: "BT", age: 26, ovr: 80, pot: 81 },
        { name: "Mamadou Diarrassouba", pos: "MOG", age: 23, ovr: 78, pot: 82 },
        { name: "Abdoulaye Kéita", pos: "MOD", age: 22, ovr: 77, pot: 82 },
        { name: "Salif Fofana", pos: "BT", age: 24, ovr: 78, pot: 81 },
        { name: "Ibrahim Bamba", pos: "BT", age: 20, ovr: 74, pot: 81 },
        { name: "Moussa Sylla", pos: "MOD", age: 21, ovr: 75, pot: 81 }
    ],
    // ==========================================
    // CÔTE D'IVOIRE (LIGUE 1) - PARTIE 2/2
    // ==========================================

    "Zoman FC": [ // Lower Mid / Révélation (76 - 79)
        { name: "Adama Bamba", pos: "G", age: 26, ovr: 78, pot: 80 },
        { name: "Franck N'Guessan", pos: "G", age: 21, ovr: 74, pot: 81 },
        { name: "Yves Kouadio", pos: "DC", age: 28, ovr: 79, pot: 79 },
        { name: "Sékou Diabaté", pos: "DC", age: 25, ovr: 77, pot: 81 },
        { name: "Ange Kouassi", pos: "DC", age: 22, ovr: 76, pot: 82 },
        { name: "Hermann Yao", pos: "DG", age: 24, ovr: 77, pot: 80 },
        { name: "Serge Konan", pos: "DD", age: 26, ovr: 78, pot: 79 },
        { name: "Ismaël Traoré", pos: "MDC", age: 27, ovr: 78, pot: 78 },
        { name: "Oumar Fofana", pos: "MDC", age: 23, ovr: 76, pot: 81 },
        { name: "Cédric Dago", pos: "MC", age: 25, ovr: 77, pot: 80 },
        { name: "Elysée Kouamé", pos: "MC", age: 21, ovr: 75, pot: 82 },
        { name: "Moussa Diakité", pos: "MOC", age: 24, ovr: 78, pot: 82 },
        { name: "Habib Koné", pos: "MOC", age: 20, ovr: 76, pot: 83 },
        { name: "Bakary Diomandé", pos: "MOG", age: 23, ovr: 77, pot: 81 },
        { name: "Jean-Jacques Koffi", pos: "MOD", age: 22, ovr: 76, pot: 81 },
        { name: "Souleymane Touré", pos: "BT", age: 26, ovr: 79, pot: 80 },
        { name: "Alain Gbagbo", pos: "BT", age: 21, ovr: 75, pot: 82 },
        { name: "Ibrahim Sylla", pos: "BT", age: 24, ovr: 77, pot: 80 }
    ],

    "LYS Sassandra": [ // Très Populaire (76 - 79)
        { name: "Eliezer Tapé", pos: "G", age: 27, ovr: 78, pot: 80 },
        { name: "Kouamé N'Dri", pos: "G", age: 22, ovr: 74, pot: 79 },
        { name: "Patrick Gnahoré", pos: "DC", age: 29, ovr: 79, pot: 79 },
        { name: "Mory Koné", pos: "DC", age: 25, ovr: 77, pot: 81 },
        { name: "Sylvain Kassi", pos: "DC", age: 21, ovr: 75, pot: 82 },
        { name: "Ousmane Diallo", pos: "DG", age: 26, ovr: 77, pot: 78 },
        { name: "Guy-Gervais Yao", pos: "DD", age: 24, ovr: 76, pot: 80 },
        { name: "Amara Camara", pos: "MDC", age: 28, ovr: 78, pot: 78 },
        { name: "Trésor Mofossé", pos: "MC", age: 26, ovr: 77, pot: 79 },
        { name: "Armand Boka", pos: "MC", age: 22, ovr: 75, pot: 81 },
        { name: "Kader Ouattara", pos: "MOC", age: 25, ovr: 78, pot: 81 },
        { name: "Salif Bamba", pos: "MDC", age: 23, ovr: 76, pot: 80 },
        { name: "Daouda Sanogo", pos: "MOG", age: 27, ovr: 78, pot: 78 },
        { name: "Junior Loué", pos: "MOD", age: 21, ovr: 76, pot: 83 },
        { name: "Hassan Cissé", pos: "BT", age: 28, ovr: 79, pot: 79 },
        { name: "Evariste Dibo", pos: "BT", age: 24, ovr: 77, pot: 82 },
        { name: "Karim Fofana", pos: "BT", age: 20, ovr: 74, pot: 81 },
        { name: "Mamadou Sy", pos: "MOC", age: 22, ovr: 75, pot: 80 }
    ],

    "CO Korhogo": [ // Bas/Milieu de tableau (74 - 78)
        { name: "Issa Traoré", pos: "G", age: 29, ovr: 77, pot: 77 },
        { name: "Yaya Koné", pos: "G", age: 23, ovr: 73, pot: 78 },
        { name: "Aboubacar Sangaré", pos: "DC", age: 28, ovr: 77, pot: 77 },
        { name: "Lassina Diakité", pos: "DC", age: 25, ovr: 76, pot: 79 },
        { name: "Mohamed Coulibaly", pos: "DC", age: 22, ovr: 74, pot: 79 },
        { name: "Siaka Bamba", pos: "DG", age: 26, ovr: 76, pot: 78 },
        { name: "Amadou Touré", pos: "DD", age: 24, ovr: 75, pot: 79 },
        { name: "Sékou Ouattara", pos: "MDC", age: 27, ovr: 77, pot: 77 },
        { name: "Issouf Camara", pos: "MDC", age: 23, ovr: 75, pot: 80 },
        { name: "Ousmane Fofana", pos: "MC", age: 25, ovr: 76, pot: 79 },
        { name: "Adama Sylla", pos: "MC", age: 21, ovr: 74, pot: 81 },
        { name: "Karim Diabaté", pos: "MOC", age: 26, ovr: 77, pot: 78 },
        { name: "Moussa Koné", pos: "MOG", age: 24, ovr: 76, pot: 79 },
        { name: "Souleymane Soro", pos: "MOD", age: 22, ovr: 75, pot: 80 },
        { name: "Bakary Traoré", pos: "BT", age: 28, ovr: 78, pot: 78 },
        { name: "Ibrahim Coulibaly", pos: "BT", age: 25, ovr: 76, pot: 79 },
        { name: "Salif Sanogo", pos: "BT", age: 20, ovr: 73, pot: 80 },
        { name: "Ali Bamba", pos: "MOC", age: 23, ovr: 74, pot: 79 }
    ],

    "AS Denguélé": [ // Bas/Milieu de tableau (74 - 78)
        { name: "Oumar Diallo", pos: "G", age: 28, ovr: 77, pot: 78 },
        { name: "Seydou Koné", pos: "G", age: 22, ovr: 73, pot: 79 },
        { name: "Moussa Camara", pos: "DC", age: 30, ovr: 78, pot: 78 },
        { name: "Kader Sylla", pos: "DC", age: 26, ovr: 76, pot: 78 },
        { name: "Amara Diomandé", pos: "DC", age: 21, ovr: 74, pot: 80 },
        { name: "Ismaël Bamba", pos: "DG", age: 25, ovr: 76, pot: 79 },
        { name: "Lamine Touré", pos: "DD", age: 24, ovr: 75, pot: 80 },
        { name: "Yaya Fofana", pos: "MDC", age: 29, ovr: 77, pot: 77 },
        { name: "Abdoulaye Koné", pos: "MC", age: 27, ovr: 76, pot: 77 },
        { name: "Sékou Sangaré", pos: "MC", age: 23, ovr: 75, pot: 80 },
        { name: "Mamadou Ouattara", pos: "MOC", age: 25, ovr: 76, pot: 79 },
        { name: "Ibrahim Diakité", pos: "MDC", age: 21, ovr: 73, pot: 79 },
        { name: "Bakary Camara", pos: "MOG", age: 26, ovr: 77, pot: 78 },
        { name: "Issa Traoré", pos: "MOD", age: 22, ovr: 75, pot: 81 },
        { name: "Karim Cissé", pos: "BT", age: 28, ovr: 78, pot: 78 },
        { name: "Salif Doumbia", pos: "BT", age: 24, ovr: 76, pot: 80 },
        { name: "Ousmane Sylla", pos: "BT", age: 19, ovr: 72, pot: 81 },
        { name: "Aliou Sanogo", pos: "MOD", age: 23, ovr: 74, pot: 79 }
    ],

    "SOL FC": [ // Bas/Milieu de tableau (74 - 78)
        { name: "Habib Bamba", pos: "G", age: 27, ovr: 77, pot: 79 },
        { name: "Jean-Claude Kouamé", pos: "G", age: 21, ovr: 72, pot: 78 },
        { name: "Arnaud Yao", pos: "DC", age: 29, ovr: 78, pot: 78 },
        { name: "Cédric Konan", pos: "DC", age: 25, ovr: 76, pot: 79 },
        { name: "Guy-Florent N'Guessan", pos: "DC", age: 22, ovr: 74, pot: 81 },
        { name: "Michel Koffi", pos: "DG", age: 26, ovr: 76, pot: 78 },
        { name: "Hermann Dago", pos: "DD", age: 24, ovr: 75, pot: 80 },
        { name: "Eric Gbagbo", pos: "MDC", age: 28, ovr: 77, pot: 77 },
        { name: "Serge N'Dri", pos: "MC", age: 26, ovr: 76, pot: 78 },
        { name: "Yves Kouadio", pos: "MC", age: 22, ovr: 74, pot: 80 },
        { name: "Stéphane Boka", pos: "MOC", age: 25, ovr: 76, pot: 79 },
        { name: "Alain Kassi", pos: "MDC", age: 20, ovr: 72, pot: 80 },
        { name: "Junior Gnahoré", pos: "MOG", age: 23, ovr: 75, pot: 81 },
        { name: "Elysée Loué", pos: "MOD", age: 24, ovr: 76, pot: 79 },
        { name: "Patrick Yoboué", pos: "BT", age: 27, ovr: 78, pot: 79 },
        { name: "Fabrice Assalé", pos: "BT", age: 23, ovr: 76, pot: 81 },
        { name: "Franck Dje", pos: "BT", age: 19, ovr: 71, pot: 82 },
        { name: "Ange Kouamé", pos: "MOC", age: 22, ovr: 74, pot: 80 }
    ],

    "Mouna FC": [ // Promu / Bas de tableau (74 - 77)
        { name: "Saliou Traoré", pos: "G", age: 28, ovr: 76, pot: 77 },
        { name: "Ibrahim Bamba", pos: "G", age: 22, ovr: 72, pot: 78 },
        { name: "Moussa Diakité", pos: "DC", age: 29, ovr: 77, pot: 77 },
        { name: "Kader Camara", pos: "DC", age: 25, ovr: 75, pot: 79 },
        { name: "Amadou Sylla", pos: "DC", age: 21, ovr: 73, pot: 79 },
        { name: "Ismaël Koné", pos: "DG", age: 26, ovr: 75, pot: 77 },
        { name: "Lamine Ouattara", pos: "DD", age: 24, ovr: 74, pot: 78 },
        { name: "Yaya Touré", pos: "MDC", age: 27, ovr: 76, pot: 77 },
        { name: "Ousmane Sangaré", pos: "MC", age: 25, ovr: 75, pot: 78 },
        { name: "Sékou Fofana", pos: "MC", age: 22, ovr: 73, pot: 79 },
        { name: "Bakary Diomandé", pos: "MOC", age: 26, ovr: 76, pot: 77 },
        { name: "Karim Sanogo", pos: "MDC", age: 20, ovr: 71, pot: 78 },
        { name: "Aliou Cissé", pos: "MOG", age: 24, ovr: 75, pot: 79 },
        { name: "Salif Coulibaly", pos: "MOD", age: 23, ovr: 74, pot: 80 },
        { name: "Abdoulaye Bamba", pos: "BT", age: 28, ovr: 77, pot: 77 },
        { name: "Mamadou Traoré", pos: "BT", age: 24, ovr: 75, pot: 79 },
        { name: "Issa Sylla", pos: "BT", age: 19, ovr: 70, pot: 81 },
        { name: "Hassan Camara", pos: "MOG", age: 22, ovr: 73, pot: 78 }
    ],

    "ASI": [ // ASI d'Abengourou (74 - 78)
        { name: "Guy-Roland N'Goran", pos: "G", age: 30, ovr: 78, pot: 78 },
        { name: "Eric Yao", pos: "G", age: 23, ovr: 73, pot: 79 },
        { name: "Jean-Paul Kouamé", pos: "DC", age: 28, ovr: 77, pot: 77 },
        { name: "Cédric Kassi", pos: "DC", age: 26, ovr: 76, pot: 78 },
        { name: "Arnaud Boka", pos: "DC", age: 21, ovr: 73, pot: 80 },
        { name: "Stéphane Dago", pos: "DG", age: 27, ovr: 76, pot: 77 },
        { name: "Michel Konan", pos: "DD", age: 24, ovr: 75, pot: 80 },
        { name: "Hermann N'Dri", pos: "MDC", age: 29, ovr: 77, pot: 77 },
        { name: "Alain Kouadio", pos: "MC", age: 25, ovr: 76, pot: 79 },
        { name: "Patrick Gbagbo", pos: "MC", age: 22, ovr: 74, pot: 81 },
        { name: "Yves Assalé", pos: "MOC", age: 26, ovr: 77, pot: 78 },
        { name: "Junior Yoboué", pos: "MDC", age: 20, ovr: 71, pot: 80 },
        { name: "Elysée Dje", pos: "MOG", age: 24, ovr: 76, pot: 79 },
        { name: "Serge Loué", pos: "MOD", age: 23, ovr: 75, pot: 81 },
        { name: "Franck Koffi", pos: "BT", age: 28, ovr: 78, pot: 78 },
        { name: "Fabrice N'Guessan", pos: "BT", age: 24, ovr: 76, pot: 80 },
        { name: "Ange Kouamé", pos: "BT", age: 19, ovr: 71, pot: 82 },
        { name: "Guy-Florent Yao", pos: "MOD", age: 22, ovr: 74, pot: 80 }
    ],

    "ES Bafing": [ // Bas/Milieu de tableau (74 - 78)
        { name: "Moussa Bamba", pos: "G", age: 28, ovr: 77, pot: 78 },
        { name: "Aliou Touré", pos: "G", age: 22, ovr: 72, pot: 79 },
        { name: "Saliou Diakité", pos: "DC", age: 29, ovr: 78, pot: 78 },
        { name: "Kader Fofana", pos: "DC", age: 25, ovr: 76, pot: 79 },
        { name: "Amadou Sanogo", pos: "DC", age: 21, ovr: 73, pot: 81 },
        { name: "Ismaël Camara", pos: "DG", age: 26, ovr: 76, pot: 78 },
        { name: "Lamine Sylla", pos: "DD", age: 24, ovr: 75, pot: 80 },
        { name: "Yaya Sangaré", pos: "MDC", age: 27, ovr: 77, pot: 78 },
        { name: "Ousmane Ouattara", pos: "MC", age: 25, ovr: 76, pot: 79 },
        { name: "Sékou Koné", pos: "MC", age: 22, ovr: 74, pot: 80 },
        { name: "Bakary Diabaté", pos: "MOC", age: 26, ovr: 77, pot: 78 },
        { name: "Karim Coulibaly", pos: "MDC", age: 20, ovr: 71, pot: 80 },
        { name: "Alioune Traoré", pos: "MOG", age: 24, ovr: 76, pot: 80 },
        { name: "Salif Diomandé", pos: "MOD", age: 23, ovr: 75, pot: 81 },
        { name: "Abdoulaye Sylla", pos: "BT", age: 28, ovr: 78, pot: 78 },
        { name: "Mamadou Camara", pos: "BT", age: 24, ovr: 76, pot: 80 },
        { name: "Issa Bamba", pos: "BT", age: 19, ovr: 71, pot: 82 },
        { name: "Hassan Sanogo", pos: "MOC", age: 22, ovr: 74, pot: 80 }
    ],

    "JCAT": [ // Historique en difficulté (75 - 79)
        { name: "Cédric N'Goran", pos: "G", age: 31, ovr: 78, pot: 78 },
        { name: "Arnaud Yao", pos: "G", age: 24, ovr: 74, pot: 79 },
        { name: "Jean-Paul Kassi", pos: "DC", age: 30, ovr: 78, pot: 78 },
        { name: "Stéphane Boka", pos: "DC", age: 27, ovr: 77, pot: 78 },
        { name: "Michel Dago", pos: "DC", age: 22, ovr: 75, pot: 81 },
        { name: "Hermann Konan", pos: "DG", age: 28, ovr: 77, pot: 77 },
        { name: "Eric N'Dri", pos: "DD", age: 25, ovr: 76, pot: 79 },
        { name: "Serge Kouadio", pos: "MDC", age: 29, ovr: 78, pot: 78 },
        { name: "Yves Gbagbo", pos: "MC", age: 26, ovr: 77, pot: 79 },
        { name: "Alain Assalé", pos: "MC", age: 23, ovr: 75, pot: 80 },
        { name: "Junior Yoboué", pos: "MOC", age: 25, ovr: 77, pot: 80 },
        { name: "Elysée Loué", pos: "MDC", age: 21, ovr: 73, pot: 80 },
        { name: "Patrick Dje", pos: "MOG", age: 27, ovr: 78, pot: 78 },
        { name: "Fabrice Koffi", pos: "MOD", age: 24, ovr: 76, pot: 80 },
        { name: "Franck N'Guessan", pos: "BT", age: 29, ovr: 79, pot: 79 },
        { name: "Ange Kouamé", pos: "BT", age: 25, ovr: 77, pot: 80 },
        { name: "Guy-Florent Yao", pos: "BT", age: 20, ovr: 72, pot: 82 },
        { name: "Serge Kassi", pos: "MOD", age: 23, ovr: 75, pot: 81 }
    ],

    "Sewé Sport": [ // Ancien Champion / Milieu de tableau (76 - 80)
        { name: "Sylvain Gbohouo", pos: "G", age: 35, ovr: 80, pot: 80 },
        { name: "Ousmane Fofana", pos: "G", age: 23, ovr: 75, pot: 81 },
        { name: "Moussa Bamba", pos: "DC", age: 30, ovr: 79, pot: 79 },
        { name: "Kader Sylla", pos: "DC", age: 26, ovr: 78, pot: 80 },
        { name: "Amadou Diabaté", pos: "DC", age: 22, ovr: 76, pot: 82 },
        { name: "Ismaël Touré", pos: "DG", age: 28, ovr: 78, pot: 78 },
        { name: "Lamine Sangaré", pos: "DD", age: 25, ovr: 77, pot: 80 },
        { name: "Yaya Ouattara", pos: "MDC", age: 29, ovr: 79, pot: 79 },
        { name: "Abdoulaye Koné", pos: "MC", age: 27, ovr: 78, pot: 79 },
        { name: "Sékou Camara", pos: "MC", age: 23, ovr: 76, pot: 81 },
        { name: "Mamadou Diomandé", pos: "MOC", age: 26, ovr: 78, pot: 80 },
        { name: "Ibrahim Sanogo", pos: "MDC", age: 21, ovr: 74, pot: 81 },
        { name: "Bakary Coulibaly", pos: "MOG", age: 27, ovr: 79, pot: 79 },
        { name: "Issa Traoré", pos: "MOD", age: 24, ovr: 77, pot: 82 },
        { name: "Karim Sylla", pos: "BT", age: 29, ovr: 80, pot: 80 },
        { name: "Salif Bamba", pos: "BT", age: 25, ovr: 78, pot: 81 },
        { name: "Ousmane Cissé", pos: "BT", age: 20, ovr: 73, pot: 83 },
        { name: "Aliou Sanogo", pos: "MOD", age: 23, ovr: 76, pot: 81 }
    ],
    // ==========================================
    // MAROC (BOTOLA PRO) - PARTIE 1/2
    // ==========================================

    "Wydad AC": [ // Top Club (83 - 87)
        { name: "Youssef El Motie", pos: "G", age: 29, ovr: 85, pot: 86 },
        { name: "Mehdi Maftah", pos: "G", age: 30, ovr: 81, pot: 81 },
        { name: "Jamal Harkass", pos: "DC", age: 28, ovr: 85, pot: 85 },
        { name: "Amine Aboulfath", pos: "DC", age: 26, ovr: 83, pot: 85 },
        { name: "Ayoub El Amloud", pos: "DD", age: 30, ovr: 86, pot: 86 },
        { name: "Ilyes Chetti", pos: "DG", age: 29, ovr: 84, pot: 84 },
        { name: "Amine Farhane", pos: "DC", age: 26, ovr: 82, pot: 84 },
        { name: "Yahya Jabrane", pos: "MDC", age: 32, ovr: 87, pot: 87 },
        { name: "Zakaria Draoui", pos: "MDC", age: 30, ovr: 85, pot: 85 },
        { name: "Abdallah Haimoud", pos: "MC", age: 22, ovr: 82, pot: 88 },
        { name: "Sidi Bouna Amar", pos: "MOC", age: 25, ovr: 84, pot: 87 },
        { name: "Oussama Mahrous", pos: "MC", age: 28, ovr: 81, pot: 82 },
        { name: "Saifeddine Bouhra", pos: "MOG", age: 24, ovr: 84, pot: 88 },
        { name: "Hamdou Elhouni", pos: "MOD", age: 30, ovr: 83, pot: 83 },
        { name: "M'Baye Niang", pos: "BT", age: 29, ovr: 85, pot: 85 },
        { name: "Bouly Junior Sambou", pos: "BT", age: 25, ovr: 82, pot: 84 },
        { name: "Imad Khannouss", pos: "MOG", age: 21, ovr: 79, pot: 86 },
        { name: "Montasser Lahtimi", pos: "MOD", age: 23, ovr: 81, pot: 86 }
    ],

    "Raja CA": [ // Top Club (83 - 87) - Les Aigles Verts
        { name: "Anas Zniti", pos: "G", age: 35, ovr: 86, pot: 86 },
        { name: "Marouane Fakhr", pos: "G", age: 34, ovr: 80, pot: 80 },
        { name: "Abdellah Khafifi", pos: "DC", age: 31, ovr: 84, pot: 84 },
        { name: "Ismail Mokadem", pos: "DC", age: 28, ovr: 85, pot: 85 },
        { name: "Youssef Belammari", pos: "DG", age: 25, ovr: 83, pot: 86 },
        { name: "Mohamed Boulacsout", pos: "DD", age: 25, ovr: 82, pot: 85 },
        { name: "Bouchaib Arrassi", pos: "DC", age: 24, ovr: 81, pot: 86 },
        { name: "Mohamed Makahasi", pos: "MDC", age: 29, ovr: 84, pot: 84 },
        { name: "Roger Aholou", pos: "MDC", age: 30, ovr: 83, pot: 83 },
        { name: "Mohamed Zrida", pos: "MC", age: 25, ovr: 85, pot: 88 },
        { name: "Sabir Bougrine", pos: "MOC", age: 27, ovr: 84, pot: 85 },
        { name: "Ahmadou Camara", pos: "MC", age: 20, ovr: 79, pot: 87 },
        { name: "Yousri Bouzok", pos: "MOD", age: 27, ovr: 86, pot: 87 },
        { name: "Adam Ennaffati", pos: "MOG", age: 30, ovr: 85, pot: 85 },
        { name: "Naoufel Zerhouni", pos: "BT", age: 28, ovr: 84, pot: 84 },
        { name: "Riad Benayad", pos: "BT", age: 27, ovr: 83, pot: 84 },
        { name: "Victor Abrego", pos: "BT", age: 27, ovr: 81, pot: 82 },
        { name: "Nawfel Zarkane", pos: "MOD", age: 21, ovr: 78, pot: 85 }
    ],

    "AS FAR": [ // Top Club (83 - 86) - Champion Récent
        { name: "El Mehdi Benabid", pos: "G", age: 26, ovr: 85, pot: 88 },
        { name: "Ayoub El Khayati", pos: "G", age: 25, ovr: 80, pot: 84 },
        { name: "Zuhair Marour", pos: "DC", age: 29, ovr: 83, pot: 83 },
        { name: "Hatim Essaouabi", pos: "DC", age: 23, ovr: 82, pot: 87 },
        { name: "Emmanuel Immanishimwe", pos: "DG", age: 29, ovr: 84, pot: 84 },
        { name: "Mohamed Mofid", pos: "DD", age: 24, ovr: 83, pot: 86 },
        { name: "Anwar Tarkhatt", pos: "DC", age: 26, ovr: 81, pot: 83 },
        { name: "Rabie Hrimat", pos: "MDC", age: 29, ovr: 86, pot: 86 },
        { name: "Larbi Naji", pos: "MDC", age: 33, ovr: 83, pot: 83 },
        { name: "Amine Zouhzouh", pos: "MOC", age: 23, ovr: 84, pot: 89 },
        { name: "Khalid Ait Ouarkhane", pos: "MC", age: 22, ovr: 82, pot: 87 },
        { name: "Zinedine Derrag", pos: "MC", age: 25, ovr: 81, pot: 84 },
        { name: "Hamza Igamane", pos: "BT", age: 21, ovr: 85, pot: 90 },
        { name: "Ahmed Hammoudan", pos: "MOG", age: 32, ovr: 84, pot: 84 },
        { name: "Lamine Diakite", pos: "MOD", age: 32, ovr: 82, pot: 82 },
        { name: "Tumisang Orebonye", pos: "BT", age: 28, ovr: 83, pot: 83 },
        { name: "Abdelfettah Hadraf", pos: "MOG", age: 26, ovr: 81, pot: 83 },
        { name: "Alaeddine Ajaraie", pos: "BT", age: 31, ovr: 80, pot: 80 }
    ],

    "RS Berkane": [ // Top Club (82 - 86) - Maîtres Africains
        { name: "Munir Mohamedi", pos: "G", age: 35, ovr: 86, pot: 86 },
        { name: "Hamza Hamiani", pos: "G", age: 30, ovr: 82, pot: 82 },
        { name: "Issoufou Dayo", pos: "DC", age: 32, ovr: 86, pot: 86 },
        { name: "Abdelhak Assal", pos: "DC", age: 25, ovr: 83, pot: 86 },
        { name: "Hamza El Moussaoui", pos: "DG", age: 30, ovr: 84, pot: 84 },
        { name: "Ayoub Khairi", pos: "DD", age: 24, ovr: 81, pot: 85 },
        { name: "Amine El Karmoudi", pos: "DC", age: 22, ovr: 79, pot: 84 },
        { name: "Yassine Labhiri", pos: "MC", age: 29, ovr: 85, pot: 85 },
        { name: "Omar Arjoune", pos: "MDC", age: 28, ovr: 84, pot: 84 },
        { name: "Mamadou Lamine Camara", pos: "MDC", age: 21, ovr: 82, pot: 88 },
        { name: "Mohamed El Morabit", pos: "MOC", age: 25, ovr: 83, pot: 86 },
        { name: "Reda Hajji", pos: "MC", age: 26, ovr: 80, pot: 82 },
        { name: "Youssef Zghoudi", pos: "MOD", age: 31, ovr: 83, pot: 83 },
        { name: "Paul Bassène", pos: "BT", age: 23, ovr: 82, pot: 87 },
        { name: "Youssef El Fahli", pos: "MOG", age: 27, ovr: 84, pot: 84 },
        { name: "Oussama El Mlioui", pos: "BT", age: 27, ovr: 81, pot: 82 },
        { name: "Djibril Ouattara", pos: "BT", age: 24, ovr: 80, pot: 84 },
        { name: "Tuisila Kisinda", pos: "MOD", age: 24, ovr: 82, pot: 85 }
    ],

    "FUS Rabat": [ // Upper Mid (79 - 84)
        { name: "Aymen Majid", pos: "G", age: 29, ovr: 82, pot: 82 },
        { name: "Mehdi Bellarabi", pos: "G", age: 24, ovr: 78, pot: 82 },
        { name: "El Mehdi El Bassil", pos: "DC", age: 36, ovr: 80, pot: 80 },
        { name: "Oussama Raoui", pos: "DC", age: 21, ovr: 81, pot: 87 },
        { name: "Ayoub Qasmi", pos: "DG", age: 30, ovr: 80, pot: 80 },
        { name: "Ayoub Nanah", pos: "MOC", age: 31, ovr: 83, pot: 83 },
        { name: "Amine Louani", pos: "MDC", age: 28, ovr: 81, pot: 81 },
        { name: "Mehdi Karnass", pos: "MC", age: 34, ovr: 80, pot: 80 },
        { name: "Hamza Hannouri", pos: "BT", age: 26, ovr: 82, pot: 84 },
        { name: "Herman Kameni", pos: "BT", age: 22, ovr: 80, pot: 85 },
        { name: "Hamid Ahadad", pos: "MOG", age: 29, ovr: 82, pot: 82 },
        { name: "Yahya Ben Khaleq", pos: "DC", age: 25, ovr: 79, pot: 82 },
        { name: "Anas Bach", pos: "DD", age: 26, ovr: 81, pot: 82 },
        { name: "James Ajako", pos: "DG", age: 21, ovr: 78, pot: 84 },
        { name: "Youssef Belammari", pos: "MC", age: 24, ovr: 80, pot: 85 },
        { name: "Amine Azri", pos: "MOG", age: 22, ovr: 77, pot: 83 },
        { name: "Chouaib El Maftoul", pos: "MDC", age: 29, ovr: 80, pot: 80 },
        { name: "Ayoub Mouloua", pos: "BT", age: 23, ovr: 78, pot: 82 }
    ],

    "Maghreb de Fès": [ // Upper Mid (79 - 83)
        { name: "Salaheddine Shihab", pos: "G", age: 31, ovr: 81, pot: 81 },
        { name: "Hamza El Janati", pos: "DD", age: 25, ovr: 82, pot: 85 },
        { name: "Youssef Aguerdoum", pos: "DC", age: 34, ovr: 80, pot: 80 },
        { name: "Saad Ait Khorsa", pos: "DC", age: 30, ovr: 79, pot: 79 },
        { name: "Omar Namsaoui", pos: "DD", age: 34, ovr: 78, pot: 78 },
        { name: "Imad Riahi", pos: "MOD", age: 23, ovr: 81, pot: 85 },
        { name: "Justin Mengolo", pos: "BT", age: 30, ovr: 80, pot: 80 },
        { name: "Lahcen Dahdouh", pos: "MOC", age: 24, ovr: 81, pot: 85 },
        { name: "Hamza Afsal", pos: "MDC", age: 27, ovr: 79, pot: 80 },
        { name: "Haytham Aina", pos: "MC", age: 21, ovr: 77, pot: 83 },
        { name: "Mouhcine Bouriga", pos: "BT", age: 24, ovr: 80, pot: 84 },
        { name: "Tarik Astati", pos: "DG", age: 32, ovr: 79, pot: 79 },
        { name: "Ismail Benktib", pos: "MDC", age: 25, ovr: 80, pot: 83 },
        { name: "Christian Nsundi", pos: "BT", age: 22, ovr: 78, pot: 83 },
        { name: "Oussama Amin", pos: "DC", age: 26, ovr: 78, pot: 80 },
        { name: "Mohammed El Badoui", pos: "MOG", age: 23, ovr: 79, pot: 84 },
        { name: "Khalid Baba", pos: "MC", age: 28, ovr: 78, pot: 78 },
        { name: "Youssef El Houari", pos: "G", age: 24, ovr: 76, pot: 80 }
    ],

    "Hassania Agadir": [ // Upper Mid (78 - 82)
        { name: "Mehdi El Jourbaoui", pos: "G", age: 31, ovr: 80, pot: 80 },
        { name: "Badr Benachour", pos: "G", age: 29, ovr: 78, pot: 78 },
        { name: "Yassine Rami", pos: "DC", age: 37, ovr: 79, pot: 79 },
        { name: "Jamal Ech-Chammakh", pos: "DG", age: 23, ovr: 81, pot: 85 },
        { name: "Hamza El Khalfoui", pos: "DC", age: 25, ovr: 79, pot: 82 },
        { name: "Fedi Ben Choug", pos: "MOC", age: 29, ovr: 82, pot: 82 },
        { name: "Jalal Tachtach", pos: "MC", age: 29, ovr: 80, pot: 80 },
        { name: "Soufian El Moudane", pos: "MDC", age: 30, ovr: 81, pot: 81 },
        { name: "Katy Kataldi", pos: "BT", age: 24, ovr: 80, pot: 84 },
        { name: "Mohamed Bakhache", pos: "MOD", age: 22, ovr: 79, pot: 84 },
        { name: "Ayoub Lakhdar", pos: "MOG", age: 26, ovr: 79, pot: 81 },
        { name: "Abdallah Boukhanfer", pos: "MDC", age: 21, ovr: 77, pot: 83 },
        { name: "Hamza Afsal", pos: "MC", age: 27, ovr: 78, pot: 78 },
        { name: "Ilias El Mourabit", pos: "DC", age: 23, ovr: 77, pot: 82 },
        { name: "Amine El Mssane", pos: "DD", age: 24, ovr: 78, pot: 82 },
        { name: "Reda Zemrani", pos: "BT", age: 21, ovr: 76, pot: 81 },
        { name: "Hassan Souari", pos: "MOC", age: 20, ovr: 75, pot: 82 },
        { name: "Hicham El Amrani", pos: "MC", age: 25, ovr: 77, pot: 80 }
    ],

    "Olympique Safi": [ // Upper Mid (78 - 82)
        { name: "Khalid Kbir Alaoui", pos: "G", age: 26, ovr: 81, pot: 84 },
        { name: "Yassine Kordani", pos: "DC", age: 25, ovr: 80, pot: 83 },
        { name: "Mehdi Khalis", pos: "DC", age: 35, ovr: 78, pot: 78 },
        { name: "Walid Rhailouf", pos: "MC", age: 25, ovr: 79, pot: 82 },
        { name: "Abderahman Kassak", pos: "MDC", age: 28, ovr: 80, pot: 80 },
        { name: "Cheickna Samake", pos: "BT", age: 24, ovr: 81, pot: 85 },
        { name: "Younes Najari", pos: "MOD", age: 28, ovr: 81, pot: 81 },
        { name: "Abdoulaye Diarra", pos: "BT", age: 22, ovr: 79, pot: 84 },
        { name: "Houcine Rahimi", pos: "MOG", age: 22, ovr: 79, pot: 85 },
        { name: "Soulaimane El Amrani", pos: "DG", age: 27, ovr: 79, pot: 80 },
        { name: "Mohamed El Morabit", pos: "DD", age: 26, ovr: 78, pot: 81 },
        { name: "Karim El Bounaghat", pos: "MOC", age: 24, ovr: 79, pot: 83 },
        { name: "Ayman Belaidi", pos: "DC", age: 21, ovr: 77, pot: 82 },
        { name: "Zakaria Belmaachi", pos: "MDC", age: 23, ovr: 78, pot: 82 },
        { name: "Ali Acha", pos: "MC", age: 25, ovr: 77, pot: 80 },
        { name: "Oussama El Gherib", pos: "DG", age: 36, ovr: 76, pot: 76 },
        { name: "Youssef Michte", pos: "BT", age: 25, ovr: 78, pot: 81 },
        { name: "Reda Zahraoui", pos: "G", age: 22, ovr: 75, pot: 80 }
    ],

    "Ittihad Tanger": [ // Upper Mid (78 - 82)
        { name: "Gaya Merbah", pos: "G", age: 29, ovr: 83, pot: 83 },
        { name: "Ismail Khafi", pos: "BT", age: 28, ovr: 82, pot: 82 },
        { name: "Mohamed Ali Bamaamar", pos: "MDC", age: 34, ovr: 81, pot: 81 },
        { name: "El Hadji Youssoupha Konate", pos: "DC", age: 29, ovr: 80, pot: 80 },
        { name: "Ayoub El Jorfi", pos: "DC", age: 24, ovr: 79, pot: 83 },
        { name: "Oussama Al Aiz", pos: "DD", age: 25, ovr: 79, pot: 82 },
        { name: "Hassan Chentouf", pos: "MC", age: 27, ovr: 80, pot: 80 },
        { name: "Hamza El Wasti", pos: "MOD", age: 29, ovr: 81, pot: 81 },
        { name: "Jawad Ghabra", pos: "MOG", age: 28, ovr: 80, pot: 80 },
        { name: "Zakaria Kiani", pos: "DD", age: 27, ovr: 78, pot: 79 },
        { name: "Nour El Asri", pos: "MOC", age: 22, ovr: 78, pot: 84 },
        { name: "Ali El Harrak", pos: "BT", age: 26, ovr: 79, pot: 81 },
        { name: "Badr Mosaddaq", pos: "G", age: 25, ovr: 77, pot: 81 },
        { name: "Ayoub El Khaliqi", pos: "DG", age: 23, ovr: 78, pot: 83 },
        { name: "Mohamed Ayman", pos: "MC", age: 21, ovr: 76, pot: 82 },
        { name: "Youssef Benali", pos: "MOD", age: 29, ovr: 79, pot: 79 },
        { name: "Walid Bencherifa", pos: "DC", age: 35, ovr: 77, pot: 77 },
        { name: "Sofian El Moudane", pos: "MDC", age: 30, ovr: 80, pot: 80 }
    ],

    "Moghreb Tétouan": [ // Upper Mid (78 - 82)
        { name: "Yahia Filali", pos: "G", age: 28, ovr: 81, pot: 82 },
        { name: "Zaid Krouch", pos: "MOC", age: 33, ovr: 82, pot: 82 },
        { name: "Yassine Amrioui", pos: "DG", age: 29, ovr: 79, pot: 79 },
        { name: "Ayoub Modane", pos: "DC", age: 26, ovr: 80, pot: 82 },
        { name: "Mamadou Seck", pos: "DC", age: 24, ovr: 79, pot: 83 },
        { name: "Bilal El Megri", pos: "MOD", age: 33, ovr: 80, pot: 80 },
        { name: "Yassine Lamine", pos: "MOG", age: 23, ovr: 80, pot: 85 },
        { name: "Pape Badji", pos: "BT", age: 25, ovr: 81, pot: 84 },
        { name: "Hilal Ferdaoussi", pos: "MDC", age: 24, ovr: 78, pot: 82 },
        { name: "Anass Rgoig", pos: "MC", age: 22, ovr: 77, pot: 83 },
        { name: "Ayoub Chaboud", pos: "DD", age: 27, ovr: 79, pot: 80 },
        { name: "Mohamed Radouani", pos: "MC", age: 26, ovr: 78, pot: 81 },
        { name: "Mouad Goulouss", pos: "BT", age: 21, ovr: 77, pot: 83 },
        { name: "Walid El Karti", pos: "MDC", age: 20, ovr: 76, pot: 84 },
        { name: "Mohamed Yassine", pos: "G", age: 23, ovr: 76, pot: 81 },
        { name: "Ismail El Hajri", pos: "DC", age: 22, ovr: 77, pot: 82 },
        { name: "Ayoub Ouadghiri", pos: "MOD", age: 24, ovr: 78, pot: 81 },
        { name: "Zakaria El Ouardi", pos: "MOC", age: 25, ovr: 80, pot: 83 }
    ],// ==========================================
    // MAROC (BOTOLA PRO) - PARTIE 2/2
    // ==========================================

    "JS Soualem": [ // Milieu de tableau (76 - 80)
        { name: "Hicham El Allouch", pos: "G", age: 33, ovr: 78, pot: 78 },
        { name: "Mohamed Chennouf", pos: "G", age: 25, ovr: 75, pot: 80 },
        { name: "Yassine Kordani", pos: "DC", age: 29, ovr: 79, pot: 79 },
        { name: "Ayman Haddidi", pos: "DC", age: 23, ovr: 76, pot: 82 },
        { name: "Amine Lamghari", pos: "DC", age: 26, ovr: 77, pot: 79 },
        { name: "Badr Benoun", pos: "DD", age: 24, ovr: 75, pot: 80 },
        { name: "Ayoub Khalifi", pos: "DG", age: 27, ovr: 76, pot: 77 },
        { name: "Karim Safsaf", pos: "MDC", age: 28, ovr: 78, pot: 78 },
        { name: "Mehdi Maouhoub", pos: "MC", age: 21, ovr: 75, pot: 84 },
        { name: "Youssef Essayati", pos: "MC", age: 30, ovr: 77, pot: 77 },
        { name: "Hicham El Aroui", pos: "MOC", age: 32, ovr: 79, pot: 79 },
        { name: "Salaheddine Icharane", pos: "MOG", age: 25, ovr: 76, pot: 81 },
        { name: "Abdelwahed Hasti", pos: "MOD", age: 22, ovr: 75, pot: 82 },
        { name: "Hamza Moujahid", pos: "MDC", age: 28, ovr: 78, pot: 78 },
        { name: "Mustapha Sahd", pos: "BT", age: 30, ovr: 80, pot: 80 },
        { name: "Gibril Sillah", pos: "BT", age: 25, ovr: 78, pot: 82 },
        { name: "Ayoub Taleb", pos: "BT", age: 20, ovr: 74, pot: 83 },
        { name: "Oussama Zemraoui", pos: "MOC", age: 21, ovr: 76, pot: 81 }
    ],

    "Mouloudia Oujda": [ // Historique / Bas de tableau (75 - 79)
        { name: "Mehdi Maftah", pos: "G", age: 30, ovr: 79, pot: 79 },
        { name: "Ziad Laafsa", pos: "G", age: 24, ovr: 74, pot: 79 },
        { name: "Yassine Merah", pos: "DC", age: 27, ovr: 78, pot: 80 },
        { name: "Anass Nouader", pos: "DC", age: 25, ovr: 76, pot: 81 },
        { name: "Hamza Semmoumy", pos: "DD", age: 33, ovr: 77, pot: 77 },
        { name: "Oualid Sail", pos: "DG", age: 31, ovr: 76, pot: 76 },
        { name: "Yassine Filali", pos: "DC", age: 22, ovr: 74, pot: 80 },
        { name: "Lamine Diakité", pos: "MDC", age: 32, ovr: 79, pot: 79 },
        { name: "Habib Allah Dahmani", pos: "MC", age: 29, ovr: 78, pot: 78 },
        { name: "Karim Benarif", pos: "MC", age: 26, ovr: 77, pot: 80 },
        { name: "Nadir Lougmani", pos: "MOC", age: 23, ovr: 76, pot: 82 },
        { name: "Youssef Anouar", pos: "MOG", age: 33, ovr: 78, pot: 78 },
        { name: "Chouhaib El Maftoul", pos: "MOD", age: 29, ovr: 79, pot: 79 },
        { name: "Soufiane Karkache", pos: "MDC", age: 25, ovr: 76, pot: 81 },
        { name: "Paul Valère", pos: "BT", age: 28, ovr: 79, pot: 79 },
        { name: "Ali Haroune", pos: "BT", age: 24, ovr: 76, pot: 81 },
        { name: "Yassine Dahbi", pos: "BT", age: 32, ovr: 77, pot: 77 },
        { name: "Amine El Mourabit", pos: "MOD", age: 21, ovr: 74, pot: 82 }
    ],

    "SCC Mohammédia": [ // Milieu / Bas de tableau (76 - 79)
        { name: "El Mehdi Harrar", pos: "G", age: 23, ovr: 76, pot: 82 },
        { name: "Soufiane Barrouhou", pos: "G", age: 30, ovr: 75, pot: 75 },
        { name: "Abdelhakim Bassaine", pos: "DC", age: 28, ovr: 78, pot: 78 },
        { name: "Zakaria Driouech", pos: "DC", age: 23, ovr: 75, pot: 82 },
        { name: "Hamza Bahaj", pos: "DD", age: 26, ovr: 77, pot: 79 },
        { name: "Ayoub Boucheta", pos: "DG", age: 29, ovr: 76, pot: 76 },
        { name: "Abderazzak Nakous", pos: "DC", age: 21, ovr: 74, pot: 81 },
        { name: "Walid Nassi", pos: "MDC", age: 24, ovr: 77, pot: 82 },
        { name: "Ayoub Adila", pos: "MC", age: 27, ovr: 78, pot: 78 },
        { name: "Taoufik Safsafi", pos: "MC", age: 32, ovr: 77, pot: 77 },
        { name: "Oussama Zamraoui", pos: "MOC", age: 22, ovr: 76, pot: 83 },
        { name: "Ismail Mihrab", pos: "MOG", age: 25, ovr: 77, pot: 81 },
        { name: "Abderrazak Ghazouat", pos: "MOD", age: 24, ovr: 76, pot: 82 },
        { name: "Adil Tahif", pos: "MDC", age: 23, ovr: 75, pot: 80 },
        { name: "Hassan Moujahid", pos: "BT", age: 26, ovr: 78, pot: 80 },
        { name: "Abdelaziz Ndour", pos: "BT", age: 22, ovr: 75, pot: 83 },
        { name: "Salomon Banga", pos: "BT", age: 27, ovr: 77, pot: 78 },
        { name: "Youssef Dalzi", pos: "MOC", age: 21, ovr: 74, pot: 81 }
    ],

    "Youssoufia Berrechid": [ // Bas de tableau (74 - 78)
        { name: "Achraf Hilali", pos: "G", age: 32, ovr: 77, pot: 77 },
        { name: "Hussein Chadli", pos: "G", age: 25, ovr: 74, pot: 78 },
        { name: "Yassine El Oualid", pos: "DC", age: 30, ovr: 78, pot: 78 },
        { name: "Tarik Astati", pos: "DC", age: 32, ovr: 76, pot: 76 },
        { name: "Hamza El Khattari", pos: "DD", age: 24, ovr: 75, pot: 80 },
        { name: "Ayman Chabani", pos: "DG", age: 26, ovr: 76, pot: 79 },
        { name: "Abdelkhalek Ait Ourehbi", pos: "DC", age: 22, ovr: 73, pot: 80 },
        { name: "Soufiane Saadane", pos: "MDC", age: 29, ovr: 77, pot: 77 },
        { name: "Ibrahim Najm Eddine", pos: "MC", age: 27, ovr: 76, pot: 78 },
        { name: "Oussama Chaibi", pos: "MC", age: 25, ovr: 75, pot: 80 },
        { name: "Abdelaziz El Hamzaoui", pos: "MOC", age: 23, ovr: 75, pot: 81 },
        { name: "Said El Aoufi", pos: "MOG", age: 28, ovr: 77, pot: 77 },
        { name: "Younes Ed-Dyb", pos: "MOD", age: 24, ovr: 76, pot: 80 },
        { name: "Karim El Hani", pos: "MDC", age: 22, ovr: 74, pot: 79 },
        { name: "Abdelkhaliq Ait Ourehbi", pos: "BT", age: 28, ovr: 78, pot: 78 },
        { name: "Mouad Goulouss", pos: "BT", age: 23, ovr: 75, pot: 81 },
        { name: "Youssef Oggadi", pos: "BT", age: 31, ovr: 76, pot: 76 },
        { name: "Zakaria El Kiani", pos: "MOD", age: 26, ovr: 75, pot: 78 }
    ],

    "RCA Zemamra": [ // Promu / Bas de tableau (75 - 78)
        { name: "Marouane Fakhr", pos: "G", age: 34, ovr: 78, pot: 78 },
        { name: "Younes Karabila", pos: "G", age: 24, ovr: 73, pot: 79 },
        { name: "Brahim El Bahri", pos: "DC", age: 37, ovr: 76, pot: 76 },
        { name: "Abdelkhalid Hamidouch", pos: "DC", age: 26, ovr: 77, pot: 80 },
        { name: "Yassine El Bouzidi", pos: "DD", age: 28, ovr: 76, pot: 76 },
        { name: "Hamza El Madani", pos: "DG", age: 25, ovr: 75, pot: 80 },
        { name: "Tariq Taouil", pos: "DC", age: 22, ovr: 74, pot: 81 },
        { name: "Ayoub Benyacha", pos: "MDC", age: 27, ovr: 77, pot: 78 },
        { name: "Abdessamad El Moubarki", pos: "MOC", age: 41, ovr: 76, pot: 76 },
        { name: "Youssef Bekkari", pos: "MC", age: 23, ovr: 75, pot: 82 },
        { name: "Lahcen Dahdouh", pos: "MC", age: 24, ovr: 76, pot: 80 },
        { name: "Kamal El Othmani", pos: "MOG", age: 29, ovr: 77, pot: 77 },
        { name: "Zakaria Hadraf", pos: "MOD", age: 34, ovr: 78, pot: 78 },
        { name: "Oussama Shita", pos: "MDC", age: 21, ovr: 73, pot: 79 },
        { name: "Mahmoud Benhalib", pos: "BT", age: 28, ovr: 79, pot: 79 },
        { name: "Jawad Ghabra", pos: "BT", age: 29, ovr: 77, pot: 77 },
        { name: "Amine El Azzouzi", pos: "BT", age: 22, ovr: 75, pot: 82 },
        { name: "Hicham Marchad", pos: "MOG", age: 32, ovr: 76, pot: 76 }
    ],

    "UTS Rabat": [ // Jeunesse & Pépites (76 - 80)
        { name: "Abderrahmane El Houasli", pos: "G", age: 39, ovr: 78, pot: 78 },
        { name: "Reda Asmama", pos: "G", age: 22, ovr: 76, pot: 83 },
        { name: "Ilyas Haddad", pos: "DC", age: 34, ovr: 78, pot: 78 },
        { name: "Achraf Berki", pos: "DC", age: 22, ovr: 77, pot: 84 },
        { name: "Hicham El Aroui", pos: "DD", age: 33, ovr: 76, pot: 76 },
        { name: "Ayman Dairani", pos: "DG", age: 26, ovr: 78, pot: 81 },
        { name: "Tahadi El Aynaoui", pos: "DC", age: 21, ovr: 75, pot: 83 },
        { name: "Eric Mbangossoum", pos: "MDC", age: 24, ovr: 79, pot: 84 },
        { name: "Ayoub El Moudene", pos: "MDC", age: 26, ovr: 78, pot: 80 },
        { name: "Amine Zouhzouh", pos: "MOC", age: 23, ovr: 80, pot: 85 },
        { name: "Hassan Aqboub", pos: "MC", age: 20, ovr: 76, pot: 85 },
        { name: "Mohamed Radid", pos: "MOG", age: 21, ovr: 77, pot: 84 },
        { name: "Tawfik Bentayeb", pos: "MOD", age: 22, ovr: 78, pot: 83 },
        { name: "Simon Diedhiou", pos: "MC", age: 32, ovr: 77, pot: 77 },
        { name: "Tiago Lopes", pos: "BT", age: 29, ovr: 79, pot: 79 },
        { name: "Hicham Khaloua", pos: "BT", age: 28, ovr: 78, pot: 78 },
        { name: "Anass El Moudane", pos: "BT", age: 23, ovr: 76, pot: 82 },
        { name: "Soufiane Hariss", pos: "MOC", age: 31, ovr: 76, pot: 76 }
    ],

    "Difaâ El Jadidi": [ // Club Historique (75 - 79)
        { name: "Mohamed Yousfi", pos: "G", age: 33, ovr: 79, pot: 79 },
        { name: "Marouane Bessak", pos: "G", age: 27, ovr: 75, pot: 78 },
        { name: "Dieumerci Amale", pos: "DD", age: 25, ovr: 79, pot: 82 },
        { name: "Mukoko Amale", pos: "DC", age: 29, ovr: 78, pot: 78 },
        { name: "Chouaib El Maftoul", pos: "DC", age: 29, ovr: 77, pot: 77 },
        { name: "El Mehdi Karnass", pos: "DG", age: 34, ovr: 76, pot: 76 },
        { name: "Othmane Boukhriss", pos: "DC", age: 23, ovr: 74, pot: 80 },
        { name: "Christian Nsundi", pos: "MDC", age: 24, ovr: 77, pot: 82 },
        { name: "Moustapha Chichane", pos: "MDC", age: 32, ovr: 78, pot: 78 },
        { name: "Ayoub Benchaoui", pos: "MC", age: 25, ovr: 76, pot: 79 },
        { name: "Reda Lakhmidi", pos: "MOC", age: 22, ovr: 75, pot: 81 },
        { name: "Abdelfettah Hadraf", pos: "MOG", age: 26, ovr: 79, pot: 81 },
        { name: "Hassan Fares", pos: "MOD", age: 21, ovr: 74, pot: 82 },
        { name: "Othmane El Assas", pos: "MC", age: 20, ovr: 72, pot: 81 },
        { name: "Richard Zumah", pos: "BT", age: 26, ovr: 78, pot: 80 },
        { name: "Omar Arjoune", pos: "BT", age: 28, ovr: 77, pot: 77 },
        { name: "Hamza Hannouri", pos: "BT", age: 26, ovr: 76, pot: 79 },
        { name: "Driss El Jabali", pos: "MOD", age: 24, ovr: 75, pot: 80 }
    ],

    "O. Khouribga": [ // Bas de tableau / Historique (74 - 78)
        { name: "Abderrahmane Kernan", pos: "G", age: 24, ovr: 76, pot: 81 },
        { name: "Amine Echaal", pos: "G", age: 22, ovr: 73, pot: 78 },
        { name: "Youssef Oggadi", pos: "DC", age: 33, ovr: 77, pot: 77 },
        { name: "Zouheir El Hachemi", pos: "DC", age: 28, ovr: 76, pot: 76 },
        { name: "Anwar Tarkhatt", pos: "DD", age: 26, ovr: 78, pot: 81 },
        { name: "Aymane El Aouni", pos: "DG", age: 24, ovr: 75, pot: 79 },
        { name: "Kabelo Seakanyeng", pos: "DC", age: 30, ovr: 79, pot: 79 },
        { name: "Oussama Hafari", pos: "MDC", age: 25, ovr: 77, pot: 81 },
        { name: "Saddil Tariq", pos: "MC", age: 28, ovr: 76, pot: 76 },
        { name: "Ayman Ouhatti", pos: "MC", age: 23, ovr: 75, pot: 80 },
        { name: "Mohamed El Kadi", pos: "MOC", age: 21, ovr: 74, pot: 81 },
        { name: "Ayoub Gaadaoui", pos: "MOG", age: 31, ovr: 77, pot: 77 },
        { name: "Ismail El Harrach", pos: "MOD", age: 25, ovr: 76, pot: 79 },
        { name: "Zakaria Essafi", pos: "MDC", age: 22, ovr: 74, pot: 78 },
        { name: "Tumisang Orebonye", pos: "BT", age: 28, ovr: 79, pot: 79 },
        { name: "Reda Hajji", pos: "BT", age: 26, ovr: 77, pot: 79 },
        { name: "Hamza El Fatouaki", pos: "BT", age: 23, ovr: 75, pot: 80 },
        { name: "Saad El Morsli", pos: "MOC", age: 26, ovr: 75, pot: 78 }
    ],

    "KAC Kénitra": [ // Retour d'un club mythique (74 - 78)
        { name: "Hatem Taouab", pos: "G", age: 26, ovr: 76, pot: 80 },
        { name: "Ayoub El Khalloufi", pos: "G", age: 23, ovr: 73, pot: 78 },
        { name: "Mehdi Baltam", pos: "DC", age: 32, ovr: 77, pot: 77 },
        { name: "Oussama El Gharib", pos: "DC", age: 36, ovr: 75, pot: 75 },
        { name: "Hassan Khadri", pos: "DD", age: 25, ovr: 75, pot: 79 },
        { name: "Youssef Tourabi", pos: "DG", age: 34, ovr: 76, pot: 76 },
        { name: "Ayman Bouali", pos: "DC", age: 21, ovr: 72, pot: 80 },
        { name: "Mustapha Belmokhtar", pos: "MDC", age: 29, ovr: 77, pot: 77 },
        { name: "Mansour Ba", pos: "MC", age: 27, ovr: 76, pot: 78 },
        { name: "Ali M'Madi", pos: "MC", age: 33, ovr: 75, pot: 75 },
        { name: "Amine Ed-Dine", pos: "MOC", age: 22, ovr: 75, pot: 81 },
        { name: "Hicham El Khelfi", pos: "MOG", age: 28, ovr: 76, pot: 76 },
        { name: "Mohamed Tsouli", pos: "MOD", age: 24, ovr: 75, pot: 79 },
        { name: "Zakaria Makran", pos: "MDC", age: 20, ovr: 71, pot: 79 },
        { name: "Tarik Bendaoud", pos: "BT", age: 30, ovr: 78, pot: 78 },
        { name: "Achraf Ghorafi", pos: "BT", age: 23, ovr: 75, pot: 81 },
        { name: "Badr El Kachani", pos: "BT", age: 34, ovr: 76, pot: 76 },
        { name: "Oussama El Aiz", pos: "MOC", age: 25, ovr: 74, pot: 78 }
    ],

    "COD Meknès": [ // Club Historique (74 - 78)
        { name: "Ismail Kouha", pos: "G", age: 31, ovr: 77, pot: 77 },
        { name: "Yahya El Filali", pos: "G", age: 22, ovr: 73, pot: 79 },
        { name: "Khalid Semmoumy", pos: "DC", age: 33, ovr: 76, pot: 76 },
        { name: "Abdelmajid Din", pos: "DC", age: 27, ovr: 76, pot: 79 },
        { name: "Oussama El Aiz", pos: "DD", age: 28, ovr: 75, pot: 75 },
        { name: "Nabil El Oualji", pos: "DG", age: 36, ovr: 75, pot: 75 },
        { name: "Imad El Kimaoui", pos: "DC", age: 24, ovr: 74, pot: 80 },
        { name: "Zakaria Lahlali", pos: "MDC", age: 32, ovr: 77, pot: 77 },
        { name: "Faical Haddadi", pos: "MC", age: 26, ovr: 76, pot: 79 },
        { name: "Ayoub Benyacha", pos: "MC", age: 25, ovr: 75, pot: 80 },
        { name: "Jawad El Ouadni", pos: "MOC", age: 29, ovr: 76, pot: 76 },
        { name: "Mohamed El Hali", pos: "MOG", age: 27, ovr: 76, pot: 78 },
        { name: "Youssef Es-Saydy", pos: "MOD", age: 23, ovr: 75, pot: 81 },
        { name: "Anass El Moudane", pos: "MDC", age: 21, ovr: 73, pot: 80 },
        { name: "Nabil Bakkal", pos: "BT", age: 34, ovr: 77, pot: 77 },
        { name: "Mouhcine Nchima", pos: "BT", age: 25, ovr: 76, pot: 80 },
        { name: "Badr Bahi", pos: "BT", age: 22, ovr: 74, pot: 81 },
        { name: "Tariq Tissoudali", pos: "MOC", age: 24, ovr: 75, pot: 80 }
    ],
    // ==========================================
    // AFRIQUE DU SUD (BETWAY PREM) - PARTIE 1/2
    // ==========================================

    "Mamelodi Sundowns": [ // Top Club Continental (83 - 87)
        { name: "Ronwen Williams", pos: "G", age: 32, ovr: 87, pot: 87 },
        { name: "Denis Onyango", pos: "G", age: 38, ovr: 81, pot: 81 },
        { name: "Grant Kekana", pos: "DC", age: 31, ovr: 85, pot: 85 },
        { name: "Mothobi Mvala", pos: "DC", age: 30, ovr: 84, pot: 84 },
        { name: "Khuliso Mudau", pos: "DD", age: 29, ovr: 86, pot: 86 },
        { name: "Aubrey Modiba", pos: "DG", age: 28, ovr: 84, pot: 84 },
        { name: "Abdelmounaim Boutouil", pos: "DC", age: 26, ovr: 83, pot: 85 },
        { name: "Teboho Mokoena", pos: "MDC", age: 27, ovr: 87, pot: 88 },
        { name: "Rivaldo Coetzee", pos: "MDC", age: 27, ovr: 83, pot: 85 },
        { name: "Marcelo Allende", pos: "MC", age: 25, ovr: 86, pot: 88 },
        { name: "Themba Zwane", pos: "MOC", age: 34, ovr: 85, pot: 85 },
        { name: "Neo Maema", pos: "MOC", age: 28, ovr: 84, pot: 84 },
        { name: "Lucas Ribeiro", pos: "MOD", age: 25, ovr: 86, pot: 88 },
        { name: "Thapelo Maseko", pos: "MOG", age: 21, ovr: 82, pot: 89 },
        { name: "Peter Shalulile", pos: "BT", age: 30, ovr: 86, pot: 86 },
        { name: "Iqraam Rayners", pos: "BT", age: 28, ovr: 84, pot: 84 },
        { name: "Thembinkosi Lorch", pos: "MOD", age: 30, ovr: 84, pot: 84 },
        { name: "Tashreeq Matthews", pos: "MOG", age: 23, ovr: 81, pot: 86 }
    ],

    "Orlando Pirates": [ // Top Club (82 - 85)
        { name: "Sipho Chaine", pos: "G", age: 27, ovr: 83, pot: 85 },
        { name: "Melusi Buthelezi", pos: "G", age: 26, ovr: 80, pot: 83 },
        { name: "Tapelo Xoki", pos: "DC", age: 29, ovr: 84, pot: 84 },
        { name: "Nkosinathi Sibisi", pos: "DC", age: 28, ovr: 83, pot: 84 },
        { name: "Olisa Ndah", pos: "DC", age: 26, ovr: 82, pot: 85 },
        { name: "Thabiso Monyane", pos: "DD", age: 24, ovr: 81, pot: 84 },
        { name: "Deon Hotto", pos: "DG", age: 33, ovr: 83, pot: 83 },
        { name: "Miguel Timm", pos: "MDC", age: 32, ovr: 83, pot: 83 },
        { name: "Makhehlene Makhaula", pos: "MDC", age: 34, ovr: 81, pot: 81 },
        { name: "Ndabayithethwa Ndlondlo", pos: "MC", age: 28, ovr: 82, pot: 82 },
        { name: "Patrick Maswanganyi", pos: "MOC", age: 26, ovr: 85, pot: 86 },
        { name: "Kabelo Dlamini", pos: "MOC", age: 27, ovr: 81, pot: 82 },
        { name: "Monnapule Saleng", pos: "MOD", age: 26, ovr: 85, pot: 86 },
        { name: "Relebohile Mofokeng", pos: "MOG", age: 19, ovr: 81, pot: 90 },
        { name: "Evidence Makgopa", pos: "BT", age: 24, ovr: 82, pot: 86 },
        { name: "Zakhele Lepasa", pos: "BT", age: 27, ovr: 81, pot: 82 },
        { name: "Kermit Erasmus", pos: "BT", age: 33, ovr: 80, pot: 80 },
        { name: "Innocent Maela", pos: "DG", age: 31, ovr: 81, pot: 81 }
    ],

    "Kaizer Chiefs": [ // Historique / Top Club (80 - 84)
        { name: "Bruce Bvuma", pos: "G", age: 29, ovr: 82, pot: 82 },
        { name: "Brandon Petersen", pos: "G", age: 29, ovr: 80, pot: 80 },
        { name: "Spiwe Msimango", pos: "DC", age: 26, ovr: 82, pot: 84 },
        { name: "Thatayaone Ditlhokwe", pos: "DC", age: 25, ovr: 81, pot: 85 },
        { name: "Edmilson Dove", pos: "DC", age: 29, ovr: 80, pot: 80 },
        { name: "Reeve Frosler", pos: "DD", age: 26, ovr: 81, pot: 83 },
        { name: "Sifiso Hlanti", pos: "DG", age: 34, ovr: 79, pot: 79 },
        { name: "Yusuf Maart", pos: "MDC", age: 28, ovr: 83, pot: 83 },
        { name: "Sibongiseni Mthethwa", pos: "MDC", age: 29, ovr: 81, pot: 81 },
        { name: "Edson Castillo", pos: "MC", age: 30, ovr: 82, pot: 82 },
        { name: "Siyethemba Sithebe", pos: "MC", age: 31, ovr: 80, pot: 80 },
        { name: "Mduduzi Shabalala", pos: "MOC", age: 20, ovr: 79, pot: 86 },
        { name: "Pule Mmodi", pos: "MOG", age: 31, ovr: 81, pot: 81 },
        { name: "Ashley Du Preez", pos: "MOD", age: 26, ovr: 82, pot: 83 },
        { name: "Christian Saile", pos: "MOD", age: 24, ovr: 79, pot: 83 },
        { name: "Ranga Chivaviro", pos: "BT", age: 31, ovr: 80, pot: 80 },
        { name: "Wandile Duba", pos: "BT", age: 19, ovr: 76, pot: 85 },
        { name: "Keagan Dolly", pos: "MOC", age: 31, ovr: 81, pot: 81 }
    ],

    "SuperSport Utd": [ // Upper Mid (79 - 83)
        { name: "Ricardo Goss", pos: "G", age: 30, ovr: 82, pot: 82 },
        { name: "Washington Arubi", pos: "G", age: 38, ovr: 78, pot: 78 },
        { name: "Thulani Hlatshwayo", pos: "DC", age: 34, ovr: 81, pot: 81 },
        { name: "Ime Okon", pos: "DC", age: 20, ovr: 78, pot: 86 },
        { name: "Nyiko Mobbie", pos: "DD", age: 29, ovr: 81, pot: 81 },
        { name: "Onismor Bhasera", pos: "DG", age: 38, ovr: 77, pot: 77 },
        { name: "Siyanda Xulu", pos: "DC", age: 32, ovr: 80, pot: 80 },
        { name: "Grant Margeman", pos: "MDC", age: 26, ovr: 83, pot: 84 },
        { name: "Siphesihle Ndlovu", pos: "MC", age: 27, ovr: 80, pot: 81 },
        { name: "Phathutshedzo Nange", pos: "MDC", age: 32, ovr: 79, pot: 79 },
        { name: "Gape Moralo", pos: "MC", age: 24, ovr: 78, pot: 82 },
        { name: "Lyle Lakay", pos: "MOG", age: 32, ovr: 80, pot: 80 },
        { name: "Shandre Campbell", pos: "MOG", age: 18, ovr: 77, pot: 87 },
        { name: "Gamphani Lungu", pos: "MOD", age: 25, ovr: 81, pot: 83 },
        { name: "Bradley Grobler", pos: "BT", age: 36, ovr: 82, pot: 82 },
        { name: "Terrence Dzvukamanja", pos: "BT", age: 30, ovr: 80, pot: 80 },
        { name: "Etiosa Ighodaro", pos: "BT", age: 22, ovr: 79, pot: 84 },
        { name: "Vincent Pule", pos: "MOC", age: 32, ovr: 80, pot: 80 }
    ],

    "Cape Town City": [ // Upper Mid (79 - 83)
        { name: "Darren Keet", pos: "G", age: 34, ovr: 81, pot: 81 },
        { name: "Bongani Mpandle", pos: "G", age: 31, ovr: 77, pot: 77 },
        { name: "Keanu Cupido", pos: "DC", age: 26, ovr: 81, pot: 83 },
        { name: "Lorenzo Gordinho", pos: "DC", age: 30, ovr: 80, pot: 80 },
        { name: "Thamsanqa Mkhize", pos: "DD", age: 35, ovr: 80, pot: 80 },
        { name: "Marc van Heerden", pos: "DG", age: 36, ovr: 78, pot: 78 },
        { name: "Taariq Fielies", pos: "DC", age: 31, ovr: 80, pot: 80 },
        { name: "Thato Mokeke", pos: "MDC", age: 33, ovr: 80, pot: 80 },
        { name: "Fidel Brice Ambina", pos: "MDC", age: 22, ovr: 79, pot: 85 },
        { name: "Thabo Nodada", pos: "MC", age: 29, ovr: 82, pot: 82 },
        { name: "Jaedin Rhodes", pos: "MOC", age: 21, ovr: 79, pot: 85 },
        { name: "Darwin Gonzalez", pos: "BT", age: 29, ovr: 81, pot: 81 },
        { name: "Khanyisa Mayo", pos: "BT", age: 25, ovr: 83, pot: 85 },
        { name: "Thabiso Kutumela", pos: "MOD", age: 30, ovr: 80, pot: 80 },
        { name: "Jo Paciencia", pos: "BT", age: 27, ovr: 79, pot: 80 },
        { name: "Heaven Slatsha", pos: "MC", age: 21, ovr: 76, pot: 82 },
        { name: "Relebogile Mokhuoane", pos: "MC", age: 29, ovr: 78, pot: 78 },
        { name: "Tshegofatso Nyama", pos: "MOG", age: 24, ovr: 79, pot: 83 }
    ],

    "Stellenbosch FC": [ // Upper Mid (79 - 83) - Formateurs
        { name: "Sage Stephens", pos: "G", age: 33, ovr: 81, pot: 81 },
        { name: "Oscarine Masuluke", pos: "G", age: 31, ovr: 78, pot: 78 },
        { name: "Ismael Toure", pos: "DC", age: 26, ovr: 82, pot: 84 },
        { name: "Thabo Moloisane", pos: "DC", age: 25, ovr: 80, pot: 82 },
        { name: "Fawaaz Basadien", pos: "DG", age: 27, ovr: 81, pot: 82 },
        { name: "Deano van Rooyen", pos: "DD", age: 27, ovr: 81, pot: 82 },
        { name: "Athenkosi Mcaba", pos: "DC", age: 22, ovr: 78, pot: 84 },
        { name: "Sihle Nduli", pos: "MDC", age: 28, ovr: 80, pot: 80 },
        { name: "Jayden Adams", pos: "MC", age: 23, ovr: 82, pot: 86 },
        { name: "Nhlanhla Mgaga", pos: "MC", age: 28, ovr: 79, pot: 79 },
        { name: "Andre de Jong", pos: "MOC", age: 27, ovr: 80, pot: 80 },
        { name: "Antonio van Wyk", pos: "MOG", age: 22, ovr: 79, pot: 84 },
        { name: "Devin Titus", pos: "MOD", age: 23, ovr: 81, pot: 85 },
        { name: "Anicet Oura", pos: "MOG", age: 24, ovr: 80, pot: 84 },
        { name: "Mervin Boji", pos: "BT", age: 20, ovr: 76, pot: 84 },
        { name: "Genino Palace", pos: "MC", age: 25, ovr: 78, pot: 81 },
        { name: "Qobolwakhe Sibande", pos: "DG", age: 24, ovr: 77, pot: 80 },
        { name: "Fritz Jabaar", pos: "BT", age: 22, ovr: 75, pot: 80 }
    ],

    "Sekhukhune Utd": [ // Milieu de tableau solide (78 - 82)
        { name: "Badra Ali Sangaré", pos: "G", age: 38, ovr: 82, pot: 82 },
        { name: "Renaldo Leaner", pos: "G", age: 26, ovr: 78, pot: 81 },
        { name: "Daniel Cardoso", pos: "DC", age: 35, ovr: 80, pot: 80 },
        { name: "Edwin Gyimah", pos: "DC", age: 33, ovr: 79, pot: 79 },
        { name: "Siphosakhe Ntiya-Ntiya", pos: "DG", age: 27, ovr: 78, pot: 78 },
        { name: "Asekho Tiwani", pos: "DG", age: 19, ovr: 76, pot: 84 },
        { name: "Tresor Tshibwabwa", pos: "DC", age: 25, ovr: 79, pot: 82 },
        { name: "Kamohelo Mokotjo", pos: "MDC", age: 33, ovr: 81, pot: 81 },
        { name: "Siphesihle Mkhize", pos: "MC", age: 25, ovr: 78, pot: 81 },
        { name: "Jamie Webber", pos: "MC", age: 26, ovr: 80, pot: 81 },
        { name: "Larry Bwalya", pos: "MOC", age: 29, ovr: 80, pot: 80 },
        { name: "Keletso Makgalwa", pos: "MOD", age: 27, ovr: 79, pot: 79 },
        { name: "Elias Mokwana", pos: "MOG", age: 24, ovr: 81, pot: 85 },
        { name: "Vusimuzi Mncube", pos: "MOD", age: 30, ovr: 79, pot: 79 },
        { name: "Victor Letsoalo", pos: "BT", age: 31, ovr: 81, pot: 81 },
        { name: "Chibuike Ohizu", pos: "BT", age: 27, ovr: 80, pot: 81 },
        { name: "Tiklas Thutlwa", pos: "MC", age: 25, ovr: 77, pot: 80 },
        { name: "Sibusiso Vilakazi", pos: "MOC", age: 34, ovr: 78, pot: 78 }
    ],

    "AmaZulu": [ // Milieu de tableau (78 - 82)
        { name: "Veli Mothwa", pos: "G", age: 33, ovr: 82, pot: 82 },
        { name: "Olufemi Amonome", pos: "G", age: 25, ovr: 77, pot: 80 },
        { name: "Ramahlwe Mphahlele", pos: "DC", age: 34, ovr: 79, pot: 79 },
        { name: "Mbongeni Gumede", pos: "DC", age: 30, ovr: 78, pot: 78 },
        { name: "Riaan Hanamub", pos: "DG", age: 29, ovr: 81, pot: 81 },
        { name: "Thembela Sikhakhane", pos: "DD", age: 31, ovr: 79, pot: 79 },
        { name: "Taariq Fielies", pos: "DC", age: 31, ovr: 79, pot: 79 },
        { name: "George Maluleka", pos: "MDC", age: 35, ovr: 79, pot: 79 },
        { name: "Ethan Brooks", pos: "MC", age: 23, ovr: 80, pot: 85 },
        { name: "Siphesihle Maduna", pos: "MC", age: 24, ovr: 78, pot: 81 },
        { name: "Hendrick Ekstein", pos: "MOC", age: 33, ovr: 80, pot: 80 },
        { name: "Celimpilo Ngema", pos: "MOC", age: 26, ovr: 81, pot: 82 },
        { name: "Augustine Mulenga", pos: "MOD", age: 34, ovr: 79, pot: 79 },
        { name: "Sede Dion", pos: "BT", age: 25, ovr: 80, pot: 83 },
        { name: "Victorien Adebayor", pos: "BT", age: 27, ovr: 79, pot: 80 },
        { name: "Bonginkosi Ntuli", pos: "BT", age: 33, ovr: 78, pot: 78 },
        { name: "Mswati Mashigo", pos: "MC", age: 25, ovr: 77, pot: 80 },
        { name: "Mlondi Mbanjwa", pos: "MOG", age: 26, ovr: 78, pot: 80 }
    ],

    "Golden Arrows": [ // Milieu de tableau (77 - 81)
        { name: "Ismail Watenga", pos: "G", age: 29, ovr: 80, pot: 80 },
        { name: "Sifiso Mlungwana", pos: "G", age: 27, ovr: 78, pot: 80 },
        { name: "Gladwin Shitolo", pos: "DC", age: 34, ovr: 79, pot: 79 },
        { name: "Thabani Zuke", pos: "DC", age: 25, ovr: 78, pot: 81 },
        { name: "Nduduzo Sibiya", pos: "DG", age: 28, ovr: 81, pot: 81 },
        { name: "Sbonelo Cele", pos: "DD", age: 23, ovr: 77, pot: 82 },
        { name: "Bradley Cross", pos: "DC", age: 23, ovr: 78, pot: 83 },
        { name: "Ntsako Makhubela", pos: "MDC", age: 30, ovr: 79, pot: 79 },
        { name: "Velemseni Ndwandwe", pos: "MC", age: 28, ovr: 80, pot: 80 },
        { name: "Nhlanhla Zwane", pos: "MC", age: 25, ovr: 78, pot: 81 },
        { name: "Lungelo Dube", pos: "MOC", age: 24, ovr: 77, pot: 81 },
        { name: "Siyanda Mthanti", pos: "MOD", age: 23, ovr: 78, pot: 82 },
        { name: "Olwethu Ncube", pos: "MOG", age: 26, ovr: 79, pot: 80 },
        { name: "Knox Mutizwa", pos: "BT", age: 30, ovr: 81, pot: 81 },
        { name: "Ryan Moon", pos: "BT", age: 27, ovr: 78, pot: 78 },
        { name: "Siyabonga Khumalo", pos: "MOD", age: 25, ovr: 77, pot: 80 },
        { name: "Angelo Van Rooi", pos: "MOG", age: 23, ovr: 76, pot: 81 },
        { name: "Moyela Manganyi", pos: "BT", age: 22, ovr: 75, pot: 80 }
    ],

    "TS Galaxy": [ // Milieu de tableau (77 - 81)
        { name: "Vasilije Kolak", pos: "G", age: 29, ovr: 80, pot: 80 },
        { name: "Fiacre Ntwari", pos: "G", age: 24, ovr: 78, pot: 83 },
        { name: "Pogiso Sanoka", pos: "DC", age: 31, ovr: 80, pot: 80 },
        { name: "MacBeth Mahlangu", pos: "DC", age: 22, ovr: 79, pot: 84 },
        { name: "Marks Munyai", pos: "DD", age: 32, ovr: 78, pot: 78 },
        { name: "Kganyane Letsoenyo", pos: "DG", age: 24, ovr: 77, pot: 81 },
        { name: "Lebone Seema", pos: "DC", age: 26, ovr: 77, pot: 79 },
        { name: "Mlungisi Mbunjana", pos: "MDC", age: 33, ovr: 79, pot: 79 },
        { name: "Mpho Mvelase", pos: "MDC", age: 34, ovr: 78, pot: 78 },
        { name: "Kamogelo Sebelebele", pos: "MC", age: 24, ovr: 78, pot: 82 },
        { name: "Thato Khiba", pos: "MC", age: 27, ovr: 79, pot: 79 },
        { name: "Sphiwe Mahlangu", pos: "MOD", age: 28, ovr: 80, pot: 80 },
        { name: "Puso Dithejane", pos: "MOG", age: 20, ovr: 76, pot: 85 },
        { name: "Lehlogonolo Mojela", pos: "BT", age: 27, ovr: 81, pot: 81 },
        { name: "Samir Nurkovic", pos: "BT", age: 31, ovr: 80, pot: 80 },
        { name: "Higor Vidal", pos: "BT", age: 27, ovr: 79, pot: 79 },
        { name: "Orengo Rakwena", pos: "MC", age: 22, ovr: 75, pot: 80 },
        { name: "Thabang Semache", pos: "MOC", age: 25, ovr: 77, pot: 80 }
    ],
    // ==========================================
    // AFRIQUE DU SUD (BETWAY PREM) - PARTIE 2/2
    // ==========================================

    "Royal AM": [ // Milieu de tableau (76 - 80)
        { name: "Hugo Nyame", pos: "G", age: 34, ovr: 79, pot: 79 },
        { name: "Mondli Mpoto", pos: "G", age: 25, ovr: 76, pot: 80 },
        { name: "Thabo Matlaba", pos: "DG", age: 36, ovr: 78, pot: 78 },
        { name: "Lesego Manganyi", pos: "DC", age: 31, ovr: 77, pot: 77 },
        { name: "Sikhethele Mabuza", pos: "DD", age: 28, ovr: 76, pot: 76 },
        { name: "Shadrack Kobedi", pos: "DC", age: 29, ovr: 77, pot: 77 },
        { name: "Sello Matjila", pos: "DC", age: 23, ovr: 75, pot: 81 },
        { name: "Kabelo Mahlasela", pos: "MOC", age: 33, ovr: 79, pot: 79 },
        { name: "Siphesihle Msomi", pos: "MDC", age: 26, ovr: 77, pot: 80 },
        { name: "Jeffrey Dlamini", pos: "MC", age: 24, ovr: 76, pot: 82 },
        { name: "Sbusiso Magaqa", pos: "MC", age: 25, ovr: 78, pot: 81 },
        { name: "Mfundo Thikazi", pos: "MOD", age: 24, ovr: 79, pot: 84 },
        { name: "Levy Mashiane", pos: "MOG", age: 27, ovr: 78, pot: 78 },
        { name: "Hopewell Cele", pos: "MDC", age: 21, ovr: 74, pot: 80 },
        { name: "Mxolisi Macuphu", pos: "BT", age: 34, ovr: 78, pot: 78 },
        { name: "Ruzaigh Gamildien", pos: "BT", age: 34, ovr: 77, pot: 77 },
        { name: "Motebang Sera", pos: "BT", age: 28, ovr: 79, pot: 79 },
        { name: "Sabelo Sithole", pos: "MOC", age: 22, ovr: 75, pot: 82 }
    ],

    "Richards Bay": [ // Lutte pour le maintien (75 - 79)
        { name: "Salim Magoola", pos: "G", age: 28, ovr: 81, pot: 81 },
        { name: "Jackson Mabokgwane", pos: "G", age: 36, ovr: 77, pot: 77 },
        { name: "Simphiwe Mcineka", pos: "DC", age: 26, ovr: 78, pot: 80 },
        { name: "Ndiviwe Mdabuka", pos: "DC", age: 33, ovr: 77, pot: 77 },
        { name: "Romario Dlamini", pos: "DD", age: 29, ovr: 76, pot: 76 },
        { name: "Tshepo Mabua", pos: "DG", age: 29, ovr: 77, pot: 77 },
        { name: "Thabani Dube", pos: "DC", age: 31, ovr: 78, pot: 78 },
        { name: "Abel Mabaso", pos: "MDC", age: 32, ovr: 79, pot: 79 },
        { name: "Sanele Barns", pos: "MOD", age: 27, ovr: 80, pot: 80 },
        { name: "Boikanyo Komane", pos: "MDC", age: 31, ovr: 78, pot: 78 },
        { name: "Lwandile Mabuya", pos: "MC", age: 24, ovr: 76, pot: 81 },
        { name: "Moses Mthembu", pos: "MC", age: 23, ovr: 75, pot: 80 },
        { name: "Langelihle Mhlongo", pos: "MOC", age: 21, ovr: 74, pot: 82 },
        { name: "Thulani Gumede", pos: "MOG", age: 25, ovr: 77, pot: 79 },
        { name: "Somila Ntsundwana", pos: "BT", age: 27, ovr: 78, pot: 78 },
        { name: "Justice Figuareido", pos: "BT", age: 25, ovr: 77, pot: 80 },
        { name: "Yanela Mbuthuma", pos: "BT", age: 22, ovr: 75, pot: 81 },
        { name: "Katlego Makateng", pos: "BT", age: 26, ovr: 76, pot: 78 }
    ],

    "Polokwane City": [ // Milieu / Bas de tableau (75 - 79)
        { name: "Manuel Sapunga", pos: "G", age: 32, ovr: 79, pot: 79 },
        { name: "Lindokuhle Mathebula", pos: "G", age: 26, ovr: 75, pot: 78 },
        { name: "Bulelani Ndlovu", pos: "DC", age: 28, ovr: 77, pot: 77 },
        { name: "Lebohang Nkaki", pos: "DC", age: 25, ovr: 76, pot: 80 },
        { name: "Thabang Matuludi", pos: "DD", age: 25, ovr: 78, pot: 81 },
        { name: "Ndumiso Mabena", pos: "DG", age: 23, ovr: 75, pot: 80 },
        { name: "Francious Baloyi", pos: "DC", age: 22, ovr: 74, pot: 79 },
        { name: "Oswin Appollis", pos: "MOC", age: 22, ovr: 81, pot: 85 },
        { name: "Given Mashikinya", pos: "MDC", age: 32, ovr: 78, pot: 78 },
        { name: "Njabulo Buthelezi", pos: "MDC", age: 26, ovr: 77, pot: 79 },
        { name: "Simon Ramabu", pos: "MC", age: 28, ovr: 76, pot: 76 },
        { name: "Ndamulelo Maphangule", pos: "MC", age: 32, ovr: 77, pot: 77 },
        { name: "Stevens Goovadia", pos: "MOG", age: 21, ovr: 74, pot: 81 },
        { name: "Tholo Thuto", pos: "MOD", age: 24, ovr: 75, pot: 78 },
        { name: "Hlayisi Chauke", pos: "BT", age: 26, ovr: 78, pot: 78 },
        { name: "Douglas Mapfumo", pos: "BT", age: 25, ovr: 77, pot: 80 },
        { name: "Mokibelo Ramabu", pos: "BT", age: 22, ovr: 75, pot: 81 },
        { name: "Samuel Nana", pos: "MOD", age: 23, ovr: 76, pot: 80 }
    ],

    "Chippa United": [ // Bas de tableau (76 - 80)
        { name: "Stanley Nwabali", pos: "G", age: 27, ovr: 82, pot: 84 },
        { name: "Darren Johnson", pos: "G", age: 27, ovr: 76, pot: 78 },
        { name: "Justice Chabalala", pos: "DC", age: 32, ovr: 78, pot: 78 },
        { name: "Roscoe Pietersen", pos: "DC", age: 35, ovr: 77, pot: 77 },
        { name: "Sirgio Kammies", pos: "DD", age: 26, ovr: 77, pot: 79 },
        { name: "Malebogo Modise", pos: "DG", age: 25, ovr: 78, pot: 81 },
        { name: "Ronaldo Maarman", pos: "DC", age: 24, ovr: 76, pot: 80 },
        { name: "Goodman Mosele", pos: "MDC", age: 24, ovr: 81, pot: 84 },
        { name: "Siphesihle Mkhize", pos: "MC", age: 25, ovr: 78, pot: 81 },
        { name: "Craig Martin", pos: "MOD", age: 30, ovr: 79, pot: 79 },
        { name: "Menzi Ndwandwe", pos: "MC", age: 26, ovr: 77, pot: 78 },
        { name: "Thabang Malope", pos: "MOC", age: 23, ovr: 75, pot: 80 },
        { name: "Ayabulela Konqobe", pos: "MDC", age: 28, ovr: 77, pot: 77 },
        { name: "Sinoxolo Kwayiba", pos: "MOG", age: 24, ovr: 76, pot: 81 },
        { name: "Bienvenu Eva Nga", pos: "BT", age: 31, ovr: 79, pot: 79 },
        { name: "Elmo Kambindu", pos: "BT", age: 30, ovr: 78, pot: 78 },
        { name: "Aviwe Mqokozo", pos: "BT", age: 21, ovr: 74, pot: 82 },
        { name: "Diego Appollis", pos: "MOC", age: 23, ovr: 75, pot: 79 }
    ],

    "Moroka Swallows": [ // Club Historique (76 - 80)
        { name: "Daniel Akpeyi", pos: "G", age: 37, ovr: 80, pot: 80 },
        { name: "Thakasani Mbanjwa", pos: "G", age: 27, ovr: 76, pot: 77 },
        { name: "Kwanda Mngonyama", pos: "DC", age: 30, ovr: 79, pot: 79 },
        { name: "Junaid Sait", pos: "DC", age: 31, ovr: 78, pot: 78 },
        { name: "Sipho Sibiya", pos: "DG", age: 31, ovr: 77, pot: 77 },
        { name: "Mashweu Mphahlele", pos: "DD", age: 26, ovr: 76, pot: 79 },
        { name: "Vusi Sibiya", pos: "DC", age: 29, ovr: 78, pot: 78 },
        { name: "Andile Jali", pos: "MDC", age: 33, ovr: 81, pot: 81 },
        { name: "Tlakusani Mthethwa", pos: "MDC", age: 31, ovr: 79, pot: 79 },
        { name: "Lindokuhle Mtshali", pos: "MC", age: 26, ovr: 78, pot: 80 },
        { name: "Roland Sanou", pos: "MC", age: 24, ovr: 77, pot: 81 },
        { name: "Gabadinho Mhango", pos: "BT", age: 31, ovr: 81, pot: 81 },
        { name: "Tshediso Patjie", pos: "MOD", age: 33, ovr: 78, pot: 78 },
        { name: "Mthokozisi Shwabule", pos: "MOG", age: 27, ovr: 77, pot: 77 },
        { name: "Keenan Phillips", pos: "DD", age: 24, ovr: 76, pot: 80 },
        { name: "Kagiso Malinga", pos: "BT", age: 29, ovr: 78, pot: 78 },
        { name: "Tshepo Makhanya", pos: "BT", age: 22, ovr: 74, pot: 80 },
        { name: "Siyabonga Khumalo", pos: "MOC", age: 21, ovr: 75, pot: 82 }
    ],

    "Cape Town Spurs": [ // Promu / En difficulté (74 - 78)
        { name: "Zama Dlamini", pos: "G", age: 32, ovr: 76, pot: 76 },
        { name: "Neil Boshoff", pos: "G", age: 28, ovr: 74, pot: 74 },
        { name: "Clayton Daniels", pos: "DC", age: 39, ovr: 77, pot: 77 },
        { name: "Rushwin Dortley", pos: "DC", age: 21, ovr: 75, pot: 83 },
        { name: "Gadiel Kamagi", pos: "DG", age: 26, ovr: 76, pot: 78 },
        { name: "Nazeer Allie", pos: "DD", age: 38, ovr: 76, pot: 76 },
        { name: "Liam Bern", pos: "DC", age: 21, ovr: 73, pot: 80 },
        { name: "Chumani Butsaka", pos: "MC", age: 22, ovr: 77, pot: 82 },
        { name: "Jarrod Moroole", pos: "MDC", age: 32, ovr: 77, pot: 77 },
        { name: "Michael Morton", pos: "MDC", age: 35, ovr: 76, pot: 76 },
        { name: "Morne Nel", pos: "MC", age: 27, ovr: 75, pot: 75 },
        { name: "Asenele Velebayi", pos: "MOD", age: 21, ovr: 76, pot: 83 },
        { name: "Colin Ryan", pos: "MOG", age: 34, ovr: 76, pot: 76 },
        { name: "Gabriel Amato", pos: "MOC", age: 23, ovr: 74, pot: 79 },
        { name: "Ashley Cupido", pos: "BT", age: 22, ovr: 79, pot: 84 },
        { name: "Therlo Moosa", pos: "BT", age: 28, ovr: 76, pot: 76 },
        { name: "Luke Baartman", pos: "BT", age: 17, ovr: 72, pot: 85 },
        { name: "Surprise Ralani", pos: "MOG", age: 36, ovr: 78, pot: 78 }
    ],

    "Baroka FC": [ // Lutte Maintien (74 - 78)
        { name: "Elvis Chipezeze", pos: "G", age: 34, ovr: 78, pot: 78 },
        { name: "Wellington Manqele", pos: "G", age: 23, ovr: 73, pot: 79 },
        { name: "Bonginkosi Makume", pos: "DC", age: 28, ovr: 77, pot: 77 },
        { name: "Denwin Farmer", pos: "DC", age: 27, ovr: 76, pot: 76 },
        { name: "Sibusiso Mabiliso", pos: "DG", age: 24, ovr: 77, pot: 81 },
        { name: "Mashweu Mphahlele", pos: "DD", age: 26, ovr: 76, pot: 78 },
        { name: "Elliot Seema", pos: "DC", age: 30, ovr: 76, pot: 76 },
        { name: "Sipho Maluleke", pos: "MDC", age: 25, ovr: 75, pot: 79 },
        { name: "Nhlanhla Mgaga", pos: "MC", age: 28, ovr: 78, pot: 78 },
        { name: "Kgodiso Monama", pos: "MOC", age: 26, ovr: 76, pot: 77 },
        { name: "Manuel Kambala", pos: "MDC", age: 32, ovr: 77, pot: 77 },
        { name: "Tebogo Mokoena", pos: "MC", age: 24, ovr: 75, pot: 80 },
        { name: "Richard Mbulu", pos: "BT", age: 30, ovr: 78, pot: 78 },
        { name: "Evidence Makgopa", pos: "BT", age: 24, ovr: 79, pot: 83 }, // Historique du club
        { name: "Dan Ndlovu", pos: "MOD", age: 26, ovr: 76, pot: 77 },
        { name: "Siyabonga Mzizi", pos: "MOG", age: 22, ovr: 74, pot: 80 },
        { name: "Thamsanqa Masiya", pos: "MOD", age: 27, ovr: 77, pot: 77 },
        { name: "Sekela Sithole", pos: "BT", age: 21, ovr: 73, pot: 81 }
    ],

    "Maritzburg Utd": [ // Historique en reconstruction (74 - 78)
        { name: "King Ndlovu", pos: "G", age: 31, ovr: 77, pot: 77 },
        { name: "Renaldo Leaner", pos: "G", age: 26, ovr: 75, pot: 78 },
        { name: "Alfred Ndengane", pos: "DC", age: 37, ovr: 78, pot: 78 },
        { name: "Brian Cross", pos: "DC", age: 23, ovr: 76, pot: 82 },
        { name: "Bonginkosi Makume", pos: "DC", age: 28, ovr: 77, pot: 77 },
        { name: "Keegan Allan", pos: "DD", age: 23, ovr: 77, pot: 83 },
        { name: "Sibusiso Hlubi", pos: "DG", age: 28, ovr: 76, pot: 76 },
        { name: "Daylon Claasen", pos: "MOC", age: 34, ovr: 78, pot: 78 },
        { name: "Lucky Baloyi", pos: "MDC", age: 32, ovr: 77, pot: 77 },
        { name: "Travis Graham", pos: "MDC", age: 30, ovr: 76, pot: 76 },
        { name: "Karim Kimvuidi", pos: "MOC", age: 22, ovr: 79, pot: 85 },
        { name: "Ryan Baartman", pos: "MC", age: 25, ovr: 75, pot: 79 },
        { name: "Amadou Soukouna", pos: "BT", age: 31, ovr: 79, pot: 79 },
        { name: "Rowan Human", pos: "MOD", age: 23, ovr: 78, pot: 83 },
        { name: "Friday Samu", pos: "BT", age: 29, ovr: 77, pot: 77 },
        { name: "Tshepo Nzimande", pos: "MOG", age: 21, ovr: 74, pot: 81 },
        { name: "Zukile Kewuti", pos: "MC", age: 28, ovr: 76, pot: 76 },
        { name: "Brandon Theron", pos: "MOD", age: 30, ovr: 77, pot: 77 }
    ],

    "Black Leopards": [ // Club de division inférieure / Maintien (73 - 77)
        { name: "Jonas Mendes", pos: "G", age: 34, ovr: 76, pot: 76 },
        { name: "Rotshidzwa Muleka", pos: "G", age: 28, ovr: 74, pot: 74 },
        { name: "Edwin Gyimah", pos: "DC", age: 33, ovr: 77, pot: 77 },
        { name: "Isaac Masia", pos: "DC", age: 29, ovr: 75, pot: 75 },
        { name: "Khomotso Masia", pos: "DC", age: 26, ovr: 74, pot: 77 },
        { name: "Pule Ndlovu", pos: "DD", age: 25, ovr: 74, pot: 78 },
        { name: "Tebogo Makobela", pos: "DG", age: 31, ovr: 75, pot: 75 },
        { name: "Abubakar Mumuni", pos: "MDC", age: 28, ovr: 76, pot: 76 },
        { name: "Siphesihle Mkhize", pos: "MDC", age: 25, ovr: 75, pot: 79 },
        { name: "Donald Makgetlwa", pos: "MC", age: 27, ovr: 74, pot: 75 },
        { name: "Lefa Hlongwane", pos: "MOC", age: 30, ovr: 76, pot: 76 },
        { name: "Tiklas Thutlwa", pos: "MOD", age: 25, ovr: 75, pot: 79 },
        { name: "Sanele Mathenjwa", pos: "MOG", age: 23, ovr: 74, pot: 80 },
        { name: "Roderick Kabwe", pos: "MC", age: 31, ovr: 77, pot: 77 },
        { name: "Mwape Musonda", pos: "BT", age: 33, ovr: 78, pot: 78 },
        { name: "Bethuel Muzeu", pos: "BT", age: 24, ovr: 76, pot: 81 },
        { name: "Thembisani Nevhulamba", pos: "BT", age: 30, ovr: 75, pot: 75 },
        { name: "Thobani Mncwango", pos: "BT", age: 36, ovr: 74, pot: 74 }
    ],

    "Jomo Cosmos": [ // Légendaire, aujourd'hui modeste (73 - 77)
        { name: "Kagiso Mlambo", pos: "G", age: 28, ovr: 75, pot: 76 },
        { name: "Dino Visser", pos: "G", age: 34, ovr: 74, pot: 74 },
        { name: "Njabulo Mngomezulu", pos: "DC", age: 26, ovr: 76, pot: 79 },
        { name: "Thabo Mofokeng", pos: "DC", age: 29, ovr: 75, pot: 75 },
        { name: "Lethabo Mofokeng", pos: "DG", age: 22, ovr: 74, pot: 80 },
        { name: "Sibusiso Kumalo", pos: "DD", age: 33, ovr: 75, pot: 75 },
        { name: "Shane Roberts", pos: "MDC", age: 25, ovr: 76, pot: 80 },
        { name: "Matsilele Sono Jr", pos: "MOC", age: 32, ovr: 75, pot: 75 }, // Clin d'oeil au propriétaire
        { name: "Banele Ndlovu", pos: "MC", age: 24, ovr: 74, pot: 79 },
        { name: "Tshepo Mashigo", pos: "MOG", age: 27, ovr: 75, pot: 76 },
        { name: "Thato Mokoena", pos: "MOD", age: 21, ovr: 73, pot: 81 },
        { name: "Mxolisi Macuphu", pos: "BT", age: 34, ovr: 77, pot: 77 },
        { name: "Sabelo Ndzinisa", pos: "BT", age: 32, ovr: 76, pot: 76 },
        { name: "Kgotso Mofokeng", pos: "MC", age: 23, ovr: 74, pot: 78 },
        { name: "Jabulani Shongwe", pos: "MOC", age: 34, ovr: 75, pot: 75 },
        { name: "Clifford Mulenga", pos: "MOD", age: 36, ovr: 74, pot: 74 },
        { name: "Vusi Mncube", pos: "BT", age: 26, ovr: 75, pot: 77 },
        { name: "Siyabonga Nhlapo", pos: "DC", age: 35, ovr: 76, pot: 76 }
    ],
    // ==========================================
    // EGYPT (PREMIER LEAGUE) - PARTIE 1/2
    // ==========================================

    "Al Ahly": [ // Top Club Continental (84 - 88)
        { name: "Mohamed El Shenawy", pos: "G", age: 35, ovr: 87, pot: 87 },
        { name: "Mostafa Shobeir", pos: "G", age: 24, ovr: 82, pot: 86 },
        { name: "Mohamed Abdelmonem", pos: "DC", age: 25, ovr: 86, pot: 89 },
        { name: "Yasser Ibrahim", pos: "DC", age: 31, ovr: 84, pot: 84 },
        { name: "Ali Maaloul", pos: "DG", age: 34, ovr: 85, pot: 85 },
        { name: "Mohamed Hany", pos: "DD", age: 28, ovr: 84, pot: 85 },
        { name: "Rami Rabia", pos: "DC", age: 31, ovr: 83, pot: 83 },
        { name: "Marwan Attia", pos: "MDC", age: 25, ovr: 85, pot: 88 },
        { name: "Imam Ashour", pos: "MC", age: 26, ovr: 86, pot: 89 },
        { name: "Akram Tawfik", pos: "MDC", age: 26, ovr: 84, pot: 86 },
        { name: "Mohamed Magdy Afsha", pos: "MOC", age: 28, ovr: 84, pot: 84 },
        { name: "Amr El Solia", pos: "MC", age: 34, ovr: 83, pot: 83 },
        { name: "Percy Tau", pos: "MOD", age: 30, ovr: 85, pot: 85 },
        { name: "Hussein El Shahat", pos: "MOG", age: 32, ovr: 84, pot: 84 },
        { name: "Wessam Abou Ali", pos: "BT", age: 25, ovr: 85, pot: 87 },
        { name: "Mahmoud Kahraba", pos: "BT", age: 30, ovr: 84, pot: 84 },
        { name: "Reda Slim", pos: "MOG", age: 24, ovr: 83, pot: 86 },
        { name: "Ahmed Nabil Koka", pos: "MC", age: 22, ovr: 81, pot: 86 }
    ],

    "Zamalek": [ // Top Club (83 - 86)
        { name: "Mohamed Awad", pos: "G", age: 31, ovr: 84, pot: 84 },
        { name: "Mohamed Sobhy", pos: "G", age: 24, ovr: 81, pot: 85 },
        { name: "Mahmoud Hamdy Wensh", pos: "DC", age: 28, ovr: 85, pot: 85 },
        { name: "Hossam Abdelmaguid", pos: "DC", age: 23, ovr: 82, pot: 86 },
        { name: "Hamza Mathlouthi", pos: "DC", age: 31, ovr: 84, pot: 84 },
        { name: "Ahmed Fatouh", pos: "DG", age: 26, ovr: 85, pot: 86 },
        { name: "Omar Gaber", pos: "DD", age: 32, ovr: 83, pot: 83 },
        { name: "Nabil Emad Dunga", pos: "MDC", age: 28, ovr: 84, pot: 84 },
        { name: "Abdallah El Said", pos: "MOC", age: 38, ovr: 83, pot: 83 },
        { name: "Mohamed Shehata", pos: "MC", age: 23, ovr: 81, pot: 85 },
        { name: "Youssef Obama", pos: "MOC", age: 28, ovr: 82, pot: 82 },
        { name: "Ahmed Sayed Zizo", pos: "MOD", age: 28, ovr: 87, pot: 87 },
        { name: "Shikabala", pos: "MOC", age: 38, ovr: 82, pot: 82 },
        { name: "Mostafa Shalaby", pos: "MOG", age: 29, ovr: 83, pot: 83 },
        { name: "Seifeddine Jaziri", pos: "BT", age: 31, ovr: 84, pot: 84 },
        { name: "Nasser Mansi", pos: "BT", age: 26, ovr: 81, pot: 82 },
        { name: "Samson Akinyoola", pos: "BT", age: 24, ovr: 80, pot: 82 },
        { name: "Sayed Abdallah", pos: "MOD", age: 24, ovr: 80, pot: 83 }
    ],

    "Pyramids FC": [ // Top Club (83 - 86)
        { name: "Ahmed El Shenawy", pos: "G", age: 33, ovr: 84, pot: 84 },
        { name: "Sherif Ekramy", pos: "G", age: 40, ovr: 79, pot: 79 },
        { name: "Ali Gabr", pos: "DC", age: 35, ovr: 83, pot: 83 },
        { name: "Ahmed Samy", pos: "DC", age: 32, ovr: 83, pot: 83 },
        { name: "Mohamed Chibi", pos: "DD", age: 31, ovr: 84, pot: 84 },
        { name: "Mohamed Hamdi", pos: "DG", age: 29, ovr: 83, pot: 83 },
        { name: "Osama Galal", pos: "DC", age: 26, ovr: 82, pot: 85 },
        { name: "Blati Touré", pos: "MDC", age: 29, ovr: 85, pot: 85 },
        { name: "Walid El Karti", pos: "MC", age: 29, ovr: 85, pot: 85 },
        { name: "Mohamed Reda Bobo", pos: "MC", age: 23, ovr: 82, pot: 86 },
        { name: "Ibrahim Adel", pos: "MOG", age: 23, ovr: 84, pot: 88 },
        { name: "Mostafa Fathi", pos: "MOD", age: 30, ovr: 85, pot: 85 },
        { name: "Ramadan Sobhi", pos: "MOG", age: 27, ovr: 84, pot: 85 },
        { name: "Abdallah El Said", pos: "MOC", age: 38, ovr: 83, pot: 83 },
        { name: "Fiston Mayele", pos: "BT", age: 30, ovr: 85, pot: 85 },
        { name: "Fagrie Lakay", pos: "BT", age: 26, ovr: 83, pot: 84 },
        { name: "Marwan Hamdi", pos: "BT", age: 27, ovr: 82, pot: 83 },
        { name: "Mahmoud Saber", pos: "MOC", age: 22, ovr: 80, pot: 85 }
    ],

    "Al Masry": [ // Upper Mid (79 - 83)
        { name: "Mahmoud Gad", pos: "G", age: 25, ovr: 82, pot: 85 },
        { name: "Essam Tharwat", pos: "G", age: 37, ovr: 78, pot: 78 },
        { name: "Baher El Mohamady", pos: "DC", age: 27, ovr: 81, pot: 82 },
        { name: "Hussein El Sayed", pos: "DG", age: 32, ovr: 79, pot: 79 },
        { name: "Karim El Eraki", pos: "DD", age: 26, ovr: 80, pot: 81 },
        { name: "Amr Moussa", pos: "DC", age: 35, ovr: 78, pot: 78 },
        { name: "Amr Saadawy", pos: "DG", age: 27, ovr: 78, pot: 79 },
        { name: "Mahmoud Hamada", pos: "MC", age: 30, ovr: 81, pot: 81 },
        { name: "Elias Jelassi", pos: "MOC", age: 30, ovr: 82, pot: 82 },
        { name: "Hassan Ali", pos: "MC", age: 26, ovr: 79, pot: 80 },
        { name: "Samir Fekri", pos: "MOD", age: 29, ovr: 80, pot: 80 },
        { name: "Amadou Bah", pos: "MDC", age: 24, ovr: 78, pot: 81 },
        { name: "Ghaylas Guenaoui", pos: "MOG", age: 26, ovr: 81, pot: 82 },
        { name: "Fakhreddine Ben Youssef", pos: "BT", age: 32, ovr: 81, pot: 81 },
        { name: "Marwan Hamdi", pos: "BT", age: 27, ovr: 80, pot: 81 },
        { name: "Mido Gaber", pos: "MOD", age: 31, ovr: 79, pot: 79 },
        { name: "Mohamed El Shamy", pos: "BT", age: 28, ovr: 79, pot: 79 },
        { name: "Islam Attia", pos: "MOC", age: 25, ovr: 77, pot: 80 }
    ],

    "Future FC": [ // Upper Mid (79 - 83)
        { name: "Mahmoud Genesh", pos: "G", age: 36, ovr: 82, pot: 82 },
        { name: "Mahmoud Hamdi", pos: "G", age: 30, ovr: 79, pot: 79 },
        { name: "Mahmoud Marei", pos: "DC", age: 26, ovr: 81, pot: 83 },
        { name: "Ali El Fil", pos: "DC", age: 31, ovr: 80, pot: 80 },
        { name: "Jonathan Ngwem", pos: "DG", age: 32, ovr: 81, pot: 81 },
        { name: "Basem Ali", pos: "DD", age: 35, ovr: 79, pot: 79 },
        { name: "Khaled Reda", pos: "DC", age: 34, ovr: 78, pot: 78 },
        { name: "Ghanam Mohamed", pos: "MDC", age: 27, ovr: 81, pot: 82 },
        { name: "Mohamed Reda", pos: "MC", age: 23, ovr: 82, pot: 85 },
        { name: "Omar Kamal", pos: "MOD", age: 30, ovr: 82, pot: 82 },
        { name: "Abdelkabir El Ouadi", pos: "MOG", age: 31, ovr: 81, pot: 81 },
        { name: "Nasser Maher", pos: "MOC", age: 27, ovr: 81, pot: 82 },
        { name: "Mohamed Farouk", pos: "MOC", age: 34, ovr: 80, pot: 80 },
        { name: "Marwan Mohsen", pos: "BT", age: 35, ovr: 80, pot: 80 },
        { name: "Ahmed Atef", pos: "BT", age: 26, ovr: 81, pot: 82 },
        { name: "Ayman Sfaxi", pos: "MOG", age: 28, ovr: 79, pot: 80 },
        { name: "Bello Babatunde", pos: "MDC", age: 21, ovr: 77, pot: 83 },
        { name: "Ali Zaazaa", pos: "MC", age: 22, ovr: 78, pot: 82 }
    ],

    "Smouha": [ // Milieu de Tableau (78 - 81)
        { name: "El Hani Soliman", pos: "G", age: 39, ovr: 80, pot: 80 },
        { name: "Hussein Taimour", pos: "G", age: 27, ovr: 77, pot: 78 },
        { name: "Ahmed Hakam", pos: "DC", age: 26, ovr: 79, pot: 81 },
        { name: "Mahmoud Shabana", pos: "DC", age: 29, ovr: 80, pot: 80 },
        { name: "Sherif Reda", pos: "DD", age: 26, ovr: 78, pot: 79 },
        { name: "Tarek Alaa", pos: "DG", age: 23, ovr: 76, pot: 80 },
        { name: "Barakat Haggag", pos: "DC", age: 26, ovr: 77, pot: 79 },
        { name: "Dokou Dodo", pos: "MDC", age: 19, ovr: 78, pot: 86 },
        { name: "Amr Kalawa", pos: "MC", age: 25, ovr: 79, pot: 81 },
        { name: "Mahmoud Halawa", pos: "MOC", age: 23, ovr: 77, pot: 80 },
        { name: "Hussein Faisal", pos: "MOG", age: 25, ovr: 80, pot: 82 },
        { name: "Mostafa El Badry", pos: "MOD", age: 26, ovr: 79, pot: 80 },
        { name: "Ahmed Khaled", pos: "MC", age: 24, ovr: 76, pot: 79 },
        { name: "Hossam Hassan", pos: "BT", age: 30, ovr: 82, pot: 82 },
        { name: "Fadi Farid", pos: "BT", age: 26, ovr: 79, pot: 80 },
        { name: "Benjamin Bernard", pos: "BT", age: 24, ovr: 78, pot: 81 },
        { name: "Mohamed Saeed", pos: "MOD", age: 27, ovr: 77, pot: 77 },
        { name: "Abu Bakr Liday", pos: "MOG", age: 24, ovr: 76, pot: 80 }
    ],

    "Ittihad Alex": [ // Historique / Milieu de Tableau (78 - 81)
        { name: "Al Mahdi Soliman", pos: "G", age: 36, ovr: 81, pot: 81 },
        { name: "Amr Khalil", pos: "G", age: 30, ovr: 77, pot: 77 },
        { name: "Mahmoud Alaa", pos: "DC", age: 33, ovr: 82, pot: 82 },
        { name: "Khaled Sobhi", pos: "DC", age: 29, ovr: 79, pot: 79 },
        { name: "Hesham Salah", pos: "DD", age: 26, ovr: 80, pot: 81 },
        { name: "Salifu Moro", pos: "MDC", age: 25, ovr: 79, pot: 82 },
        { name: "Khaled El Ghandour", pos: "MC", age: 32, ovr: 80, pot: 80 },
        { name: "Amr El Sisi", pos: "MDC", age: 29, ovr: 79, pot: 79 },
        { name: "Ibrahim Hassan", pos: "MOD", age: 33, ovr: 80, pot: 80 },
        { name: "Ahmed Adel", pos: "MOC", age: 27, ovr: 78, pot: 79 },
        { name: "Boateng", pos: "BT", age: 27, ovr: 79, pot: 80 },
        { name: "Mabululu", pos: "BT", age: 31, ovr: 83, pot: 83 },
        { name: "Amido Balde", pos: "BT", age: 32, ovr: 78, pot: 78 },
        { name: "Ahmed Eid", pos: "MOG", age: 24, ovr: 77, pot: 80 },
        { name: "Mostafa Ibrahim", pos: "DC", age: 23, ovr: 76, pot: 79 },
        { name: "Fawzi El Henawy", pos: "MOD", age: 26, ovr: 78, pot: 79 },
        { name: "Omar El Wahsh", pos: "MC", age: 29, ovr: 78, pot: 78 },
        { name: "Sabri Rahil", pos: "DG", age: 36, ovr: 77, pot: 77 }
    ],

    "Enppi": [ // Club formateur / Milieu (77 - 80)
        { name: "Abdelaziz El Balouti", pos: "G", age: 29, ovr: 79, pot: 80 },
        { name: "Abdelrahman Samir", pos: "G", age: 24, ovr: 75, pot: 79 },
        { name: "Ahmed Kalusha", pos: "DC", age: 26, ovr: 79, pot: 81 },
        { name: "Mohamed Hamed", pos: "DC", age: 27, ovr: 78, pot: 79 },
        { name: "Ali Fawzi", pos: "DD", age: 32, ovr: 79, pot: 79 },
        { name: "Marwan Dawoud", pos: "DG", age: 26, ovr: 78, pot: 80 },
        { name: "Seif El Khashab", pos: "DC", age: 25, ovr: 76, pot: 79 },
        { name: "Ziad Kamal", pos: "MDC", age: 23, ovr: 78, pot: 83 },
        { name: "Modimo Terek", pos: "MDC", age: 22, ovr: 77, pot: 82 },
        { name: "Mostafa Shakshak", pos: "MOC", age: 22, ovr: 76, pot: 81 },
        { name: "Ahmed Youssef", pos: "MC", age: 24, ovr: 77, pot: 80 },
        { name: "Mostafa Dewidar", pos: "MOG", age: 25, ovr: 78, pot: 79 },
        { name: "Rafik Kabou", pos: "MOD", age: 31, ovr: 80, pot: 80 },
        { name: "Ahmed Amin Oufa", pos: "BT", age: 27, ovr: 80, pot: 81 },
        { name: "Youssef Labib", pos: "BT", age: 23, ovr: 76, pot: 80 },
        { name: "Eric Traore", pos: "MOD", age: 28, ovr: 79, pot: 79 },
        { name: "Mohamed El Nahass", pos: "MC", age: 26, ovr: 77, pot: 78 },
        { name: "Khaled Reda", pos: "DG", age: 24, ovr: 75, pot: 78 }
    ],

    "Al Mokawloon": [ // Bas de tableau / Historique (76 - 80)
        { name: "Mahmoud Abou El Saoud", pos: "G", age: 36, ovr: 80, pot: 80 },
        { name: "Amer Amer", pos: "G", age: 37, ovr: 78, pot: 78 },
        { name: "Faroucka Kabore", pos: "DC", age: 30, ovr: 79, pot: 79 },
        { name: "Ahmed Alaa", pos: "DC", age: 30, ovr: 78, pot: 78 },
        { name: "Amir Abed", pos: "DD", age: 34, ovr: 78, pot: 78 },
        { name: "Joseph Ochaya", pos: "DG", age: 30, ovr: 80, pot: 80 },
        { name: "Loai Wael", pos: "DC", age: 31, ovr: 77, pot: 77 },
        { name: "Ahmed Shimi", pos: "MDC", age: 29, ovr: 78, pot: 78 },
        { name: "Mahmoud Abdelaziz", pos: "MDC", age: 33, ovr: 79, pot: 79 },
        { name: "Omar Fathi", pos: "MOC", age: 30, ovr: 78, pot: 78 },
        { name: "Abdelrahman Gebali", pos: "MC", age: 24, ovr: 76, pot: 79 },
        { name: "Mohamed Magli", pos: "MC", age: 27, ovr: 77, pot: 78 },
        { name: "Mamadou Niass", pos: "MOD", age: 29, ovr: 79, pot: 79 },
        { name: "Amadou Niass", pos: "MOG", age: 28, ovr: 78, pot: 78 },
        { name: "John Okoli", pos: "BT", age: 26, ovr: 79, pot: 80 },
        { name: "Firas Ifia", pos: "BT", age: 26, ovr: 77, pot: 78 },
        { name: "Ziad Farag", pos: "BT", age: 22, ovr: 75, pot: 80 },
        { name: "Luis Hinestroza", pos: "MOD", age: 31, ovr: 78, pot: 78 }
    ],

    "Ismaily": [ // Historique en difficulté (77 - 80)
        { name: "Ahmed Adel", pos: "G", age: 37, ovr: 79, pot: 79 },
        { name: "Mohamed Fawzy", pos: "G", age: 30, ovr: 77, pot: 77 },
        { name: "Baher El Mohamady", pos: "DC", age: 27, ovr: 81, pot: 82 },
        { name: "Mohamed Hashem", pos: "DC", age: 28, ovr: 78, pot: 78 },
        { name: "Essam Sobhy", pos: "DD", age: 34, ovr: 77, pot: 77 },
        { name: "Mohamed Desouki", pos: "DG", age: 26, ovr: 78, pot: 80 },
        { name: "Mohamed Nasr", pos: "DC", age: 24, ovr: 76, pot: 80 },
        { name: "Emad Hamdi", pos: "MDC", age: 31, ovr: 79, pot: 79 },
        { name: "Mohamed Makhlouf", pos: "MC", age: 26, ovr: 77, pot: 78 },
        { name: "Omar El Wahsh", pos: "MC", age: 29, ovr: 78, pot: 78 },
        { name: "Saleh Gomaa", pos: "MOC", age: 30, ovr: 80, pot: 80 },
        { name: "Abdelrahman Magdy", pos: "MOD", age: 26, ovr: 81, pot: 82 },
        { name: "Mahmoud Shabrawy", pos: "MOG", age: 28, ovr: 78, pot: 78 },
        { name: "Yaw Annor", pos: "BT", age: 26, ovr: 80, pot: 81 },
        { name: "Firas Chaouat", pos: "BT", age: 27, ovr: 79, pot: 80 },
        { name: "Basem Morsy", pos: "BT", age: 32, ovr: 78, pot: 78 },
        { name: "Marwan Hamdi", pos: "BT", age: 23, ovr: 75, pot: 79 },
        { name: "Mohamed Hassan", pos: "MDC", age: 30, ovr: 78, pot: 78 }
    ],
    // ==========================================
    // ÉGYPTE (PREMIER LEAGUE) - PARTIE 2/2
    // ==========================================

    "ZED FC": [ // Nouveau riche ambitieux (77 - 81)
        { name: "Ali Lotfi", pos: "G", age: 34, ovr: 81, pot: 81 },
        { name: "Amr Hossam", pos: "G", age: 32, ovr: 78, pot: 78 },
        { name: "Abdallah Bakri", pos: "DC", age: 29, ovr: 80, pot: 80 },
        { name: "Mohamed Samir", pos: "DC", age: 36, ovr: 78, pot: 78 },
        { name: "Ali Gamal", pos: "DD", age: 30, ovr: 77, pot: 77 },
        { name: "Mohamed Ashraf", pos: "DG", age: 22, ovr: 76, pot: 82 },
        { name: "Islam Abdallah", pos: "DC", age: 21, ovr: 74, pot: 80 },
        { name: "Peter Zilu Mutumosi", pos: "MDC", age: 25, ovr: 79, pot: 82 },
        { name: "Ahmed Atef", pos: "MC", age: 26, ovr: 78, pot: 80 },
        { name: "Abdelrahman El Banouby", pos: "MOC", age: 24, ovr: 77, pot: 81 },
        { name: "Mostafa Saad", pos: "MOG", age: 22, ovr: 78, pot: 84 },
        { name: "Mostafa Ziko", pos: "MOD", age: 27, ovr: 81, pot: 81 },
        { name: "Raafat Khalil", pos: "MOD", age: 20, ovr: 76, pot: 85 },
        { name: "Shady Hussein", pos: "BT", age: 31, ovr: 81, pot: 81 },
        { name: "Hazem Mohamed", pos: "MC", age: 19, ovr: 73, pot: 84 },
        { name: "Dilson", pos: "BT", age: 22, ovr: 77, pot: 82 },
        { name: "Mahmoud Nabil", pos: "MDC", age: 28, ovr: 78, pot: 78 },
        { name: "Youssef Azouz", pos: "BT", age: 21, ovr: 74, pot: 81 }
    ],

    "Ceramica Cleopatra": [ // Équipe très solide (78 - 82)
        { name: "Mohamed Bassam", pos: "G", age: 33, ovr: 82, pot: 82 },
        { name: "Ali El Gabry", pos: "G", age: 24, ovr: 76, pot: 80 },
        { name: "Ragab Nabil", pos: "DC", age: 30, ovr: 80, pot: 80 },
        { name: "Ahmed Ramadan", pos: "DC", age: 27, ovr: 81, pot: 82 },
        { name: "Mohamed Shokry", pos: "DG", age: 24, ovr: 80, pot: 84 },
        { name: "Ahmed Hany", pos: "DD", age: 28, ovr: 79, pot: 79 },
        { name: "Khaled Sobhi", pos: "DC", age: 29, ovr: 78, pot: 78 },
        { name: "Ahmed Kendouci", pos: "MC", age: 24, ovr: 83, pot: 86 },
        { name: "Mohamed Adel", pos: "MDC", age: 28, ovr: 79, pot: 79 },
        { name: "Sodiq Awujoola", pos: "MOG", age: 23, ovr: 81, pot: 85 },
        { name: "Mohamed Ibrahim", pos: "MOC", age: 32, ovr: 82, pot: 82 },
        { name: "Mahmoud Zalaka", pos: "MOD", age: 25, ovr: 79, pot: 81 },
        { name: "Samuel Amadi", pos: "MOG", age: 20, ovr: 76, pot: 84 },
        { name: "Ahmed Yasser Rayan", pos: "BT", age: 26, ovr: 81, pot: 82 },
        { name: "John Ebuka", pos: "BT", age: 27, ovr: 82, pot: 82 },
        { name: "Badr Benoun", pos: "DC", age: 30, ovr: 81, pot: 81 }, // Vétéran star
        { name: "Marwan Osman", pos: "BT", age: 21, ovr: 75, pot: 81 },
        { name: "Abdelrahman Body", pos: "MDC", age: 25, ovr: 77, pot: 80 }
    ],

    "Tala'ea El Gaish": [ // Équipe militaire, physique (76 - 80)
        { name: "Mohamed Shaban", pos: "G", age: 31, ovr: 79, pot: 79 },
        { name: "Omar Radwan", pos: "G", age: 26, ovr: 77, pot: 78 },
        { name: "Khaled Stouhi", pos: "DC", age: 34, ovr: 78, pot: 78 },
        { name: "Amr Tarek", pos: "DC", age: 31, ovr: 79, pot: 79 },
        { name: "Ahmed Meteb", pos: "DG", age: 27, ovr: 77, pot: 78 },
        { name: "Ahmed Zola", pos: "DD", age: 26, ovr: 78, pot: 80 },
        { name: "Hassan Magdy", pos: "DC", age: 28, ovr: 76, pot: 76 },
        { name: "Farid Shawky", pos: "MDC", age: 34, ovr: 79, pot: 79 },
        { name: "Abdelrahman Shika", pos: "MC", age: 25, ovr: 78, pot: 81 },
        { name: "Ali Hamdy", pos: "MC", age: 24, ovr: 76, pot: 80 },
        { name: "Islam Mohareb", pos: "MOC", age: 32, ovr: 78, pot: 78 },
        { name: "Karim Tarek", pos: "MOG", age: 32, ovr: 79, pot: 79 },
        { name: "Ahmed Samir", pos: "MOD", age: 29, ovr: 80, pot: 80 },
        { name: "Godwin Chika", pos: "BT", age: 22, ovr: 79, pot: 84 },
        { name: "Paul Julius", pos: "BT", age: 23, ovr: 77, pot: 81 },
        { name: "Mohamed Hamdy", pos: "MDC", age: 22, ovr: 75, pot: 80 },
        { name: "Fares Hatem", pos: "BT", age: 21, ovr: 73, pot: 79 },
        { name: "Moussa Diawara", pos: "MOD", age: 29, ovr: 78, pot: 78 }
    ],

    "National Bank": [ // National Bank of Egypt - Bonne équipe (77 - 81)
        { name: "Mohamed Abou Gabal", pos: "G", age: 35, ovr: 83, pot: 83 }, // Gabaski
        { name: "Hassan Mahmoud", pos: "G", age: 25, ovr: 76, pot: 80 },
        { name: "Ayman Ashraf", pos: "DC", age: 33, ovr: 81, pot: 81 },
        { name: "Mahmoud El Gazzar", pos: "DC", age: 26, ovr: 79, pot: 81 },
        { name: "Isaac Yaacoubou", pos: "DG", age: 30, ovr: 80, pot: 80 },
        { name: "Saeedo Simpore", pos: "MDC", age: 31, ovr: 80, pot: 80 },
        { name: "Assem Salah", pos: "DD", age: 33, ovr: 78, pot: 78 },
        { name: "Mohamed Fathi", pos: "MDC", age: 30, ovr: 79, pot: 79 },
        { name: "Serge Aka", pos: "MC", age: 29, ovr: 80, pot: 80 },
        { name: "Ahmed Madbouli", pos: "MOC", age: 29, ovr: 79, pot: 79 },
        { name: "Mahmoud Kaoud", pos: "MOG", age: 35, ovr: 78, pot: 78 },
        { name: "Karim Bambo", pos: "MOD", age: 31, ovr: 81, pot: 81 },
        { name: "Ibrahim Hassan", pos: "MOD", age: 33, ovr: 79, pot: 79 },
        { name: "Osama Faisal", pos: "BT", age: 23, ovr: 80, pot: 84 },
        { name: "Yaw Annor", pos: "BT", age: 26, ovr: 81, pot: 82 },
        { name: "Mahmoud Nader", pos: "MC", age: 21, ovr: 74, pot: 81 },
        { name: "Mohamed Bassiouny", pos: "DD", age: 34, ovr: 77, pot: 77 },
        { name: "Ahmed El Nadry", pos: "MC", age: 25, ovr: 78, pot: 80 }
    ],

    "Pharco FC": [ // Milieu de tableau / Défensif (76 - 79)
        { name: "Mohamed Saeed Shika", pos: "G", age: 31, ovr: 79, pot: 79 },
        { name: "Mahmoud El Sayed", pos: "G", age: 38, ovr: 75, pot: 75 },
        { name: "Rami Sabri", pos: "DC", age: 37, ovr: 80, pot: 80 },
        { name: "Ahmed Awad", pos: "DC", age: 29, ovr: 78, pot: 78 },
        { name: "Gaber Kamel", pos: "DG", age: 28, ovr: 77, pot: 78 },
        { name: "Jefferson Encada", pos: "DD", age: 26, ovr: 79, pot: 80 },
        { name: "Yassin Marei", pos: "DC", age: 22, ovr: 75, pot: 82 },
        { name: "Kingsley Sokari", pos: "MDC", age: 28, ovr: 79, pot: 79 },
        { name: "Mahmoud Emad", pos: "MC", age: 25, ovr: 78, pot: 80 },
        { name: "Walid Farag", pos: "MOD", age: 23, ovr: 77, pot: 81 },
        { name: "Shoukry Naguib", pos: "MOG", age: 30, ovr: 80, pot: 80 },
        { name: "Seif Thierry", pos: "BT", age: 30, ovr: 81, pot: 81 },
        { name: "Amr Gamal", pos: "BT", age: 32, ovr: 79, pot: 79 },
        { name: "Ahmed Fouad", pos: "MOC", age: 24, ovr: 76, pot: 80 },
        { name: "Mohamed Fakhry", pos: "MC", age: 25, ovr: 77, pot: 79 },
        { name: "Oussema Boughanmi", pos: "MOD", age: 34, ovr: 77, pot: 77 },
        { name: "Mahmoud Ghalab", pos: "DG", age: 21, ovr: 74, pot: 79 },
        { name: " رزق (Rizk) Abdelhalim", pos: "MDC", age: 26, ovr: 76, pot: 78 }
    ],

    "El Gouna": [ // Équipe côtière / Bas de tableau (75 - 79)
        { name: "Sobhy Soliman", pos: "G", age: 26, ovr: 77, pot: 80 },
        { name: "Ahmed Masoud", pos: "G", age: 32, ovr: 76, pot: 76 },
        { name: "Ahmed Abdelrasoul", pos: "DC", age: 28, ovr: 77, pot: 77 },
        { name: "Sabri Rahil", pos: "DG", age: 36, ovr: 78, pot: 78 }, // Vétéran
        { name: "Kamal Abou El Fotouh", pos: "DC", age: 26, ovr: 76, pot: 79 },
        { name: "Alou Jatta", pos: "DD", age: 25, ovr: 77, pot: 81 },
        { name: "Ahmed Hossam", pos: "DC", age: 22, ovr: 74, pot: 80 },
        { name: "Nour El Sayed", pos: "MDC", age: 40, ovr: 75, pot: 75 }, // Légende locale
        { name: "Ahmed Tarek", pos: "MC", age: 24, ovr: 76, pot: 80 },
        { name: "Emanuel Luckman", pos: "MOG", age: 21, ovr: 75, pot: 83 },
        { name: "Ayman Moka", pos: "MOC", age: 26, ovr: 78, pot: 79 },
        { name: "Gabriel Chukwudi", pos: "MOD", age: 22, ovr: 76, pot: 82 },
        { name: "Arnaud Randrianantenaina", pos: "BT", age: 23, ovr: 78, pot: 83 },
        { name: "Hossam Ghanem", pos: "BT", age: 25, ovr: 77, pot: 79 },
        { name: "Reda Salah", pos: "MC", age: 23, ovr: 75, pot: 80 },
        { name: "Mohamed El Sabahy", pos: "MDC", age: 29, ovr: 77, pot: 77 },
        { name: "Ashraf Magdy", pos: "MOG", age: 27, ovr: 76, pot: 77 },
        { name: "Ahmed Belia", pos: "BT", age: 20, ovr: 72, pot: 80 }
    ],

    "Baladiyat": [ // Baladiyat El Mahalla - Promu (74 - 78)
        { name: "Mahmoud Maher", pos: "G", age: 29, ovr: 76, pot: 76 },
        { name: "Ahmed Hussein", pos: "G", age: 25, ovr: 74, pot: 78 },
        { name: "Mohamed Abdelrazek", pos: "DC", age: 30, ovr: 77, pot: 77 },
        { name: "Nour El Zamouri", pos: "DC", age: 26, ovr: 76, pot: 79 },
        { name: "Tarek Alaa", pos: "DG", age: 23, ovr: 75, pot: 80 },
        { name: "Hesham Shaaban", pos: "DD", age: 28, ovr: 76, pot: 76 },
        { name: "Islam Marzouk", pos: "MC", age: 26, ovr: 75, pot: 77 },
        { name: "Magdy Awad", pos: "MDC", age: 25, ovr: 76, pot: 79 },
        { name: "Youssef Hassan", pos: "MC", age: 21, ovr: 73, pot: 81 },
        { name: "Emanuel Ihiawekwe", pos: "MOD", age: 22, ovr: 76, pot: 82 },
        { name: "Abdelrahman Semana", pos: "MOG", age: 27, ovr: 77, pot: 77 },
        { name: "Hossam Ashraf", pos: "BT", age: 22, ovr: 79, pot: 84 }, // Buteur pépite
        { name: "Karim Ashraf", pos: "BT", age: 26, ovr: 76, pot: 78 },
        { name: "Mohamed Amissi", pos: "MOD", age: 23, ovr: 75, pot: 80 },
        { name: "Ahmed Reda", pos: "DC", age: 21, ovr: 74, pot: 80 },
        { name: "Moaz El Henawy", pos: "DC", age: 34, ovr: 76, pot: 76 },
        { name: "Waheed Mohsen", pos: "BT", age: 25, ovr: 75, pot: 79 },
        { name: "Yahia El Zenary", pos: "MOC", age: 22, ovr: 74, pot: 80 }
    ],

    "El Dakhleya": [ // Lutte pour le maintien (73 - 77)
        { name: "Mohamed Magdy", pos: "G", age: 28, ovr: 76, pot: 77 },
        { name: "Ramzi Mahmoud", pos: "G", age: 24, ovr: 73, pot: 78 },
        { name: "Moaz El Henawy", pos: "DC", age: 34, ovr: 77, pot: 77 }, // Vétéran
        { name: "Mahmoud Mansour", pos: "DC", age: 27, ovr: 75, pot: 77 },
        { name: "Ihab Samir", pos: "DG", age: 30, ovr: 76, pot: 76 },
        { name: "Karim Yehia", pos: "DD", age: 26, ovr: 76, pot: 78 },
        { name: "Mahmoud Saber", pos: "DC", age: 22, ovr: 73, pot: 79 },
        { name: "Allan Kyambadde", pos: "MDC", age: 28, ovr: 78, pot: 78 },
        { name: "Mahmoud Hassouna", pos: "MC", age: 25, ovr: 75, pot: 78 },
        { name: "Kelechi Chimezie", pos: "MC", age: 23, ovr: 76, pot: 80 },
        { name: "Ali El Zahdi", pos: "MOD", age: 24, ovr: 75, pot: 79 },
        { name: "Ziad Tarek", pos: "MOG", age: 23, ovr: 76, pot: 81 },
        { name: "Funsho Bamgboye", pos: "BT", age: 25, ovr: 78, pot: 81 },
        { name: "Mohamed El Zarif", pos: "BT", age: 26, ovr: 75, pot: 76 },
        { name: "Abdelrahman Atef", pos: "BT", age: 22, ovr: 74, pot: 80 },
        { name: "Ahmed El Sebaie", pos: "MOC", age: 27, ovr: 76, pot: 76 },
        { name: "Mostafa Fawzy", pos: "BT", age: 24, ovr: 75, pot: 78 },
        { name: "Omar Naim", pos: "MOD", age: 21, ovr: 72, pot: 78 }
    ],

    "Ghazl El Mahalla": [ // Club Historique / Bas de tableau (74 - 78)
        { name: "Amr Shaaban", pos: "G", age: 30, ovr: 77, pot: 77 },
        { name: "Mahmoud El Hadary", pos: "G", age: 28, ovr: 75, pot: 75 },
        { name: "Moaz El Henawy", pos: "DC", age: 34, ovr: 78, pot: 78 },
        { name: "Mostafa El Aash", pos: "DC", age: 24, ovr: 77, pot: 81 },
        { name: "Ehab Samir", pos: "DG", age: 30, ovr: 76, pot: 76 },
        { name: "Yahia Hamed", pos: "DD", age: 34, ovr: 75, pot: 75 },
        { name: "Mohamed Gaber", pos: "DD", age: 33, ovr: 76, pot: 76 },
        { name: "Hamid Mao", pos: "MDC", age: 31, ovr: 78, pot: 78 },
        { name: "Ahmed El Nadry", pos: "MC", age: 24, ovr: 77, pot: 81 },
        { name: "Paul Julius", pos: "MC", age: 23, ovr: 76, pot: 80 },
        { name: "Gabriel Orok", pos: "MOD", age: 23, ovr: 78, pot: 82 },
        { name: "Hazem Morsi", pos: "MOG", age: 24, ovr: 76, pot: 79 },
        { name: "Abdo Yehia", pos: "BT", age: 25, ovr: 79, pot: 81 },
        { name: "Agbucho Charles", pos: "BT", age: 26, ovr: 77, pot: 78 },
        { name: "Ahmed El Sheikh", pos: "MOC", age: 31, ovr: 78, pot: 78 },
        { name: "Karim Mostafa", pos: "MOC", age: 28, ovr: 76, pot: 76 },
        { name: "Tarek Samy", pos: "DC", age: 25, ovr: 75, pot: 78 },
        { name: "Mohamed Ouka", pos: "BT", age: 21, ovr: 73, pot: 80 }
    ],

    "Aswan SC": [ // Club du Sud de l'Égypte (74 - 78)
        { name: "Amr Hossam", pos: "G", age: 32, ovr: 77, pot: 77 },
        { name: "Khaled Walid", pos: "G", age: 26, ovr: 74, pot: 76 },
        { name: "Mohamed Atwa", pos: "DC", age: 33, ovr: 78, pot: 78 },
        { name: "Islam Gamal", pos: "DC", age: 35, ovr: 77, pot: 77 },
        { name: "Ali Fathi", pos: "DG", age: 32, ovr: 76, pot: 76 },
        { name: "Mohamed Mostafa", pos: "DD", age: 26, ovr: 75, pot: 78 },
        { name: "Castelo", pos: "DC", age: 27, ovr: 76, pot: 78 },
        { name: "Raphael Ayagwa", pos: "MDC", age: 26, ovr: 78, pot: 80 },
        { name: "Emad Fathy", pos: "MC", age: 31, ovr: 77, pot: 77 },
        { name: "Mido Mostafa", pos: "MC", age: 29, ovr: 76, pot: 76 },
        { name: "Ahmed Belhadji", pos: "MOC", age: 26, ovr: 79, pot: 81 },
        { name: "Mahmoud Fahmy", pos: "MOD", age: 24, ovr: 75, pot: 80 },
        { name: "Evouna", pos: "BT", age: 31, ovr: 78, pot: 78 }, // Malick Evouna (ancien cador)
        { name: "Mohamed Hamdy Zaky", pos: "BT", age: 32, ovr: 79, pot: 79 },
        { name: "Dilson", pos: "BT", age: 22, ovr: 76, pot: 82 },
        { name: "Moustafa Abdelrasoul", pos: "MOG", age: 25, ovr: 75, pot: 77 },
        { name: "Gedo", pos: "BT", age: 28, ovr: 77, pot: 77 },
        { name: "Ahmed Hamoudi", pos: "MOG", age: 33, ovr: 78, pot: 78 }
    ],
    // ==========================================
    // TUNISIE (LIGUE 1 PRO) - PARTIE 1/2
    // ==========================================

    "Espérance Tunis": [ // Top Club Continental (84 - 88)
        { name: "Amanallah Memmiche", pos: "G", age: 20, ovr: 85, pot: 91 },
        { name: "Moez Ben Cherifia", pos: "G", age: 32, ovr: 84, pot: 84 },
        { name: "Yassine Meriah", pos: "DC", age: 30, ovr: 87, pot: 87 },
        { name: "Mohamed Amine Tougai", pos: "DC", age: 24, ovr: 86, pot: 89 },
        { name: "Mohamed Ben Ali", pos: "DD", age: 29, ovr: 84, pot: 84 },
        { name: "Mohamed Amine Ben Hmida", pos: "DG", age: 28, ovr: 84, pot: 84 },
        { name: "Hani Amamou", pos: "DC", age: 26, ovr: 82, pot: 85 },
        { name: "Roger Aholou", pos: "MDC", age: 30, ovr: 86, pot: 86 },
        { name: "Houssem Tka", pos: "MC", age: 23, ovr: 85, pot: 88 },
        { name: "Ghailene Chaalali", pos: "MC", age: 30, ovr: 85, pot: 85 },
        { name: "Zakaria El Ayeb", pos: "MOC", age: 21, ovr: 82, pot: 87 },
        { name: "Ghaith Ouahabi", pos: "MDC", age: 20, ovr: 81, pot: 86 },
        { name: "Yan Sasse", pos: "MOD", age: 26, ovr: 86, pot: 87 },
        { name: "Houssam Ghacha", pos: "MOG", age: 28, ovr: 85, pot: 85 },
        { name: "Rodrigo Rodrigues", pos: "BT", age: 27, ovr: 86, pot: 86 },
        { name: "Oussama Bouguerra", pos: "MOG", age: 25, ovr: 83, pot: 85 },
        { name: "Kepa Sowe", pos: "BT", age: 19, ovr: 80, pot: 88 },
        { name: "Mohamed Ali Ben Hammouda", pos: "BT", age: 25, ovr: 82, pot: 84 }
    ],

    "Club Africain": [ // Top Club (83 - 86)
        { name: "Mouez Hassen", pos: "G", age: 29, ovr: 84, pot: 84 },
        { name: "Noureddine Farhati", pos: "G", age: 23, ovr: 80, pot: 84 },
        { name: "Rami Bedoui", pos: "DC", age: 34, ovr: 84, pot: 84 },
        { name: "Toufik Cherifi", pos: "DC", age: 22, ovr: 83, pot: 87 },
        { name: "Ghaith Zaalouni", pos: "DD", age: 22, ovr: 82, pot: 86 },
        { name: "Mohamed Amine Hamrouni", pos: "DG", age: 26, ovr: 82, pot: 84 },
        { name: "Hamza Agrebi", pos: "DD", age: 33, ovr: 81, pot: 81 },
        { name: "Ahmed Khalil", pos: "MDC", age: 29, ovr: 85, pot: 85 },
        { name: "Wissem Ben Yahia", pos: "MC", age: 39, ovr: 82, pot: 82 }, // Vétéran légendaire
        { name: "Ghaith Sghaier", pos: "MC", age: 28, ovr: 83, pot: 83 },
        { name: "Federico Bikoro", pos: "MDC", age: 28, ovr: 83, pot: 83 },
        { name: "Rached Arfaoui", pos: "MOC", age: 28, ovr: 82, pot: 82 },
        { name: "Bassem Srarfi", pos: "MOD", age: 26, ovr: 84, pot: 85 },
        { name: "Zouheir Dhaouadi", pos: "MOG", age: 36, ovr: 81, pot: 81 },
        { name: "Kingsley Eduwo", pos: "BT", age: 28, ovr: 84, pot: 84 },
        { name: "Hamdi Labidi", pos: "BT", age: 21, ovr: 82, pot: 86 },
        { name: "Ali Amri", pos: "MOD", age: 27, ovr: 81, pot: 81 },
        { name: "Adem Garreb", pos: "MOG", age: 20, ovr: 79, pot: 85 }
    ],

    "Étoile du Sahel": [ // Top Club (82 - 86)
        { name: "Ali Jemal", pos: "G", age: 34, ovr: 84, pot: 84 },
        { name: "Raed Bouchniba", pos: "G", age: 20, ovr: 78, pot: 84 },
        { name: "Zied Boughattas", pos: "DC", age: 33, ovr: 83, pot: 83 },
        { name: "Hamza Jelassi", pos: "DC", age: 32, ovr: 84, pot: 84 },
        { name: "Salah Barhoumi", pos: "DD", age: 25, ovr: 81, pot: 83 },
        { name: "Ghofrane Naouali", pos: "DG", age: 24, ovr: 82, pot: 85 },
        { name: "Abderrazak Bouazra", pos: "DC", age: 22, ovr: 80, pot: 84 },
        { name: "Jacques Mbé", pos: "MDC", age: 25, ovr: 84, pot: 86 },
        { name: "Soumaila Sidibe", pos: "MC", age: 26, ovr: 83, pot: 84 },
        { name: "Oussama Abid", pos: "MOC", age: 21, ovr: 82, pot: 87 },
        { name: "Yassine Amri", pos: "MDC", age: 28, ovr: 81, pot: 81 },
        { name: "Adem Ouertani", pos: "MC", age: 20, ovr: 79, pot: 85 },
        { name: "Raki Aouani", pos: "MOD", age: 19, ovr: 80, pot: 88 },
        { name: "Fraj Ben Njima", pos: "MOG", age: 20, ovr: 81, pot: 86 },
        { name: "Yassine Chamakhi", pos: "BT", age: 29, ovr: 83, pot: 83 },
        { name: "Vinny Bongonga", pos: "BT", age: 28, ovr: 82, pot: 82 },
        { name: "Hassen Jaziri", pos: "BT", age: 23, ovr: 80, pot: 84 },
        { name: "Assil Jaziri", pos: "MOD", age: 24, ovr: 79, pot: 82 }
    ],

    "CS Sfaxien": [ // Top Club (81 - 85)
        { name: "Aymen Dahmen", pos: "G", age: 27, ovr: 85, pot: 86 },
        { name: "Sabri Ben Hassen", pos: "G", age: 27, ovr: 80, pot: 81 },
        { name: "Alaa Ghram", pos: "DC", age: 22, ovr: 84, pot: 88 },
        { name: "Koffi Kouame", pos: "DC", age: 27, ovr: 82, pot: 83 },
        { name: "Mahmoud Ghorbel", pos: "DD", age: 20, ovr: 79, pot: 85 },
        { name: "Aziz Saihi", pos: "DG", age: 24, ovr: 80, pot: 83 },
        { name: "Mohamed Nasraoui", pos: "DC", age: 21, ovr: 81, pot: 86 },
        { name: "Naby Camara", pos: "MDC", age: 22, ovr: 82, pot: 86 },
        { name: "Chadi Hammami", pos: "MC", age: 37, ovr: 81, pot: 81 },
        { name: "Wadhah Zaidi", pos: "MOC", age: 25, ovr: 81, pot: 83 },
        { name: "Fares Neji", pos: "MC", age: 23, ovr: 80, pot: 84 },
        { name: "Abdoulaye Touré", pos: "MDC", age: 24, ovr: 81, pot: 84 },
        { name: "Baraket Hmidi", pos: "MOG", age: 21, ovr: 80, pot: 85 },
        { name: "Youssef Becha", pos: "MOD", age: 19, ovr: 79, pot: 86 },
        { name: "Diby Beranger", pos: "BT", age: 25, ovr: 82, pot: 84 },
        { name: "Hazem Haj Hassen", pos: "BT", age: 28, ovr: 81, pot: 81 },
        { name: "Amine Allah Haboubi", pos: "BT", age: 21, ovr: 80, pot: 85 },
        { name: "Fode Camara", pos: "MOD", age: 22, ovr: 79, pot: 83 }
    ],

    "US Monastir": [ // Upper Mid (80 - 84)
        { name: "Bechir Ben Said", pos: "G", age: 29, ovr: 84, pot: 85 },
        { name: "Sadok Yeddes", pos: "G", age: 25, ovr: 78, pot: 81 },
        { name: "Naude Zeguei", pos: "DC", age: 23, ovr: 82, pot: 86 },
        { name: "Hichem Baccar", pos: "DC", age: 22, ovr: 81, pot: 85 },
        { name: "Wael Ben Othman", pos: "DG", age: 28, ovr: 80, pot: 80 },
        { name: "Bassel Trabelsi", pos: "DD", age: 24, ovr: 79, pot: 82 },
        { name: "Ousmane Ouattara", pos: "DC", age: 29, ovr: 80, pot: 80 },
        { name: "Alaeddine Dridi", pos: "MDC", age: 26, ovr: 82, pot: 83 },
        { name: "Moses Orkuma", pos: "MDC", age: 29, ovr: 81, pot: 81 },
        { name: "Faisal Mannai", pos: "MOC", age: 28, ovr: 81, pot: 81 },
        { name: "Chiheb Jbeli", pos: "MC", age: 27, ovr: 80, pot: 80 },
        { name: "Adnane Baffour", pos: "MC", age: 22, ovr: 79, pot: 84 },
        { name: "Idriss Mhirsi", pos: "MOD", age: 30, ovr: 82, pot: 82 },
        { name: "Ahmed Jafeli", pos: "MOG", age: 25, ovr: 80, pot: 82 },
        { name: "Boubacar Traoré", pos: "BT", age: 24, ovr: 83, pot: 86 },
        { name: "Zied Aloui", pos: "BT", age: 25, ovr: 81, pot: 83 },
        { name: "Abdelkader Boutiche", pos: "BT", age: 27, ovr: 80, pot: 80 },
        { name: "Yassin Cheikh El Welly", pos: "MOG", age: 25, ovr: 79, pot: 82 }
    ],

    "Stade Tunisien": [ // Upper Mid (79 - 83)
        { name: "Sami Helal", pos: "G", age: 35, ovr: 82, pot: 82 },
        { name: "Atef Dkhili", pos: "G", age: 34, ovr: 80, pot: 80 },
        { name: "Hamza Ben Abda", pos: "DC", age: 29, ovr: 81, pot: 81 },
        { name: "Marouane Sahraoui", pos: "DC", age: 28, ovr: 80, pot: 80 },
        { name: "Nidhal Laifi", pos: "DG", age: 26, ovr: 80, pot: 82 },
        { name: "Hedi Khalfa", pos: "DD", age: 29, ovr: 79, pot: 79 },
        { name: "Ousmane Adams", pos: "DC", age: 23, ovr: 78, pot: 83 },
        { name: "Lamine Ndao", pos: "MDC", age: 31, ovr: 81, pot: 81 },
        { name: "Youssouf Oumarou", pos: "MC", age: 31, ovr: 82, pot: 82 },
        { name: "Ghazi Ayadi", pos: "MC", age: 27, ovr: 81, pot: 82 },
        { name: "Amath Ndaw", pos: "MOC", age: 24, ovr: 79, pot: 83 },
        { name: "Skander Zaidi", pos: "MDC", age: 25, ovr: 78, pot: 81 },
        { name: "Hamza Khadraoui", pos: "MOG", age: 25, ovr: 82, pot: 85 },
        { name: "Bilel Mejri", pos: "MOD", age: 28, ovr: 81, pot: 81 },
        { name: "Haythem Jouini", pos: "BT", age: 30, ovr: 83, pot: 83 },
        { name: "Mahmoud Diallo", pos: "BT", age: 27, ovr: 80, pot: 80 },
        { name: "Ousmane Diop", pos: "BT", age: 23, ovr: 78, pot: 82 },
        { name: "Sadok Kadida", pos: "MOD", age: 22, ovr: 77, pot: 81 }
    ],

    "US Ben Guerdane": [ // Milieu de Tableau (78 - 81)
        { name: "Ali Ayari", pos: "G", age: 34, ovr: 80, pot: 80 },
        { name: "Noureddine Farhati", pos: "G", age: 23, ovr: 77, pot: 81 },
        { name: "Chaouki Ben Khader", pos: "DC", age: 23, ovr: 79, pot: 83 },
        { name: "Mahmoud Mhadhebi", pos: "DC", age: 26, ovr: 78, pot: 80 },
        { name: "Jawhar Ben Hassen", pos: "DG", age: 26, ovr: 78, pot: 81 },
        { name: "Mohamed Amine Zghada", pos: "DD", age: 22, ovr: 77, pot: 82 },
        { name: "Skander Bouabid", pos: "DC", age: 25, ovr: 76, pot: 79 },
        { name: "Mohamed Ali Trabelsi", pos: "MDC", age: 26, ovr: 79, pot: 80 },
        { name: "Presnel Banga", pos: "MC", age: 23, ovr: 78, pot: 83 },
        { name: "Youssef Mosrati", pos: "MOC", age: 24, ovr: 78, pot: 81 },
        { name: "Ayoub Ben Tarcha", pos: "MDC", age: 26, ovr: 77, pot: 78 },
        { name: "Anes Ammar", pos: "MC", age: 21, ovr: 76, pot: 82 },
        { name: "Wadhah Zaidi", pos: "MOG", age: 25, ovr: 80, pot: 82 },
        { name: "Fakhreddine Ouji", pos: "MOD", age: 25, ovr: 79, pot: 81 },
        { name: "Nassim Chachia", pos: "BT", age: 27, ovr: 79, pot: 79 },
        { name: "Mohamed Jomaa", pos: "BT", age: 26, ovr: 78, pot: 79 },
        { name: "Houssem Habbassi", pos: "BT", age: 27, ovr: 77, pot: 78 },
        { name: "Rafik Kamergi", pos: "MOD", age: 29, ovr: 78, pot: 78 }
    ],

    "Olympique Béja": [ // Milieu de Tableau / Solide (78 - 81)
        { name: "Achraf Krir", pos: "G", age: 32, ovr: 81, pot: 81 },
        { name: "Zied Ghanmi", pos: "G", age: 26, ovr: 76, pot: 78 },
        { name: "Rayane Derbali", pos: "DC", age: 21, ovr: 79, pot: 84 },
        { name: "Skander Bouabid", pos: "DC", age: 25, ovr: 78, pot: 81 },
        { name: "Mouhib Selmi", pos: "DD", age: 24, ovr: 77, pot: 80 },
        { name: "Yassine Bouabid", pos: "DG", age: 24, ovr: 78, pot: 82 },
        { name: "Klousseh Agbozo", pos: "DC", age: 29, ovr: 79, pot: 79 },
        { name: "Babacar Sarr", pos: "MDC", age: 26, ovr: 80, pot: 82 },
        { name: "Aly Desse Sissoko", pos: "MDC", age: 28, ovr: 79, pot: 79 },
        { name: "Ousmane Coulibaly", pos: "MC", age: 24, ovr: 78, pot: 83 },
        { name: "Bahaeddine Othman", pos: "MOC", age: 20, ovr: 76, pot: 84 },
        { name: "Houssem Eddine Habassi", pos: "MOG", age: 27, ovr: 79, pot: 79 },
        { name: "Lamine Ba", pos: "MOD", age: 22, ovr: 78, pot: 83 },
        { name: "Chadi Derbali", pos: "MOG", age: 21, ovr: 77, pot: 82 },
        { name: "Ousmane Kombous", pos: "BT", age: 28, ovr: 80, pot: 80 },
        { name: "Ahmed Amri", pos: "BT", age: 24, ovr: 79, pot: 82 },
        { name: "Mounir Jelassi", pos: "BT", age: 23, ovr: 77, pot: 81 },
        { name: "Farouk Mimouni", pos: "MOD", age: 22, ovr: 78, pot: 82 }
    ],

    "CA Bizertin": [ // Historique / Milieu de Tableau (77 - 80)
        { name: "Kais Amdouni", pos: "G", age: 36, ovr: 79, pot: 79 },
        { name: "Wassim Ghozzi", pos: "G", age: 23, ovr: 74, pot: 79 },
        { name: "Ali Machani", pos: "DC", age: 30, ovr: 79, pot: 79 },
        { name: "Firas Akremi", pos: "DG", age: 23, ovr: 78, pot: 82 },
        { name: "Iheb Mbarki", pos: "DD", age: 32, ovr: 78, pot: 78 },
        { name: "Yassine Kchouk", pos: "DC", age: 25, ovr: 77, pot: 80 },
        { name: "Achraf Ferchichi", pos: "DC", age: 21, ovr: 75, pot: 81 },
        { name: "Alassane Kanté", pos: "MDC", age: 23, ovr: 79, pot: 83 },
        { name: "Hassan Dridi", pos: "MC", age: 25, ovr: 78, pot: 81 },
        { name: "Mouez Aboud", pos: "MOC", age: 27, ovr: 79, pot: 79 },
        { name: "Nader Jerbi", pos: "MC", age: 24, ovr: 76, pot: 79 },
        { name: "Yassine Oueslati", pos: "MDC", age: 22, ovr: 75, pot: 80 },
        { name: "Amadou Cissoko", pos: "MOG", age: 26, ovr: 79, pot: 80 },
        { name: "Khalil Balbouz", pos: "MOD", age: 25, ovr: 78, pot: 81 },
        { name: "Bechir Mkaddem", pos: "BT", age: 26, ovr: 79, pot: 80 },
        { name: "Moussa Sow", pos: "BT", age: 24, ovr: 77, pot: 82 },
        { name: "Omar Mechergui", pos: "BT", age: 21, ovr: 75, pot: 82 },
        { name: "Youssef Fellahi", pos: "MOD", age: 22, ovr: 76, pot: 80 }
    ],

    "EGS Gafsa": [ // Bas de tableau / Promu (76 - 79)
        { name: "Ali Othmani", pos: "G", age: 28, ovr: 77, pot: 78 },
        { name: "Rami Baccar", pos: "G", age: 24, ovr: 74, pot: 77 },
        { name: "Hichem Jbira", pos: "DC", age: 29, ovr: 77, pot: 77 },
        { name: "Mohamed Ben Othman", pos: "DC", age: 26, ovr: 76, pot: 79 },
        { name: "Ayoub Chagra", pos: "DD", age: 25, ovr: 75, pot: 78 },
        { name: "Walid Zrelli", pos: "DG", age: 27, ovr: 76, pot: 77 },
        { name: "Nabil Guesmi", pos: "DC", age: 23, ovr: 74, pot: 79 },
        { name: "Oussama Mhamdi", pos: "MDC", age: 28, ovr: 77, pot: 77 },
        { name: "Slim Ben Salem", pos: "MC", age: 26, ovr: 76, pot: 78 },
        { name: "Alaeddine Hlel", pos: "MC", age: 25, ovr: 75, pot: 79 },
        { name: "Issam Nafti", pos: "MOC", age: 31, ovr: 78, pot: 78 },
        { name: "Saber Dhaouadi", pos: "MDC", age: 22, ovr: 74, pot: 78 },
        { name: "Houssem Mansour", pos: "MOD", age: 24, ovr: 76, pot: 79 },
        { name: "Yassine Sassi", pos: "MOG", age: 27, ovr: 77, pot: 77 },
        { name: "Saddam Yahia", pos: "BT", age: 32, ovr: 78, pot: 78 }, // Vétéran star
        { name: "Aymen Ghenaimi", pos: "BT", age: 25, ovr: 76, pot: 79 },
        { name: "Khaled Khelil", pos: "MOC", age: 23, ovr: 75, pot: 80 },
        { name: "Amir Abid", pos: "BT", age: 21, ovr: 73, pot: 81 }
    ],
    // ==========================================
    // TUNISIE (LIGUE 1 PRO) - PARTIE 2/2
    // ==========================================

    "AS Marsa": [ // Club historique de la banlieue de Tunis (74 - 78)
        { name: "Wael Kordi", pos: "G", age: 29, ovr: 76, pot: 76 },
        { name: "Zied Jebali", pos: "G", age: 33, ovr: 77, pot: 77 },
        { name: "Othman Karoui", pos: "DC", age: 28, ovr: 75, pot: 77 },
        { name: "Seifeddine Kanzari", pos: "DC", age: 34, ovr: 76, pot: 76 },
        { name: "Omar Bouraoui", pos: "DD", age: 30, ovr: 75, pot: 75 },
        { name: "Amine Khaloufi", pos: "DG", age: 25, ovr: 74, pot: 78 },
        { name: "Hichem Nagguez", pos: "DC", age: 22, ovr: 73, pot: 79 },
        { name: "Nidhal Ben Salem", pos: "MDC", age: 27, ovr: 76, pot: 77 },
        { name: "Bahaeddine Sellami", pos: "MC", age: 26, ovr: 75, pot: 78 },
        { name: "Aymen Ammous", pos: "MC", age: 24, ovr: 74, pot: 79 },
        { name: "Houssem Habbassi", pos: "MOC", age: 28, ovr: 77, pot: 77 },
        { name: "Farouk Mimouni", pos: "MOG", age: 23, ovr: 75, pot: 80 },
        { name: "Sadok Kadida", pos: "MOD", age: 21, ovr: 74, pot: 81 },
        { name: "Moataz Ben Ali", pos: "MDC", age: 20, ovr: 72, pot: 80 },
        { name: "Nassim Chachia", pos: "BT", age: 27, ovr: 78, pot: 79 },
        { name: "Othmane Saidi", pos: "BT", age: 31, ovr: 76, pot: 76 },
        { name: "Hassan Jaziri", pos: "BT", age: 22, ovr: 74, pot: 80 },
        { name: "Slim Jendoubi", pos: "MOC", age: 25, ovr: 75, pot: 78 }
    ],

    "ES Métlaoui": [ // Club du bassin minier, difficile à battre à domicile (74 - 78)
        { name: "Abdessalem Haloui", pos: "G", age: 34, ovr: 77, pot: 77 },
        { name: "Hazem Khlij", pos: "G", age: 24, ovr: 73, pot: 78 },
        { name: "Hachem Abbas", pos: "DC", age: 37, ovr: 76, pot: 76 }, // Vétéran
        { name: "Chamseddine Nerier", pos: "DC", age: 25, ovr: 75, pot: 79 },
        { name: "Hamza Rabii", pos: "DG", age: 26, ovr: 74, pot: 77 },
        { name: "Riadh Frioui", pos: "DD", age: 28, ovr: 75, pot: 76 },
        { name: "Afif Jebali", pos: "DC", age: 23, ovr: 73, pot: 78 },
        { name: "Rami Baccouche", pos: "MDC", age: 33, ovr: 76, pot: 76 },
        { name: "Cedric Gbo", pos: "MDC", age: 22, ovr: 75, pot: 82 },
        { name: "Zied Baccouche", pos: "MC", age: 34, ovr: 77, pot: 77 },
        { name: "Alaeddine Gmach", pos: "MOC", age: 28, ovr: 75, pot: 76 },
        { name: "Amine Khelil", pos: "MOG", age: 25, ovr: 74, pot: 77 },
        { name: "Bassel Trabelsi", pos: "MOD", age: 24, ovr: 75, pot: 79 },
        { name: "Hazem Mastouri", pos: "BT", age: 27, ovr: 78, pot: 79 },
        { name: "Boubacar Diarra", pos: "BT", age: 29, ovr: 77, pot: 77 },
        { name: "Yassine Majdi", pos: "BT", age: 21, ovr: 73, pot: 80 },
        { name: "Saber Hammami", pos: "MC", age: 26, ovr: 74, pot: 76 },
        { name: "Mohamed Hachemi", pos: "DG", age: 22, ovr: 72, pot: 78 }
    ],

    "US Tataouine": [ // Club du Sud (74 - 78)
        { name: "Aziz Sellami", pos: "G", age: 28, ovr: 76, pot: 77 },
        { name: "Yassine Pegari", pos: "G", age: 23, ovr: 73, pot: 79 },
        { name: "Thameur Salhi", pos: "DC", age: 31, ovr: 77, pot: 77 },
        { name: "Wassim Zaghdoud", pos: "DC", age: 30, ovr: 76, pot: 76 },
        { name: "Fourat Soltani", pos: "DD", age: 25, ovr: 74, pot: 78 },
        { name: "Kouni Khalfa", pos: "DG", age: 27, ovr: 75, pot: 77 },
        { name: "Mohamed Amine Khemiri", pos: "DC", age: 24, ovr: 73, pot: 78 },
        { name: "Mahmoud Messai", pos: "MDC", age: 30, ovr: 76, pot: 76 },
        { name: "Edem Boulila", pos: "MDC", age: 24, ovr: 75, pot: 80 },
        { name: "Moumen Rahmani", pos: "MC", age: 26, ovr: 74, pot: 78 },
        { name: "Ghassen Khalfa", pos: "MOC", age: 28, ovr: 76, pot: 77 },
        { name: "Wadhah Zaidi", pos: "MOD", age: 25, ovr: 75, pot: 79 },
        { name: "Oussema Boughanmi", pos: "MOG", age: 34, ovr: 77, pot: 77 }, // Vétéran
        { name: "Saber Hammami", pos: "BT", age: 26, ovr: 76, pot: 78 },
        { name: "Alia Sylla", pos: "BT", age: 24, ovr: 75, pot: 81 },
        { name: "Zied Baccouche", pos: "BT", age: 21, ovr: 73, pot: 80 },
        { name: "Nader Ghandri", pos: "MC", age: 22, ovr: 74, pot: 79 },
        { name: "Houssem Louati", pos: "MOD", age: 29, ovr: 75, pot: 75 }
    ],

    "AS Soliman": [ // Équipe accrocheuse du Cap Bon (74 - 78)
        { name: "Bahaeddine Othman", pos: "G", age: 28, ovr: 76, pot: 77 },
        { name: "Yassine Rihane", pos: "G", age: 22, ovr: 73, pot: 79 },
        { name: "Fares Meskini", pos: "DC", age: 27, ovr: 76, pot: 78 },
        { name: "Mohamed Habib Yaken", pos: "DC", age: 30, ovr: 75, pot: 75 },
        { name: "Oussama Hichri", pos: "DD", age: 24, ovr: 74, pot: 79 },
        { name: "Ghassen Mahersi", pos: "DG", age: 26, ovr: 75, pot: 78 },
        { name: "Rayane Yaakoubi", pos: "DC", age: 21, ovr: 73, pot: 80 },
        { name: "Elvis Baffour", pos: "MDC", age: 25, ovr: 77, pot: 81 },
        { name: "Youssef Mosrati", pos: "MC", age: 24, ovr: 76, pot: 81 },
        { name: "Bilel Hammami", pos: "MDC", age: 26, ovr: 75, pot: 77 },
        { name: "Mouldi Hanachi", pos: "MOC", age: 28, ovr: 76, pot: 76 },
        { name: "Bernard Babacar", pos: "MOD", age: 25, ovr: 75, pot: 78 },
        { name: "Seddik Mejri", pos: "MOG", age: 29, ovr: 76, pot: 76 },
        { name: "Roche Foning", pos: "BT", age: 24, ovr: 77, pot: 82 },
        { name: "Wassim Naghmouchi", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Mohamed Ali Ben Hammouda", pos: "BT", age: 23, ovr: 74, pot: 80 },
        { name: "Anes Brini", pos: "MC", age: 21, ovr: 73, pot: 79 },
        { name: "Malek Jammali", pos: "MOD", age: 20, ovr: 72, pot: 81 }
    ],

    "JS Kairouan": [ // Club Historique JSK (74 - 79)
        { name: "Ali Kalai", pos: "G", age: 38, ovr: 77, pot: 77 },
        { name: "Nedim Thabet", pos: "G", age: 25, ovr: 74, pot: 78 },
        { name: "Bahaeddine Romdhani", pos: "DC", age: 27, ovr: 76, pot: 78 },
        { name: "Houssem Bnina", pos: "DC", age: 30, ovr: 75, pot: 75 },
        { name: "Amine Abbas", pos: "DG", age: 34, ovr: 76, pot: 76 },
        { name: "Safouane Ben Salem", pos: "DD", age: 31, ovr: 75, pot: 75 },
        { name: "Ahmed Ammar", pos: "DC", age: 26, ovr: 74, pot: 77 },
        { name: "Skander Zayed", pos: "MDC", age: 26, ovr: 77, pot: 79 },
        { name: "Oussama Bouguerra", pos: "MC", age: 25, ovr: 78, pot: 82 },
        { name: "Sabri Zaidi", pos: "MOC", age: 28, ovr: 76, pot: 77 },
        { name: "Mohamed Aouichi", pos: "MDC", age: 29, ovr: 75, pot: 75 },
        { name: "Yassine Salhi", pos: "MOG", age: 33, ovr: 76, pot: 76 },
        { name: "Louay Dahnous", pos: "MOD", age: 23, ovr: 75, pot: 80 },
        { name: "Lamjed Ameur", pos: "BT", age: 34, ovr: 77, pot: 77 },
        { name: "Yassine Chikhaoui", pos: "BT", age: 26, ovr: 76, pot: 78 },
        { name: "Zied Baccouche", pos: "BT", age: 21, ovr: 73, pot: 81 },
        { name: "Walid Bouzidi", pos: "MC", age: 22, ovr: 74, pot: 79 },
        { name: "Moutiaa Choutri", pos: "MOD", age: 24, ovr: 74, pot: 78 }
    ],

    "CS Hammam-Lif": [ // CSHL, Historique banlieue Sud (74 - 78)
        { name: "Ali Gasmi", pos: "G", age: 30, ovr: 76, pot: 76 },
        { name: "Rayen Yacoubi", pos: "G", age: 22, ovr: 72, pot: 78 },
        { name: "Mahmoud Laadhibi", pos: "DC", age: 32, ovr: 76, pot: 76 },
        { name: "Fares Meskini", pos: "DC", age: 28, ovr: 75, pot: 76 },
        { name: "Louay Zarrouk", pos: "DG", age: 26, ovr: 75, pot: 78 },
        { name: "Amine Khelil", pos: "DD", age: 29, ovr: 74, pot: 74 },
        { name: "Saber Hammami", pos: "DC", age: 23, ovr: 73, pot: 79 },
        { name: "Kacem Ouni", pos: "MDC", age: 26, ovr: 76, pot: 78 },
        { name: "Mohamed Khaldoun", pos: "MC", age: 25, ovr: 75, pot: 77 },
        { name: "Firas Sekkouhi", pos: "MOC", age: 28, ovr: 75, pot: 76 },
        { name: "Zied Ben Salem", pos: "MDC", age: 31, ovr: 74, pot: 74 },
        { name: "Othmane Saidi", pos: "MOG", age: 31, ovr: 76, pot: 76 },
        { name: "Seddik Mejri", pos: "MOD", age: 29, ovr: 75, pot: 75 },
        { name: "Antar Jemaa", pos: "BT", age: 32, ovr: 77, pot: 77 },
        { name: "Rabii Bouzid", pos: "BT", age: 27, ovr: 75, pot: 76 },
        { name: "Malek Jammali", pos: "BT", age: 21, ovr: 72, pot: 79 },
        { name: "Ghaith Sghaier", pos: "MC", age: 28, ovr: 76, pot: 77 },
        { name: "Houssem Habbassi", pos: "MOD", age: 27, ovr: 75, pot: 76 }
    ],

    "ES Zarzis": [ // Club du Sud ESZ (74 - 78)
        { name: "Sadok Yeddes", pos: "G", age: 25, ovr: 76, pot: 81 },
        { name: "Wael Kordi", pos: "G", age: 29, ovr: 74, pot: 74 },
        { name: "Zied Boughattas", pos: "DC", age: 33, ovr: 77, pot: 77 },
        { name: "Malek Bhar", pos: "DC", age: 28, ovr: 75, pot: 77 },
        { name: "Ghaith Maaloul", pos: "DD", age: 27, ovr: 76, pot: 78 },
        { name: "Wael Belghali", pos: "DG", age: 26, ovr: 74, pot: 76 },
        { name: "Rayane Derbali", pos: "DC", age: 21, ovr: 73, pot: 80 },
        { name: "Youssef Mosrati", pos: "MDC", age: 24, ovr: 76, pot: 81 },
        { name: "Moez Ben Abid", pos: "MC", age: 30, ovr: 75, pot: 75 },
        { name: "Slim Ben Belgacem", pos: "MC", age: 34, ovr: 76, pot: 76 }, // Vétéran
        { name: "Hassan Dridi", pos: "MOC", age: 25, ovr: 75, pot: 78 },
        { name: "Alaeddine Gmach", pos: "MOG", age: 28, ovr: 76, pot: 77 },
        { name: "Ayoub Ben Tarcha", pos: "MOD", age: 26, ovr: 75, pot: 77 },
        { name: "Youssef Snana", pos: "BT", age: 20, ovr: 74, pot: 83 }, // Pépite
        { name: "Aymen Ghenaimi", pos: "BT", age: 25, ovr: 75, pot: 78 },
        { name: "Hazem Mastouri", pos: "BT", age: 27, ovr: 76, pot: 77 },
        { name: "Alia Sylla", pos: "BT", age: 24, ovr: 74, pot: 78 },
        { name: "Fares Meskini", pos: "MDC", age: 28, ovr: 74, pot: 75 }
    ],

    "AS Rejiche": [ // Révélation de ces dernières années (73 - 77)
        { name: "Achraf Krir", pos: "G", age: 32, ovr: 77, pot: 77 },
        { name: "Zied Jebali", pos: "G", age: 33, ovr: 75, pot: 75 },
        { name: "Marouane Saidi", pos: "DC", age: 30, ovr: 76, pot: 76 },
        { name: "Wael Ben Othman", pos: "DC", age: 28, ovr: 75, pot: 76 },
        { name: "Aymen Zbidi", pos: "DD", age: 27, ovr: 74, pot: 76 },
        { name: "Mohamed Amine Ben Hmida", pos: "DG", age: 26, ovr: 75, pot: 77 },
        { name: "Malek Bhar", pos: "DC", age: 28, ovr: 74, pot: 75 },
        { name: "Anis Khedher", pos: "MDC", age: 32, ovr: 76, pot: 76 },
        { name: "Moez Hadj Ali", pos: "MC", age: 25, ovr: 75, pot: 78 },
        { name: "Houssem Souissi", pos: "MOC", age: 26, ovr: 74, pot: 77 },
        { name: "Nidhal Ben Salem", pos: "MDC", age: 27, ovr: 75, pot: 76 },
        { name: "Oussama Boughanmi", pos: "MOG", age: 33, ovr: 76, pot: 76 },
        { name: "Malek Jammali", pos: "MOD", age: 23, ovr: 74, pot: 79 },
        { name: "Nidhal Laifi", pos: "BT", age: 26, ovr: 76, pot: 77 },
        { name: "Aboubakar Diarra", pos: "BT", age: 29, ovr: 75, pot: 75 },
        { name: "Amine Ghabi", pos: "BT", age: 22, ovr: 73, pot: 79 },
        { name: "Atef Dkhili", pos: "G", age: 34, ovr: 74, pot: 74 },
        { name: "Hazem Khlij", pos: "MOC", age: 24, ovr: 73, pot: 78 }
    ],

    "Stade Gabèsien": [ // Le Stayla, rude à domicile (74 - 78)
        { name: "Salah Othmani", pos: "G", age: 29, ovr: 76, pot: 76 },
        { name: "Wassim Ghozzi", pos: "G", age: 23, ovr: 73, pot: 78 },
        { name: "Hachem Abbas", pos: "DC", age: 37, ovr: 77, pot: 77 },
        { name: "Akrem Ben Sassi", pos: "DC", age: 32, ovr: 76, pot: 76 },
        { name: "Ali Machani", pos: "DD", age: 30, ovr: 75, pot: 75 },
        { name: "Bassem Boulaabi", pos: "DG", age: 35, ovr: 75, pot: 75 },
        { name: "Fourat Soltani", pos: "DC", age: 25, ovr: 74, pot: 78 },
        { name: "Youssef Fouzai", pos: "MDC", age: 36, ovr: 77, pot: 77 },
        { name: "Ahmed Ammar", pos: "MC", age: 26, ovr: 75, pot: 78 },
        { name: "Michailou Dramé", pos: "MOC", age: 32, ovr: 76, pot: 76 },
        { name: "Zied Baccouche", pos: "MDC", age: 34, ovr: 75, pot: 75 },
        { name: "Isam Omrani", pos: "MOG", age: 30, ovr: 75, pot: 75 },
        { name: "Issam Trabelsi", pos: "MOD", age: 27, ovr: 74, pot: 76 },
        { name: "Hichem Essifi", pos: "BT", age: 37, ovr: 77, pot: 77 }, // Vétéran
        { name: "Lamjed Ameur", pos: "BT", age: 34, ovr: 76, pot: 76 },
        { name: "Alia Sylla", pos: "BT", age: 24, ovr: 74, pot: 79 },
        { name: "Saber Hammami", pos: "MC", age: 26, ovr: 73, pot: 75 },
        { name: "Ahmed Hosni", pos: "MOG", age: 34, ovr: 75, pot: 75 }
    ],

    "CO Médenine": [ // Bas de tableau / Promu (73 - 77)
        { name: "Nadim Thabet", pos: "G", age: 25, ovr: 75, pot: 79 },
        { name: "Yassine Pegari", pos: "G", age: 23, ovr: 72, pot: 77 },
        { name: "Othman Karoui", pos: "DC", age: 28, ovr: 76, pot: 77 },
        { name: "Houssem Bnina", pos: "DC", age: 30, ovr: 75, pot: 75 },
        { name: "Ayoub Chagra", pos: "DD", age: 25, ovr: 74, pot: 77 },
        { name: "Hamza Rabii", pos: "DG", age: 26, ovr: 74, pot: 76 },
        { name: "Rami Baccouche", pos: "DC", age: 33, ovr: 74, pot: 74 },
        { name: "Aymen Zbidi", pos: "MDC", age: 27, ovr: 75, pot: 76 },
        { name: "Nader Jerbi", pos: "MC", age: 24, ovr: 74, pot: 79 },
        { name: "Saber Dhaouadi", pos: "MDC", age: 22, ovr: 73, pot: 78 },
        { name: "Zied Ben Salem", pos: "MOC", age: 31, ovr: 75, pot: 75 },
        { name: "Louay Dahnous", pos: "MOG", age: 23, ovr: 74, pot: 79 },
        { name: "Ali Amri", pos: "MOD", age: 27, ovr: 75, pot: 75 },
        { name: "Yassine Salhi", pos: "BT", age: 33, ovr: 76, pot: 76 },
        { name: "Mohamed Jomaa", pos: "BT", age: 26, ovr: 75, pot: 76 },
        { name: "Aymen Ghenaimi", pos: "BT", age: 25, ovr: 74, pot: 78 },
        { name: "Hassan Dridi", pos: "MC", age: 25, ovr: 73, pot: 76 },
        { name: "Chadi Derbali", pos: "MOD", age: 21, ovr: 72, pot: 79 }
    ],
    // ==========================================
    // ALGÉRIE (LIGUE 1) - PARTIE 1/2
    // ==========================================

    "CR Belouizdad": [ // Top Club (81 - 85) - Quintuple champion récent
        { name: "Alexis Guendouz", pos: "G", age: 28, ovr: 84, pot: 84 },
        { name: "Redouane Maachou", pos: "G", age: 23, ovr: 78, pot: 83 },
        { name: "Chouaib Keddad", pos: "DC", age: 29, ovr: 84, pot: 84 },
        { name: "Mouad Hadded", pos: "DC", age: 27, ovr: 82, pot: 83 },
        { name: "Mokhtar Belkhiter", pos: "DD", age: 32, ovr: 83, pot: 83 },
        { name: "Youcef Laouafi", pos: "DG", age: 28, ovr: 82, pot: 82 },
        { name: "Houssem Mrezigue", pos: "MDC", age: 24, ovr: 85, pot: 88 }, // Star au milieu
        { name: "Houcine Selmi", pos: "MC", age: 31, ovr: 82, pot: 82 },
        { name: "Abderraouf Benguit", pos: "MC", age: 28, ovr: 83, pot: 83 },
        { name: "Akram Bouras", pos: "MDC", age: 22, ovr: 81, pot: 86 },
        { name: "Ishak Boussouf", pos: "MOD", age: 22, ovr: 82, pot: 87 },
        { name: "Abderrahmane Meziane", pos: "MOG", age: 30, ovr: 84, pot: 84 },
        { name: "Leonel Wamba", pos: "BT", age: 21, ovr: 82, pot: 87 },
        { name: "Oussama Darfalou", pos: "BT", age: 30, ovr: 81, pot: 81 },
        { name: "Aymen Bouguerra", pos: "DD", age: 27, ovr: 80, pot: 80 },
        { name: "Mohamed Islam Belkhir", pos: "MOG", age: 23, ovr: 80, pot: 84 },
        { name: "Lamine Jallow", pos: "BT", age: 28, ovr: 81, pot: 81 },
        { name: "Islam Boutiche", pos: "MDC", age: 24, ovr: 79, pot: 83 }
    ],

    "MC Alger": [ // Top Club (81 - 85) - Doyen historique, très gros budget
        { name: "Oussama Litim", pos: "G", age: 33, ovr: 82, pot: 82 },
        { name: "Abdelkader Salhi", pos: "G", age: 31, ovr: 80, pot: 80 },
        { name: "Djamel Benlamri", pos: "DC", age: 34, ovr: 84, pot: 84 }, // Vétéran star
        { name: "Ayoub Abdellaoui", pos: "DC", age: 31, ovr: 85, pot: 85 },
        { name: "Réda Halaïmia", pos: "DD", age: 27, ovr: 83, pot: 83 },
        { name: "Hamza Mouali", pos: "DG", age: 26, ovr: 82, pot: 83 },
        { name: "Ayoub Ghezala", pos: "DC", age: 28, ovr: 81, pot: 81 },
        { name: "Badreddine Touki", pos: "MDC", age: 24, ovr: 81, pot: 84 },
        { name: "Mohamed Zougrana", pos: "MC", age: 22, ovr: 83, pot: 87 },
        { name: "Khlifni Hassan Khodja", pos: "MC", age: 23, ovr: 79, pot: 83 },
        { name: "Khalid Dahamni", pos: "MOC", age: 24, ovr: 80, pot: 84 },
        { name: "Fathallah Tahahar", pos: "MOD", age: 30, ovr: 81, pot: 81 },
        { name: "Youcef Belaïli", pos: "MOG", age: 32, ovr: 86, pot: 86 }, // Superstar du championnat
        { name: "Zakaria Naidji", pos: "BT", age: 29, ovr: 84, pot: 84 },
        { name: "Sofiane Bayazid", pos: "BT", age: 27, ovr: 82, pot: 82 },
        { name: "Kheireddine Merzougui", pos: "BT", age: 31, ovr: 80, pot: 80 },
        { name: "Mehdi Boucherit", pos: "MOD", age: 20, ovr: 77, pot: 85 },
        { name: "Larbi Tabti", pos: "MOC", age: 31, ovr: 81, pot: 81 }
    ],

    "USM Alger": [ // Top Club (80 - 85) - Vainqueur Coupe de la CAF récent
        { name: "Oussama Benbot", pos: "G", age: 29, ovr: 85, pot: 85 },
        { name: "Kamel Soufi", pos: "G", age: 27, ovr: 78, pot: 80 },
        { name: "Zineddine Belaïd", pos: "DC", age: 25, ovr: 85, pot: 88 }, // Star défensive
        { name: "Hocine Dehiri", pos: "DC", age: 23, ovr: 80, pot: 85 },
        { name: "Saâdi Radouani", pos: "DD", age: 29, ovr: 84, pot: 84 },
        { name: "Ilyes Chetti", pos: "DG", age: 29, ovr: 83, pot: 83 },
        { name: "Adem Alilet", pos: "DC", age: 25, ovr: 81, pot: 84 },
        { name: "Oussama Chita", pos: "MDC", age: 27, ovr: 83, pot: 83 },
        { name: "Brahim Benzaza", pos: "MC", age: 27, ovr: 84, pot: 84 },
        { name: "Salim Boukhenchouche", pos: "MC", age: 32, ovr: 81, pot: 81 },
        { name: "Omar Embarek", pos: "MDC", age: 25, ovr: 80, pot: 83 },
        { name: "Abdelkrim Zouari", pos: "MOC", age: 34, ovr: 81, pot: 81 },
        { name: "Tumisang Orebonye", pos: "MOD", age: 28, ovr: 82, pot: 82 },
        { name: "Ismaïl Belkacemi", pos: "MOG", age: 30, ovr: 84, pot: 84 },
        { name: "Abdoulaye Kanou", pos: "BT", age: 23, ovr: 82, pot: 86 },
        { name: "Smail Bacha", pos: "BT", age: 23, ovr: 79, pot: 84 },
        { name: "Khaled Bousseliou", pos: "MOG", age: 26, ovr: 81, pot: 82 },
        { name: "Mohamed Ait El Hadj", pos: "MOC", age: 22, ovr: 80, pot: 86 }
    ],

    "JS Kabylie": [ // Historique, JSK (79 - 83)
        { name: "Chamseddine Rahmani", pos: "G", age: 33, ovr: 82, pot: 82 },
        { name: "Fares Boukerrit", pos: "G", age: 26, ovr: 78, pot: 80 },
        { name: "Badr-Eddine Souyad", pos: "DC", age: 28, ovr: 82, pot: 82 },
        { name: "Tarek Bouhakak", pos: "DC", age: 30, ovr: 80, pot: 80 },
        { name: "Oussama Gatal", pos: "DD", age: 27, ovr: 80, pot: 81 },
        { name: "Ahmed Mammeri", pos: "DG", age: 26, ovr: 81, pot: 83 },
        { name: "Moussa Benzaid", pos: "DC", age: 25, ovr: 79, pot: 82 },
        { name: "Ali Amriche", pos: "MDC", age: 25, ovr: 80, pot: 83 },
        { name: "Mohamed Reda Boumechra", pos: "MC", age: 26, ovr: 81, pot: 82 },
        { name: "Ayoub Ait-Atmane", pos: "MDC", age: 24, ovr: 78, pot: 82 },
        { name: "Adem Redjem", pos: "MOC", age: 27, ovr: 81, pot: 81 },
        { name: "Koceila Boualia", pos: "MOD", age: 23, ovr: 84, pot: 88 }, // Grande pépite
        { name: "Dadi El Hocine Mouaki", pos: "MOG", age: 27, ovr: 83, pot: 83 },
        { name: "Massinissa Nait Salem", pos: "MOD", age: 23, ovr: 79, pot: 84 },
        { name: "Redouane Berkane", pos: "BT", age: 21, ovr: 79, pot: 85 },
        { name: "Essang Matouti", pos: "BT", age: 20, ovr: 78, pot: 86 },
        { name: "Faïk Amrane", pos: "MC", age: 26, ovr: 79, pot: 81 },
        { name: "Lahlou Akhrib", pos: "BT", age: 19, ovr: 76, pot: 84 }
    ],

    "ES Sétif": [ // Historique, L'Aigle Noir (79 - 83)
        { name: "Zakaria Saidi", pos: "G", age: 27, ovr: 80, pot: 82 },
        { name: "Tarek Bousseder", pos: "G", age: 24, ovr: 77, pot: 81 },
        { name: "Drice Chaabi", pos: "DC", age: 25, ovr: 80, pot: 83 },
        { name: "Tarek Aggoun", pos: "DC", age: 26, ovr: 79, pot: 81 },
        { name: "Mohamed Khadir", pos: "DD", age: 34, ovr: 79, pot: 79 },
        { name: "Belkacem Brahimi", pos: "DG", age: 30, ovr: 80, pot: 80 },
        { name: "Abdelkrim Nemdil", pos: "DC", age: 34, ovr: 78, pot: 78 },
        { name: "Amir Yahia", pos: "MDC", age: 23, ovr: 78, pot: 84 },
        { name: "Nassim Yettou", pos: "MC", age: 32, ovr: 81, pot: 81 },
        { name: "Salam Jiddou", pos: "MC", age: 24, ovr: 82, pot: 86 },
        { name: "Salah Eddine Bouchama", pos: "MDC", age: 24, ovr: 79, pot: 82 },
        { name: "Walid Zamoum", pos: "MOD", age: 24, ovr: 80, pot: 83 },
        { name: "Aimen Lahmeri", pos: "MOG", age: 27, ovr: 82, pot: 82 },
        { name: "Abdelmalek Oukil", pos: "MOG", age: 27, ovr: 80, pot: 80 },
        { name: "Aoued Nouri", pos: "MOC", age: 23, ovr: 79, pot: 84 },
        { name: "Souleymane Coulibaly", pos: "BT", age: 34, ovr: 80, pot: 80 },
        { name: "Giles Guenaoui", pos: "BT", age: 25, ovr: 81, pot: 83 },
        { name: "Abdelaziz Askar", pos: "BT", age: 20, ovr: 76, pot: 84 }
    ],

    "CS Constantine": [ // Sanafir, très régulier (79 - 83)
        { name: "Zakaria Bouhalfaya", pos: "G", age: 26, ovr: 82, pot: 84 },
        { name: "Bahaeddine Khalfaoui", pos: "G", age: 24, ovr: 77, pot: 81 },
        { name: "Mohamed Amine Madani", pos: "DC", age: 31, ovr: 83, pot: 83 },
        { name: "Seifeddine Zaâlani", pos: "DC", age: 31, ovr: 81, pot: 81 },
        { name: "Amir Belaili", pos: "DD", age: 33, ovr: 80, pot: 80 },
        { name: "Houari Baouche", pos: "DG", age: 28, ovr: 81, pot: 81 },
        { name: "Oussama Meddahi", pos: "DD", age: 33, ovr: 78, pot: 78 },
        { name: "Ghilas Guenaoui", pos: "MDC", age: 25, ovr: 80, pot: 83 },
        { name: "Chamseddine Derradji", pos: "DG", age: 31, ovr: 79, pot: 79 },
        { name: "Messaid Bouabta", pos: "MDC", age: 32, ovr: 81, pot: 81 },
        { name: "Messibah Benchaira", pos: "MC", age: 34, ovr: 82, pot: 82 },
        { name: "Brahim Dib", pos: "MOC", age: 30, ovr: 84, pot: 84 }, // Maître à jouer
        { name: "Chekal Affari", pos: "MC", age: 21, ovr: 79, pot: 85 },
        { name: "Zakaria Khaldi", pos: "MOD", age: 28, ovr: 82, pot: 82 },
        { name: "Abdennour Belhocini", pos: "MOG", age: 27, ovr: 81, pot: 81 },
        { name: "Mounder Temine", pos: "BT", age: 22, ovr: 80, pot: 85 },
        { name: "Enow Nkembe", pos: "BT", age: 24, ovr: 79, pot: 83 },
        { name: "Ahmed Khaldi", pos: "MOD", age: 25, ovr: 80, pot: 82 }
    ],

    "JS Saoura": [ // Club du Sud, solide à domicile (78 - 82)
        { name: "Walid Ouabdi", pos: "G", age: 29, ovr: 81, pot: 81 },
        { name: "Zakaria Haidous", pos: "G", age: 25, ovr: 76, pot: 80 },
        { name: "Merouane Khelif", pos: "DC", age: 24, ovr: 81, pot: 85 },
        { name: "Riyane Akacem", pos: "DC", age: 25, ovr: 80, pot: 83 },
        { name: "Khaled Bouziani", pos: "DG", age: 26, ovr: 79, pot: 81 },
        { name: "Mohamed Amrane", pos: "DD", age: 29, ovr: 79, pot: 79 },
        { name: "Adel Benamar", pos: "DC", age: 27, ovr: 78, pot: 80 },
        { name: "Adel Bouchiba", pos: "MDC", age: 35, ovr: 80, pot: 80 },
        { name: "Abdeldjalil Saâd", pos: "MC", age: 32, ovr: 81, pot: 81 },
        { name: "Moslah Taib", pos: "MDC", age: 21, ovr: 77, pot: 83 },
        { name: "Amine Hammia", pos: "MOC", age: 26, ovr: 80, pot: 81 },
        { name: "Oussama Bellatreche", pos: "MOG", age: 28, ovr: 81, pot: 81 },
        { name: "Ismail Fettouhi", pos: "MOD", age: 25, ovr: 79, pot: 82 },
        { name: "Aimen Lahmeri", pos: "MOD", age: 27, ovr: 81, pot: 81 },
        { name: "Mohamed El Amine Hammia", pos: "BT", age: 32, ovr: 82, pot: 82 },
        { name: "Mohamed Souibaâh", pos: "BT", age: 32, ovr: 80, pot: 80 },
        { name: "Oussama Amiri", pos: "BT", age: 22, ovr: 78, pot: 84 },
        { name: "Ayoub Farhi", pos: "MC", age: 24, ovr: 79, pot: 82 }
    ],

    "Paradou AC": [ // Académie de jeunes talents (75 - 80 / POT très élevé)
        { name: "Toufik Moussaoui", pos: "G", age: 33, ovr: 81, pot: 81 }, // Vétéran pour encadrer
        { name: "Mokhtar Ferhi", pos: "G", age: 22, ovr: 75, pot: 82 },
        { name: "Youcef Douar", pos: "DC", age: 26, ovr: 79, pot: 82 },
        { name: "Abdallah Bendouma", pos: "DC", age: 22, ovr: 77, pot: 85 },
        { name: "Ahmed Ait Abdesslem", pos: "DD", age: 21, ovr: 76, pot: 84 },
        { name: "Abdelhak Bouzida", pos: "DG", age: 20, ovr: 75, pot: 83 },
        { name: "Idir Mokrani", pos: "DC", age: 20, ovr: 74, pot: 84 },
        { name: "Jaber Kaassis", pos: "MDC", age: 21, ovr: 78, pot: 86 },
        { name: "Yacine Titraoui", pos: "MC", age: 20, ovr: 81, pot: 89 }, // La pépite algérienne
        { name: "Abderrahmane Tahri", pos: "MC", age: 23, ovr: 77, pot: 83 },
        { name: "Moncef Bounaas", pos: "MOC", age: 21, ovr: 76, pot: 85 },
        { name: "Adil Boulbina", pos: "MOG", age: 20, ovr: 79, pot: 88 }, // Grosse pépite offensive
        { name: "Djawed Djaou", pos: "MOD", age: 19, ovr: 75, pot: 85 },
        { name: "Aimen Bouderbal", pos: "MDC", age: 21, ovr: 74, pot: 82 },
        { name: "Ben Ahmed Kohili", pos: "BT", age: 18, ovr: 74, pot: 87 },
        { name: "Mostafa Touloum", pos: "BT", age: 19, ovr: 73, pot: 84 },
        { name: "Hicham Belaid", pos: "BT", age: 21, ovr: 75, pot: 81 },
        { name: "Aimen Sais", pos: "MOG", age: 22, ovr: 76, pot: 83 }
    ],

    "ASO Chlef": [ // Mid-Table solide, récent vainqueur Coupe (76 - 80)
        { name: "Kacem Soufi", pos: "G", age: 28, ovr: 79, pot: 79 },
        { name: "Mohamed Alaoui", pos: "G", age: 25, ovr: 75, pot: 78 },
        { name: "Abderrahmane Abada", pos: "DC", age: 24, ovr: 78, pot: 82 },
        { name: "Abderrahim Hamra", pos: "DC", age: 26, ovr: 77, pot: 80 },
        { name: "Ayoub Debbari", pos: "DD", age: 29, ovr: 78, pot: 78 },
        { name: "Chemseddine Nessakh", pos: "DG", age: 36, ovr: 78, pot: 78 }, // Vétéran
        { name: "Ahmed Kerroum", pos: "DC", age: 23, ovr: 76, pot: 81 },
        { name: "Abdelkader Boussaid", pos: "MDC", age: 32, ovr: 79, pot: 79 },
        { name: "Ayoub Zenasni", pos: "MDC", age: 26, ovr: 77, pot: 80 },
        { name: "Ibrahim Farhi", pos: "MC", age: 26, ovr: 78, pot: 81 },
        { name: "Toufik Addadi", pos: "MOC", age: 33, ovr: 80, pot: 80 },
        { name: "Yacine Aliane", pos: "MOD", age: 25, ovr: 79, pot: 82 },
        { name: "Abderrahmane Bounoua", pos: "MOG", age: 25, ovr: 78, pot: 80 },
        { name: "Nidhal Moulay", pos: "MOG", age: 22, ovr: 75, pot: 81 },
        { name: "Evra Agbagno", pos: "BT", age: 23, ovr: 80, pot: 84 }, // Buteur puissant
        { name: "Yacine Belarbi", pos: "BT", age: 22, ovr: 76, pot: 82 },
        { name: "Juma Chuka", pos: "BT", age: 28, ovr: 78, pot: 78 },
        { name: "Mohamed Achour", pos: "DD", age: 22, ovr: 75, pot: 79 }
    ],

    "MC Oran": [ // Club Historique MCO, racheté récemment (77 - 81)
        { name: "Oussama Della Krachai", pos: "G", age: 26, ovr: 80, pot: 83 },
        { name: "Fares Boukerrit", pos: "G", age: 26, ovr: 77, pot: 80 },
        { name: "Mohamed Naamani", pos: "DC", age: 34, ovr: 81, pot: 81 },
        { name: "Ahmed Kerroum", pos: "DC", age: 23, ovr: 78, pot: 82 },
        { name: "Abdelkader Khadir", pos: "DD", age: 34, ovr: 79, pot: 79 },
        { name: "Djamel Ibouzidene", pos: "DG", age: 30, ovr: 78, pot: 78 },
        { name: "Abdelhakim Nehari", pos: "DC", age: 25, ovr: 77, pot: 81 },
        { name: "Hafid Benamara", pos: "MDC", age: 28, ovr: 80, pot: 80 },
        { name: "Amine Chadli", pos: "MDC", age: 22, ovr: 76, pot: 82 },
        { name: "Aymen Benbelaid", pos: "MC", age: 26, ovr: 79, pot: 82 },
        { name: "Rayane Senhadji", pos: "MC", age: 27, ovr: 78, pot: 79 },
        { name: "Marouane Dahar", pos: "MOC", age: 31, ovr: 80, pot: 80 },
        { name: "Zoubir Motrani", pos: "MOG", age: 28, ovr: 79, pot: 79 },
        { name: "Hocine Aoued", pos: "MOD", age: 25, ovr: 78, pot: 81 },
        { name: "Maxwell Baakoh", pos: "MOD", age: 28, ovr: 81, pot: 81 },
        { name: "Riad Benayad", pos: "BT", age: 27, ovr: 82, pot: 83 }, // Top attaquant
        { name: "Walid Ardji", pos: "BT", age: 28, ovr: 79, pot: 79 },
        { name: "Merouane Siam", pos: "BT", age: 24, ovr: 77, pot: 81 }
    ],
    // ==========================================
    // ALGÉRIE (LIGUE 1) - PARTIE 2/2
    // ==========================================

    "US Biskra": [ // Milieu de Tableau / Sud (75 - 79)
        { name: "Oussama Mellala", pos: "G", age: 26, ovr: 78, pot: 80 },
        { name: "Abderrahmane Amri", pos: "G", age: 24, ovr: 74, pot: 78 },
        { name: "Adel Lakhdari", pos: "DC", age: 34, ovr: 79, pot: 79 }, // Vétéran solide
        { name: "Nacereddine Khoualed", pos: "DC", age: 38, ovr: 77, pot: 77 },
        { name: "Aymen Charef", pos: "DD", age: 25, ovr: 76, pot: 79 },
        { name: "Bilal Boukarroum", pos: "DG", age: 29, ovr: 77, pot: 77 },
        { name: "Tarek Adouane", pos: "DC", age: 26, ovr: 75, pot: 78 },
        { name: "Hatem Dakhia", pos: "MDC", age: 32, ovr: 78, pot: 78 },
        { name: "Nizar Thamer", pos: "MDC", age: 24, ovr: 76, pot: 81 },
        { name: "Mustapha Zeghnoun", pos: "MC", age: 32, ovr: 77, pot: 77 },
        { name: "Merouane Boussalem", pos: "MOC", age: 27, ovr: 78, pot: 79 },
        { name: "Ali Amriche", pos: "MC", age: 25, ovr: 76, pot: 80 },
        { name: "Riad Wael Rahmoun", pos: "MOG", age: 23, ovr: 77, pot: 82 },
        { name: "Laid Saidi", pos: "MOD", age: 24, ovr: 76, pot: 81 },
        { name: "Mohamed Baâli", pos: "BT", age: 24, ovr: 78, pot: 82 },
        { name: "Amine Bouziane", pos: "BT", age: 28, ovr: 77, pot: 78 },
        { name: "Oussama Khelifi", pos: "BT", age: 22, ovr: 75, pot: 80 },
        { name: "Abdelkader Ghorab", pos: "MOG", age: 27, ovr: 76, pot: 77 }
    ],

    "NC Magra": [ // Maintien / Milieu de Tableau (75 - 79)
        { name: "Salaheddine Cherfi", pos: "G", age: 25, ovr: 77, pot: 80 },
        { name: "Mohamed Tayeb", pos: "G", age: 28, ovr: 75, pot: 76 },
        { name: "Hamida Ziane", pos: "DC", age: 30, ovr: 78, pot: 78 },
        { name: "Ayoub Derbal", pos: "DC", age: 23, ovr: 75, pot: 80 },
        { name: "Abderrezak Kibboua", pos: "DD", age: 26, ovr: 76, pot: 78 },
        { name: "Chemseddine Lakehal", pos: "DG", age: 24, ovr: 75, pot: 79 },
        { name: "Khaled Bouhakak", pos: "DC", age: 29, ovr: 76, pot: 77 },
        { name: "Fouad Haddad", pos: "MDC", age: 33, ovr: 78, pot: 78 },
        { name: "Yasser Belaribi", pos: "MC", age: 25, ovr: 76, pot: 79 },
        { name: "Abdessamed Bounoua", pos: "MDC", age: 27, ovr: 77, pot: 78 },
        { name: "Ammar El Orfi", pos: "MOC", age: 31, ovr: 78, pot: 78 },
        { name: "Karm Benkouider", pos: "MC", age: 22, ovr: 74, pot: 80 },
        { name: "Bouzid Dadache", pos: "MOD", age: 29, ovr: 77, pot: 77 },
        { name: "Abdelhakim Amokrane", pos: "MOG", age: 30, ovr: 78, pot: 78 },
        { name: "Nadjib Kemoukh", pos: "BT", age: 25, ovr: 77, pot: 81 },
        { name: "Hamza Demane", pos: "BT", age: 34, ovr: 78, pot: 78 }, // Vétéran attaquant
        { name: "Redouane Bounoua", pos: "BT", age: 24, ovr: 75, pot: 80 },
        { name: "Youcef Chibane", pos: "MOD", age: 35, ovr: 76, pot: 76 }
    ],

    "USM Khenchela": [ // Solide promu devenu régulier (76 - 80)
        { name: "Sofiane Khedairia", pos: "G", age: 34, ovr: 80, pot: 80 }, // Gardien d'expérience
        { name: "Oussama Filali", pos: "G", age: 25, ovr: 76, pot: 80 },
        { name: "Abdelhakim Sameur", pos: "DC", age: 33, ovr: 79, pot: 79 },
        { name: "Nabil Saâdou", pos: "DC", age: 34, ovr: 79, pot: 79 },
        { name: "Oussama Kaddour", pos: "DD", age: 26, ovr: 78, pot: 81 },
        { name: "Oussama Gatal", pos: "DG", age: 27, ovr: 77, pot: 79 },
        { name: "Hamza Rebiai", pos: "DC", age: 30, ovr: 77, pot: 77 },
        { name: "Mohamed Yacine Athmani", pos: "MDC", age: 32, ovr: 78, pot: 78 },
        { name: "Farid Daoud", pos: "MDC", age: 34, ovr: 79, pot: 79 },
        { name: "Chakib Berrouba", pos: "MC", age: 24, ovr: 76, pot: 81 },
        { name: "Hichem El Kaddour", pos: "MOC", age: 25, ovr: 77, pot: 80 },
        { name: "Abdeljalil Semahi", pos: "MC", age: 29, ovr: 78, pot: 78 },
        { name: "Tosin Omoyele", pos: "MOD", age: 27, ovr: 79, pot: 79 },
        { name: "Ilyes Yaiche", pos: "MOG", age: 26, ovr: 80, pot: 81 },
        { name: "Sofiane Bayazid", pos: "BT", age: 27, ovr: 79, pot: 80 },
        { name: "Amine Ghodbane", pos: "BT", age: 26, ovr: 77, pot: 79 },
        { name: "Lahouari Touil", pos: "BT", age: 32, ovr: 78, pot: 78 },
        { name: "Maxime Baakoh", pos: "MOD", age: 26, ovr: 78, pot: 80 }
    ],

    "ES Ben Aknoun": [ // Promu, lutte pour le maintien (74 - 78)
        { name: "Tarek Bousseder", pos: "G", age: 24, ovr: 76, pot: 81 },
        { name: "Fares Boukassoula", pos: "G", age: 29, ovr: 74, pot: 74 },
        { name: "Zidane Mebarakou", pos: "DC", age: 35, ovr: 78, pot: 78 }, // Vétéran
        { name: "Abdelkrim Oukali", pos: "DC", age: 26, ovr: 75, pot: 78 },
        { name: "Ayoub Ghezala", pos: "DD", age: 28, ovr: 76, pot: 77 },
        { name: "Rayane Hachoud", pos: "DG", age: 23, ovr: 74, pot: 79 },
        { name: "Ali Haddouche", pos: "DC", age: 25, ovr: 74, pot: 77 },
        { name: "Yacine Deghmani", pos: "MDC", age: 31, ovr: 76, pot: 76 },
        { name: "Amine Benbelaid", pos: "MC", age: 31, ovr: 77, pot: 77 },
        { name: "Riad Dehar", pos: "MDC", age: 24, ovr: 74, pot: 78 },
        { name: "Zoubir Daoudi", pos: "MOC", age: 27, ovr: 76, pot: 77 },
        { name: "Billel Benhammouda", pos: "MC", age: 26, ovr: 75, pot: 76 },
        { name: "Hadj Bouguèche", pos: "MOG", age: 40, ovr: 75, pot: 75 }, // Légende inépuisable
        { name: "Ali Haroun", pos: "MOD", age: 27, ovr: 77, pot: 78 },
        { name: "Yacine Aliane", pos: "BT", age: 25, ovr: 78, pot: 81 },
        { name: "Hichem Mokhtar", pos: "BT", age: 32, ovr: 76, pot: 76 },
        { name: "Amine Zaouche", pos: "BT", age: 22, ovr: 73, pot: 78 },
        { name: "Mohamed Bouziane", pos: "MOD", age: 24, ovr: 75, pot: 79 }
    ],

    "MC El Bayadh": [ // Équipe surprise du Sud-Ouest (76 - 80)
        { name: "Abdelkader Morcely", pos: "G", age: 28, ovr: 79, pot: 81 },
        { name: "Aimen Bouziani", pos: "G", age: 24, ovr: 74, pot: 79 },
        { name: "Belaid Kouar", pos: "DC", age: 34, ovr: 78, pot: 78 },
        { name: "Ismail Ouchen", pos: "DC", age: 26, ovr: 77, pot: 80 },
        { name: "Azzedine Berriah", pos: "DD", age: 25, ovr: 76, pot: 80 },
        { name: "Kheireddine Aliouat", pos: "DG", age: 28, ovr: 77, pot: 78 },
        { name: "Adel Amaouche", pos: "DC", age: 24, ovr: 75, pot: 79 },
        { name: "Djamel Belalem", pos: "MDC", age: 30, ovr: 78, pot: 78 },
        { name: "Kamel Belmiloud", pos: "MC", age: 26, ovr: 77, pot: 80 },
        { name: "Walid Allati", pos: "MDC", age: 32, ovr: 77, pot: 77 },
        { name: "Abdelilah Barkat", pos: "MOC", age: 27, ovr: 78, pot: 79 },
        { name: "Mounir Belhaidja", pos: "MC", age: 22, ovr: 75, pot: 81 },
        { name: "Riad Belhadj", pos: "MOG", age: 25, ovr: 77, pot: 80 },
        { name: "Ramzi Tenah", pos: "MOD", age: 23, ovr: 76, pot: 81 },
        { name: "Kamal Belarbi", pos: "BT", age: 26, ovr: 79, pot: 81 },
        { name: "Mounir Aichi", pos: "BT", age: 31, ovr: 77, pot: 77 },
        { name: "Abdelkader Ghorab", pos: "BT", age: 27, ovr: 78, pot: 79 },
        { name: "Amine Toumi", pos: "MOD", age: 21, ovr: 74, pot: 80 }
    ],

    "JS d'El Biar": [ // Club amateur/promu historique d'Alger (73 - 77)
        { name: "Amine Zemmamouche", pos: "G", age: 39, ovr: 77, pot: 77 }, // Retour du vétéran
        { name: "Ilyes Meziane", pos: "G", age: 23, ovr: 72, pot: 76 },
        { name: "Hamza Zeddam", pos: "DC", age: 40, ovr: 75, pot: 75 },
        { name: "Rafik Khelifi", pos: "DC", age: 26, ovr: 74, pot: 76 },
        { name: "Omar Boukous", pos: "DD", age: 28, ovr: 75, pot: 76 },
        { name: "Sofiane Bouterbiat", pos: "DG", age: 29, ovr: 74, pot: 74 },
        { name: "Mehdi Ouadfel", pos: "DC", age: 22, ovr: 72, pot: 77 },
        { name: "Karim Hendou", pos: "MDC", age: 37, ovr: 76, pot: 76 },
        { name: "Farid Bellabès", pos: "MC", age: 35, ovr: 75, pot: 75 },
        { name: "Nassim Yettou", pos: "MOC", age: 32, ovr: 76, pot: 76 },
        { name: "Yanis Bounoua", pos: "MDC", age: 21, ovr: 73, pot: 79 },
        { name: "Reda Betrouni", pos: "MC", age: 30, ovr: 74, pot: 74 },
        { name: "Sid Ali Yahia-Chérif", pos: "MOG", age: 39, ovr: 76, pot: 76 },
        { name: "Oussama Khelil", pos: "MOD", age: 25, ovr: 75, pot: 78 },
        { name: "Amine Touahri", pos: "BT", age: 34, ovr: 75, pot: 75 },
        { name: "Adem Zorgane", pos: "BT", age: 20, ovr: 72, pot: 79 },
        { name: "Lamine Abid", pos: "BT", age: 32, ovr: 76, pot: 76 },
        { name: "Hamza Zaidi", pos: "MOG", age: 27, ovr: 74, pot: 75 }
    ],

    "RC Arbaâ": [ // L'Ezzerga, équipe rugueuse (73 - 77)
        { name: "Chouia Chouia", pos: "G", age: 31, ovr: 75, pot: 75 },
        { name: "Ahmed Merzouki", pos: "G", age: 24, ovr: 73, pot: 77 },
        { name: "Salim Brahimi", pos: "DC", age: 32, ovr: 76, pot: 76 },
        { name: "Mustapha Ouznadji", pos: "DC", age: 28, ovr: 75, pot: 76 },
        { name: "Tarek Boutebba", pos: "DD", age: 27, ovr: 74, pot: 75 },
        { name: "Ilyes Sidhoum", pos: "DG", age: 33, ovr: 75, pot: 75 },
        { name: "Farès Hamouche", pos: "DC", age: 25, ovr: 74, pot: 77 },
        { name: "Abdelhakim Djerar", pos: "MDC", age: 33, ovr: 76, pot: 76 },
        { name: "Yacine Medane", pos: "MC", age: 30, ovr: 75, pot: 75 },
        { name: "Bilal Rait", pos: "MDC", age: 35, ovr: 74, pot: 74 },
        { name: "Bouazza Feham", pos: "MOC", age: 38, ovr: 76, pot: 76 }, // Vétéran meneur
        { name: "Aimen Bouguerra", pos: "MC", age: 26, ovr: 75, pot: 78 },
        { name: "Mohamed Taib", pos: "MOG", age: 29, ovr: 75, pot: 75 },
        { name: "Ghislain Guessan", pos: "MOD", age: 31, ovr: 76, pot: 76 },
        { name: "Oussama Kismoun", pos: "BT", age: 27, ovr: 76, pot: 77 },
        { name: "Hichem Nekkache", pos: "BT", age: 33, ovr: 75, pot: 75 },
        { name: "Fares Benabderrahmane", pos: "BT", age: 24, ovr: 74, pot: 79 },
        { name: "Amir Bouguettaya", pos: "MOD", age: 22, ovr: 73, pot: 78 }
    ],

    "NA Hussein Dey": [ // Historique NAHD, le sang et or (74 - 78)
        { name: "Gaya Merbah", pos: "G", age: 29, ovr: 79, pot: 79 }, // Retour pour relancer le club
        { name: "Imad Benhamou", pos: "G", age: 22, ovr: 73, pot: 78 },
        { name: "Lyes Oukkal", pos: "DC", age: 32, ovr: 77, pot: 77 },
        { name: "Kosseila Kasdi", pos: "DC", age: 27, ovr: 76, pot: 78 },
        { name: "Mohamed Herida", pos: "DD", age: 33, ovr: 75, pot: 75 },
        { name: "Mounir Ait L'Hadi", pos: "DG", age: 28, ovr: 76, pot: 77 },
        { name: "Mehdi Abid", pos: "DC", age: 23, ovr: 74, pot: 79 },
        { name: "Housseyn Selmi", pos: "MDC", age: 31, ovr: 78, pot: 78 },
        { name: "Mourad Benayad", pos: "MC", age: 33, ovr: 76, pot: 76 },
        { name: "Faouzi Yaya", pos: "MOC", age: 34, ovr: 77, pot: 77 },
        { name: "Ilyes Benyoucef", pos: "MC", age: 29, ovr: 76, pot: 77 },
        { name: "Nassim Benaissa", pos: "MDC", age: 24, ovr: 75, pot: 80 },
        { name: "Walid Ardji", pos: "MOD", age: 28, ovr: 77, pot: 77 },
        { name: "Mustapha Zeghnoun", pos: "MOG", age: 32, ovr: 75, pot: 75 },
        { name: "Rachid Nadji", pos: "BT", age: 35, ovr: 76, pot: 76 },
        { name: "Abdelraouf Chouiter", pos: "BT", age: 29, ovr: 77, pot: 77 },
        { name: "Hamza Banouh", pos: "BT", age: 34, ovr: 75, pot: 75 },
        { name: "Rafik Khelifi", pos: "MOG", age: 21, ovr: 73, pot: 79 }
    ],

    "JSM Béjaïa": [ // Historique JSMB, les Vert et Rouge (74 - 78)
        { name: "Yacine Djabaret", pos: "G", age: 35, ovr: 76, pot: 76 },
        { name: "Sofiane Kacem", pos: "G", age: 27, ovr: 74, pot: 75 },
        { name: "Zidane Mebarakou", pos: "DC", age: 35, ovr: 77, pot: 77 }, // Retour au bercail
        { name: "Maamar Youcef", pos: "DC", age: 34, ovr: 76, pot: 76 },
        { name: "Amine Khellaf", pos: "DD", age: 26, ovr: 75, pot: 78 },
        { name: "Nassim Oussad", pos: "DG", age: 28, ovr: 74, pot: 76 },
        { name: "Fares Benmansour", pos: "DC", age: 22, ovr: 73, pot: 79 },
        { name: "Billel Rait", pos: "MDC", age: 35, ovr: 76, pot: 76 },
        { name: "Hocine Laribi", pos: "MC", age: 32, ovr: 75, pot: 75 },
        { name: "Zahir Zerdab", pos: "MOC", age: 40, ovr: 75, pot: 75 },
        { name: "Mohamed Lamine Bougherara", pos: "MDC", age: 24, ovr: 74, pot: 79 },
        { name: "Kamel Belmadi", pos: "MC", age: 27, ovr: 75, pot: 76 },
        { name: "Oussama Hicham", pos: "MOG", age: 25, ovr: 76, pot: 79 },
        { name: "Reda Bensayah", pos: "MOD", age: 29, ovr: 77, pot: 77 },
        { name: "Fawzi Rahal", pos: "BT", age: 38, ovr: 76, pot: 76 },
        { name: "Karim Aribi", pos: "BT", age: 29, ovr: 78, pot: 78 },
        { name: "Yanis Gourmi", pos: "BT", age: 21, ovr: 73, pot: 80 },
        { name: "Aimen Benabdi", pos: "MOD", age: 22, ovr: 74, pot: 78 }
    ],

    "USM El Harrach": [ // El Kawassir, stade mythique du 1er Novembre (74 - 78)
        { name: "Houssam Limane", pos: "G", age: 34, ovr: 77, pot: 77 },
        { name: "Abdelkrim Belhani", pos: "G", age: 24, ovr: 73, pot: 78 },
        { name: "Hamza Ziad", pos: "DC", age: 36, ovr: 76, pot: 76 },
        { name: "Ryad Kenniche", pos: "DC", age: 30, ovr: 77, pot: 77 },
        { name: "Ibrahim Benzerga", pos: "DD", age: 29, ovr: 75, pot: 75 },
        { name: "Ayoub Azzem", pos: "DG", age: 27, ovr: 74, pot: 76 },
        { name: "Mehdi Ouadfel", pos: "DC", age: 22, ovr: 73, pot: 78 },
        { name: "Hamza Ait Ouamar", pos: "MDC", age: 37, ovr: 77, pot: 77 },
        { name: "Billel Benaldjia", pos: "MC", age: 35, ovr: 75, pot: 75 },
        { name: "Abdelhakim Djerar", pos: "MC", age: 33, ovr: 76, pot: 76 },
        { name: "Ilyes Yaiche", pos: "MOC", age: 26, ovr: 78, pot: 80 },
        { name: "Oussama Abdat", pos: "MDC", age: 21, ovr: 74, pot: 79 },
        { name: "Lamine Abid", pos: "BT", age: 32, ovr: 77, pot: 77 }, // Retour du buteur
        { name: "Bouguèche Hadj", pos: "MOG", age: 40, ovr: 75, pot: 75 },
        { name: "Sofiane Younes", pos: "MOD", age: 41, ovr: 75, pot: 75 }, // Légende harrachi
        { name: "Hichem Nekkache", pos: "BT", age: 33, ovr: 76, pot: 76 },
        { name: "Youcef Chibane", pos: "BT", age: 35, ovr: 75, pot: 75 },
        { name: "Nassim Benaissa", pos: "MOD", age: 24, ovr: 74, pot: 78 }
    ],
    // ==========================================
    // SÉNÉGAL (LIGUE 1) - PARTIE 1/2
    // ==========================================

    "Génération Foot": [ // Académie mythique (partenaire FC Metz) - POT exceptionnels (70 - 74)
        { name: "Pape Mamadou Sy", pos: "G", age: 26, ovr: 73, pot: 76 },
        { name: "Ousmane Ba", pos: "G", age: 19, ovr: 68, pot: 84 },
        { name: "Cheikhou Ndiaye", pos: "DC", age: 21, ovr: 71, pot: 85 }, // Grosse pépite défensive
        { name: "Ousmane Diop", pos: "DC", age: 24, ovr: 72, pot: 77 },
        { name: "Mor Talla Fall", pos: "DD", age: 20, ovr: 70, pot: 82 },
        { name: "Khadim Diaw", pos: "DG", age: 25, ovr: 73, pot: 75 },
        { name: "Seydou Sano", pos: "DC", age: 19, ovr: 69, pot: 83 },
        { name: "Djibril Diarra", pos: "MDC", age: 20, ovr: 72, pot: 86 }, // Milieu très prometteur
        { name: "Moustapha Fall", pos: "MC", age: 23, ovr: 71, pot: 78 },
        { name: "Jean-Louis Barthélémy", pos: "MOC", age: 18, ovr: 68, pot: 87 },
        { name: "Lamine Gueye", pos: "MC", age: 25, ovr: 72, pot: 74 },
        { name: "Idrissa Gueye", pos: "MDC", age: 21, ovr: 70, pot: 80 },
        { name: "Amara Diouf", pos: "MOG", age: 16, ovr: 71, pot: 89 }, // La superstar en devenir
        { name: "Ibou Sané", pos: "MOD", age: 19, ovr: 70, pot: 85 },
        { name: "Malick Mbaye", pos: "BT", age: 20, ovr: 72, pot: 84 },
        { name: "Pape Amadou Diallo", pos: "MOG", age: 19, ovr: 71, pot: 85 },
        { name: "Ida Kéïta", pos: "BT", age: 22, ovr: 73, pot: 79 },
        { name: "Souleymane Basse", pos: "DG", age: 20, ovr: 69, pot: 81 }
    ],

    "Casa Sports": [ // Club historique de Ziguinchor, gros public (71 - 75)
        { name: "Alioune Badara Faty", pos: "G", age: 24, ovr: 74, pot: 79 },
        { name: "Pape Diatta Ndiaye", pos: "G", age: 27, ovr: 71, pot: 73 },
        { name: "Aliou Diatta", pos: "DC", age: 28, ovr: 74, pot: 74 },
        { name: "Mouhamed Camara", pos: "DC", age: 23, ovr: 72, pot: 78 },
        { name: "Abdoulaye Diedhiou", pos: "DD", age: 26, ovr: 73, pot: 75 },
        { name: "Mamadou Coly", pos: "DG", age: 25, ovr: 72, pot: 76 },
        { name: "Gérard Diémé", pos: "DC", age: 21, ovr: 69, pot: 77 },
        { name: "Moussa Marone", pos: "MDC", age: 28, ovr: 74, pot: 74 },
        { name: "Aimé Tendeng", pos: "MC", age: 24, ovr: 73, pot: 79 },
        { name: "Raymond Diémé", pos: "MOC", age: 26, ovr: 75, pot: 77 },
        { name: "Lamine Jarju", pos: "MOG", age: 22, ovr: 72, pot: 80 },
        { name: "Abdou Seydi", pos: "MC", age: 21, ovr: 70, pot: 76 },
        { name: "Aliou Badara Baldé", pos: "MOD", age: 25, ovr: 73, pot: 76 },
        { name: "Lamin Danfa", pos: "MOG", age: 23, ovr: 71, pot: 75 },
        { name: "Moussa Sagna", pos: "BT", age: 27, ovr: 74, pot: 74 },
        { name: "Assane Badji", pos: "BT", age: 20, ovr: 69, pot: 79 },
        { name: "Pape Macou Sarr", pos: "BT", age: 24, ovr: 72, pot: 77 },
        { name: "Yaya Sané", pos: "DD", age: 22, ovr: 70, pot: 75 }
    ],

    "Jaraaf": [ // Le club le plus titré, basé à Dakar (72 - 76)
        { name: "Cheikh Lo Ndoye", pos: "G", age: 31, ovr: 75, pot: 75 },
        { name: "Mamadou Sy", pos: "G", age: 23, ovr: 71, pot: 77 },
        { name: "Matar Kanté", pos: "DC", age: 32, ovr: 76, pot: 76 }, // Taulier
        { name: "Mamadou Ndiaye", pos: "DC", age: 25, ovr: 74, pot: 78 },
        { name: "Abdoulaye Faye", pos: "DD", age: 27, ovr: 73, pot: 75 },
        { name: "Pape Ndiaye Souaré", pos: "DG", age: 34, ovr: 75, pot: 75 }, // Retour au pays
        { name: "Jean-Rémi Bocandé", pos: "DC", age: 22, ovr: 71, pot: 78 },
        { name: "Ousmane Kane", pos: "MDC", age: 28, ovr: 75, pot: 75 },
        { name: "Gora Barry", pos: "MC", age: 26, ovr: 74, pot: 76 },
        { name: "Majid Sané", pos: "MDC", age: 24, ovr: 72, pot: 77 },
        { name: "Albert Diène", pos: "MOC", age: 25, ovr: 76, pot: 79 },
        { name: "Ababacar Sarr", pos: "MC", age: 21, ovr: 71, pot: 80 },
        { name: "Mohamed Niang", pos: "MOG", age: 27, ovr: 74, pot: 75 },
        { name: "El Hadji Kane", pos: "MOD", age: 23, ovr: 73, pot: 79 },
        { name: "Ameth Niang", pos: "BT", age: 25, ovr: 75, pot: 78 },
        { name: "Bouly Junior Sambou", pos: "BT", age: 25, ovr: 76, pot: 78 },
        { name: "Souleymane Cissé", pos: "BT", age: 20, ovr: 70, pot: 81 },
        { name: "Mor Ndiaye", pos: "MOG", age: 22, ovr: 72, pot: 76 }
    ],

    "Teungueth FC": [ // Champion récent, très solide (72 - 76)
        { name: "Marc Diouf", pos: "G", age: 26, ovr: 75, pot: 78 },
        { name: "Ibrahima Fall", pos: "G", age: 22, ovr: 70, pot: 76 },
        { name: "Moutarou Baldé", pos: "DD", age: 30, ovr: 76, pot: 76 }, // Excellent latéral
        { name: "Babacar Diop", pos: "DC", age: 28, ovr: 75, pot: 75 },
        { name: "Luke Sylva", pos: "DC", age: 24, ovr: 73, pot: 79 },
        { name: "Sidy Sow", pos: "DG", age: 27, ovr: 74, pot: 75 },
        { name: "Malick Ndoye", pos: "DC", age: 21, ovr: 71, pot: 78 },
        { name: "Paul Valère Bassène", pos: "MDC", age: 25, ovr: 74, pot: 77 },
        { name: "Abou Bakry Diop", pos: "MDC", age: 29, ovr: 75, pot: 75 },
        { name: "Fally Ndaw", pos: "MC", age: 23, ovr: 73, pot: 78 },
        { name: "Ousmane Sow", pos: "MOC", age: 26, ovr: 75, pot: 76 },
        { name: "Youssouf Diop", pos: "MC", age: 20, ovr: 70, pot: 80 },
        { name: "El Hadji Omar Fall", pos: "MOG", age: 28, ovr: 74, pot: 74 },
        { name: "Mouhamed Cissé", pos: "MOD", age: 22, ovr: 72, pot: 79 },
        { name: "Mbaye Jacques Ndiaye", pos: "BT", age: 21, ovr: 74, pot: 82 },
        { name: "Ousseynou Boye", pos: "BT", age: 27, ovr: 75, pot: 76 },
        { name: "Ibrahima Ciss", pos: "BT", age: 24, ovr: 73, pot: 77 },
        { name: "Pape Diagne", pos: "MOD", age: 25, ovr: 72, pot: 75 }
    ],

    "Diambars": [ // Autre académie historique (Saly) - POT énormes (68 - 73)
        { name: "Ousmane Kane", pos: "G", age: 22, ovr: 70, pot: 78 },
        { name: "Saliou Diouf", pos: "G", age: 18, ovr: 66, pot: 82 },
        { name: "Mbacou Lèye", pos: "DC", age: 20, ovr: 70, pot: 81 },
        { name: "Bacary Sané", pos: "DC", age: 19, ovr: 69, pot: 84 },
        { name: "El Hadji Guèye", pos: "DD", age: 21, ovr: 71, pot: 79 },
        { name: "Samba Diallo", pos: "DG", age: 20, ovr: 70, pot: 82 },
        { name: "Cheikh Mbacké", pos: "DC", age: 18, ovr: 67, pot: 83 },
        { name: "Elimane Cissé", pos: "MDC", age: 26, ovr: 73, pot: 75 }, // Encadre les jeunes
        { name: "Moustapha Ndiaye", pos: "MC", age: 19, ovr: 69, pot: 85 },
        { name: "Ismaël Bâ", pos: "MDC", age: 21, ovr: 70, pot: 80 },
        { name: "Pape Moustapha", pos: "MOC", age: 18, ovr: 68, pot: 86 },
        { name: "Arial Mendy", pos: "MC", age: 20, ovr: 71, pot: 81 },
        { name: "Ousseynou Niang", pos: "MOG", age: 22, ovr: 72, pot: 80 },
        { name: "Bamba Kane", pos: "MOD", age: 19, ovr: 69, pot: 84 },
        { name: "Malick Thiam", pos: "BT", age: 18, ovr: 68, pot: 87 }, // Grosse promesse
        { name: "Aliou Ba", pos: "BT", age: 21, ovr: 71, pot: 80 },
        { name: "Cheikh Faye", pos: "BT", age: 23, ovr: 72, pot: 77 },
        { name: "Moussa Kanouté", pos: "MOG", age: 20, ovr: 69, pot: 79 }
    ],

    "AS Pikine": [ // Club de la banlieue dakaroise, ferveur immense (71 - 75)
        { name: "Ibrahima Niass", pos: "G", age: 28, ovr: 74, pot: 74 },
        { name: "Lamine Thiam", pos: "G", age: 24, ovr: 70, pot: 75 },
        { name: "Baye Assane Cissé", pos: "DC", age: 30, ovr: 75, pot: 75 },
        { name: "Souleymane Diallo", pos: "DC", age: 26, ovr: 73, pot: 76 },
        { name: "Kader Fall", pos: "DD", age: 25, ovr: 72, pot: 76 },
        { name: "Ousmane Sarr", pos: "DG", age: 29, ovr: 73, pot: 73 },
        { name: "Pape Diakhaté", pos: "DC", age: 22, ovr: 70, pot: 77 },
        { name: "Thierno Dioum", pos: "MDC", age: 27, ovr: 74, pot: 75 },
        { name: "Ibrahima Ndiaye", pos: "MDC", age: 23, ovr: 72, pot: 78 },
        { name: "Mansour Bâ", pos: "MC", age: 25, ovr: 73, pot: 77 },
        { name: "Alassane Sylla", pos: "MOC", age: 29, ovr: 75, pot: 75 },
        { name: "El Hadj Ndao", pos: "MC", age: 21, ovr: 69, pot: 76 },
        { name: "Modou Ndiaye", pos: "MOG", age: 26, ovr: 74, pot: 75 },
        { name: "Ibrahima Faye", pos: "MOD", age: 24, ovr: 72, pot: 77 },
        { name: "Amadou Badiane", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Landing Sagna", pos: "BT", age: 23, ovr: 73, pot: 79 },
        { name: "Aliou Tamba", pos: "BT", age: 21, ovr: 70, pot: 78 },
        { name: "Mor Diaw", pos: "MOD", age: 25, ovr: 71, pot: 74 }
    ],

    "Guédiawaye FC": [ // L'autre grand club de banlieue, grand rival de Pikine (71 - 75)
        { name: "Ousmane Diagne", pos: "G", age: 27, ovr: 74, pot: 76 },
        { name: "Moussa Sarr", pos: "G", age: 21, ovr: 69, pot: 77 },
        { name: "Mamadou Seck", pos: "DC", age: 31, ovr: 75, pot: 75 },
        { name: "Sidy Barry", pos: "DC", age: 24, ovr: 72, pot: 77 },
        { name: "Youssoupha Ndiaye", pos: "DD", age: 28, ovr: 73, pot: 74 },
        { name: "Malick Fall", pos: "DG", age: 26, ovr: 74, pot: 76 },
        { name: "El Hadji Guèye", pos: "DC", age: 20, ovr: 70, pot: 79 },
        { name: "Djibril Cissé", pos: "MDC", age: 29, ovr: 74, pot: 74 },
        { name: "Pape Samb", pos: "MC", age: 25, ovr: 73, pot: 77 },
        { name: "Ousseynou Boye", pos: "MDC", age: 22, ovr: 71, pot: 78 },
        { name: "Gorgui Diop", pos: "MOC", age: 27, ovr: 75, pot: 76 },
        { name: "Khadim Diop", pos: "MC", age: 20, ovr: 69, pot: 76 },
        { name: "Saliou Ndoye", pos: "MOD", age: 25, ovr: 73, pot: 76 },
        { name: "Ismaïla Diop", pos: "MOG", age: 23, ovr: 72, pot: 79 },
        { name: "Amath Niang", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Moussa Sagna", pos: "BT", age: 24, ovr: 73, pot: 78 },
        { name: "Ibrahima Cissokho", pos: "BT", age: 20, ovr: 70, pot: 80 },
        { name: "Pape Macou", pos: "MOG", age: 26, ovr: 71, pot: 73 }
    ],

    "Dakar Sacré-Cœur": [ // Club partenaire de l'Olympique Lyonnais (69 - 73)
        { name: "Abdou Dieng", pos: "G", age: 23, ovr: 72, pot: 78 },
        { name: "Lamine Thiam", pos: "G", age: 19, ovr: 67, pot: 80 },
        { name: "Pape Diouf", pos: "DC", age: 21, ovr: 71, pot: 82 },
        { name: "Omar Ndiaye", pos: "DC", age: 24, ovr: 70, pot: 76 },
        { name: "Saliou Guèye", pos: "DD", age: 20, ovr: 69, pot: 80 },
        { name: "Moussa Ba", pos: "DG", age: 22, ovr: 71, pot: 77 },
        { name: "Issa Cissé", pos: "DC", age: 18, ovr: 66, pot: 83 },
        { name: "Mamadou Touré", pos: "MDC", age: 25, ovr: 73, pot: 76 },
        { name: "Amadou Sarr", pos: "MDC", age: 19, ovr: 68, pot: 84 },
        { name: "El Hadji Diallo", pos: "MC", age: 21, ovr: 70, pot: 81 },
        { name: "Ibrahima Sow", pos: "MOC", age: 20, ovr: 71, pot: 83 },
        { name: "Arouna Sy", pos: "MC", age: 22, ovr: 69, pot: 75 },
        { name: "Pape Ndiaye", pos: "MOG", age: 19, ovr: 70, pot: 85 },
        { name: "Modou Lô", pos: "MOD", age: 21, ovr: 71, pot: 79 },
        { name: "Cheikh Bamba", pos: "BT", age: 22, ovr: 72, pot: 80 },
        { name: "Youssouph Faye", pos: "BT", age: 19, ovr: 68, pot: 82 },
        { name: "Aliou Ba", pos: "BT", age: 24, ovr: 71, pot: 74 },
        { name: "Babacar Niang", pos: "MOD", age: 20, ovr: 68, pot: 77 }
    ],

    "Sonacos": [ // Le club de Diourbel, parrainé par l'industrie huilière (70 - 74)
        { name: "Mame Balla Diop", pos: "G", age: 28, ovr: 73, pot: 73 },
        { name: "Djibril Cissé", pos: "G", age: 23, ovr: 69, pot: 75 },
        { name: "Abdoul Karim Seck", pos: "DC", age: 30, ovr: 74, pot: 74 },
        { name: "Thierno Ndiaye", pos: "DC", age: 26, ovr: 72, pot: 75 },
        { name: "Mansour Niang", pos: "DD", age: 27, ovr: 71, pot: 73 },
        { name: "Ibrahima Coly", pos: "DG", age: 25, ovr: 72, pot: 76 },
        { name: "Moussa Sarr", pos: "DC", age: 22, ovr: 69, pot: 76 },
        { name: "Serigne Saliou Ndiaye", pos: "MDC", age: 29, ovr: 74, pot: 74 },
        { name: "Ameth Fall", pos: "MC", age: 25, ovr: 72, pot: 76 },
        { name: "Khadim Ndiaye", pos: "MDC", age: 23, ovr: 70, pot: 75 },
        { name: "Sidy Ndao", pos: "MOC", age: 26, ovr: 73, pot: 75 },
        { name: "Ibrahima Sène", pos: "MC", age: 21, ovr: 68, pot: 74 },
        { name: "Pape Badiane", pos: "MOG", age: 24, ovr: 72, pot: 77 },
        { name: "Modou Ndiaye", pos: "MOD", age: 25, ovr: 71, pot: 74 },
        { name: "Aliou Tamba", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Babacar Diop", pos: "BT", age: 22, ovr: 71, pot: 78 },
        { name: "Ndiouga Ndoye", pos: "BT", age: 24, ovr: 70, pot: 73 },
        { name: "Mactar Ndiaye", pos: "MOD", age: 26, ovr: 70, pot: 72 }
    ],

    "Linguère": [ // Le club phare de Saint-Louis (70 - 74)
        { name: "Moussa Diouf", pos: "G", age: 29, ovr: 74, pot: 74 },
        { name: "Ousmane Sarr", pos: "G", age: 22, ovr: 69, pot: 76 },
        { name: "Amadou Bâ", pos: "DC", age: 31, ovr: 74, pot: 74 },
        { name: "Souleymane Ndoye", pos: "DC", age: 25, ovr: 72, pot: 76 },
        { name: "Matar Fall", pos: "DD", age: 26, ovr: 71, pot: 74 },
        { name: "Alioune Seck", pos: "DG", age: 28, ovr: 73, pot: 73 },
        { name: "Daouda Guèye", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Ibrahima Ndoye", pos: "MDC", age: 27, ovr: 73, pot: 74 },
        { name: "Mansour Fall", pos: "MC", age: 24, ovr: 72, pot: 77 },
        { name: "Abdou Fall", pos: "MDC", age: 22, ovr: 70, pot: 76 },
        { name: "Mamadou Niang", pos: "MOC", age: 26, ovr: 74, pot: 76 },
        { name: "Pape Sarr", pos: "MC", age: 20, ovr: 69, pot: 78 },
        { name: "El Hadji Cissé", pos: "MOG", age: 25, ovr: 72, pot: 75 },
        { name: "Cheikh Diouf", pos: "MOD", age: 23, ovr: 71, pot: 77 },
        { name: "Ousmane Kane", pos: "BT", age: 27, ovr: 74, pot: 74 },
        { name: "Boubacar Fall", pos: "BT", age: 21, ovr: 70, pot: 79 },
        { name: "Kader Sarr", pos: "BT", age: 25, ovr: 72, pot: 75 },
        { name: "Ndiaga Ndiaye", pos: "MOG", age: 24, ovr: 70, pot: 74 }
    ],
    // ==========================================
    // SÉNÉGAL (LIGUE 1) - PARTIE 2/2
    // ==========================================

    "US Gorée": [ // Le club insulaire historique de Dakar (70 - 74)
        { name: "Ibrahima Ndiaye", pos: "G", age: 29, ovr: 74, pot: 74 },
        { name: "Pape Sarr", pos: "G", age: 23, ovr: 69, pot: 75 },
        { name: "Alassane Diallo", pos: "DC", age: 32, ovr: 74, pot: 74 },
        { name: "Mamadou Sy", pos: "DC", age: 26, ovr: 72, pot: 76 },
        { name: "Cheikh Guèye", pos: "DD", age: 27, ovr: 71, pot: 73 },
        { name: "Omar Ndao", pos: "DG", age: 25, ovr: 72, pot: 76 },
        { name: "Moussa Sène", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Ablaye Fall", pos: "MDC", age: 28, ovr: 73, pot: 73 },
        { name: "Moustapha Seck", pos: "MC", age: 24, ovr: 72, pot: 77 },
        { name: "Pape Ousmane Diop", pos: "MDC", age: 22, ovr: 70, pot: 76 },
        { name: "El Hadji Niang", pos: "MOC", age: 27, ovr: 73, pot: 74 },
        { name: "Modou Ndoye", pos: "MC", age: 20, ovr: 69, pot: 78 },
        { name: "Ousmane Kane", pos: "MOG", age: 25, ovr: 72, pot: 75 },
        { name: "Khadim Diouf", pos: "MOD", age: 23, ovr: 71, pot: 76 },
        { name: "Babacar Fall", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Ibrahima Ba", pos: "BT", age: 22, ovr: 71, pot: 79 },
        { name: "Sidy Tamba", pos: "BT", age: 25, ovr: 70, pot: 73 },
        { name: "Amath Cissé", pos: "MOD", age: 24, ovr: 70, pot: 75 }
    ],

    "Stade de Mbour": [ // Pilier de la Petite-Côte (70 - 74)
        { name: "Mamadou Diop", pos: "G", age: 27, ovr: 73, pot: 75 },
        { name: "Ousmane Guèye", pos: "G", age: 21, ovr: 68, pot: 76 },
        { name: "Ibrahima Cissokho", pos: "DC", age: 30, ovr: 74, pot: 74 },
        { name: "Pape Ndiaye", pos: "DC", age: 25, ovr: 71, pot: 75 },
        { name: "Moussa Fall", pos: "DD", age: 26, ovr: 70, pot: 73 },
        { name: "Alioune Sarr", pos: "DG", age: 24, ovr: 71, pot: 75 },
        { name: "Souleymane Ba", pos: "DC", age: 22, ovr: 69, pot: 74 },
        { name: "Amadou Diallo", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Cheikh Ndao", pos: "MC", age: 25, ovr: 72, pot: 76 },
        { name: "Modou Cissé", pos: "MDC", age: 23, ovr: 70, pot: 74 },
        { name: "El Hadji Sène", pos: "MOC", age: 28, ovr: 74, pot: 74 },
        { name: "Ibrahima Kane", pos: "MC", age: 20, ovr: 69, pot: 78 },
        { name: "Pape Diouf", pos: "MOG", age: 24, ovr: 72, pot: 76 },
        { name: "Ousmane Niang", pos: "MOD", age: 26, ovr: 71, pot: 73 },
        { name: "Babacar Ndiaye", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Moussa Sagna", pos: "BT", age: 23, ovr: 71, pot: 77 },
        { name: "Khadim Badiane", pos: "BT", age: 21, ovr: 69, pot: 76 },
        { name: "Ameth Tamba", pos: "MOG", age: 25, ovr: 70, pot: 74 }
    ],

    "Jamono Fatick": [ // Club du Sine-Saloum, rugueux (68 - 72)
        { name: "Cheikh Ba", pos: "G", age: 26, ovr: 71, pot: 74 },
        { name: "Ibrahima Diouf", pos: "G", age: 22, ovr: 67, pot: 73 },
        { name: "Ousmane Ndiaye", pos: "DC", age: 31, ovr: 73, pot: 73 },
        { name: "Moussa Guèye", pos: "DC", age: 24, ovr: 70, pot: 75 },
        { name: "Pape Sarr", pos: "DD", age: 25, ovr: 69, pot: 72 },
        { name: "Amadou Fall", pos: "DG", age: 27, ovr: 70, pot: 72 },
        { name: "Modou Sène", pos: "DC", age: 23, ovr: 68, pot: 74 },
        { name: "Babacar Diallo", pos: "MDC", age: 28, ovr: 72, pot: 72 },
        { name: "Alioune Cissé", pos: "MC", age: 26, ovr: 71, pot: 74 },
        { name: "El Hadji Kane", pos: "MDC", age: 21, ovr: 68, pot: 75 },
        { name: "Ibrahima Niang", pos: "MOC", age: 29, ovr: 73, pot: 73 },
        { name: "Souleymane Ndoye", pos: "MC", age: 20, ovr: 67, pot: 77 },
        { name: "Mamadou Diop", pos: "MOG", age: 25, ovr: 71, pot: 74 },
        { name: "Pape Ndao", pos: "MOD", age: 24, ovr: 70, pot: 73 },
        { name: "Ousmane Sagna", pos: "BT", age: 28, ovr: 72, pot: 72 },
        { name: "Khadim Fall", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Moussa Badiane", pos: "BT", age: 25, ovr: 69, pot: 72 },
        { name: "Cheikh Tamba", pos: "MOD", age: 23, ovr: 68, pot: 74 }
    ],

    "Ouakam": [ // US Ouakam, ferveur populaire à Dakar (71 - 75)
        { name: "Pape Ousmane Sarr", pos: "G", age: 28, ovr: 74, pot: 74 },
        { name: "Mamadou Fall", pos: "G", age: 23, ovr: 69, pot: 75 },
        { name: "Cheikh Diop", pos: "DC", age: 32, ovr: 75, pot: 75 },
        { name: "Ibrahima Ndiaye", pos: "DC", age: 26, ovr: 72, pot: 76 },
        { name: "Ousmane Guèye", pos: "DD", age: 27, ovr: 71, pot: 73 },
        { name: "Modou Cissé", pos: "DG", age: 25, ovr: 72, pot: 76 },
        { name: "Amadou Sène", pos: "DC", age: 22, ovr: 69, pot: 75 },
        { name: "Babacar Kane", pos: "MDC", age: 29, ovr: 74, pot: 74 },
        { name: "Alioune Diallo", pos: "MC", age: 24, ovr: 72, pot: 77 },
        { name: "El Hadji Ndoye", pos: "MDC", age: 21, ovr: 70, pot: 76 },
        { name: "Souleymane Niang", pos: "MOC", age: 28, ovr: 74, pot: 74 },
        { name: "Pape Diouf", pos: "MC", age: 20, ovr: 69, pot: 78 },
        { name: "Moussa Ndao", pos: "MOG", age: 25, ovr: 72, pot: 76 },
        { name: "Ibrahima Sagna", pos: "MOD", age: 26, ovr: 71, pot: 73 },
        { name: "Khadim Badiane", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Ousmane Tamba", pos: "BT", age: 23, ovr: 71, pot: 77 },
        { name: "Ameth Fall", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Cheikh Sarr", pos: "MOG", age: 24, ovr: 70, pot: 74 }
    ],

    "Ndiambour": [ // ASEC Ndiambour de Louga, club mythique (69 - 73)
        { name: "Moussa Diop", pos: "G", age: 27, ovr: 72, pot: 74 },
        { name: "Ibrahima Ndiaye", pos: "G", age: 22, ovr: 68, pot: 73 },
        { name: "Pape Sarr", pos: "DC", age: 31, ovr: 73, pot: 73 },
        { name: "Ousmane Guèye", pos: "DC", age: 25, ovr: 70, pot: 74 },
        { name: "Cheikh Fall", pos: "DD", age: 26, ovr: 69, pot: 72 },
        { name: "Amadou Cissé", pos: "DG", age: 28, ovr: 71, pot: 71 },
        { name: "Modou Sène", pos: "DC", age: 21, ovr: 67, pot: 75 },
        { name: "Babacar Kane", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Alioune Diallo", pos: "MC", age: 24, ovr: 71, pot: 76 },
        { name: "El Hadji Ndoye", pos: "MDC", age: 23, ovr: 69, pot: 73 },
        { name: "Souleymane Niang", pos: "MOC", age: 27, ovr: 72, pot: 74 },
        { name: "Pape Diouf", pos: "MC", age: 20, ovr: 68, pot: 76 },
        { name: "Moussa Ndao", pos: "MOG", age: 26, ovr: 71, pot: 73 },
        { name: "Ibrahima Sagna", pos: "MOD", age: 25, ovr: 70, pot: 74 },
        { name: "Khadim Badiane", pos: "BT", age: 28, ovr: 73, pot: 73 },
        { name: "Ousmane Tamba", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Ameth Fall", pos: "BT", age: 24, ovr: 69, pot: 73 },
        { name: "Cheikh Sarr", pos: "MOG", age: 23, ovr: 68, pot: 74 }
    ],

    "AS Douanes": [ // Équipe de la Douane, solide et expérimentée (72 - 76)
        { name: "Pape Diop", pos: "G", age: 30, ovr: 75, pot: 75 },
        { name: "Ibrahima Ndiaye", pos: "G", age: 24, ovr: 70, pot: 74 },
        { name: "Ousmane Guèye", pos: "DC", age: 33, ovr: 76, pot: 76 },
        { name: "Moussa Sarr", pos: "DC", age: 27, ovr: 73, pot: 75 },
        { name: "Cheikh Fall", pos: "DD", age: 28, ovr: 72, pot: 73 },
        { name: "Amadou Cissé", pos: "DG", age: 26, ovr: 73, pot: 76 },
        { name: "Modou Sène", pos: "DC", age: 22, ovr: 70, pot: 76 },
        { name: "Babacar Kane", pos: "MDC", age: 31, ovr: 75, pot: 75 },
        { name: "Alioune Diallo", pos: "MC", age: 25, ovr: 73, pot: 77 },
        { name: "El Hadji Ndoye", pos: "MDC", age: 23, ovr: 71, pot: 75 },
        { name: "Souleymane Niang", pos: "MOC", age: 29, ovr: 74, pot: 74 },
        { name: "Pape Diouf", pos: "MC", age: 21, ovr: 70, pot: 78 },
        { name: "Moussa Ndao", pos: "MOG", age: 27, ovr: 73, pot: 74 },
        { name: "Ibrahima Sagna", pos: "MOD", age: 26, ovr: 72, pot: 74 },
        { name: "Khadim Badiane", pos: "BT", age: 29, ovr: 75, pot: 75 },
        { name: "Ousmane Tamba", pos: "BT", age: 24, ovr: 72, pot: 77 },
        { name: "Ameth Fall", pos: "BT", age: 23, ovr: 71, pot: 75 },
        { name: "Cheikh Sarr", pos: "MOD", age: 25, ovr: 70, pot: 74 }
    ],

    "NGB Niary Tally": [ // Les "Galactiques" de Dakar, grand public (70 - 74)
        { name: "Ousmane Ndiaye", pos: "G", age: 28, ovr: 73, pot: 73 },
        { name: "Pape Diop", pos: "G", age: 22, ovr: 68, pot: 75 },
        { name: "Ibrahima Guèye", pos: "DC", age: 31, ovr: 74, pot: 74 },
        { name: "Moussa Sarr", pos: "DC", age: 25, ovr: 71, pot: 75 },
        { name: "Cheikh Fall", pos: "DD", age: 26, ovr: 70, pot: 73 },
        { name: "Amadou Cissé", pos: "DG", age: 27, ovr: 72, pot: 74 },
        { name: "Modou Sène", pos: "DC", age: 21, ovr: 68, pot: 76 },
        { name: "Babacar Kane", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Alioune Diallo", pos: "MC", age: 24, ovr: 72, pot: 77 },
        { name: "El Hadji Ndoye", pos: "MDC", age: 22, ovr: 70, pot: 75 },
        { name: "Souleymane Niang", pos: "MOC", age: 28, ovr: 73, pot: 73 },
        { name: "Pape Diouf", pos: "MC", age: 20, ovr: 69, pot: 78 },
        { name: "Moussa Ndao", pos: "MOG", age: 25, ovr: 72, pot: 76 },
        { name: "Ibrahima Sagna", pos: "MOD", age: 26, ovr: 71, pot: 73 },
        { name: "Khadim Badiane", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Ousmane Tamba", pos: "BT", age: 23, ovr: 71, pot: 77 },
        { name: "Ameth Fall", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Cheikh Sarr", pos: "MOG", age: 24, ovr: 70, pot: 74 }
    ],

    "Port Autonome": [ // Le club du Port de Dakar (69 - 73)
        { name: "Mamadou Diop", pos: "G", age: 27, ovr: 72, pot: 74 },
        { name: "Ibrahima Ndiaye", pos: "G", age: 21, ovr: 67, pot: 74 },
        { name: "Ousmane Guèye", pos: "DC", age: 32, ovr: 73, pot: 73 },
        { name: "Pape Sarr", pos: "DC", age: 26, ovr: 70, pot: 74 },
        { name: "Cheikh Fall", pos: "DD", age: 25, ovr: 69, pot: 73 },
        { name: "Amadou Cissé", pos: "DG", age: 28, ovr: 71, pot: 72 },
        { name: "Modou Sène", pos: "DC", age: 22, ovr: 68, pot: 75 },
        { name: "Babacar Kane", pos: "MDC", age: 30, ovr: 73, pot: 73 },
        { name: "Alioune Diallo", pos: "MC", age: 25, ovr: 71, pot: 75 },
        { name: "El Hadji Ndoye", pos: "MDC", age: 23, ovr: 69, pot: 74 },
        { name: "Souleymane Niang", pos: "MOC", age: 27, ovr: 72, pot: 74 },
        { name: "Pape Diouf", pos: "MC", age: 20, ovr: 68, pot: 76 },
        { name: "Moussa Ndao", pos: "MOG", age: 26, ovr: 71, pot: 73 },
        { name: "Ibrahima Sagna", pos: "MOD", age: 24, ovr: 70, pot: 75 },
        { name: "Khadim Badiane", pos: "BT", age: 29, ovr: 73, pot: 73 },
        { name: "Ousmane Tamba", pos: "BT", age: 23, ovr: 70, pot: 76 },
        { name: "Ameth Fall", pos: "BT", age: 22, ovr: 69, pot: 74 },
        { name: "Cheikh Sarr", pos: "MOG", age: 25, ovr: 69, pot: 73 }
    ],

    "Mbour Petite-Côte": [ // Autre figure de Mbour, club de coupe (69 - 73)
        { name: "Ousmane Diop", pos: "G", age: 26, ovr: 71, pot: 74 },
        { name: "Mamadou Ndiaye", pos: "G", age: 22, ovr: 68, pot: 73 },
        { name: "Ibrahima Guèye", pos: "DC", age: 30, ovr: 73, pot: 73 },
        { name: "Pape Sarr", pos: "DC", age: 25, ovr: 70, pot: 74 },
        { name: "Cheikh Fall", pos: "DD", age: 26, ovr: 69, pot: 72 },
        { name: "Amadou Cissé", pos: "DG", age: 27, ovr: 70, pot: 73 },
        { name: "Modou Sène", pos: "DC", age: 21, ovr: 67, pot: 75 },
        { name: "Babacar Kane", pos: "MDC", age: 29, ovr: 72, pot: 72 },
        { name: "Alioune Diallo", pos: "MC", age: 24, ovr: 71, pot: 76 },
        { name: "El Hadji Ndoye", pos: "MDC", age: 23, ovr: 69, pot: 74 },
        { name: "Souleymane Niang", pos: "MOC", age: 28, ovr: 72, pot: 73 },
        { name: "Pape Diouf", pos: "MC", age: 20, ovr: 68, pot: 77 },
        { name: "Moussa Ndao", pos: "MOG", age: 25, ovr: 71, pot: 75 },
        { name: "Ibrahima Sagna", pos: "MOD", age: 26, ovr: 70, pot: 72 },
        { name: "Khadim Badiane", pos: "BT", age: 28, ovr: 73, pot: 73 },
        { name: "Ousmane Tamba", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Ameth Fall", pos: "BT", age: 24, ovr: 69, pot: 74 },
        { name: "Cheikh Sarr", pos: "MOD", age: 23, ovr: 68, pot: 74 }
    ],

    "CNEPS": [ // CNEPS Excellence de Thiès (68 - 72)
        { name: "Mamadou Diop", pos: "G", age: 28, ovr: 72, pot: 72 },
        { name: "Ousmane Ndiaye", pos: "G", age: 21, ovr: 67, pot: 74 },
        { name: "Ibrahima Guèye", pos: "DC", age: 31, ovr: 73, pot: 73 },
        { name: "Pape Sarr", pos: "DC", age: 24, ovr: 69, pot: 75 },
        { name: "Cheikh Fall", pos: "DD", age: 25, ovr: 68, pot: 72 },
        { name: "Amadou Cissé", pos: "DG", age: 27, ovr: 70, pot: 72 },
        { name: "Modou Sène", pos: "DC", age: 22, ovr: 67, pot: 74 },
        { name: "Babacar Kane", pos: "MDC", age: 29, ovr: 72, pot: 72 },
        { name: "Alioune Diallo", pos: "MC", age: 25, ovr: 71, pot: 74 },
        { name: "El Hadji Ndoye", pos: "MDC", age: 21, ovr: 68, pot: 75 },
        { name: "Souleymane Niang", pos: "MOC", age: 26, ovr: 71, pot: 74 },
        { name: "Pape Diouf", pos: "MC", age: 20, ovr: 67, pot: 76 },
        { name: "Moussa Ndao", pos: "MOG", age: 24, ovr: 70, pot: 75 },
        { name: "Ibrahima Sagna", pos: "MOD", age: 25, ovr: 69, pot: 73 },
        { name: "Khadim Badiane", pos: "BT", age: 27, ovr: 72, pot: 72 },
        { name: "Ousmane Tamba", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Ameth Fall", pos: "BT", age: 23, ovr: 69, pot: 74 },
        { name: "Cheikh Sarr", pos: "MOG", age: 24, ovr: 68, pot: 73 }
    ],
    // ==========================================
    // NIGÉRIA (NPFL) - PARTIE 1/2
    // ==========================================

    "Enyimba FC": [ // "The People's Elephant", le géant nigérian, 2x vainqueur de la LDC (72 - 76)
        { name: "Olorunleke Ojo", pos: "G", age: 28, ovr: 76, pot: 76 },
        { name: "Ani Ozoemena", pos: "G", age: 24, ovr: 71, pot: 75 },
        { name: "Somiari Alalibo", pos: "DC", age: 26, ovr: 75, pot: 77 },
        { name: "Pascal Eze", pos: "DC", age: 23, ovr: 73, pot: 79 },
        { name: "Bilal Yakubu", pos: "DD", age: 25, ovr: 72, pot: 76 },
        { name: "Chigozie Chilekwu", pos: "DG", age: 27, ovr: 74, pot: 75 },
        { name: "Innocent Gabriel", pos: "DC", age: 22, ovr: 71, pot: 78 },
        { name: "Daniel Daga", pos: "MDC", age: 18, ovr: 71, pot: 86 }, // Grosse pépite nigériane
        { name: "Chibuike Nwaiwu", pos: "MDC", age: 21, ovr: 73, pot: 80 },
        { name: "Ikenna Cooper", pos: "MC", age: 26, ovr: 74, pot: 75 },
        { name: "Eze Ekwutoziam", pos: "MOC", age: 24, ovr: 75, pot: 79 },
        { name: "Alalibo Somiari", pos: "MC", age: 22, ovr: 72, pot: 77 },
        { name: "Joseph Atule", pos: "MOG", age: 23, ovr: 75, pot: 81 },
        { name: "Bernard Ovoke", pos: "MOD", age: 27, ovr: 74, pot: 74 },
        { name: "Chijioke Mbaoma", pos: "BT", age: 21, ovr: 76, pot: 83 }, // Buteur prolifique
        { name: "Chukwuemeka Obioma", pos: "BT", age: 25, ovr: 75, pot: 78 },
        { name: "Mujeeb Odufeso", pos: "BT", age: 24, ovr: 72, pot: 76 },
        { name: "Ifeanyi Ihemekwele", pos: "MOG", age: 20, ovr: 70, pot: 78 }
    ],

    "Remo Stars": [ // Club moderne (Ikenne), superbes infrastructures et académie (71 - 75)
        { name: "Kayode Bankole", pos: "G", age: 22, ovr: 74, pot: 81 },
        { name: "Charles Tambe", pos: "G", age: 29, ovr: 71, pot: 71 },
        { name: "Nduka Junior", pos: "DC", age: 23, ovr: 75, pot: 82 }, // Capitaine et roc défensif
        { name: "Ahmed Akinyele", pos: "DC", age: 25, ovr: 73, pot: 76 },
        { name: "Sodiq Ismail", pos: "DD", age: 21, ovr: 74, pot: 83 }, // Excellent passeur
        { name: "Seun Ogunribide", pos: "DG", age: 26, ovr: 73, pot: 75 },
        { name: "Victor Collins", pos: "DC", age: 24, ovr: 71, pot: 77 },
        { name: "Qudus Akanni", pos: "MDC", age: 22, ovr: 73, pot: 80 },
        { name: "Jide Fatokun", pos: "MC", age: 25, ovr: 74, pot: 76 },
        { name: "Dayo Ojo", pos: "MC", age: 29, ovr: 75, pot: 75 }, // Expérience au milieu
        { name: "Olamilekan Adedayo", pos: "MOC", age: 20, ovr: 71, pot: 79 },
        { name: "Tochukwu Michael", pos: "MDC", age: 24, ovr: 72, pot: 77 },
        { name: "Olamilekan Adams", pos: "MOG", age: 21, ovr: 74, pot: 81 },
        { name: "Sikiru Alimi", pos: "MOD", age: 28, ovr: 75, pot: 75 },
        { name: "Franck Mawuena", pos: "BT", age: 31, ovr: 74, pot: 74 }, // Togolais très physique
        { name: "Isaac James", pos: "BT", age: 23, ovr: 72, pot: 78 },
        { name: "Hadi Haruna", pos: "BT", age: 19, ovr: 69, pot: 80 },
        { name: "Samad Kadiri", pos: "MOD", age: 27, ovr: 72, pot: 72 }
    ],

    "Rivers United": [ // Club riche de Port Harcourt, régulier en Afrique (72 - 76)
        { name: "Victor Sochima", pos: "G", age: 25, ovr: 75, pot: 79 },
        { name: "Abiodun Akande", pos: "G", age: 30, ovr: 72, pot: 72 },
        { name: "Kazie Enyinnaya", pos: "DC", age: 26, ovr: 74, pot: 76 },
        { name: "Emmanuel Ampiah", pos: "DC", age: 26, ovr: 73, pot: 75 },
        { name: "Ebube Duru", pos: "DG", age: 24, ovr: 75, pot: 79 }, // Super latéral gauche
        { name: "Chigozie Ihunda", pos: "DD", age: 27, ovr: 72, pot: 73 },
        { name: "Temple Emekayi", pos: "DC", age: 24, ovr: 71, pot: 76 },
        { name: "Farouk Mohammed", pos: "MDC", age: 32, ovr: 76, pot: 76 }, // Taulier
        { name: "Joseph Onoja", pos: "MC", age: 25, ovr: 74, pot: 77 },
        { name: "Chiamaka Madu", pos: "MOC", age: 28, ovr: 75, pot: 75 },
        { name: "Ukor Ali", pos: "MDC", age: 22, ovr: 71, pot: 78 },
        { name: "Paul Odeh", pos: "MC", age: 23, ovr: 72, pot: 76 },
        { name: "Albert Korvah", pos: "MOD", age: 25, ovr: 75, pot: 77 }, // Libérien percutant
        { name: "Enyinnaya Godswill", pos: "MOG", age: 24, ovr: 73, pot: 78 },
        { name: "Nyima Nwagua", pos: "BT", age: 30, ovr: 76, pot: 76 }, // Attaquant puissant
        { name: "Alex Oyowah", pos: "BT", age: 23, ovr: 74, pot: 80 },
        { name: "Shedrack Asiegbu", pos: "BT", age: 26, ovr: 72, pot: 74 },
        { name: "Deputy Echeta", pos: "MOG", age: 22, ovr: 71, pot: 77 }
    ],

    "Enugu Rangers": [ // "Flying Antelopes", club très historique de l'Est (71 - 75)
        { name: "Opubo Japhet", pos: "G", age: 27, ovr: 74, pot: 76 },
        { name: "Detan Ogundare", pos: "G", age: 23, ovr: 70, pot: 77 },
        { name: "Ifeanyi Ogba", pos: "DC", age: 25, ovr: 74, pot: 78 },
        { name: "Ebuka Anthony", pos: "DC", age: 26, ovr: 73, pot: 75 },
        { name: "Kenneth Igboke", pos: "DD", age: 22, ovr: 72, pot: 80 },
        { name: "Philip Clement", pos: "DG", age: 24, ovr: 71, pot: 76 },
        { name: "David Chimezie", pos: "DC", age: 25, ovr: 72, pot: 75 },
        { name: "Kazeem Ogunleye", pos: "MDC", age: 23, ovr: 74, pot: 79 },
        { name: "Ugochukwu Ugwuoke", pos: "MC", age: 26, ovr: 75, pot: 75 },
        { name: "Chidiebere Nwobodo", pos: "MOC", age: 25, ovr: 74, pot: 77 },
        { name: "Isaac Saviour", pos: "MC", age: 21, ovr: 71, pot: 78 },
        { name: "Nweke Kalu", pos: "MDC", age: 24, ovr: 70, pot: 74 },
        { name: "Joel Odoh", pos: "MOG", age: 22, ovr: 73, pot: 79 },
        { name: "Godwin Obaje", pos: "MOD", age: 27, ovr: 75, pot: 75 },
        { name: "Chukwudi Nwaodu", pos: "BT", age: 25, ovr: 74, pot: 76 },
        { name: "Nwangwa Nyima", pos: "BT", age: 28, ovr: 73, pot: 73 },
        { name: "Kingsley Maduforo", pos: "BT", age: 22, ovr: 71, pot: 77 },
        { name: "Kalu Nweke", pos: "MOD", age: 23, ovr: 72, pot: 75 }
    ],

    "Shooting Stars": [ // 3SC, basé à Ibadan, grosse ferveur populaire (70 - 74)
        { name: "Darlington Ovunda", pos: "G", age: 26, ovr: 73, pot: 75 },
        { name: "Gali Daudu", pos: "G", age: 23, ovr: 69, pot: 74 },
        { name: "Gbolagade Adelowo", pos: "DC", age: 25, ovr: 73, pot: 77 },
        { name: "Alex Aghahowa", pos: "DC", age: 24, ovr: 72, pot: 76 },
        { name: "Taiye Murtala", pos: "DD", age: 22, ovr: 71, pot: 78 },
        { name: "Bamidele Ayodeji", pos: "DG", age: 27, ovr: 72, pot: 73 },
        { name: "Olawale Mutiu", pos: "DC", age: 26, ovr: 70, pot: 72 },
        { name: "Taofeek Malomo", pos: "MOC", age: 24, ovr: 75, pot: 79 }, // Joueur frisson
        { name: "Abdullahi Lawal", pos: "MDC", age: 25, ovr: 73, pot: 76 },
        { name: "Daddy Abdulrahman", pos: "MC", age: 22, ovr: 71, pot: 77 },
        { name: "Ayobami Junior", pos: "MC", age: 28, ovr: 74, pot: 74 },
        { name: "Douglas Achiv", pos: "MDC", age: 26, ovr: 72, pot: 74 },
        { name: "Gideon Monday", pos: "MOG", age: 21, ovr: 72, pot: 79 },
        { name: "Joshua Akpan", pos: "MOD", age: 24, ovr: 71, pot: 75 },
        { name: "Sikiru Alimi", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Samuel Ayanrinde", pos: "BT", age: 23, ovr: 72, pot: 76 },
        { name: "Christian Pyagbara", pos: "BT", age: 28, ovr: 73, pot: 73 },
        { name: "Gafar Olafimihan", pos: "MOG", age: 25, ovr: 70, pot: 72 }
    ],

    "Plateau United": [ // Champion 2017, équipe solide de Jos (71 - 75)
        { name: "Suraj Ayeleso", pos: "G", age: 32, ovr: 75, pot: 75 }, // Gardien expérimenté
        { name: "Bamidele Adekunle", pos: "G", age: 24, ovr: 70, pot: 76 },
        { name: "Daniel Itodo", pos: "DG", age: 33, ovr: 74, pot: 74 }, // Célèbre pour ses longues touches
        { name: "Emmanuel Yakubu", pos: "DC", age: 26, ovr: 73, pot: 75 },
        { name: "Harrison Ebah", pos: "DC", age: 25, ovr: 72, pot: 77 },
        { name: "Mustapha Ibrahim", pos: "DD", age: 27, ovr: 71, pot: 73 },
        { name: "Golbe Elisha", pos: "DC", age: 34, ovr: 73, pot: 73 }, // Légende du club
        { name: "Charles Henlong", pos: "MDC", age: 28, ovr: 74, pot: 74 },
        { name: "Jimmy Ambrose", pos: "MDC", age: 26, ovr: 72, pot: 74 },
        { name: "Sunday Anthony", pos: "MC", age: 24, ovr: 73, pot: 78 },
        { name: "Samuel Pam", pos: "MOC", age: 23, ovr: 71, pot: 77 },
        { name: "Nenrot Silas", pos: "MC", age: 25, ovr: 72, pot: 75 },
        { name: "Albert Hillary", pos: "BT", age: 21, ovr: 75, pot: 82 }, // Grosse pépite offensive
        { name: "Izuchukwu Chimezie", pos: "MOD", age: 24, ovr: 72, pot: 76 },
        { name: "Mohammed Zulkifilu", pos: "BT", age: 26, ovr: 73, pot: 75 },
        { name: "Umar Abba", pos: "BT", age: 23, ovr: 71, pot: 76 },
        { name: "Alexander Enejoh", pos: "MOG", age: 22, ovr: 70, pot: 77 },
        { name: "Barnabas Daniel", pos: "MOD", age: 27, ovr: 72, pot: 72 }
    ],

    "Kano Pillars": [ // "Sai Masu Gida", le géant du Nord, ferveur inégalable (71 - 75)
        { name: "Galadima Mohammed", pos: "G", age: 24, ovr: 73, pot: 78 },
        { name: "Abubakar Idris", pos: "G", age: 21, ovr: 69, pot: 76 },
        { name: "Abdullahi Musa", pos: "DC", age: 28, ovr: 75, pot: 75 },
        { name: "Habibu Yakubu", pos: "DC", age: 25, ovr: 72, pot: 76 },
        { name: "Fahad Usman", pos: "DG", age: 26, ovr: 74, pot: 76 },
        { name: "Nelson Ogbonna", pos: "DD", age: 24, ovr: 71, pot: 75 },
        { name: "Ismaila Nasir", pos: "DC", age: 22, ovr: 70, pot: 77 },
        { name: "Rabiu Ali", pos: "MOC", age: 43, ovr: 76, pot: 76 }, // La légende absolue (Pele)
        { name: "Yusuf Maigoro", pos: "MDC", age: 26, ovr: 73, pot: 75 },
        { name: "Aminu Sani", pos: "MC", age: 23, ovr: 72, pot: 78 },
        { name: "Umar Shehu", pos: "MC", age: 25, ovr: 71, pot: 74 },
        { name: "Aliyu Abdullahi", pos: "MDC", age: 21, ovr: 70, pot: 76 },
        { name: "Auwal Ali Malam", pos: "MOD", age: 28, ovr: 74, pot: 74 },
        { name: "Mustapha Salisu", pos: "MOG", age: 24, ovr: 72, pot: 76 },
        { name: "Mustapha Umar", pos: "BT", age: 26, ovr: 75, pot: 76 },
        { name: "Ibrahim Mustapha", pos: "BT", age: 27, ovr: 74, pot: 74 },
        { name: "Abba Adam", pos: "BT", age: 22, ovr: 71, pot: 77 },
        { name: "Suleiman Idris", pos: "MOD", age: 23, ovr: 70, pot: 75 }
    ],

    "Akwa United": [ // "Promise Keepers", basés à Uyo, super stade (70 - 74)
        { name: "Jean Efala", pos: "G", age: 31, ovr: 74, pot: 74 }, // Gardien camerounais
        { name: "Ismaila Mutiu", pos: "G", age: 25, ovr: 70, pot: 73 },
        { name: "Wisdom Nwachukwu", pos: "DC", age: 24, ovr: 73, pot: 78 },
        { name: "David Philip", pos: "DC", age: 26, ovr: 72, pot: 75 },
        { name: "Etboy Akpan", pos: "DD", age: 28, ovr: 74, pot: 74 },
        { name: "James Ajako", pos: "DG", age: 22, ovr: 73, pot: 79 },
        { name: "Oladayo Alabi", pos: "DC", age: 23, ovr: 70, pot: 76 },
        { name: "Uche Collins", pos: "MDC", age: 25, ovr: 72, pot: 75 },
        { name: "Cyril Olisema", pos: "MOC", age: 28, ovr: 75, pot: 75 },
        { name: "Suleiman Sani", pos: "MC", age: 24, ovr: 71, pot: 76 },
        { name: "Chukwuebuka Anthony", pos: "MC", age: 21, ovr: 70, pot: 77 },
        { name: "Emmanuel Essien", pos: "MDC", age: 26, ovr: 71, pot: 73 },
        { name: "Ubong Friday", pos: "MOD", age: 28, ovr: 75, pot: 75 },
        { name: "Dare Ojo", pos: "MOG", age: 29, ovr: 73, pot: 73 },
        { name: "Edidiong Ezekiel", pos: "BT", age: 22, ovr: 74, pot: 80 },
        { name: "Uche Okeke", pos: "BT", age: 25, ovr: 72, pot: 75 },
        { name: "Samuel Amadi", pos: "BT", age: 23, ovr: 71, pot: 76 },
        { name: "Gideon Joel", pos: "MOD", age: 20, ovr: 69, pot: 78 }
    ],

    "Lobi Stars": [ // Basé à Makurdi, club rugueux et accrocheur (70 - 74)
        { name: "Daniel Emmanuel", pos: "G", age: 29, ovr: 73, pot: 73 },
        { name: "Lucky Jimoh", pos: "G", age: 24, ovr: 69, pot: 74 },
        { name: "Moses Tsehuan", pos: "DC", age: 27, ovr: 74, pot: 75 },
        { name: "Orji Kalu", pos: "DC", age: 31, ovr: 73, pot: 73 },
        { name: "John Lazarus", pos: "DD", age: 26, ovr: 72, pot: 75 },
        { name: "Pita John", pos: "DG", age: 25, ovr: 71, pot: 74 },
        { name: "Chinedu Sunday", pos: "DC", age: 23, ovr: 70, pot: 76 },
        { name: "Christian Madu", pos: "MDC", age: 30, ovr: 74, pot: 74 },
        { name: "Ahmadu Liman", pos: "MC", age: 22, ovr: 72, pot: 78 },
        { name: "Abba Umar", pos: "MOC", age: 26, ovr: 73, pot: 75 },
        { name: "Chinedu Chukwu", pos: "MDC", age: 24, ovr: 70, pot: 74 },
        { name: "David Tyavkase", pos: "MC", age: 35, ovr: 71, pot: 71 }, // Vétéran mythique
        { name: "Suur Kumaga", pos: "MOG", age: 21, ovr: 74, pot: 81 },
        { name: "Stanley Oganbor", pos: "MOD", age: 25, ovr: 72, pot: 76 },
        { name: "Samuel Tiza", pos: "BT", age: 23, ovr: 74, pot: 79 },
        { name: "Adeleke Adeniyi", pos: "BT", age: 28, ovr: 72, pot: 72 },
        { name: "Wasiu Alalade", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "Godfrey Utim", pos: "MOG", age: 22, ovr: 70, pot: 76 }
    ],

    "Kwara United": [ // "Afonja Warriors", basé à Ilorin (69 - 73)
        { name: "Adewale Adeyinka", pos: "G", age: 26, ovr: 74, pot: 77 },
        { name: "Surajudeen Aiyeleso", pos: "G", age: 32, ovr: 71, pot: 71 },
        { name: "Bamidele Aiyenugba", pos: "DC", age: 40, ovr: 72, pot: 72 }, // Légende absolue (ex-Enyimba/Lille)
        { name: "Kabiru Balogun", pos: "DC", age: 25, ovr: 73, pot: 76 },
        { name: "Abiodun Adebayo", pos: "DD", age: 27, ovr: 71, pot: 73 },
        { name: "Muritala Dagbo", pos: "DG", age: 24, ovr: 72, pot: 77 },
        { name: "Elisha Golbe", pos: "DC", age: 23, ovr: 69, pot: 74 },
        { name: "Jide Williams", pos: "MDC", age: 28, ovr: 73, pot: 73 },
        { name: "Isaiah Ejeh", pos: "MC", age: 22, ovr: 71, pot: 78 },
        { name: "Issa Gata", pos: "MOC", age: 25, ovr: 72, pot: 75 },
        { name: "Gbolahan Salami", pos: "MDC", age: 32, ovr: 71, pot: 71 },
        { name: "Junior Lokosa", pos: "MC", age: 30, ovr: 70, pot: 70 },
        { name: "Ayobami Akinpelu", pos: "MOD", age: 24, ovr: 73, pot: 76 },
        { name: "Wasiu Jimoh", pos: "MOG", age: 27, ovr: 72, pot: 73 },
        { name: "Emmanuel Ogbole", pos: "BT", age: 21, ovr: 73, pot: 80 },
        { name: "Samuel Ayanrinde", pos: "BT", age: 26, ovr: 71, pot: 74 },
        { name: "Abubakar Garba", pos: "BT", age: 23, ovr: 70, pot: 75 },
        { name: "Saheed Olaniyi", pos: "MOG", age: 22, ovr: 69, pot: 74 }
    ],
    // ==========================================
    // NIGÉRIA (NPFL) - PARTIE 2/2
    // ==========================================

    "Bendel Insurance": [ // "Benin Arsenal", équipe de Benin City, redoutable défensivement (71 - 75)
        { name: "Amas Obasogie", pos: "G", age: 24, ovr: 76, pot: 81 }, // L'un des meilleurs gardiens du pays
        { name: "David Obiazo", pos: "G", age: 28, ovr: 71, pot: 72 },
        { name: "Sunday Anyanwu", pos: "DC", age: 26, ovr: 74, pot: 76 },
        { name: "Julius Emiloju", pos: "DG", age: 25, ovr: 73, pot: 75 },
        { name: "Efe Enabulele", pos: "DC", age: 23, ovr: 72, pot: 77 },
        { name: "Stanley Okorom", pos: "DD", age: 27, ovr: 74, pot: 74 },
        { name: "Hussaini Abdullahi", pos: "DC", age: 21, ovr: 70, pot: 76 },
        { name: "Kelly Kester", pos: "MDC", age: 31, ovr: 75, pot: 75 }, // Milieu très athlétique
        { name: "Divine Nwachukwu", pos: "MOC", age: 20, ovr: 74, pot: 84 }, // Pépite créative
        { name: "Zulkifilu Rabiu", pos: "MC", age: 24, ovr: 72, pot: 76 },
        { name: "Vincent Augustus", pos: "MDC", age: 22, ovr: 71, pot: 75 },
        { name: "Evans Ogbonda", pos: "MC", age: 26, ovr: 73, pot: 74 },
        { name: "Ismael Sarki", pos: "MOD", age: 25, ovr: 74, pot: 75 },
        { name: "Paul Obata", pos: "MOG", age: 24, ovr: 72, pot: 77 },
        { name: "Imade Osarenkhoe", pos: "BT", age: 23, ovr: 75, pot: 80 }, // Buteur puissant
        { name: "Chukwudi Meze", pos: "BT", age: 26, ovr: 72, pot: 73 },
        { name: "Meyinwa Oritseweyinmi", pos: "BT", age: 21, ovr: 70, pot: 76 },
        { name: "Jude Micheal", pos: "MOG", age: 19, ovr: 69, pot: 78 }
    ],

    "Doma United": [ // "Savannah Tigers", jeune club rugueux et accrocheur (69 - 73)
        { name: "Kingdom Osayi", pos: "G", age: 23, ovr: 75, pot: 80 }, // Spécialiste des clean-sheets
        { name: "Abdullahi Zalli", pos: "G", age: 26, ovr: 69, pot: 71 },
        { name: "Nelson Abiam", pos: "DC", age: 24, ovr: 73, pot: 77 }, // Défenseur buteur
        { name: "Hillary Ekawu", pos: "DC", age: 25, ovr: 71, pot: 74 },
        { name: "Haruna Aliyu", pos: "DD", age: 27, ovr: 72, pot: 72 },
        { name: "Samuel Enefiok", pos: "DG", age: 22, ovr: 70, pot: 75 },
        { name: "Sani Shehu", pos: "DC", age: 20, ovr: 68, pot: 74 },
        { name: "Maurice Chigozie", pos: "MDC", age: 25, ovr: 72, pot: 76 },
        { name: "Innocent John", pos: "MC", age: 23, ovr: 71, pot: 75 },
        { name: "Samuel Enefiok", pos: "MC", age: 28, ovr: 73, pot: 73 },
        { name: "Jerry Agwu", pos: "MOC", age: 22, ovr: 70, pot: 76 },
        { name: "Saifullahi Yusuf", pos: "MDC", age: 21, ovr: 69, pot: 74 },
        { name: "Emmanuel Jesam", pos: "MOG", age: 23, ovr: 72, pot: 77 },
        { name: "Bidemi Fasika", pos: "MOD", age: 24, ovr: 71, pot: 75 },
        { name: "Musa Usman", pos: "BT", age: 26, ovr: 74, pot: 74 },
        { name: "Charles Chibuike", pos: "BT", age: 22, ovr: 71, pot: 78 },
        { name: "Kazeem Abiodun", pos: "BT", age: 25, ovr: 70, pot: 72 },
        { name: "Ndong Emmanuel", pos: "MOD", age: 20, ovr: 68, pot: 75 }
    ],

    "Sunshine Stars": [ // Club historique d'Akure (70 - 74)
        { name: "Mustapha Lawal", pos: "G", age: 28, ovr: 74, pot: 74 },
        { name: "Taiwo Adeniyi", pos: "G", age: 23, ovr: 70, pot: 75 },
        { name: "Emmanuel Abe", pos: "MDC", age: 31, ovr: 74, pot: 74 }, // Légende du club replacée derrière/milieu
        { name: "Habib Yakub", pos: "DC", age: 25, ovr: 73, pot: 77 },
        { name: "Mutiu Dauda", pos: "DD", age: 24, ovr: 71, pot: 75 },
        { name: "Seun Olulayo", pos: "DG", age: 29, ovr: 73, pot: 73 },
        { name: "Isiaka Oladuntoye", pos: "DC", age: 27, ovr: 72, pot: 74 },
        { name: "Vincent Temitope", pos: "MDC", age: 24, ovr: 72, pot: 76 },
        { name: "Afeez Babatunde", pos: "MC", age: 22, ovr: 70, pot: 75 },
        { name: "Michael Olalusi", pos: "MOC", age: 25, ovr: 74, pot: 77 },
        { name: "Opeyemi Makinde", pos: "MC", age: 21, ovr: 69, pot: 76 },
        { name: "Kehinde Adeyemi", pos: "MOG", age: 26, ovr: 73, pot: 74 },
        { name: "Promise Awosanmi", pos: "MOD", age: 23, ovr: 72, pot: 78 },
        { name: "Awosanmi Chigozie", pos: "MOG", age: 20, ovr: 69, pot: 75 },
        { name: "Ibrahim Yusuf", pos: "BT", age: 26, ovr: 74, pot: 75 },
        { name: "Tunde Adeniji", pos: "BT", age: 28, ovr: 73, pot: 73 },
        { name: "Lucky Nwafor", pos: "BT", age: 22, ovr: 71, pot: 77 },
        { name: "Oluwole Olanrewaju", pos: "MOD", age: 24, ovr: 70, pot: 74 }
    ],

    "Katsina United": [ // "Changi Boys", gros public au nord du pays (69 - 73)
        { name: "Kassim Brijih", pos: "G", age: 26, ovr: 72, pot: 74 },
        { name: "Ibrahim Pius", pos: "G", age: 22, ovr: 68, pot: 73 },
        { name: "Usman Bara'u", pos: "DC", age: 29, ovr: 74, pot: 74 },
        { name: "Stephen Manyo", pos: "DC", age: 25, ovr: 72, pot: 75 },
        { name: "Aliyu Musa", pos: "DD", age: 24, ovr: 70, pot: 74 },
        { name: "Chinedu Ozor", pos: "DG", age: 27, ovr: 71, pot: 72 },
        { name: "Suleiman Ibrahim", pos: "DC", age: 21, ovr: 68, pot: 76 },
        { name: "Abubakar Nayara", pos: "MDC", age: 28, ovr: 73, pot: 73 },
        { name: "Destiny Ashadi", pos: "MOC", age: 29, ovr: 74, pot: 74 }, // Créateur historique
        { name: "Michael Ibe", pos: "MC", age: 26, ovr: 72, pot: 74 },
        { name: "Musa Wakili", pos: "MDC", age: 23, ovr: 70, pot: 75 },
        { name: "Bello Lukman", pos: "MC", age: 20, ovr: 69, pot: 75 },
        { name: "Nafiu Ibrahim", pos: "MOD", age: 24, ovr: 72, pot: 76 },
        { name: "Yahaya Nazifi", pos: "MOG", age: 22, ovr: 71, pot: 77 },
        { name: "Fidelis Iria", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Andrew Idoko", pos: "BT", age: 23, ovr: 71, pot: 75 },
        { name: "Samson Olasupo", pos: "BT", age: 25, ovr: 70, pot: 72 },
        { name: "Ahmed Abdulkarim", pos: "MOG", age: 21, ovr: 69, pot: 74 }
    ],

    "Niger Tornadoes": [ // Équipe basée à Minna, "Ikon Allah Boys" (68 - 72)
        { name: "Joshua Enaholo", pos: "G", age: 28, ovr: 73, pot: 73 },
        { name: "Mustapha Aliko", pos: "G", age: 32, ovr: 71, pot: 71 },
        { name: "Sunday Akinmoladun", pos: "DC", age: 26, ovr: 73, pot: 75 },
        { name: "Idris Saidu", pos: "DC", age: 24, ovr: 71, pot: 74 },
        { name: "Hussaini Isah", pos: "DD", age: 25, ovr: 70, pot: 73 },
        { name: "Gabriel Wassa", pos: "DG", age: 28, ovr: 72, pot: 72 },
        { name: "Abba Khalid", pos: "DC", age: 22, ovr: 68, pot: 73 },
        { name: "Ifeanyi Okoye", pos: "MDC", age: 30, ovr: 73, pot: 73 },
        { name: "Ernest Chidiebere", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Peter Momoh", pos: "MC", age: 26, ovr: 72, pot: 74 },
        { name: "David Okoromi", pos: "MOC", age: 23, ovr: 70, pot: 76 },
        { name: "Bashir Usman", pos: "MOD", age: 24, ovr: 73, pot: 77 }, // Bon ailier
        { name: "Musa Wakili", pos: "MOG", age: 27, ovr: 71, pot: 72 },
        { name: "Yahuza Bala", pos: "MOD", age: 21, ovr: 69, pot: 74 },
        { name: "Chidiebere Chijioke", pos: "BT", age: 25, ovr: 72, pot: 75 },
        { name: "Clinton Jephta", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Usman Martins", pos: "BT", age: 24, ovr: 69, pot: 72 },
        { name: "Akintunde Azeez", pos: "MOG", age: 23, ovr: 68, pot: 73 }
    ],

    "Heartland FC": [ // "Naze Millionaires" d'Owerri, club historique (70 - 74)
        { name: "Chisom Chiaha", pos: "G", age: 25, ovr: 72, pot: 75 },
        { name: "Bright John", pos: "G", age: 21, ovr: 68, pot: 74 },
        { name: "Chinedu Ozor", pos: "DC", age: 27, ovr: 74, pot: 74 },
        { name: "Nnaemeka Anyanwu", pos: "DC", age: 30, ovr: 73, pot: 73 },
        { name: "Uche Orji", pos: "DD", age: 24, ovr: 71, pot: 74 },
        { name: "Divine Ukadike", pos: "DG", age: 22, ovr: 70, pot: 76 },
        { name: "Ezeali Kingsley", pos: "DC", age: 25, ovr: 71, pot: 73 },
        { name: "Julius Namso", pos: "MDC", age: 32, ovr: 74, pot: 74 },
        { name: "Chukwudi Nwaodu", pos: "MOC", age: 26, ovr: 74, pot: 75 },
        { name: "Clement Ogbobe", pos: "MC", age: 23, ovr: 72, pot: 76 },
        { name: "Fabian Omaka", pos: "MDC", age: 24, ovr: 71, pot: 74 },
        { name: "Onyekachi Okafor", pos: "MC", age: 28, ovr: 72, pot: 72 },
        { name: "Peters Afolabi", pos: "MOG", age: 25, ovr: 73, pot: 75 },
        { name: "George Opara", pos: "MOD", age: 22, ovr: 71, pot: 77 },
        { name: "Onyedikachi Bright", pos: "BT", age: 27, ovr: 74, pot: 74 },
        { name: "Chijioke Opara", pos: "BT", age: 23, ovr: 72, pot: 76 },
        { name: "Ezekiel Bassey", pos: "MOD", age: 29, ovr: 73, pot: 73 }, // Vétéran percutant
        { name: "Tochukwu Nadi", pos: "BT", age: 21, ovr: 69, pot: 75 }
    ],

    "Gombe United": [ // "Savannah Scorpions", très difficle à jouer à domicile (68 - 72)
        { name: "Itodo Akor", pos: "G", age: 33, ovr: 73, pot: 73 }, // Capitaine et vétéran
        { name: "Emmanuel Fabiyi", pos: "G", age: 29, ovr: 70, pot: 70 },
        { name: "Sadiq Shuaibu", pos: "DC", age: 26, ovr: 72, pot: 74 },
        { name: "Alege Abdulkadir", pos: "DC", age: 24, ovr: 70, pot: 73 },
        { name: "Mahmud Haliru", pos: "DD", age: 25, ovr: 71, pot: 74 },
        { name: "Babatunde Bello", pos: "DG", age: 23, ovr: 69, pot: 75 },
        { name: "Franklyn Anthony", pos: "DC", age: 22, ovr: 68, pot: 72 },
        { name: "Lukman Mohammed", pos: "MDC", age: 27, ovr: 73, pot: 73 },
        { name: "Barry Legbara", pos: "MC", age: 25, ovr: 71, pot: 74 },
        { name: "Nurudeen Jimoh", pos: "MC", age: 21, ovr: 69, pot: 76 },
        { name: "Taiye Yusuf", pos: "MOC", age: 24, ovr: 72, pot: 75 },
        { name: "Samuel Oyedeji", pos: "MDC", age: 23, ovr: 68, pot: 71 },
        { name: "Chidera Ejike", pos: "MOG", age: 26, ovr: 71, pot: 72 },
        { name: "Bala Umar", pos: "MOD", age: 22, ovr: 70, pot: 74 },
        { name: "Yusuf Abdulazeez", pos: "BT", age: 24, ovr: 73, pot: 77 },
        { name: "Ahmed Jimoh", pos: "BT", age: 27, ovr: 72, pot: 72 },
        { name: "Sadiq Shuaibu", pos: "BT", age: 20, ovr: 68, pot: 75 },
        { name: "Emmanuel Mathew", pos: "MOD", age: 23, ovr: 69, pot: 72 }
    ],

    "Sporting Lagos": [ // Le club "Tech" de Lagos, moderne et attractif (69 - 73)
        { name: "Christian Nwoke", pos: "G", age: 23, ovr: 73, pot: 79 },
        { name: "Nathaniel Asibe", pos: "G", age: 26, ovr: 69, pot: 71 },
        { name: "Alimi Sunday", pos: "DC", age: 25, ovr: 72, pot: 75 },
        { name: "Patrick Egeonu", pos: "DC", age: 22, ovr: 70, pot: 76 },
        { name: "Ekemini Ukoete", pos: "DD", age: 24, ovr: 71, pot: 74 },
        { name: "Salawudeen Aliu", pos: "DG", age: 23, ovr: 70, pot: 75 },
        { name: "Chiemeka Nwokeji", pos: "DC", age: 21, ovr: 68, pot: 74 },
        { name: "Rivio Ayemwenre", pos: "MDC", age: 24, ovr: 73, pot: 77 },
        { name: "Chinedu Ufere", pos: "MC", age: 26, ovr: 72, pot: 74 },
        { name: "Vincent Akpikpi", pos: "MOC", age: 22, ovr: 71, pot: 78 },
        { name: "Odia Henry", pos: "MC", age: 20, ovr: 69, pot: 75 },
        { name: "Clement Naantaum", pos: "MOG", age: 25, ovr: 74, pot: 76 }, // Ailier vif
        { name: "Jonathan Alukwu", pos: "MOD", age: 21, ovr: 73, pot: 80 }, // Très prometteur
        { name: "Samuel Ayanrinde", pos: "MOD", age: 23, ovr: 71, pot: 74 },
        { name: "Junior Lokosa", pos: "BT", age: 30, ovr: 74, pot: 74 }, // Expérience devant
        { name: "Paschal Durugbor", pos: "BT", age: 24, ovr: 72, pot: 76 },
        { name: "Kalu Chukwuemeka", pos: "BT", age: 22, ovr: 70, pot: 75 },
        { name: "Wisdom Nwachukwu", pos: "MOG", age: 19, ovr: 68, pot: 76 }
    ],

    "Bayelsa United": [ // "Restoration Boys" de Yenagoa, équipe très offensive (70 - 74)
        { name: "Clinton Ayeba", pos: "G", age: 25, ovr: 72, pot: 75 },
        { name: "Osagie Onauwu", pos: "G", age: 22, ovr: 68, pot: 74 },
        { name: "Gabriel Biriduba", pos: "DC", age: 26, ovr: 73, pot: 76 },
        { name: "Tarabina Biweribo", pos: "DC", age: 24, ovr: 72, pot: 77 },
        { name: "Stephen Wisdom", pos: "DD", age: 23, ovr: 70, pot: 75 },
        { name: "Hassan Oladimeji", pos: "DG", age: 25, ovr: 71, pot: 74 },
        { name: "Arise Ogundele", pos: "DC", age: 21, ovr: 68, pot: 73 },
        { name: "Daniel Ekpo", pos: "MDC", age: 28, ovr: 73, pot: 73 },
        { name: "Favour Martins", pos: "MC", age: 22, ovr: 71, pot: 76 },
        { name: "Bobo Thomas", pos: "MOC", age: 24, ovr: 72, pot: 75 },
        { name: "Kehinde Lawal", pos: "MC", age: 26, ovr: 70, pot: 72 },
        { name: "Ebedebiri Endurance", pos: "MDC", age: 23, ovr: 69, pot: 74 },
        { name: "Tekena Garando", pos: "MOG", age: 21, ovr: 72, pot: 78 },
        { name: "Magbisa Wisdom", pos: "MOD", age: 25, ovr: 71, pot: 73 },
        { name: "Robert Mizo", pos: "BT", age: 23, ovr: 76, pot: 81 }, // Serial buteur de la ligue
        { name: "Ekeson Okorie", pos: "BT", age: 24, ovr: 72, pot: 75 },
        { name: "Israel Consul", pos: "BT", age: 20, ovr: 69, pot: 76 },
        { name: "John Bassey", pos: "MOD", age: 22, ovr: 70, pot: 74 }
    ],

    "Abia Warriors": [ // Voisins d'Enyimba à Umuahia, équipe très coriace (70 - 74)
        { name: "Johnson Nnaemeka", pos: "G", age: 26, ovr: 73, pot: 75 },
        { name: "Sharp Uzoigwe", pos: "G", age: 23, ovr: 69, pot: 73 },
        { name: "Augustine Njoku", pos: "DD", age: 24, ovr: 74, pot: 78 }, // Excellent arrière droit
        { name: "Prince Okolie", pos: "DC", age: 27, ovr: 73, pot: 74 },
        { name: "Collins Nwoburuoke", pos: "DC", age: 25, ovr: 72, pot: 75 },
        { name: "Chigozie Umeh", pos: "DG", age: 23, ovr: 71, pot: 76 },
        { name: "Innocent Godwin", pos: "DC", age: 21, ovr: 68, pot: 74 },
        { name: "Uche Moses", pos: "MDC", age: 26, ovr: 73, pot: 75 },
        { name: "Mmegwa Sunday", pos: "MC", age: 24, ovr: 72, pot: 76 },
        { name: "Daniel Ijeh", pos: "MOC", age: 25, ovr: 74, pot: 77 },
        { name: "Chibuike Nwaiwu", pos: "MDC", age: 22, ovr: 70, pot: 75 },
        { name: "Chidera Ugwunna", pos: "MC", age: 21, ovr: 69, pot: 74 },
        { name: "Ojonugwa Adejoh", pos: "MOG", age: 23, ovr: 72, pot: 77 },
        { name: "Igwe Igwe", pos: "MOD", age: 25, ovr: 71, pot: 73 },
        { name: "Sunday Megwo", pos: "BT", age: 21, ovr: 74, pot: 80 }, // Jeune attaquant prometteur
        { name: "Samson Obi", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Antoine Desouza", pos: "BT", age: 24, ovr: 71, pot: 74 },
        { name: "Emmanuel Onu", pos: "MOD", age: 22, ovr: 70, pot: 75 }
    ],
    // ==========================================
    // CAMEROUN (ELITE ONE) - PARTIE 1/2
    // ==========================================

    "Coton Sport": [ // Le géant de Garoua, habitué de la Ligue des Champions CAF (72 - 76)
        { name: "Gadin Allambatnan", pos: "G", age: 26, ovr: 75, pot: 77 },
        { name: "Léonard Gweth", pos: "G", age: 22, ovr: 71, pot: 76 },
        { name: "Che Malone", pos: "DC", age: 24, ovr: 76, pot: 81 }, // Défenseur central très solide
        { name: "Hassana Mamoudou", pos: "DC", age: 27, ovr: 74, pot: 75 },
        { name: "Bawak Etta", pos: "DD", age: 29, ovr: 75, pot: 75 }, // Expérience internationale
        { name: "Ebenezer Ngong", pos: "DG", age: 21, ovr: 72, pot: 78 },
        { name: "Alioum Bouba", pos: "DC", age: 25, ovr: 73, pot: 76 },
        { name: "Djawal Kaiba", pos: "MDC", age: 20, ovr: 75, pot: 84 }, // Grande pépite au milieu
        { name: "Stéphane Meyoupo", pos: "MDC", age: 26, ovr: 74, pot: 75 },
        { name: "Ephraïm Yondjo", pos: "MC", age: 23, ovr: 73, pot: 78 },
        { name: "Patient Wassou", pos: "MOC", age: 19, ovr: 74, pot: 83 }, // Créateur explosif
        { name: "Arnaud Sanou", pos: "MC", age: 28, ovr: 73, pot: 73 },
        { name: "Jean Moursou", pos: "MOG", age: 22, ovr: 74, pot: 79 },
        { name: "Abdouraman Daman", pos: "MOD", age: 24, ovr: 73, pot: 76 },
        { name: "Emmanuel Mahop", pos: "BT", age: 28, ovr: 76, pot: 76 }, // Buteur prolifique
        { name: "Souaibou Marou", pos: "BT", age: 23, ovr: 75, pot: 80 },
        { name: "Lambert Araina", pos: "BT", age: 25, ovr: 74, pot: 77 },
        { name: "Felix Oukiné", pos: "MOG", age: 24, ovr: 72, pot: 75 }
    ],

    "Canon Yaoundé": [ // "Kpa-Kum", le club mythique de la capitale (71 - 75)
        { name: "Jourdan Mbaynassem", pos: "G", age: 25, ovr: 74, pot: 77 },
        { name: "Boris Mandjombe", pos: "G", age: 21, ovr: 69, pot: 75 },
        { name: "Henri Zo'o", pos: "DC", age: 28, ovr: 75, pot: 75 },
        { name: "Paul Atangana", pos: "DC", age: 24, ovr: 72, pot: 76 },
        { name: "Franck Ndongo", pos: "DD", age: 26, ovr: 73, pot: 74 },
        { name: "Jacques Ekani", pos: "DG", age: 23, ovr: 71, pot: 76 },
        { name: "Yves Moukoko", pos: "DC", age: 22, ovr: 70, pot: 74 },
        { name: "Samuel Oum", pos: "MDC", age: 27, ovr: 74, pot: 74 },
        { name: "Pierre Akono", pos: "MC", age: 23, ovr: 73, pot: 78 },
        { name: "Leonel Ateba", pos: "MC", age: 25, ovr: 72, pot: 75 },
        { name: "Stéphane Emana", pos: "MOC", age: 26, ovr: 74, pot: 76 },
        { name: "Valentin Biloa", pos: "MDC", age: 21, ovr: 70, pot: 75 },
        { name: "Christian Biyaga", pos: "MOD", age: 24, ovr: 73, pot: 76 },
        { name: "Gaston Ndi", pos: "MOG", age: 22, ovr: 72, pot: 77 },
        { name: "Albert Mengue", pos: "BT", age: 25, ovr: 75, pot: 78 },
        { name: "Eric Mbekeli", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Junior Awono", pos: "BT", age: 20, ovr: 70, pot: 76 },
        { name: "Arthur Ndzana", pos: "MOD", age: 23, ovr: 71, pot: 75 }
    ],

    "Union Douala": [ // "Nassaras Kamakai", club historique de la métropole économique (70 - 74)
        { name: "Nelson Bongaman", pos: "G", age: 27, ovr: 73, pot: 74 },
        { name: "Herve Nyabeye", pos: "G", age: 23, ovr: 69, pot: 73 },
        { name: "Martial Kout", pos: "DC", age: 30, ovr: 74, pot: 74 },
        { name: "Serge Andoulo", pos: "DC", age: 25, ovr: 72, pot: 75 },
        { name: "Geremi Fankwe", pos: "DD", age: 24, ovr: 71, pot: 75 },
        { name: "Fabrice Tchamabo", pos: "DG", age: 26, ovr: 72, pot: 73 },
        { name: "Cédric Djeugoue", pos: "DC", age: 31, ovr: 73, pot: 73 }, // Vétéran
        { name: "Gilles Ngomo", pos: "MDC", age: 28, ovr: 74, pot: 74 },
        { name: "Armand Djoum", pos: "MC", age: 24, ovr: 72, pot: 76 },
        { name: "Victor Kameni", pos: "MDC", age: 22, ovr: 70, pot: 75 },
        { name: "Rene Ndi", pos: "MOC", age: 25, ovr: 73, pot: 75 },
        { name: "Didier Talla", pos: "MC", age: 21, ovr: 69, pot: 77 },
        { name: "Alain Nguessi", pos: "MOG", age: 23, ovr: 72, pot: 76 },
        { name: "Joel Epassi", pos: "MOD", age: 26, ovr: 71, pot: 72 },
        { name: "Samuel Nlend", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Kevin Ekambi", pos: "BT", age: 22, ovr: 71, pot: 76 },
        { name: "Benoit Mangolo", pos: "BT", age: 24, ovr: 72, pot: 74 },
        { name: "Simon Nyam", pos: "MOG", age: 25, ovr: 70, pot: 73 }
    ],

    "Bamboutos": [ // "Mangwa Boys" de Mbouda, le plus gros public du pays (71 - 75)
        { name: "Patrick Kibyen", pos: "G", age: 25, ovr: 74, pot: 78 },
        { name: "Josue Mfoumou", pos: "G", age: 22, ovr: 70, pot: 74 },
        { name: "Marc Lamkel", pos: "DC", age: 26, ovr: 75, pot: 76 },
        { name: "Donatien Nya", pos: "DC", age: 24, ovr: 72, pot: 75 },
        { name: "Cyrille Ngando", pos: "DD", age: 27, ovr: 73, pot: 74 },
        { name: "Rostand Moukap", pos: "DG", age: 28, ovr: 74, pot: 74 },
        { name: "Hilaire Fomen", pos: "DC", age: 22, ovr: 70, pot: 75 },
        { name: "Christian Ntouba", pos: "MDC", age: 29, ovr: 75, pot: 75 },
        { name: "Frankline Garba", pos: "MC", age: 25, ovr: 73, pot: 76 },
        { name: "Jean-Pierre Tchuente", pos: "MOC", age: 24, ovr: 74, pot: 77 },
        { name: "Brice Ntambwe", pos: "MDC", age: 23, ovr: 71, pot: 74 },
        { name: "Romeo Wome", pos: "MC", age: 21, ovr: 70, pot: 76 },
        { name: "Guy-Marcel Kuete", pos: "MOG", age: 25, ovr: 73, pot: 75 },
        { name: "Kemajou Kemajou", pos: "MOD", age: 26, ovr: 72, pot: 73 },
        { name: "Aristide Bosso", pos: "BT", age: 27, ovr: 75, pot: 75 },
        { name: "Alexandre Kotto", pos: "BT", age: 23, ovr: 73, pot: 78 },
        { name: "Gildas Djeumo", pos: "BT", age: 21, ovr: 71, pot: 76 },
        { name: "Ulrich Pange", pos: "MOD", age: 22, ovr: 70, pot: 75 }
    ],

    "Colombe Sportive": [ // L'Oiseau du Sud (Sangmélima), équipe joueuse (69 - 73)
        { name: "Idrissou Njoya", pos: "G", age: 26, ovr: 72, pot: 74 },
        { name: "Paul Ndi", pos: "G", age: 21, ovr: 68, pot: 73 },
        { name: "Jules Baga", pos: "DC", age: 28, ovr: 73, pot: 73 },
        { name: "Claude Mvondo", pos: "DC", age: 24, ovr: 71, pot: 75 },
        { name: "Thierry Abanda", pos: "DD", age: 25, ovr: 70, pot: 74 },
        { name: "Lucien Owona", pos: "DG", age: 27, ovr: 72, pot: 73 },
        { name: "Yvan Meyo", pos: "DC", age: 22, ovr: 69, pot: 74 },
        { name: "Roger Essomba", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Lionel Etoundi", pos: "MC", age: 23, ovr: 71, pot: 76 },
        { name: "Bertrand Mani", pos: "MOC", age: 25, ovr: 72, pot: 75 },
        { name: "Gervais Mbia", pos: "MDC", age: 24, ovr: 70, pot: 73 },
        { name: "Alphonse Ebongue", pos: "MC", age: 20, ovr: 68, pot: 76 },
        { name: "Denis Nlate", pos: "MOG", age: 26, ovr: 71, pot: 72 },
        { name: "Serge Mballa", pos: "MOD", age: 23, ovr: 70, pot: 74 },
        { name: "Marius Ngon", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Junior Mveng", pos: "BT", age: 22, ovr: 71, pot: 76 },
        { name: "Christian Ndong", pos: "BT", age: 24, ovr: 70, pot: 73 },
        { name: "Patrice Akono", pos: "MOD", age: 21, ovr: 69, pot: 75 }
    ],

    "PWD Bamenda": [ // "Abakwa Boys", solides rugueux de la région anglophone (70 - 74)
        { name: "Karim Bello", pos: "G", age: 27, ovr: 73, pot: 74 },
        { name: "Nchindo John", pos: "G", age: 23, ovr: 69, pot: 75 },
        { name: "Bawak Thomas", pos: "DC", age: 29, ovr: 74, pot: 74 },
        { name: "Brian Ngong", pos: "DC", age: 25, ovr: 72, pot: 76 },
        { name: "Collins Fai", pos: "DD", age: 24, ovr: 71, pot: 75 },
        { name: "Nforbe Tassang", pos: "DG", age: 26, ovr: 73, pot: 74 },
        { name: "Fru Ndi", pos: "DC", age: 22, ovr: 70, pot: 76 },
        { name: "Vincent Abam", pos: "MDC", age: 28, ovr: 74, pot: 74 },
        { name: "Leonel Ateba", pos: "MC", age: 24, ovr: 72, pot: 76 },
        { name: "Che Fonning", pos: "MOC", age: 26, ovr: 73, pot: 75 },
        { name: "Awono Mbah", pos: "MDC", age: 21, ovr: 69, pot: 74 },
        { name: "George Ndeh", pos: "MC", age: 25, ovr: 71, pot: 73 },
        { name: "Hubert Nformi", pos: "MOG", age: 23, ovr: 72, pot: 77 },
        { name: "Kelvin Tah", pos: "MOD", age: 27, ovr: 73, pot: 73 },
        { name: "Moluh Emmanuel", pos: "BT", age: 26, ovr: 74, pot: 75 },
        { name: "Ernest Nsom", pos: "BT", age: 22, ovr: 71, pot: 76 },
        { name: "Gideon Tita", pos: "BT", age: 24, ovr: 70, pot: 74 },
        { name: "Mark Yong", pos: "MOG", age: 20, ovr: 68, pot: 75 }
    ],

    "Astres FC": [ // "Les Brésiliens de Bépanda", jeu très technique (69 - 73)
        { name: "Anye Derick", pos: "G", age: 25, ovr: 72, pot: 76 },
        { name: "Jean-Paul Ekene", pos: "G", age: 22, ovr: 68, pot: 73 },
        { name: "Maximilien Elimbi", pos: "DC", age: 28, ovr: 74, pot: 74 },
        { name: "Thomas Nguimbous", pos: "DC", age: 24, ovr: 71, pot: 75 },
        { name: "Arthur Ndong", pos: "DD", age: 26, ovr: 70, pot: 73 },
        { name: "Joseph Atangana", pos: "DG", age: 25, ovr: 72, pot: 75 },
        { name: "Alain Njoh", pos: "DC", age: 21, ovr: 69, pot: 76 },
        { name: "Félix Chenkam", pos: "MDC", age: 27, ovr: 73, pot: 73 },
        { name: "Cédric Mandjombe", pos: "MOC", age: 23, ovr: 74, pot: 79 }, // Excellent manieur de ballon
        { name: "Hervé Eloundou", pos: "MC", age: 26, ovr: 72, pot: 74 },
        { name: "Lionel Ndi", pos: "MDC", age: 22, ovr: 70, pot: 75 },
        { name: "Pierre Milla", pos: "MC", age: 20, ovr: 68, pot: 77 },
        { name: "Yannick Nkufo", pos: "MOG", age: 24, ovr: 72, pot: 76 },
        { name: "Basile Mvondo", pos: "MOD", age: 25, ovr: 71, pot: 74 },
        { name: "Julien Ebah", pos: "BT", age: 29, ovr: 75, pot: 75 }, // Buteur expérimenté
        { name: "Armel Tchuente", pos: "BT", age: 23, ovr: 71, pot: 75 },
        { name: "Sosthène Tiebou", pos: "BT", age: 21, ovr: 69, pot: 76 },
        { name: "Francis Nguessi", pos: "MOD", age: 22, ovr: 70, pot: 74 }
    ],

    "Fauve Azur": [ // Équipe basée à Yaoundé, réputée accrocheuse (68 - 72)
        { name: "Marcelin Mbah", pos: "G", age: 26, ovr: 71, pot: 74 },
        { name: "Serge Mveng", pos: "G", age: 23, ovr: 67, pot: 72 },
        { name: "Yves Ndiaye", pos: "DC", age: 27, ovr: 72, pot: 74 },
        { name: "Didier Omgba", pos: "DC", age: 24, ovr: 70, pot: 75 },
        { name: "Hermann Ndzana", pos: "DD", age: 25, ovr: 69, pot: 73 },
        { name: "Gautier Biloa", pos: "DG", age: 28, ovr: 71, pot: 72 },
        { name: "Fabrice Oumarou", pos: "DC", age: 22, ovr: 68, pot: 73 },
        { name: "Jean-Claude Mbami", pos: "MDC", age: 30, ovr: 73, pot: 73 },
        { name: "Patrick Essomba", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Alain Makoun", pos: "MC", age: 25, ovr: 70, pot: 72 },
        { name: "Brice Etoundi", pos: "MOC", age: 23, ovr: 72, pot: 76 },
        { name: "Kevin Abega", pos: "MDC", age: 21, ovr: 68, pot: 74 },
        { name: "Samuel Eto'o (Regen)", pos: "MOG", age: 19, ovr: 70, pot: 82 }, // Clin d'oeil, jeune pépite
        { name: "Lionel Assomo", pos: "MOD", age: 26, ovr: 71, pot: 73 },
        { name: "Rostand Kakou", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Christian Epupa", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "Guy-Noël Nsangou", pos: "BT", age: 22, ovr: 69, pot: 74 },
        { name: "Cyrille Nkufo", pos: "MOD", age: 24, ovr: 69, pot: 72 }
    ],

    "Dynamo Douala": [ // "Bon Ba Djob", club mythique très populaire (70 - 74)
        { name: "Edgar Ndi", pos: "G", age: 28, ovr: 73, pot: 73 },
        { name: "Wilfried Mvondo", pos: "G", age: 22, ovr: 69, pot: 75 },
        { name: "Jacques Haman", pos: "DC", age: 31, ovr: 74, pot: 74 },
        { name: "Théodore Nguema", pos: "DC", age: 25, ovr: 72, pot: 75 },
        { name: "Aurelien Bayemi", pos: "DD", age: 26, ovr: 71, pot: 73 },
        { name: "Benoit Eto'o", pos: "DG", age: 24, ovr: 72, pot: 76 },
        { name: "Florentin Biyaga", pos: "DC", age: 21, ovr: 69, pot: 75 },
        { name: "Modeste M'Bami", pos: "MDC", age: 29, ovr: 74, pot: 74 },
        { name: "Georges Mandjeck", pos: "MC", age: 33, ovr: 73, pot: 73 }, // Vétéran au milieu
        { name: "Christian Ndi", pos: "MC", age: 23, ovr: 71, pot: 76 },
        { name: "Fabrice Fosso", pos: "MOC", age: 26, ovr: 74, pot: 75 },
        { name: "Valentin Zobo", pos: "MDC", age: 22, ovr: 70, pot: 74 },
        { name: "Alphonse Tientcheu", pos: "MOG", age: 25, ovr: 72, pot: 74 },
        { name: "Hervé Boumsong", pos: "MOD", age: 24, ovr: 71, pot: 75 },
        { name: "Leonel Ateba", pos: "BT", age: 27, ovr: 75, pot: 75 },
        { name: "Samuel Nlend", pos: "BT", age: 23, ovr: 72, pot: 77 },
        { name: "Boris Pongo", pos: "BT", age: 21, ovr: 70, pot: 76 },
        { name: "Yannick Nkoum", pos: "MOD", age: 25, ovr: 70, pot: 73 }
    ],

    "Yong Sports": [ // YOSA de Bamenda, redoutable à domicile (69 - 73)
        { name: "Desmond Ngwa", pos: "G", age: 27, ovr: 72, pot: 74 },
        { name: "Kelvin Nformi", pos: "G", age: 23, ovr: 68, pot: 73 },
        { name: "Franklin Tassang", pos: "DC", age: 29, ovr: 73, pot: 73 },
        { name: "Clinton Ndi", pos: "DC", age: 25, ovr: 71, pot: 74 },
        { name: "Nelson Abam", pos: "DD", age: 24, ovr: 70, pot: 75 },
        { name: "Elvis Ngong", pos: "DG", age: 26, ovr: 71, pot: 73 },
        { name: "Martin Fru", pos: "DC", age: 22, ovr: 69, pot: 74 },
        { name: "Gideon Tah", pos: "MDC", age: 28, ovr: 72, pot: 72 },
        { name: "Brice Ntumbe", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Achu Ndeh", pos: "MOC", age: 25, ovr: 72, pot: 74 },
        { name: "Divine Nsom", pos: "MC", age: 21, ovr: 69, pot: 76 },
        { name: "Charles Mbah", pos: "MDC", age: 23, ovr: 70, pot: 74 },
        { name: "Mark Ndi", pos: "MOG", age: 26, ovr: 71, pot: 73 },
        { name: "Elvis Yong", pos: "MOD", age: 22, ovr: 70, pot: 75 },
        { name: "Emmanuel Nfor", pos: "BT", age: 27, ovr: 74, pot: 74 },
        { name: "Jude Tita", pos: "BT", age: 24, ovr: 72, pot: 75 },
        { name: "Collins Ambi", pos: "BT", age: 21, ovr: 70, pot: 76 },
        { name: "Brian Abam", pos: "MOG", age: 25, ovr: 69, pot: 72 }
    ],
    // ==========================================
    // CAMEROUN (ELITE ONE) - PARTIE 2/2
    // ==========================================

    "Gazelle FA": [ // Club de Garoua, voisin de Coton Sport, équipe joueuse (69 - 73)
        { name: "Moussa Sali", pos: "G", age: 26, ovr: 72, pot: 75 },
        { name: "Alioune Youssouf", pos: "G", age: 22, ovr: 68, pot: 74 },
        { name: "Hamidou Oumarou", pos: "DC", age: 28, ovr: 73, pot: 73 },
        { name: "Sambo Abdullahi", pos: "DC", age: 24, ovr: 71, pot: 75 },
        { name: "Ibrahim Bello", pos: "DD", age: 25, ovr: 70, pot: 73 },
        { name: "Sadou Bako", pos: "DG", age: 23, ovr: 72, pot: 76 },
        { name: "Amadou Djibrilla", pos: "DC", age: 21, ovr: 69, pot: 74 },
        { name: "Fadil Haman", pos: "MDC", age: 27, ovr: 73, pot: 74 },
        { name: "Ismaila Bouba", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Ousmanou Dabo", pos: "MOC", age: 25, ovr: 72, pot: 74 },
        { name: "Idrissou Mahamat", pos: "MC", age: 21, ovr: 70, pot: 76 },
        { name: "Harouna Sani", pos: "MDC", age: 23, ovr: 69, pot: 73 },
        { name: "Aboubakar Siddiq", pos: "MOG", age: 22, ovr: 71, pot: 77 },
        { name: "Daouda Kamilou", pos: "MOD", age: 34, ovr: 74, pot: 74 }, // Vétéran légende du Nord
        { name: "Souleymanou Abba", pos: "BT", age: 26, ovr: 73, pot: 74 },
        { name: "Yaya Garga", pos: "BT", age: 23, ovr: 71, pot: 76 },
        { name: "Bello Nuhu", pos: "BT", age: 20, ovr: 69, pot: 75 },
        { name: "Kassim Sali", pos: "MOD", age: 24, ovr: 70, pot: 74 }
    ],

    "APEJES": [ // Académie de Mfou, gros formateur de jeunes talents (68 - 73)
        { name: "Sylvain Ndi", pos: "G", age: 24, ovr: 71, pot: 76 },
        { name: "Joël Apam", pos: "G", age: 21, ovr: 67, pot: 74 },
        { name: "Hermann Boyom", pos: "DC", age: 27, ovr: 72, pot: 74 },
        { name: "Serge Mvondo", pos: "DC", age: 22, ovr: 70, pot: 77 },
        { name: "Luc Messi", pos: "DD", age: 23, ovr: 71, pot: 75 },
        { name: "Arthur Biloa", pos: "DG", age: 25, ovr: 69, pot: 73 },
        { name: "Cédric Nkoum", pos: "DC", age: 20, ovr: 68, pot: 75 },
        { name: "Christian Epupa", pos: "MDC", age: 26, ovr: 72, pot: 74 },
        { name: "Yvan Ngatchou", pos: "MC", age: 23, ovr: 71, pot: 76 },
        { name: "Oumarou Sanda", pos: "MOC", age: 24, ovr: 73, pot: 77 }, // Meneur de jeu très fin
        { name: "Stéphane Ndongo", pos: "MC", age: 21, ovr: 69, pot: 75 },
        { name: "Samuel Biyaga", pos: "MDC", age: 19, ovr: 67, pot: 76 },
        { name: "Franky Essomba", pos: "MOG", age: 22, ovr: 70, pot: 75 },
        { name: "Albert Meyong", pos: "MOD", age: 25, ovr: 71, pot: 74 },
        { name: "Leonel Wamba", pos: "BT", age: 23, ovr: 73, pot: 78 },
        { name: "Cyrille Nguessi", pos: "BT", age: 21, ovr: 70, pot: 76 },
        { name: "Denis Omgba", pos: "BT", age: 24, ovr: 71, pot: 74 },
        { name: "Hervé Abanda", pos: "MOD", age: 20, ovr: 68, pot: 74 }
    ],

    "UMS de Loum": [ // Équipe très solide et physique du Moungo (70 - 74)
        { name: "Rostand Youthe", pos: "G", age: 28, ovr: 74, pot: 74 },
        { name: "Martial Nkufo", pos: "G", age: 23, ovr: 69, pot: 73 },
        { name: "Willy Name", pos: "DC", age: 29, ovr: 74, pot: 74 },
        { name: "Paul Otia", pos: "DC", age: 25, ovr: 72, pot: 76 },
        { name: "Bertrand Owona", pos: "DD", age: 26, ovr: 71, pot: 73 },
        { name: "Alphonse Tientcheu", pos: "DG", age: 27, ovr: 73, pot: 73 },
        { name: "Cédric Mbami", pos: "DC", age: 22, ovr: 70, pot: 75 },
        { name: "Jean-Paul Ndi", pos: "MDC", age: 30, ovr: 74, pot: 74 },
        { name: "Frank Elimbi", pos: "MC", age: 25, ovr: 72, pot: 75 },
        { name: "Christian Ndi", pos: "MOC", age: 26, ovr: 73, pot: 74 },
        { name: "Samuel Ebah", pos: "MDC", age: 23, ovr: 70, pot: 74 },
        { name: "Brice Tchuente", pos: "MC", age: 21, ovr: 69, pot: 75 },
        { name: "Valentin Zobo", pos: "MOG", age: 24, ovr: 72, pot: 76 },
        { name: "Serge Mballa", pos: "MOD", age: 25, ovr: 71, pot: 74 },
        { name: "Arouna Dang", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Joel Epassi", pos: "BT", age: 23, ovr: 72, pot: 77 },
        { name: "Benoit Nlend", pos: "BT", age: 22, ovr: 70, pot: 75 },
        { name: "Gervais Mbia", pos: "MOG", age: 24, ovr: 69, pot: 73 }
    ],

    "Victoria United": [ // "OPOPO" (One People One Power), de Limbé, gros engouement (70 - 74)
        { name: "Idrissou Njoya", pos: "G", age: 26, ovr: 73, pot: 75 },
        { name: "Kelvin Abam", pos: "G", age: 21, ovr: 68, pot: 74 },
        { name: "Franklin Ndi", pos: "DC", age: 28, ovr: 74, pot: 74 },
        { name: "Brian Tassang", pos: "DC", age: 24, ovr: 72, pot: 76 },
        { name: "Collins Mbah", pos: "DD", age: 25, ovr: 71, pot: 74 },
        { name: "Nelson Ngong", pos: "DG", age: 23, ovr: 72, pot: 77 },
        { name: "George Fru", pos: "DC", age: 22, ovr: 69, pot: 75 },
        { name: "Vincent Tah", pos: "MDC", age: 27, ovr: 73, pot: 73 },
        { name: "Nathaniel Douala", pos: "MOC", age: 18, ovr: 74, pot: 86 }, // La pépite très médiatisée
        { name: "Leonel Nsom", pos: "MC", age: 24, ovr: 72, pot: 75 },
        { name: "Che Fonning", pos: "MDC", age: 22, ovr: 70, pot: 74 },
        { name: "Gideon Ndeh", pos: "MC", age: 21, ovr: 69, pot: 76 },
        { name: "Elvis Tita", pos: "MOG", age: 25, ovr: 72, pot: 74 },
        { name: "Mark Ambi", pos: "MOD", age: 23, ovr: 71, pot: 76 },
        { name: "Richmond Nji", pos: "BT", age: 26, ovr: 74, pot: 75 },
        { name: "Emmanuel Nfor", pos: "BT", age: 22, ovr: 71, pot: 77 },
        { name: "Jude Yong", pos: "BT", age: 20, ovr: 69, pot: 75 },
        { name: "Brian Tassang", pos: "MOD", age: 24, ovr: 70, pot: 73 }
    ],

    "Fovu de Baham": [ // Le club des rochers sacrés de l'Ouest (69 - 73)
        { name: "Patrick Kibyen", pos: "G", age: 27, ovr: 73, pot: 74 },
        { name: "Josue Mfoumou", pos: "G", age: 22, ovr: 68, pot: 73 },
        { name: "Marc Lamkel", pos: "DC", age: 29, ovr: 74, pot: 74 },
        { name: "Donatien Nya", pos: "DC", age: 25, ovr: 71, pot: 75 },
        { name: "Cyrille Ngando", pos: "DD", age: 26, ovr: 70, pot: 73 },
        { name: "Rostand Moukap", pos: "DG", age: 28, ovr: 72, pot: 72 },
        { name: "Hilaire Fomen", pos: "DC", age: 21, ovr: 69, pot: 75 },
        { name: "Christian Ntouba", pos: "MDC", age: 30, ovr: 73, pot: 73 },
        { name: "Frankline Garba", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Jean-Pierre Tchuente", pos: "MOC", age: 26, ovr: 72, pot: 74 },
        { name: "Brice Ntambwe", pos: "MDC", age: 23, ovr: 70, pot: 74 },
        { name: "Romeo Wome", pos: "MC", age: 20, ovr: 68, pot: 76 },
        { name: "Guy-Marcel Kuete", pos: "MOG", age: 25, ovr: 71, pot: 74 },
        { name: "Kemajou Kemajou", pos: "MOD", age: 27, ovr: 72, pot: 73 },
        { name: "Aristide Bosso", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Alexandre Kotto", pos: "BT", age: 23, ovr: 71, pot: 76 },
        { name: "Gildas Djeumo", pos: "BT", age: 22, ovr: 70, pot: 74 },
        { name: "Ulrich Pange", pos: "MOD", age: 24, ovr: 69, pot: 73 }
    ],

    "Avion Academy": [ // Club formateur basé dans le Littoral (Nkam/Douala) (68 - 72)
        { name: "Nelson Bongaman", pos: "G", age: 25, ovr: 71, pot: 75 },
        { name: "Herve Nyabeye", pos: "G", age: 21, ovr: 67, pot: 73 },
        { name: "Martial Kout", pos: "DC", age: 27, ovr: 72, pot: 74 },
        { name: "Serge Andoulo", pos: "DC", age: 23, ovr: 70, pot: 75 },
        { name: "Geremi Fankwe", pos: "DD", age: 24, ovr: 69, pot: 73 },
        { name: "Fabrice Tchamabo", pos: "DG", age: 26, ovr: 71, pot: 73 },
        { name: "Cédric Djeugoue", pos: "DC", age: 22, ovr: 68, pot: 74 },
        { name: "Gilles Ngomo", pos: "MDC", age: 28, ovr: 72, pot: 72 },
        { name: "Armand Djoum", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Victor Kameni", pos: "MDC", age: 21, ovr: 69, pot: 74 },
        { name: "Rene Ndi", pos: "MOC", age: 25, ovr: 72, pot: 74 },
        { name: "Didier Talla", pos: "MC", age: 20, ovr: 68, pot: 76 },
        { name: "Alain Nguessi", pos: "MOG", age: 23, ovr: 70, pot: 75 },
        { name: "Joel Epassi", pos: "MOD", age: 26, ovr: 71, pot: 73 },
        { name: "Samuel Nlend", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Kevin Ekambi", pos: "BT", age: 22, ovr: 70, pot: 76 },
        { name: "Benoit Mangolo", pos: "BT", age: 24, ovr: 71, pot: 74 },
        { name: "Simon Nyam", pos: "MOG", age: 21, ovr: 68, pot: 74 }
    ],

    "Fortuna": [ // AS Fortuna de Mfou, équipe très offensive et piégeuse (69 - 73)
        { name: "Sylvain Ndi", pos: "G", age: 26, ovr: 72, pot: 74 },
        { name: "Joël Apam", pos: "G", age: 22, ovr: 68, pot: 73 },
        { name: "Hermann Boyom", pos: "DC", age: 28, ovr: 73, pot: 73 },
        { name: "Serge Mvondo", pos: "DC", age: 24, ovr: 71, pot: 75 },
        { name: "Luc Messi", pos: "DD", age: 25, ovr: 70, pot: 74 },
        { name: "Arthur Biloa", pos: "DG", age: 27, ovr: 72, pot: 73 },
        { name: "Cédric Nkoum", pos: "DC", age: 21, ovr: 69, pot: 74 },
        { name: "Christian Epupa", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Yvan Ngatchou", pos: "MC", age: 25, ovr: 71, pot: 74 },
        { name: "Oumarou Sanda", pos: "MOC", age: 26, ovr: 73, pot: 75 },
        { name: "Stéphane Ndongo", pos: "MC", age: 23, ovr: 70, pot: 76 },
        { name: "Samuel Biyaga", pos: "MDC", age: 22, ovr: 69, pot: 74 },
        { name: "Franky Essomba", pos: "MOG", age: 24, ovr: 72, pot: 76 },
        { name: "Albert Meyong", pos: "MOD", age: 27, ovr: 72, pot: 73 },
        { name: "Leonel Wamba", pos: "BT", age: 25, ovr: 74, pot: 76 }, // Buteur rapide
        { name: "Cyrille Nguessi", pos: "BT", age: 23, ovr: 71, pot: 75 },
        { name: "Denis Omgba", pos: "BT", age: 21, ovr: 70, pot: 74 },
        { name: "Hervé Abanda", pos: "MOD", age: 24, ovr: 69, pot: 73 }
    ],

    "Panthère du Ndé": [ // "Nzuimanto" de Bangangté, équipe mythique et respectée (69 - 73)
        { name: "Marcelin Mbah", pos: "G", age: 28, ovr: 73, pot: 73 },
        { name: "Serge Mveng", pos: "G", age: 23, ovr: 69, pot: 74 },
        { name: "Yves Ndiaye", pos: "DC", age: 29, ovr: 74, pot: 74 },
        { name: "Didier Omgba", pos: "DC", age: 25, ovr: 72, pot: 75 },
        { name: "Hermann Ndzana", pos: "DD", age: 26, ovr: 71, pot: 74 },
        { name: "Gautier Biloa", pos: "DG", age: 27, ovr: 72, pot: 73 },
        { name: "Fabrice Oumarou", pos: "DC", age: 22, ovr: 69, pot: 75 },
        { name: "Jean-Claude Mbami", pos: "MDC", age: 31, ovr: 74, pot: 74 },
        { name: "Patrick Essomba", pos: "MC", age: 24, ovr: 71, pot: 76 },
        { name: "Alain Makoun", pos: "MC", age: 26, ovr: 72, pot: 74 },
        { name: "Brice Etoundi", pos: "MOC", age: 25, ovr: 73, pot: 75 },
        { name: "Kevin Abega", pos: "MDC", age: 23, ovr: 70, pot: 74 },
        { name: "Lionel Assomo", pos: "MOG", age: 27, ovr: 72, pot: 72 },
        { name: "Cyrille Nkufo", pos: "MOD", age: 24, ovr: 71, pot: 75 },
        { name: "Rostand Kakou", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Christian Epupa", pos: "BT", age: 25, ovr: 72, pot: 76 },
        { name: "Guy-Noël Nsangou", pos: "BT", age: 22, ovr: 70, pot: 75 },
        { name: "Samuel Eto'o", pos: "MOD", age: 20, ovr: 68, pot: 76 }
    ],

    "Tonnerre Kalara": [ // TKC, le rival historique du Canon à Yaoundé, club de légende (70 - 74)
        { name: "Edgar Ndi", pos: "G", age: 27, ovr: 73, pot: 75 },
        { name: "Wilfried Mvondo", pos: "G", age: 21, ovr: 68, pot: 74 },
        { name: "Jacques Haman", pos: "DC", age: 30, ovr: 74, pot: 74 },
        { name: "Théodore Nguema", pos: "DC", age: 26, ovr: 72, pot: 74 },
        { name: "Aurelien Bayemi", pos: "DD", age: 25, ovr: 71, pot: 75 },
        { name: "Benoit Eto'o", pos: "DG", age: 28, ovr: 73, pot: 73 },
        { name: "Florentin Biyaga", pos: "DC", age: 22, ovr: 69, pot: 75 },
        { name: "Modeste M'Bami", pos: "MDC", age: 29, ovr: 74, pot: 74 }, // Clin d'oeil à l'ancien international
        { name: "Georges Mandjeck", pos: "MC", age: 24, ovr: 72, pot: 76 },
        { name: "Christian Ndi", pos: "MC", age: 25, ovr: 71, pot: 73 },
        { name: "Fabrice Fosso", pos: "MOC", age: 26, ovr: 74, pot: 75 },
        { name: "Valentin Zobo", pos: "MDC", age: 23, ovr: 70, pot: 74 },
        { name: "Alphonse Tientcheu", pos: "MOG", age: 25, ovr: 72, pot: 74 },
        { name: "Hervé Boumsong", pos: "MOD", age: 24, ovr: 71, pot: 76 },
        { name: "Leonel Ateba", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Samuel Nlend", pos: "BT", age: 23, ovr: 72, pot: 77 },
        { name: "Boris Pongo", pos: "BT", age: 22, ovr: 70, pot: 75 },
        { name: "Yannick Nkoum", pos: "MOD", age: 20, ovr: 69, pot: 74 }
    ],

    "Racing": [ // TPO (Tout Puissant de l'Ouest) de Bafoussam, grande histoire (69 - 73)
        { name: "Desmond Ngwa", pos: "G", age: 28, ovr: 73, pot: 73 },
        { name: "Kelvin Nformi", pos: "G", age: 23, ovr: 69, pot: 74 },
        { name: "Franklin Tassang", pos: "DC", age: 30, ovr: 74, pot: 74 },
        { name: "Clinton Ndi", pos: "DC", age: 26, ovr: 72, pot: 75 },
        { name: "Nelson Abam", pos: "DD", age: 25, ovr: 71, pot: 73 },
        { name: "Elvis Ngong", pos: "DG", age: 27, ovr: 72, pot: 73 },
        { name: "Martin Fru", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Gideon Tah", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Brice Ntumbe", pos: "MC", age: 25, ovr: 72, pot: 74 },
        { name: "Achu Ndeh", pos: "MOC", age: 24, ovr: 73, pot: 76 },
        { name: "Divine Nsom", pos: "MC", age: 22, ovr: 70, pot: 75 },
        { name: "Charles Mbah", pos: "MDC", age: 23, ovr: 69, pot: 74 },
        { name: "Mark Ndi", pos: "MOG", age: 26, ovr: 71, pot: 72 },
        { name: "Elvis Yong", pos: "MOD", age: 25, ovr: 72, pot: 74 },
        { name: "Emmanuel Nfor", pos: "BT", age: 27, ovr: 74, pot: 74 },
        { name: "Jude Tita", pos: "BT", age: 24, ovr: 72, pot: 76 },
        { name: "Collins Ambi", pos: "BT", age: 21, ovr: 70, pot: 75 },
        { name: "Brian Abam", pos: "MOG", age: 23, ovr: 69, pot: 73 }
    ],
    // ==========================================
    // RDC (LINAFOOT) - PARTIE 1/2
    // ==========================================

    "TP Mazembe": [ // "Les Corbeaux", le géant de Lubumbashi, multiple vainqueur de LDC CAF (74 - 78)
        { name: "Siadi Baggio", pos: "G", age: 26, ovr: 76, pot: 79 },
        { name: "Ibrahim Mounkoro", pos: "G", age: 33, ovr: 74, pot: 74 },
        { name: "Kevin Mondeko", pos: "DC", age: 28, ovr: 78, pot: 78 }, // Roc défensif, capitaine
        { name: "Magloire Ntambwe", pos: "DC", age: 25, ovr: 75, pot: 77 },
        { name: "Issama Mpeko", pos: "DD", age: 34, ovr: 75, pot: 75 }, // Légende vivante au poste de latéral
        { name: "Ernest Luzolo", pos: "DG", age: 27, ovr: 76, pot: 76 },
        { name: "Atibu Radjabu", pos: "DC", age: 24, ovr: 73, pot: 76 },
        { name: "Boaz Ngalamulume", pos: "MDC", age: 23, ovr: 75, pot: 80 },
        { name: "Zemanga Soze", pos: "MDC", age: 28, ovr: 76, pot: 76 },
        { name: "Glody Likonza", pos: "MC", age: 25, ovr: 77, pot: 79 }, // Métronome de l'équipe
        { name: "Merceil Ngimbi", pos: "MC", age: 26, ovr: 74, pot: 75 },
        { name: "Patient Mwamba", pos: "MOC", age: 22, ovr: 73, pot: 81 }, // Jeune créateur à suivre
        { name: "Philippe Kinzumbi", pos: "MOG", age: 25, ovr: 76, pot: 77 }, // Ailier virevoltant
        { name: "Gloire Mujaya", pos: "MOD", age: 21, ovr: 72, pot: 78 },
        { name: "Fily Traore", pos: "BT", age: 23, ovr: 77, pot: 82 }, // Buteur surpuissant, star du club
        { name: "Joel Beya", pos: "BT", age: 24, ovr: 75, pot: 79 },
        { name: "Oscar Kabwit", pos: "MOD", age: 19, ovr: 71, pot: 83 }, // Super pépite
        { name: "Cheikh Fofana", pos: "BT", age: 25, ovr: 74, pot: 76 }
    ],

    "AS Vita Club": [ // "Les Bana Vea" de Kinshasa, l'autre géant du pays (73 - 77)
        { name: "Farid Ouedraogo", pos: "G", age: 27, ovr: 75, pot: 77 },
        { name: "Nelson Lukong", pos: "G", age: 40, ovr: 71, pot: 71 }, // Vétéran emblématique
        { name: "Varel Rozan", pos: "DC", age: 29, ovr: 76, pot: 76 },
        { name: "Guy Mfingi", pos: "DC", age: 26, ovr: 74, pot: 77 },
        { name: "Jacques Mangoba", pos: "DD", age: 24, ovr: 73, pot: 76 },
        { name: "Edouard Boka", pos: "DG", age: 25, ovr: 75, pot: 78 },
        { name: "Rene Zoungrana", pos: "DC", age: 28, ovr: 74, pot: 74 },
        { name: "Kikasa Wamba", pos: "MDC", age: 25, ovr: 74, pot: 76 },
        { name: "Lema Mabidi", pos: "MC", age: 30, ovr: 75, pot: 75 }, // Retour d'un ancien très technique
        { name: "Norberto Kipewu", pos: "MOC", age: 22, ovr: 72, pot: 78 },
        { name: "Marouf Tchakei", pos: "MOC", age: 28, ovr: 76, pot: 76 }, // Spécialiste des coups francs
        { name: "Merveille Kikasa", pos: "MDC", age: 24, ovr: 73, pot: 76 },
        { name: "Mpia Nzengeli", pos: "MOG", age: 23, ovr: 74, pot: 80 },
        { name: "Elie Panzu", pos: "MOD", age: 21, ovr: 73, pot: 79 },
        { name: "Obed Mayamba", pos: "BT", age: 26, ovr: 76, pot: 77 },
        { name: "Eric Kabwe", pos: "BT", age: 23, ovr: 74, pot: 78 },
        { name: "Platini Mpiana", pos: "BT", age: 25, ovr: 73, pot: 75 },
        { name: "Jonathan Ikangalombo", pos: "MOD", age: 22, ovr: 74, pot: 80 } // Dribbleur fou
    ],

    "DC Motema Pembe": [ // "Les Immaculés" de Kinshasa (DCMP), l'éternel rival de V.Club (71 - 75)
        { name: "Hervé Lomboto", pos: "G", age: 34, ovr: 74, pot: 74 },
        { name: "Vandiya Bunde", pos: "G", age: 24, ovr: 70, pot: 75 },
        { name: "Apianom Kasereka", pos: "DC", age: 28, ovr: 74, pot: 74 },
        { name: "Christian Ndongani", pos: "DC", age: 25, ovr: 73, pot: 76 },
        { name: "Jonathan Mutombo", pos: "DD", age: 24, ovr: 72, pot: 75 },
        { name: "Gloire Nzey", pos: "DG", age: 22, ovr: 71, pot: 77 },
        { name: "Herve Beya", pos: "DC", age: 26, ovr: 72, pot: 74 },
        { name: "Junior Kone", pos: "MDC", age: 27, ovr: 74, pot: 74 },
        { name: "Ricky Tulengi", pos: "MOC", age: 31, ovr: 75, pot: 75 }, // Meneur expérimenté
        { name: "Karim Kimvuidi", pos: "MC", age: 21, ovr: 72, pot: 81 }, // Très grosse marge de progression
        { name: "Jonathan Mambabua", pos: "MC", age: 25, ovr: 73, pot: 75 },
        { name: "Doxa Gikanji", pos: "MDC", age: 33, ovr: 73, pot: 73 },
        { name: "Jimmy Bayindula", pos: "MOG", age: 23, ovr: 71, pot: 76 },
        { name: "Borel Tomandzoto", pos: "MOD", age: 24, ovr: 72, pot: 75 },
        { name: "Jean-Marc Makusu", pos: "BT", age: 32, ovr: 76, pot: 76 }, // Vieux briscard toujours adroit
        { name: "Roland Mbala", pos: "BT", age: 25, ovr: 73, pot: 75 },
        { name: "Grace Madinga", pos: "BT", age: 22, ovr: 70, pot: 75 },
        { name: "Akram Bongonga", pos: "MOD", age: 26, ovr: 72, pot: 73 }
    ],

    "FC Lupopo": [ // Les "Cheminots" de Lubumbashi, grande rivalité avec Mazembe (72 - 76)
        { name: "Yves Mukawa", pos: "G", age: 28, ovr: 75, pot: 76 },
        { name: "Sefu Ngongo", pos: "G", age: 23, ovr: 70, pot: 74 },
        { name: "Chadrack Boka", pos: "DC", age: 24, ovr: 74, pot: 78 },
        { name: "Mukoko Batezadio", pos: "DC", age: 30, ovr: 75, pot: 75 },
        { name: "Dieu-Merci Ndongala", pos: "DD", age: 26, ovr: 73, pot: 74 },
        { name: "Isaac Banza", pos: "DG", age: 25, ovr: 72, pot: 75 },
        { name: "Luc Kanda", pos: "DC", age: 22, ovr: 71, pot: 76 },
        { name: "Masasi Obenza", pos: "MDC", age: 27, ovr: 75, pot: 76 },
        { name: "Ciel Ebengo", pos: "MC", age: 24, ovr: 74, pot: 77 },
        { name: "Josue Kazema", pos: "MOC", age: 26, ovr: 75, pot: 75 },
        { name: "Mika Miche", pos: "MDC", age: 28, ovr: 74, pot: 74 },
        { name: "Allan Kateregga", pos: "MC", age: 29, ovr: 73, pot: 73 }, // Technicien ougandais
        { name: "Patou Kabangu", pos: "MOD", age: 38, ovr: 73, pot: 73 }, // Légende congolaise inépuisable
        { name: "Horso Mwaku", pos: "MOG", age: 23, ovr: 73, pot: 78 },
        { name: "Heritier Kasongo", pos: "BT", age: 26, ovr: 75, pot: 76 },
        { name: "Sydney Lokale", pos: "BT", age: 24, ovr: 74, pot: 78 },
        { name: "Kazadi Kasengu", pos: "BT", age: 31, ovr: 74, pot: 74 },
        { name: "Jonathan Mokonzi", pos: "MOG", age: 21, ovr: 70, pot: 76 }
    ],

    "Maniema Union": [ // Basé à Kindu, la "troisième force" du pays ces dernières années (72 - 76)
        { name: "Brudel Efonge", pos: "G", age: 25, ovr: 74, pot: 78 },
        { name: "Jackson Lunanga", pos: "G", age: 27, ovr: 73, pot: 74 },
        { name: "Osimbi Ndombe", pos: "DC", age: 26, ovr: 74, pot: 76 },
        { name: "Tychique Kanza", pos: "DC", age: 24, ovr: 73, pot: 76 },
        { name: "Radjabu Atibu", pos: "DD", age: 28, ovr: 74, pot: 74 },
        { name: "Dieu-Beni Ndongala", pos: "DG", age: 22, ovr: 72, pot: 77 },
        { name: "Herve Mbuyi", pos: "DC", age: 23, ovr: 71, pot: 75 },
        { name: "Christian Ngimbi", pos: "MDC", age: 26, ovr: 74, pot: 76 },
        { name: "Lema Pongo", pos: "MC", age: 25, ovr: 73, pot: 75 },
        { name: "Maxi Mpia", pos: "MOC", age: 27, ovr: 75, pot: 75 }, // Chef d'orchestre
        { name: "Denis Mutombo", pos: "MDC", age: 24, ovr: 72, pot: 75 },
        { name: "Gédéon Kantu", pos: "MC", age: 21, ovr: 70, pot: 76 },
        { name: "Imana Lote", pos: "MOG", age: 25, ovr: 75, pot: 77 }, // Ailier dangereux
        { name: "Junior Mwanza", pos: "MOD", age: 23, ovr: 73, pot: 78 },
        { name: "Cyrille Mutwale", pos: "BT", age: 28, ovr: 75, pot: 75 },
        { name: "Jephte Kitambala", pos: "BT", age: 24, ovr: 74, pot: 77 },
        { name: "Glody Kilangalanga", pos: "BT", age: 25, ovr: 73, pot: 75 },
        { name: "Tawite Kitoko", pos: "MOD", age: 20, ovr: 70, pot: 76 }
    ],

    "Don Bosco": [ // Les Salésiens de Lubumbashi, équipe jeune, affiliée à Mazembe (69 - 73)
        { name: "Aime Bakula", pos: "G", age: 22, ovr: 70, pot: 76 },
        { name: "Esdras Kabamba", pos: "G", age: 24, ovr: 68, pot: 73 },
        { name: "Idris Kisha", pos: "DC", age: 23, ovr: 71, pot: 75 },
        { name: "Godet Masengo", pos: "DC", age: 21, ovr: 70, pot: 77 },
        { name: "Felicien Kabwe", pos: "DD", age: 25, ovr: 72, pot: 74 },
        { name: "Lumbu Kasongo", pos: "DG", age: 20, ovr: 69, pot: 76 },
        { name: "Patient Mwepu", pos: "DC", age: 24, ovr: 70, pot: 74 },
        { name: "Junior Ngalamulume", pos: "MDC", age: 22, ovr: 71, pot: 76 },
        { name: "Alain Banza", pos: "MC", age: 23, ovr: 70, pot: 75 },
        { name: "Pepe Mundele", pos: "MOC", age: 20, ovr: 72, pot: 80 }, // Très technique
        { name: "Tresor Kanda", pos: "MDC", age: 24, ovr: 69, pot: 73 },
        { name: "Chadrack Ilunga", pos: "MC", age: 21, ovr: 68, pot: 75 },
        { name: "Elie Mukendi", pos: "MOG", age: 22, ovr: 71, pot: 77 },
        { name: "Giresse Mbuyi", pos: "MOD", age: 23, ovr: 70, pot: 74 },
        { name: "Meschack Kalala", pos: "BT", age: 24, ovr: 73, pot: 76 },
        { name: "Filston Tshibangu", pos: "BT", age: 21, ovr: 71, pot: 78 },
        { name: "David Mutombo", pos: "BT", age: 19, ovr: 68, pot: 75 },
        { name: "Junior Lokwa", pos: "MOD", age: 22, ovr: 69, pot: 74 }
    ],

    "AS Dauphins Noirs": [ // Fierté de Goma (Nord-Kivu), redoutable à domicile (69 - 73)
        { name: "Jackson Lunanga", pos: "G", age: 28, ovr: 73, pot: 73 },
        { name: "Amani Kavunga", pos: "G", age: 23, ovr: 69, pot: 74 },
        { name: "Papy Kabasele", pos: "DC", age: 27, ovr: 72, pot: 74 },
        { name: "Hervé Kasonde", pos: "DC", age: 25, ovr: 71, pot: 75 },
        { name: "Tresor Ndaka", pos: "DD", age: 26, ovr: 70, pot: 72 },
        { name: "Gedeon Mwanza", pos: "DG", age: 24, ovr: 71, pot: 74 },
        { name: "Yves Kalumba", pos: "DC", age: 22, ovr: 69, pot: 75 },
        { name: "Christian Mukumi", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Enoch Kamba", pos: "MC", age: 25, ovr: 71, pot: 75 },
        { name: "Jonathan Mambu", pos: "MOC", age: 26, ovr: 72, pot: 74 },
        { name: "Tychique Bukasa", pos: "MDC", age: 23, ovr: 70, pot: 74 },
        { name: "Alain Kakule", pos: "MC", age: 21, ovr: 68, pot: 75 },
        { name: "Lola Kanda", pos: "MOG", age: 25, ovr: 72, pot: 74 },
        { name: "Kambale Muhindo", pos: "MOD", age: 22, ovr: 70, pot: 76 },
        { name: "Gloire Ndaye", pos: "BT", age: 27, ovr: 73, pot: 74 },
        { name: "Radjabu Shabani", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "Jephte Ndongala", pos: "BT", age: 20, ovr: 69, pot: 76 },
        { name: "Dieu-Merci Kambale", pos: "MOD", age: 23, ovr: 70, pot: 74 }
    ],

    "JS Kinshasa": [ // La Jeunesse Sportive de Kinshasa, équipe combative de la capitale (68 - 72)
        { name: "Heritier Nke", pos: "G", age: 26, ovr: 71, pot: 74 },
        { name: "Gael Banza", pos: "G", age: 22, ovr: 67, pot: 73 },
        { name: "Benny Nsoki", pos: "DC", age: 28, ovr: 72, pot: 72 },
        { name: "Josue Kiala", pos: "DC", age: 24, ovr: 70, pot: 74 },
        { name: "Nathan Mayele", pos: "DD", age: 25, ovr: 71, pot: 73 },
        { name: "Tshekwa Mampuya", pos: "DG", age: 23, ovr: 69, pot: 74 },
        { name: "Christian Luyindama", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Odon Mbala", pos: "MDC", age: 27, ovr: 72, pot: 73 },
        { name: "Francis Nsingi", pos: "MC", age: 25, ovr: 70, pot: 74 },
        { name: "Manasse Mutombo", pos: "MOC", age: 22, ovr: 71, pot: 76 },
        { name: "Zola Kinkela", pos: "MDC", age: 24, ovr: 69, pot: 73 },
        { name: "Gedeon Kalala", pos: "MC", age: 20, ovr: 67, pot: 75 },
        { name: "Merveille Diakite", pos: "MOG", age: 26, ovr: 71, pot: 72 },
        { name: "Chadrack Boka", pos: "MOD", age: 23, ovr: 70, pot: 75 },
        { name: "Arnold Mvuemba", pos: "BT", age: 29, ovr: 73, pot: 73 },
        { name: "Jeremie Mumbere", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "Exauce Ndombe", pos: "BT", age: 21, ovr: 69, pot: 76 },
        { name: "Glody Mbuyi", pos: "MOD", age: 22, ovr: 68, pot: 73 }
    ],

    "Lubumbashi Sport": [ // Les "Kamikazes", le 3ème club de Lubumbashi (68 - 72)
        { name: "Nathaniel Mpala", pos: "G", age: 25, ovr: 71, pot: 75 },
        { name: "Isaac Kabasele", pos: "G", age: 21, ovr: 67, pot: 74 },
        { name: "Idris Mbombo", pos: "DC", age: 29, ovr: 72, pot: 72 },
        { name: "Kabeya Katshimuka", pos: "DC", age: 24, ovr: 70, pot: 74 },
        { name: "Tresor Mukendi", pos: "DD", age: 26, ovr: 71, pot: 73 },
        { name: "Herve Kasongo", pos: "DG", age: 23, ovr: 69, pot: 74 },
        { name: "Patou Mbuyamba", pos: "DC", age: 22, ovr: 68, pot: 75 },
        { name: "Eric Tshibasu", pos: "MDC", age: 28, ovr: 72, pot: 72 },
        { name: "Patient Ilunga", pos: "MC", age: 25, ovr: 70, pot: 74 },
        { name: "Meschack Mampuya", pos: "MOC", age: 24, ovr: 71, pot: 75 },
        { name: "David Kabangu", pos: "MDC", age: 21, ovr: 68, pot: 74 },
        { name: "Christian Lwamba", pos: "MC", age: 23, ovr: 69, pot: 73 },
        { name: "Felix Ngandu", pos: "MOG", age: 26, ovr: 71, pot: 72 },
        { name: "Giresse Kalonji", pos: "MOD", age: 22, ovr: 70, pot: 76 },
        { name: "Aristote Ndongala", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Jonathan Kasongo", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "Eliezer Banza", pos: "BT", age: 20, ovr: 68, pot: 74 },
        { name: "Cedric Kanda", pos: "MOD", age: 23, ovr: 69, pot: 73 }
    ],

    "Sanga Balende": [ // "Wa Banjelu ne Bansantu" (Le club des Anges et Saints) de Mbuji-Mayi (69 - 73)
        { name: "Kalambayi Katembwe", pos: "G", age: 27, ovr: 72, pot: 74 },
        { name: "Odon Ndaye", pos: "G", age: 23, ovr: 68, pot: 73 },
        { name: "Ndaya Mbaya", pos: "DC", age: 30, ovr: 73, pot: 73 }, // Leader défensif
        { name: "Mukendi Mulumba", pos: "DC", age: 25, ovr: 71, pot: 74 },
        { name: "Tshibangu Kazadi", pos: "DD", age: 26, ovr: 70, pot: 72 },
        { name: "Ilunga Nkongolo", pos: "DG", age: 24, ovr: 71, pot: 75 },
        { name: "Kabeya Ngandu", pos: "DC", age: 22, ovr: 68, pot: 73 },
        { name: "Mwamba Mutombo", pos: "MDC", age: 29, ovr: 73, pot: 73 },
        { name: "Tshitenge Kankonda", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Kalombayi Muteba", pos: "MOC", age: 26, ovr: 72, pot: 74 },
        { name: "Badibanga Tumba", pos: "MDC", age: 23, ovr: 69, pot: 74 },
        { name: "Nkashama Mbuyi", pos: "MC", age: 21, ovr: 68, pot: 75 },
        { name: "Mputu Mubiayi", pos: "MOG", age: 25, ovr: 71, pot: 73 },
        { name: "Ntumba Kabasele", pos: "MOD", age: 22, ovr: 70, pot: 75 },
        { name: "Luse Ndongala", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Banza Mwilambwe", pos: "BT", age: 23, ovr: 72, pot: 77 }, // Attaquant très rapide
        { name: "Kabengele Tshibala", pos: "BT", age: 20, ovr: 69, pot: 76 },
        { name: "Ngalula Kabongo", pos: "MOD", age: 24, ovr: 70, pot: 74 }
    ],
    // ==========================================
    // RDC (LINAFOOT) - PARTIE 2/2
    // ==========================================

    "FC Renaissance": [ // "Les Oranges" de Kinshasa, club au public très fervent (69 - 73)
        { name: "Guy Serge", pos: "G", age: 26, ovr: 72, pot: 75 },
        { name: "Papy Lukata", pos: "G", age: 22, ovr: 68, pot: 73 },
        { name: "Inonga Baka", pos: "DC", age: 28, ovr: 73, pot: 73 },
        { name: "Jules Kanku", pos: "DC", age: 25, ovr: 71, pot: 74 },
        { name: "Hervé Apinda", pos: "DD", age: 26, ovr: 70, pot: 72 },
        { name: "Christian Ngondola", pos: "DG", age: 24, ovr: 71, pot: 74 },
        { name: "Tresor Kiala", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Zola Matumona", pos: "MDC", age: 30, ovr: 73, pot: 73 },
        { name: "Merveille Kikasa", pos: "MC", age: 24, ovr: 71, pot: 75 },
        { name: "Glody Mambenga", pos: "MOC", age: 25, ovr: 72, pot: 74 },
        { name: "Ricky Mabi", pos: "MDC", age: 23, ovr: 69, pot: 73 },
        { name: "Beni Kinzumbi", pos: "MC", age: 20, ovr: 67, pot: 76 },
        { name: "Lema Mabidi", pos: "MOG", age: 27, ovr: 72, pot: 72 },
        { name: "Cédric Ngulubi", pos: "MOD", age: 23, ovr: 70, pot: 75 },
        { name: "Vincent Bwanga", pos: "BT", age: 28, ovr: 74, pot: 74 },
        { name: "Jean-Marc Mundele", pos: "BT", age: 24, ovr: 72, pot: 76 },
        { name: "Obed Mayamba", pos: "BT", age: 21, ovr: 69, pot: 75 },
        { name: "Dieu-Merci Ndongala", pos: "MOD", age: 22, ovr: 68, pot: 74 }
    ],

    "Kuya Sport": [ // AC Kuya de Kinshasa, équipe accrocheuse et formatrice (67 - 71)
        { name: "Armand Ngeleka", pos: "G", age: 25, ovr: 70, pot: 74 },
        { name: "Joël Banza", pos: "G", age: 21, ovr: 66, pot: 72 },
        { name: "Aristote Ndongala", pos: "DC", age: 27, ovr: 71, pot: 72 },
        { name: "Fabrice Kasongo", pos: "DC", age: 23, ovr: 69, pot: 73 },
        { name: "Yannick Mampuya", pos: "DD", age: 24, ovr: 68, pot: 71 },
        { name: "Lucien Kabasele", pos: "DG", age: 26, ovr: 69, pot: 72 },
        { name: "Odon Luyindama", pos: "DC", age: 22, ovr: 67, pot: 74 },
        { name: "Christian Mputu", pos: "MDC", age: 28, ovr: 71, pot: 71 },
        { name: "Dieu-Béni Nsoki", pos: "MC", age: 24, ovr: 69, pot: 73 },
        { name: "Josué Buka", pos: "MOC", age: 22, ovr: 70, pot: 75 },
        { name: "Tresor Mbuyi", pos: "MDC", age: 21, ovr: 67, pot: 72 },
        { name: "Patient Kalala", pos: "MC", age: 23, ovr: 68, pot: 73 },
        { name: "Elie Mukendi", pos: "MOG", age: 25, ovr: 70, pot: 72 },
        { name: "Jephté Kazadi", pos: "MOD", age: 20, ovr: 68, pot: 76 },
        { name: "Manassé Mutombo", pos: "BT", age: 26, ovr: 72, pot: 73 },
        { name: "Gloire Ndaye", pos: "BT", age: 22, ovr: 70, pot: 75 },
        { name: "Exaucé Kanda", pos: "BT", age: 19, ovr: 67, pot: 74 },
        { name: "Beni Ilunga", pos: "MOD", age: 24, ovr: 69, pot: 72 }
    ],

    "Blessing FC": [ // "Les Bénis" de Lualaba (Kolwezi), équipe coriace à l'extérieur (68 - 72)
        { name: "Cédric Kalombayi", pos: "G", age: 27, ovr: 71, pot: 73 },
        { name: "Prince Ndaye", pos: "G", age: 22, ovr: 67, pot: 74 },
        { name: "Gédéon Mulumba", pos: "DC", age: 28, ovr: 72, pot: 72 },
        { name: "David Tshibangu", pos: "DC", age: 25, ovr: 70, pot: 74 },
        { name: "Serge Ngandu", pos: "DD", age: 26, ovr: 69, pot: 71 },
        { name: "Michel Kankonda", pos: "DG", age: 24, ovr: 70, pot: 73 },
        { name: "Tychique Mbaya", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Isaac Tumba", pos: "MDC", age: 29, ovr: 72, pot: 72 },
        { name: "Luse Mubiayi", pos: "MC", age: 24, ovr: 70, pot: 75 },
        { name: "Meschack Kabasele", pos: "MOC", age: 26, ovr: 71, pot: 74 },
        { name: "Jonathan Tshibala", pos: "MDC", age: 23, ovr: 69, pot: 73 },
        { name: "Arnold Kabongo", pos: "MC", age: 22, ovr: 68, pot: 74 },
        { name: "Hervé Mwilambwe", pos: "MOG", age: 25, ovr: 71, pot: 73 },
        { name: "Giresse Mutombo", pos: "MOD", age: 23, ovr: 70, pot: 75 },
        { name: "Félicien Banza", pos: "BT", age: 27, ovr: 73, pot: 73 },
        { name: "Eliezer Kasongo", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "Kabeya Katshimuka", pos: "BT", age: 20, ovr: 69, pot: 76 },
        { name: "Odon Nkongolo", pos: "MOD", age: 25, ovr: 69, pot: 72 }
    ],

    "Etoile du Kivu": [ // Basé à Bukavu, défend fièrement les couleurs du Sud-Kivu (67 - 71)
        { name: "Jackson Muhindo", pos: "G", age: 26, ovr: 70, pot: 73 },
        { name: "Amani Kavunga", pos: "G", age: 23, ovr: 66, pot: 72 },
        { name: "Dieu-Merci Kambale", pos: "DC", age: 28, ovr: 71, pot: 72 },
        { name: "Papy Kabasele", pos: "DC", age: 24, ovr: 69, pot: 73 },
        { name: "Tresor Ndaka", pos: "DD", age: 25, ovr: 68, pot: 71 },
        { name: "Gedeon Mwanza", pos: "DG", age: 26, ovr: 70, pot: 72 },
        { name: "Yves Kalumba", pos: "DC", age: 22, ovr: 67, pot: 74 },
        { name: "Christian Mukumi", pos: "MDC", age: 29, ovr: 72, pot: 72 },
        { name: "Enoch Kamba", pos: "MC", age: 23, ovr: 69, pot: 74 },
        { name: "Jonathan Mambu", pos: "MOC", age: 25, ovr: 71, pot: 73 },
        { name: "Tychique Bukasa", pos: "MDC", age: 21, ovr: 67, pot: 72 },
        { name: "Alain Kakule", pos: "MC", age: 24, ovr: 68, pot: 72 },
        { name: "Lola Kanda", pos: "MOG", age: 26, ovr: 70, pot: 71 },
        { name: "Kambale Muhindo", pos: "MOD", age: 22, ovr: 69, pot: 74 },
        { name: "Gloire Ndaye", pos: "BT", age: 27, ovr: 72, pot: 72 },
        { name: "Radjabu Shabani", pos: "BT", age: 24, ovr: 70, pot: 74 },
        { name: "Jephte Ndongala", pos: "BT", age: 20, ovr: 68, pot: 75 },
        { name: "Hervé Kasonde", pos: "MOD", age: 25, ovr: 68, pot: 71 }
    ],

    "US Panda": [ // US Panda B52, l'équipe de Likasi (Haut-Katanga) (67 - 71)
        { name: "Isaac Kabasele", pos: "G", age: 25, ovr: 70, pot: 74 },
        { name: "Nathaniel Mpala", pos: "G", age: 21, ovr: 66, pot: 73 },
        { name: "Idris Mbombo", pos: "DC", age: 28, ovr: 72, pot: 73 },
        { name: "Kabeya Katshimuka", pos: "DC", age: 23, ovr: 69, pot: 74 },
        { name: "Tresor Mukendi", pos: "DD", age: 25, ovr: 68, pot: 72 },
        { name: "Herve Kasongo", pos: "DG", age: 24, ovr: 69, pot: 73 },
        { name: "Patou Mbuyamba", pos: "DC", age: 22, ovr: 67, pot: 75 },
        { name: "Eric Tshibasu", pos: "MDC", age: 29, ovr: 71, pot: 71 },
        { name: "Patient Ilunga", pos: "MC", age: 24, ovr: 69, pot: 74 },
        { name: "Meschack Mampuya", pos: "MOC", age: 25, ovr: 70, pot: 73 },
        { name: "David Kabangu", pos: "MDC", age: 21, ovr: 67, pot: 72 },
        { name: "Christian Lwamba", pos: "MC", age: 23, ovr: 68, pot: 73 },
        { name: "Felix Ngandu", pos: "MOG", age: 26, ovr: 70, pot: 72 },
        { name: "Giresse Kalonji", pos: "MOD", age: 22, ovr: 69, pot: 75 },
        { name: "Aristote Ndongala", pos: "BT", age: 27, ovr: 72, pot: 72 },
        { name: "Jonathan Kasongo", pos: "BT", age: 24, ovr: 70, pot: 74 },
        { name: "Eliezer Banza", pos: "BT", age: 20, ovr: 68, pot: 75 },
        { name: "Cedric Kanda", pos: "MOD", age: 25, ovr: 68, pot: 71 }
    ],

    "Céleste FC": [ // Nouveau venu ambitieux dans le paysage congolais (67 - 71)
        { name: "Gael Banza", pos: "G", age: 26, ovr: 71, pot: 73 },
        { name: "Heritier Nke", pos: "G", age: 22, ovr: 67, pot: 74 },
        { name: "Benny Nsoki", pos: "DC", age: 27, ovr: 72, pot: 73 },
        { name: "Josue Kiala", pos: "DC", age: 24, ovr: 70, pot: 75 },
        { name: "Nathan Mayele", pos: "DD", age: 25, ovr: 69, pot: 72 },
        { name: "Tshekwa Mampuya", pos: "DG", age: 23, ovr: 70, pot: 74 },
        { name: "Christian Luyindama", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Odon Mbala", pos: "MDC", age: 28, ovr: 71, pot: 71 },
        { name: "Francis Nsingi", pos: "MC", age: 24, ovr: 69, pot: 74 },
        { name: "Manasse Mutombo", pos: "MOC", age: 22, ovr: 70, pot: 76 },
        { name: "Zola Kinkela", pos: "MDC", age: 23, ovr: 68, pot: 73 },
        { name: "Gedeon Kalala", pos: "MC", age: 20, ovr: 67, pot: 75 },
        { name: "Merveille Diakite", pos: "MOG", age: 25, ovr: 71, pot: 73 },
        { name: "Chadrack Boka", pos: "MOD", age: 22, ovr: 70, pot: 75 },
        { name: "Arnold Mvuemba", pos: "BT", age: 29, ovr: 72, pot: 72 },
        { name: "Jeremie Mumbere", pos: "BT", age: 24, ovr: 71, pot: 74 },
        { name: "Exauce Ndombe", pos: "BT", age: 21, ovr: 69, pot: 76 },
        { name: "Glody Mbuyi", pos: "MOD", age: 24, ovr: 69, pot: 72 }
    ],

    "Rangers": [ // AC Rangers (Kinshasa), équipe réputée pour sa belle circulation de balle (68 - 72)
        { name: "Vandiya Bunde", pos: "G", age: 25, ovr: 71, pot: 75 },
        { name: "Hervé Lomboto", pos: "G", age: 22, ovr: 68, pot: 74 },
        { name: "Apianom Kasereka", pos: "DC", age: 28, ovr: 72, pot: 73 },
        { name: "Christian Ndongani", pos: "DC", age: 24, ovr: 70, pot: 75 },
        { name: "Jonathan Mutombo", pos: "DD", age: 25, ovr: 70, pot: 73 },
        { name: "Gloire Nzey", pos: "DG", age: 23, ovr: 71, pot: 74 },
        { name: "Herve Beya", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Junior Kone", pos: "MDC", age: 27, ovr: 72, pot: 73 },
        { name: "Karim Kimvuidi", pos: "MC", age: 24, ovr: 70, pot: 76 },
        { name: "Jonathan Mambabua", pos: "MOC", age: 25, ovr: 71, pot: 75 },
        { name: "Doxa Gikanji", pos: "MDC", age: 22, ovr: 69, pot: 74 },
        { name: "Jimmy Bayindula", pos: "MC", age: 20, ovr: 67, pot: 76 },
        { name: "Borel Tomandzoto", pos: "MOG", age: 26, ovr: 71, pot: 72 },
        { name: "Akram Bongonga", pos: "MOD", age: 23, ovr: 70, pot: 75 },
        { name: "Roland Mbala", pos: "BT", age: 28, ovr: 73, pot: 73 },
        { name: "Grace Madinga", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "Jean-Marc Makusu", pos: "BT", age: 21, ovr: 69, pot: 76 },
        { name: "Ricky Tulengi", pos: "MOD", age: 24, ovr: 69, pot: 72 }
    ],

    "Simba": [ // AS Simba (Kolwezi), les Kamikazes du Lualaba (67 - 71)
        { name: "Odon Ndaye", pos: "G", age: 27, ovr: 71, pot: 72 },
        { name: "Kalambayi Katembwe", pos: "G", age: 23, ovr: 67, pot: 73 },
        { name: "Ndaya Mbaya", pos: "DC", age: 29, ovr: 72, pot: 72 },
        { name: "Mukendi Mulumba", pos: "DC", age: 25, ovr: 70, pot: 74 },
        { name: "Tshibangu Kazadi", pos: "DD", age: 26, ovr: 69, pot: 71 },
        { name: "Ilunga Nkongolo", pos: "DG", age: 24, ovr: 70, pot: 73 },
        { name: "Kabeya Ngandu", pos: "DC", age: 22, ovr: 68, pot: 74 },
        { name: "Mwamba Mutombo", pos: "MDC", age: 28, ovr: 71, pot: 71 },
        { name: "Tshitenge Kankonda", pos: "MC", age: 25, ovr: 69, pot: 73 },
        { name: "Kalombayi Muteba", pos: "MOC", age: 26, ovr: 71, pot: 74 },
        { name: "Badibanga Tumba", pos: "MDC", age: 23, ovr: 68, pot: 72 },
        { name: "Nkashama Mbuyi", pos: "MC", age: 21, ovr: 67, pot: 74 },
        { name: "Mputu Mubiayi", pos: "MOG", age: 25, ovr: 70, pot: 72 },
        { name: "Ntumba Kabasele", pos: "MOD", age: 22, ovr: 69, pot: 75 },
        { name: "Luse Ndongala", pos: "BT", age: 27, ovr: 72, pot: 73 },
        { name: "Banza Mwilambwe", pos: "BT", age: 24, ovr: 70, pot: 74 },
        { name: "Kabengele Tshibala", pos: "BT", age: 20, ovr: 68, pot: 75 },
        { name: "Ngalula Kabongo", pos: "MOD", age: 24, ovr: 69, pot: 72 }
    ],

    "Bazano": [ // JS Groupe Bazano de Lubumbashi, solide et physique (68 - 72)
        { name: "Esdras Kabamba", pos: "G", age: 26, ovr: 71, pot: 74 },
        { name: "Aime Bakula", pos: "G", age: 22, ovr: 67, pot: 73 },
        { name: "Idris Kisha", pos: "DC", age: 28, ovr: 72, pot: 73 },
        { name: "Godet Masengo", pos: "DC", age: 24, ovr: 70, pot: 75 },
        { name: "Felicien Kabwe", pos: "DD", age: 25, ovr: 70, pot: 72 },
        { name: "Lumbu Kasongo", pos: "DG", age: 23, ovr: 71, pot: 74 },
        { name: "Patient Mwepu", pos: "DC", age: 21, ovr: 68, pot: 75 },
        { name: "Junior Ngalamulume", pos: "MDC", age: 27, ovr: 72, pot: 72 },
        { name: "Alain Banza", pos: "MC", age: 24, ovr: 70, pot: 74 },
        { name: "Pepe Mundele", pos: "MOC", age: 25, ovr: 71, pot: 75 },
        { name: "Tresor Kanda", pos: "MDC", age: 22, ovr: 69, pot: 73 },
        { name: "Chadrack Ilunga", pos: "MC", age: 20, ovr: 67, pot: 76 },
        { name: "Elie Mukendi", pos: "MOG", age: 26, ovr: 71, pot: 72 },
        { name: "Giresse Mbuyi", pos: "MOD", age: 23, ovr: 70, pot: 75 },
        { name: "Meschack Kalala", pos: "BT", age: 28, ovr: 73, pot: 73 },
        { name: "Filston Tshibangu", pos: "BT", age: 24, ovr: 71, pot: 75 },
        { name: "David Mutombo", pos: "BT", age: 21, ovr: 69, pot: 76 },
        { name: "Junior Lokwa", pos: "MOD", age: 24, ovr: 69, pot: 72 }
    ],

    "Tshinkunku": [ // US Tshinkunku de Kananga, le club historique du Kasaï (67 - 71)
        { name: "Sefu Ngongo", pos: "G", age: 25, ovr: 70, pot: 74 },
        { name: "Yves Mukawa", pos: "G", age: 22, ovr: 66, pot: 73 },
        { name: "Chadrack Boka", pos: "DC", age: 27, ovr: 71, pot: 72 },
        { name: "Mukoko Batezadio", pos: "DC", age: 24, ovr: 69, pot: 73 },
        { name: "Dieu-Merci Ndongala", pos: "DD", age: 26, ovr: 69, pot: 71 },
        { name: "Isaac Banza", pos: "DG", age: 23, ovr: 70, pot: 74 },
        { name: "Luc Kanda", pos: "DC", age: 21, ovr: 67, pot: 75 },
        { name: "Masasi Obenza", pos: "MDC", age: 28, ovr: 71, pot: 71 },
        { name: "Ciel Ebengo", pos: "MC", age: 24, ovr: 69, pot: 74 },
        { name: "Josue Kazema", pos: "MOC", age: 25, ovr: 70, pot: 73 },
        { name: "Mika Miche", pos: "MDC", age: 22, ovr: 68, pot: 72 },
        { name: "Allan Kateregga", pos: "MC", age: 20, ovr: 66, pot: 75 },
        { name: "Horso Mwaku", pos: "MOG", age: 26, ovr: 70, pot: 71 },
        { name: "Jonathan Mokonzi", pos: "MOD", age: 23, ovr: 69, pot: 74 },
        { name: "Heritier Kasongo", pos: "BT", age: 27, ovr: 72, pot: 72 },
        { name: "Sydney Lokale", pos: "BT", age: 24, ovr: 70, pot: 74 },
        { name: "Kazadi Kasengu", pos: "BT", age: 21, ovr: 68, pot: 75 },
        { name: "Patou Kabangu", pos: "MOD", age: 25, ovr: 68, pot: 71 }
    ]

    
};


const REGIONAL_NAMES = {
    francophone: {
        first: [
            'Seydou', 'Amad', 'Franck', 'Eric', 'Moussa', 'Salif', 'Yaya', 'Kolo', 'Didier', 'Sadio',
            'Cheikhou', 'Idrissa', 'Kalidou', 'Ismaïla', 'Amadou', 'Koffi', 'Cheick', 'Armel', 'Cyrille', 'Junior',
            'Lionel', 'Marcel', 'Narcisse', 'Patrick', 'Rodrigue', 'Samuel', 'Thierry', 'Valentin', 'Wilfried', 'Axel',
            'Bertrand', 'Cédric', 'Dimitri', 'Emile', 'Fabrice', 'Gervais', 'Hervé', 'Ignace', 'Jules', 'Kevin',
            'Landry', 'Martial', 'Norbert', 'Olivier', 'Pierre', 'Quentin', 'René', 'Serge', 'Théodore', 'Urbain',
            'Vincent', 'Xavier', 'Yvon', 'Zacharie', 'Abou', 'Bakary', 'Constant', 'Daouda', 'Ernest', 'Fréjus',
            'Hyacinthe', 'Issouf', 'Karamoko', 'Lassina', 'Mamadou', 'Oumar', 'Raoul', 'Stéphane', 'Trésor', 'Ulrich',
            'Venance', 'Willy', 'Yacouba', 'Abdoulaye', 'Blaise', 'Christian', 'Ferdinand', 'Guillaume', 'Honoré', 'Lamine'
        ],
        last: [
            'Kéita', 'Touré', 'Kouassi', 'Bamba', 'Koné', 'Cissé', 'Traoré', 'Diallo', 'Diabaté', 'Camara',
            'Mane', 'Sarr', 'Gueye', 'Koulibaly', 'Diaby', 'Coulibaly', 'Dembélé', 'Fofana', 'Konaté', 'Ouattara',
            'Sanogo', 'Tra Bi', 'Aka', 'Brou', 'Kouamé', 'Diouf', 'Sylla', 'Barry', 'Baldé', 'Dramé',
            'Sow', 'Ndiaye', 'Fall', 'Mbaye', 'Ndoye', 'Mendy', 'Coly', 'Badji', 'Manga', 'Sagna',
            'Gomis', 'Kouyaté', 'Kanté', 'Sissoko', 'Doumbia', 'Kourouma', 'Zouzoua', 'N\'Guessan', 'Yao', 'Gnakouri',
            'Méité', 'Péléa', 'Lago', 'Kra', 'Ahoussi', 'Ettien', 'Assi', 'Boka', 'Zokora', 'Kalou',
            'Tiéné', 'Gossié', 'Lobognon', 'Akpa', 'Pokou', 'Kassi', 'Guéi', 'Tape', 'Somé', 'Diabaté',
            'Seri', 'Gradel', 'Pépé', 'Zaha', 'Aurier', 'Boly', 'Kourouma', 'Gbagbo', 'Bi Zoro', 'Kpan'
        ]
    },
    arab: {
        first: [
            'Youssef', 'Ali', 'Mohamed', 'Hassan', 'Ibrahim', 'Mahmoud', 'Tarek', 'Hakim', 'Brahim', 'Sofiane',
            'Riyad', 'Aïssa', 'Karim', 'Mehdi', 'Amine', 'Ayoub', 'Bilal', 'Hicham', 'Ilias', 'Jamal',
            'Khalid', 'Lotfi', 'Nabil', 'Omar', 'Rachid', 'Samir', 'Walid', 'Achraf', 'Badr', 'Chakib',
            'Driss', 'Faisal', 'Ghali', 'Hamza', 'Jawad', 'Lahcen', 'Mounir', 'Nassim', 'Othmane', 'Reda',
            'Taha', 'Younes', 'Zakaria', 'Adil', 'Aziz', 'Bassem', 'Chamseddine', 'Djamel', 'Essam', 'Farouk',
            'Gamal', 'Hossam', 'Ismail', 'Jaber', 'Khaled', 'Maher', 'Nader', 'Oussama', 'Rami', 'Saber',
            'Wissam', 'Yahia', 'Zied', 'Amir', 'Cherif', 'Ezzeddine', 'Firas', 'Habib', 'Imed', 'Marouane',
            'Naoufel', 'Rafik', 'Seifeddine', 'Taoufik', 'Wael', 'Yassine', 'Zouhaier', 'Abdelkader', 'Boubaker', 'Chokri'
        ],
        last: [
            'El Amrani', 'Benali', 'Mansour', 'Saidi', 'Haddad', 'Ziyech', 'Salah', 'Mahrez', 'Bounou', 'Hakimi',
            'Ounahi', 'Amrabat', 'Gouiri', 'Chaoui', 'Daoud', 'Farhat', 'Ghazi', 'Hamid', 'Idrissi', 'Jabrane',
            'Kadri', 'Lamari', 'Mansouri', 'Nouri', 'Ouali', 'Rachidi', 'Tahiri', 'Amrani', 'Benzema', 'Drissi',
            'Essafi', 'Fennich', 'Guedioura', 'Iajour', 'Jamali', 'Kharrat', 'Laouini', 'Msakni', 'Namouchi', 'Ouertatani',
            'Sassi', 'Trabelsi', 'Ben Youssef', 'Jebali', 'Sliti', 'Badri', 'Chemmam', 'Dhaouadi', 'Elkadri', 'Ferchichi',
            'Ghandri', 'Hergal', 'Jelassi', 'Kechrida', 'Lajili', 'Meriah', 'Nacef', 'Ounalli', 'Riahi', 'Souayah',
            'Agrebi', 'Belaili', 'Djahnit', 'Feghouli', 'Ghilas', 'Halliche', 'Kraouche', 'Lacen', 'Medjani', 'Neffati',
            'Ounas', 'Rahmani', 'Slimani', 'Taïder', 'Zoubir', 'Belkalem', 'Mandi', 'Bentaleb', 'Brahimi', 'Aouar'
        ]
    },
    anglophone: {
        first: [
            'John', 'Peter', 'Samuel', 'Sunday', 'Vincent', 'Percy', 'Themba', 'Ronwen', 'Teboho', 'Khuliso',
            'Emeka', 'Chukwu', 'Tunde', 'Seun', 'Femi', 'Bayo', 'Kelechi', 'Chidi', 'Nnamdi', 'Obinna',
            'Rotimi', 'Sola', 'Tayo', 'Uche', 'Wale', 'Yemi', 'Adama', 'Benson', 'Collins', 'Daniel',
            'Evans', 'Fortune', 'Gift', 'Henry', 'Isaac', 'Joel', 'Kenneth', 'Leke', 'Moses', 'Nathan',
            'Oluwafemi', 'Prince', 'Rasheed', 'Taiwo', 'Ugochukwu', 'Wisdom', 'Yusuf', 'Zuberu', 'Asamoah', 'Bright',
            'Christian', 'Dominic', 'Emmanuel', 'Francis', 'George', 'Haruna', 'Innocent', 'James', 'Kingsley', 'Lawrence',
            'Michael', 'Nicholas', 'Obi', 'Paul', 'Quincy', 'Robert', 'Stephen', 'Uchenna', 'Walter', 'Yaw',
            'Celestine', 'Divine', 'Elisha', 'Festus', 'Godwin', 'Hillary', 'Jerome', 'Kofi', 'Leonard', 'Maxwell'
        ],
        last: [
            'Ndidi', 'Balogun', 'Zwane', 'Mokoena', 'Dlamini', 'Tau', 'Williams', 'Modiba', 'Mudau', 'Osimhen',
            'Iwobi', 'Ekong', 'Okafor', 'Eze', 'Nwankwo', 'Dike', 'Awoniyi', 'Bassey', 'Chukwueze', 'Dennis',
            'Ejuke', 'Fatawu', 'Ghartey', 'Haruna', 'Ibrahim', 'Johnson', 'Kamara', 'Laryea', 'Mensah', 'Nkrumah',
            'Ofori', 'Partey', 'Quaye', 'Sarpong', 'Thomas', 'Udogie', 'Yeboah', 'Amoah', 'Boateng', 'Cudjoe',
            'Danso', 'Ekuban', 'Frimpong', 'Gyan', 'Hagan', 'Inkoom', 'Kudus', 'Lamptey', 'Muntari', 'Owusu',
            'Paintsil', 'Quartey', 'Rabiu', 'Salifu', 'Tetteh', 'Acheampong', 'Annan', 'Badu', 'Gyamfi', 'Appiah',
            'Atsu', 'Ayew', 'Clottey', 'Enyeama', 'Finidi', 'Kanu', 'Mikel', 'Okocha', 'Olise', 'Onuoha',
            'Ighalo', 'Iheanacho', 'Musa', 'Etebo', 'Aribo', 'Lookman', 'Aina', 'Ekitike', 'Boniface', 'Adeyemi'
        ]
    }
};


// =====================================================================
// ⚽ LOT 15 — MOTEUR DE PLACEMENT (positions réelles + ballon au pied)
// =====================================================================
// Jusqu'ici les joueurs sautaient sur des coordonnées tirées au hasard et
// le ballon vivait sa vie de son côté. Désormais une petite simulation
// positionnelle tourne en parallèle du moteur de match :
//
//   • chaque joueur a une position de base issue de SA formation, puis le
//     bloc entier coulisse vers le ballon (longitudinalement ET
//     latéralement) — c'est le b.a.-ba du jeu de position réel : quand le
//     ballon part sur une aile, le latéral opposé rentre dans l'axe ;
//   • le ballon est TOUJOURS collé au pied d'un porteur identifié, sauf
//     pendant le vol d'une passe ou d'une frappe ;
//   • les actions (passe courte, passe longue, conduite, pressing, perte
//     de balle) sont tirées selon le STYLE de l'équipe qui a le ballon :
//     possession, contre-attaque ou jeu direct ne produisent pas du tout
//     les mêmes séquences ;
//   • le moteur de match reste le patron : quand il annonce une frappe ou
//     une attaque, la simulation obéit et se replace en conséquence.
//
// Le rendu (2D comme 2.5D) ne fait que lire l'état : une seule vérité de
// terrain pour les deux vues.

const MATCHSIM = {
    // Durée d'une action (ms) = durée des transitions CSS. C'est LE curseur
    // de tempo : app.applyTempo() l'écrase selon le réglage choisi par le
    // coach (Lent / Normal / Rapide). Par défaut on joue lentement, parce
    // qu'un match lisible vaut mieux qu'un match expédié.
    TICK: 2400,
    active: false,

    // ---------------------------------------------------------------
    // ZONES DE RESPONSABILITÉ — le cœur du placement par poste
    // ---------------------------------------------------------------
    // Un latéral gauche ne finit pas ailier droit, un défenseur central ne
    // remonte pas jouer avant-centre. Chaque poste reçoit donc une laisse :
    //   dy    = écart latéral maximum autorisé autour de sa position de base
    //   ahead = terrain qu'il a le droit de gagner vers l'avant
    //   back  = jusqu'où il a le droit de reculer
    // Toutes les consignes (bloc qui coulisse, pressing, dérive) sont
    // appliquées AVANT cette laisse : elle a toujours le dernier mot.
    ZONES: {
        GK:   { dy: 10, ahead: 14, back:  4 },
        DC:   { dy: 15, ahead: 22, back: 10 },
        LATD: { dy: 13, ahead: 32, back: 10 },
        LATG: { dy: 13, ahead: 32, back: 10 },
        MDC:  { dy: 17, ahead: 18, back: 20 },
        MC:   { dy: 20, ahead: 24, back: 22 },
        MOC:  { dy: 20, ahead: 22, back: 26 },
        AILD: { dy: 15, ahead: 26, back: 30 },
        AILG: { dy: 15, ahead: 26, back: 30 },
        BT:   { dy: 23, ahead: 18, back: 32 }
    },

    // --- Styles des clubs IA : déterministes, tirés du nom + de la force ---
    styleFor(club, isUser, userTactics) {
        if (isUser && userTactics) return {
            style:     userTactics.style,
            mentality: userTactics.mentality,
            chan:      userTactics.attackSide || 'mixed',   // couloir d'attaque
            press:     userTactics.pressing   || 'half',    // zone de pressing
            line:      userTactics.line       || 'normal'   // hauteur de la défense
        };
        const name = (club && club.name) || 'X';
        let h = 0;
        for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
        const force = (club && club.force) || 70;
        // Les grosses écuries tiennent le ballon, les petites se recroquevillent
        const styles = force >= 78 ? ['possession', 'possession', 'direct']
            : force >= 70 ? ['possession', 'direct', 'counter']
                : ['counter', 'counter', 'direct'];
        const ments = force >= 78 ? ['offensive', 'balanced', 'balanced']
            : force >= 70 ? ['balanced', 'balanced', 'offensive']
                : ['defensive', 'balanced', 'defensive'];
        // L'IA reçoit aussi ses consignes : un cador presse haut et joue une
        // ligne avancée, un promu se replie et défend bas. Déterministe, donc
        // un club donné joue toujours de la même façon.
        const chans = ['mixed', 'flanks', 'middle', 'right', 'left'];
        return {
            style: styles[h % 3],
            mentality: ments[(h >> 3) % 3],
            chan: chans[(h >> 6) % 5],
            press: force >= 78 ? 'all' : force >= 70 ? 'half' : 'area',
            line:  force >= 78 ? 'high' : force >= 70 ? 'normal' : 'low'
        };
    },

    roleOf(i, form) {
        if (i === 0) return 'GK';
        const bx = form[i][0];
        return bx <= 22 ? 'DEF' : bx <= 38 ? 'MIL' : 'ATT';
    },

    // Poste PRÉCIS déduit de la case occupée dans la formation : c'est lui
    // qui décide du comportement (l'ailier tient sa touche, la sentinelle
    // reste devant sa défense, le latéral ne monte que de son côté).
    slotOf(i, form) {
        if (i === 0) return 'GK';
        const bx = form[i][0], by = form[i][1];
        const side = by <= 27 ? 'D' : by >= 73 ? 'G' : 'C';   // couloir droit / gauche / axe
        if (bx <= 28) {
            if (side !== 'C') return 'LAT' + side;
            return bx <= 20 ? 'DC' : 'MDC';   // au-delà, c'est une sentinelle
        }
        if (bx <= 44) {
            if (side !== 'C') return 'AIL' + side;
            return bx <= 36 ? 'MC' : 'MOC';
        }
        return side !== 'C' ? 'AIL' + side : 'BT';
    },

    init(opts) {
        const mk = (form, dir, tac, force, names) => {
            const team = {
                form, dir,                          // dir +1 : attaque vers x=100
                goalX: dir > 0 ? 0 : 100,
                atkX: dir > 0 ? 100 : 0,
                style: tac.style, mentality: tac.mentality,
                chan: tac.chan || 'mixed',      // couloir d'attaque privilégié
                press: tac.press || 'half',     // 'area' | 'half' | 'all'
                line: tac.line || 'normal',     // 'low' | 'normal' | 'high'
                pmIdx: tac.pmIdx != null ? tac.pmIdx : -1,   // meneur de jeu désigné
                force: force || 70,
                names: names || [],
                refX: 50, refY: 50,   // ballon de référence : le bloc suit avec du retard
                p: []
            };
            for (let i = 0; i < 11; i++) {
                const b = this.baseOf(team, i);
                team.p.push({
                    x: b.x, y: b.y, px: b.x, py: b.y, tx: b.x, ty: b.y,
                    role: this.roleOf(i, form), slot: this.slotOf(i, form), i,
                    ph: Math.random() * Math.PI * 2,   // phase de dérive organique
                    face: dir, run: 0
                });
            }
            return team;
        };
        this.H = mk(opts.homeForm, 1, opts.homeTac, opts.homeForce, opts.homeNames);
        this.A = mk(opts.awayForm, -1, opts.awayTac, opts.awayForce, opts.awayNames);
        this.ball = { x: 50, y: 50, z: 0, side: 'H', idx: 9, fly: null };
        this.phase = 'kickoff';
        this.t0 = this.now();
        this.locked = 0;        // ticks pendant lesquels le moteur de match impose la scène
        this.active = true;
        this.applyTargets();
        this.commit();
    },

    now() { return (typeof performance !== 'undefined' ? performance.now() : Date.now()); },
    team(k) { return k === 'H' ? this.H : this.A; },
    other(k) { return k === 'H' ? 'A' : 'H'; },

    baseOf(team, i) {
        const f = team.form[i];
        return { x: team.dir > 0 ? f[0] * 2 : 100 - f[0] * 2, y: f[1] };
    },

    dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); },
    clamp(v, a, b) { return v < a ? a : v > b ? b : v; },

    // ---------------------------------------------------------------
    // 1. PLACEMENT : le bloc coulisse vers le ballon
    // ---------------------------------------------------------------
    applyTargets() {
        const ball = this.ball;
        const t = (this.now() - this.t0) / 1000;

        ['H', 'A'].forEach(key => {
            const T = this.team(key);
            const hasBall = ball.side === key;
            const st = T.style, me = T.mentality;

            // Compacité longitudinale : à quel point le bloc suit le ballon
            let kx = hasBall
                ? (st === 'possession' ? 0.42 : st === 'direct' ? 0.50 : 0.32)
                : (me === 'defensive' ? 0.28 : me === 'offensive' ? 0.52 : 0.40);
            let ky = hasBall ? 0.26 : 0.34;   // sans ballon on glisse plus fort côté ballon

            const dx = (T.refX - 50) * kx;
            const dy = (T.refY - 50) * ky;

            // --- PRESSING PAR ZONE (modèle Soccer Manager) -------------
            // 'area' : on ne sort que dans son propre tiers, la forme prime.
            // 'half' : bloc médian, on presse dès sa moitié de terrain.
            // 'all'  : pressing tout terrain, trois hommes sur le porteur.
            let pressers = [];
            if (!hasBall) {
                const reach = T.press === 'all' ? 100 : T.press === 'half' ? 58 : 34;
                const depth = Math.abs(ball.x - T.goalX);   // distance ballon → son but
                let pressCount = 0;
                if (depth <= reach) {
                    pressCount = T.press === 'all' ? 3 : T.press === 'half' ? 2 : 1;
                    if (me === 'defensive') pressCount = Math.max(1, pressCount - 1);
                }
                if (pressCount > 0) {
                    pressers = T.p.filter(p => p.role !== 'GK')
                        .map(p => ({ p, d: this.dist(p, ball) }))
                        .sort((a, b) => a.d - b.d).slice(0, pressCount).map(o => o.p);
                }
            }

            // --- LIGNE DE HORS-JEU ------------------------------------
            // Le dernier joueur de champ adverse. Nos attaquants ne le
            // dépassent pas : c'est ce qui les empêchait de finir DERRIÈRE
            // le gardien, au fond des filets.
            const OPP = this.team(this.other(key));
            let offside = null;
            OPP.p.forEach(q => {
                if (q.role === 'GK') return;
                if (offside === null || (q.x - offside) * T.dir > 0) offside = q.x;
            });

            // --- HAUTEUR DE LA LIGNE DÉFENSIVE ------------------------
            const lineShift = T.line === 'high' ? 11 : T.line === 'low' ? -7 : 0;

            // Dans quel couloir se joue le ballon ? (sert aux latéraux)
            const lane = ball.y <= 34 ? 'D' : ball.y >= 66 ? 'G' : 'C';

            // Couloir d'attaque demandé par le coach : vers quelle bande le
            // bloc oriente-t-il son jeu quand il a le ballon ?
            // Repère : y petit = côté droit, y grand = côté gauche.
            const chanY = T.chan === 'right' ? 24 : T.chan === 'left' ? 76 : T.chan === 'middle' ? 50 : null;

            T.p.forEach(p => {
                const b = this.baseOf(T, p.i);
                const slot = p.slot || 'MC';

                if (p.role === 'GK') {
                    // Le gardien reste sur sa ligne et sort en libéro si le ballon approche
                    const near = Math.abs(ball.x - T.goalX) < 35;
                    const adv = near ? 2.5 : 8;
                    p.tx = T.goalX + T.dir * adv;
                    p.ty = this.clamp(50 + (ball.y - 50) * 0.38, 36, 64);
                    return;
                }

                // Poids par ligne : le bloc bouge d'un seul tenant, les attaquants saturent
                const w = p.role === 'DEF' ? 1.0 : p.role === 'MIL' ? 0.92 : 0.72;
                let tx = b.x + dx * w;
                let ty = b.y + dy * w;

                // ----- CONSIGNES DE POSTE ---------------------------------
                if (slot === 'AILD' || slot === 'AILG') {
                    // L'ailier étire le jeu : il colle sa ligne de touche ballon
                    // au pied, et rentre d'un cran pour défendre son couloir.
                    const wide = slot === 'AILD' ? 12 : 88;
                    ty += (wide - ty) * (hasBall ? 0.55 : 0.18);
                    if (hasBall) tx += T.dir * (st === 'direct' ? 7 : 5);
                } else if (slot === 'LATD' || slot === 'LATG') {
                    // Le latéral tient son couloir et ne monte que si le jeu
                    // vient de son côté — sinon il rentre couvrir dans l'axe.
                    const wide = slot === 'LATD' ? 14 : 86;
                    const mine = (slot === 'LATD' && lane === 'D') || (slot === 'LATG' && lane === 'G');
                    ty += ((mine ? wide : (wide + 50) / 2) - ty) * 0.38;
                    tx += T.dir * lineShift * 0.7;   // le bloc monte ou descend d'un seul tenant
                    if (hasBall && mine && me !== 'defensive') tx += T.dir * 9;
                    else if (hasBall) tx += T.dir * 2;
                } else if (slot === 'DC') {
                    // Les centraux restent en ligne, épaule contre épaule
                    ty += (b.y - ty) * 0.45;
                    if (!hasBall) tx -= T.dir * (me === 'defensive' ? 5 : 2);
                    tx += T.dir * lineShift;   // ligne haute / basse
                } else if (slot === 'MDC') {
                    // La sentinelle se place TOUJOURS entre le ballon et sa défense
                    tx += ((T.goalX + (ball.x - T.goalX) * 0.55) - tx) * 0.35;
                    ty += ((50 + (ball.y - 50) * 0.50) - ty) * 0.35;
                } else if (slot === 'MC') {
                    // Le relayeur suit le ballon latéralement sans jamais sortir de l'axe
                    ty += (ball.y - ty) * 0.22;
                } else if (slot === 'MOC') {
                    // Le meneur cherche l'espace entre les lignes adverses
                    if (hasBall) { tx += T.dir * 5; ty += (ball.y - ty) * 0.28; }
                } else if (slot === 'BT') {
                    // Le buteur joue sur la dernière ligne adverse
                    tx += T.dir * (hasBall ? (st === 'direct' ? 10 : 7) : 2);
                    ty += ((50 + (ball.y - 50) * 0.35) - ty) * 0.30;
                }

                // ----- COULOIR D'ATTAQUE ----------------------------------
                // Ballon au pied, le bloc s'oriente vers la bande demandée.
                // Léger : la laisse de poste garde la forme intacte.
                if (hasBall && chanY !== null && p.role !== 'GK') {
                    ty += (chanY - ty) * 0.16;
                } else if (hasBall && T.chan === 'flanks' && (slot === 'AILD' || slot === 'AILG')) {
                    ty += ((slot === 'AILD' ? 10 : 90) - ty) * 0.25;   // on étire au maximum
                }

                // Dérive organique : personne ne reste planté sur sa croix
                tx += Math.sin(t * 0.22 + p.ph) * 1.1;
                ty += Math.cos(t * 0.18 + p.ph * 1.3) * 1.3;

                // Pressing : on sort sur le porteur
                if (pressers.indexOf(p) > -1) {
                    const far = this.dist({ x: tx, y: ty }, ball);
                    const reach = this.clamp(1 - (far - 8) / 30, 0.25, 1);
                    // Un pressing tout terrain sort franchement, un pressing
                    // de surface se contente d'accompagner sans se découvrir.
                    const bite = T.press === 'all' ? 1.35 : T.press === 'area' ? 0.75 : 1;
                    const pull = (p.role === 'DEF' ? 0.28 : 0.48) * reach * bite;
                    tx += (ball.x - tx) * pull;
                    ty += (ball.y - ty) * pull;
                }

                // ----- LA LAISSE : on ne quitte jamais sa zone -------------
                const z = this.ZONES[slot] || { dy: 20, ahead: 24, back: 24 };
                ty = this.clamp(ty, b.y - z.dy, b.y + z.dy);
                const fwd = (tx - b.x) * T.dir;
                if (fwd > z.ahead) tx = b.x + T.dir * z.ahead;
                else if (fwd < -z.back) tx = b.x - T.dir * z.back;

                // ----- HORS-JEU : on ne dépasse pas le dernier défenseur ---
                if (offside !== null && (slot === 'BT' || slot === 'AILD' || slot === 'AILG' || slot === 'MOC')) {
                    const limit = offside + T.dir * 1.5;
                    if ((tx - limit) * T.dir > 0) tx = limit;
                }

                // Seul le porteur du ballon est dispensé de sa zone : il va
                // chercher son ballon là où il est.
                if (hasBall && p.i === ball.idx) { tx = ball.x + T.dir * 0.6; ty = ball.y; }

                p.tx = tx;
                p.ty = this.clamp(ty, 4, 96);
            });

            // Bornes dures du terrain. Un joueur de champ ne va JAMAIS au-delà
            // de 5 unités d'une ligne de but : ni derrière son propre gardien,
            // ni — surtout — derrière celui d'en face, dans les filets.
            T.p.forEach(p => {
                if (p.role !== 'GK') p.tx = this.clamp(p.tx, 5, 95);
            });
        });
    },

    // Vitesse de pointe, en unités de terrain par seconde (≈ m/s).
    // C'est le garde-fou qui interdit toute téléportation : quel que soit
    // l'ordre reçu, personne ne couvre plus de terrain qu'un sprinter.
    TOP_SPEED: 4.6,
    GK_SPEED: 3.4,

    // Fige les cibles : la position courante devient l'ancienne, la cible la
    // nouvelle — mais jamais plus loin que ce que les jambes permettent.
    commit(durMs) {
        const sec = (durMs || this.TICK) / 1000;
        // Le bloc rattrape le ballon d'un tiers par tour : c'est ce décalage
        // qui crée les espaces et évite l'effet « banc de poissons ».
        ['H', 'A'].forEach(k => {
            const T = this.team(k);
            T.refX += (this.ball.x - T.refX) * 0.20;
            T.refY += (this.ball.y - T.refY) * 0.20;
        });
        ['H', 'A'].forEach(k => this.team(k).p.forEach(p => {
            p.px = p.x; p.py = p.y;
            const maxStep = (p.role === 'GK' ? this.GK_SPEED : this.TOP_SPEED) * sec;
            let dx = p.tx - p.x, dy = p.ty - p.y;
            let d = Math.hypot(dx, dy);
            if (d > maxStep) {
                // Trop loin pour ce laps de temps : on avance dans la bonne
                // direction, on finira le trajet aux tours suivants.
                const r = maxStep / d;
                p.tx = p.x + dx * r; p.ty = p.y + dy * r;
                d = maxStep;
            }
            p.run = this.clamp(d / maxStep, 0, 1);
            if (Math.abs(p.tx - p.x) > 0.6) p.face = p.tx > p.x ? 1 : -1;
            p.x = p.tx; p.y = p.ty;
        }));
        this.tickAt = this.now();
    },

    // Position interpolée à l'instant présent (pour coller le ballon au pied)
    playerNow(key, idx) {
        const p = this.team(key).p[idx];
        if (!p) return { x: 50, y: 50 };
        const a = this.clamp((this.now() - (this.tickAt || 0)) / this.TICK, 0, 1);
        return { x: p.px + (p.x - p.px) * a, y: p.py + (p.y - p.py) * a };
    },

    // ---------------------------------------------------------------
    // 2. ACTIONS : dictées par le style de l'équipe qui a le ballon
    // ---------------------------------------------------------------
    hold(ms) { this.holdUntil = this.now() + (ms || 0); },

    tick() {
        if (!this.active) return;
        this.ballNow();   // fait avancer (et terminer) un vol en cours
        // Pendant une transition longue (engagement), on ne redonne pas de
        // nouvelles cibles : sinon la course est coupée net à mi-chemin.
        if (this.holdUntil && this.now() < this.holdUntil) return;
        if (this.locked > 0) { this.locked--; this.applyTargets(); this.commit(); return; }
        if (this.ball.fly || this.shotFly) { this.applyTargets(); this.commit(); return; }

        if (this.pendingGoalKick) { const k = this.pendingGoalKick; this.pendingGoalKick = null; this.goalKick(k); return; }

        const key = this.ball.side, T = this.team(key), O = this.team(this.other(key));
        const carrier = T.p[this.ball.idx] || T.p[9];
        const cpos = { x: carrier.x, y: carrier.y };

        // Une offensive ne peut pas camper sur la ligne de but : elle se
        // conclut (frappe contrée, sortie de but, dégagement) et l'adversaire
        // relance de sa surface. Sans ça le ballon reste collé au poteau.
        if (Math.abs(carrier.x - T.atkX) < 11 && Math.random() < 0.45) {
            this.goalKick(this.other(key));
            return;
        }

        // Pression subie : le plus proche adversaire, MAIS AUSSI combien
        // d'hommes l'entourent. C'est ce deuxième terme qui fait exister le
        // réglage de pressing : trois joueurs qui sortent étouffent le porteur
        // là où un seul le laisse ressortir.
        let nearest = null, nd = 999, swarm = 0;
        O.p.forEach(q => {
            const d = this.dist(q, cpos);
            if (d < nd) { nd = d; nearest = q; }
            if (d < 10 && q.role !== 'GK') swarm++;
        });

        // Perte de balle : d'autant plus probable que l'adversaire est proche,
        // nombreux et fort.
        const forceRatio = O.force / Math.max(40, T.force);
        const lossBase = T.style === 'possession' ? 0.10 : T.style === 'direct' ? 0.17 : 0.13;
        const crowd = 1 + Math.max(0, swarm - 1) * 0.30;
        const loss = nd < 9
            ? lossBase * forceRatio * (1.5 - nd / 14) * crowd
            : lossBase * 0.25;
        if (Math.random() < loss) {
            this.ball.side = this.other(key);
            this.ball.idx = nearest ? nearest.i : 5;
            this.phase = 'transition';
            this.applyTargets(); this.commit();
            this.glue(true);
            return;
        }

        // ---------------------------------------------------------------
        // RÉPARTITION DES ACTIONS
        // ---------------------------------------------------------------
        // Huit gestes au lieu de quatre. Le style décide du répertoire de
        // base, le couloir d'attaque décide de la conclusion dans le dernier
        // tiers, et la zone du terrain interdit les gestes absurdes (pas de
        // centre depuis sa propre surface).
        //   short   passe courte        long     ballon long
        //   carry   conduite            switch   changement d'aile
        //   cross   centre              through  passe en profondeur
        //   dribble élimination         recycle  passe en retrait
        const st = T.style;
        const inFinalThird = (T.dir > 0 ? cpos.x > 70 : cpos.x < 30);
        const ownThird = (T.dir > 0 ? cpos.x < 32 : cpos.x > 68);
        const wideCarrier = carrier.y <= 30 || carrier.y >= 70;
        let r = Math.random();
        let action;
        if (st === 'possession') {
            action = r < 0.38 ? 'short' : r < 0.52 ? 'carry' : r < 0.64 ? 'switch'
                : r < 0.74 ? 'through' : r < 0.83 ? 'dribble' : r < 0.93 ? 'recycle' : 'long';
        } else if (st === 'direct') {
            action = r < 0.27 ? 'long' : r < 0.43 ? 'short' : r < 0.59 ? 'carry'
                : r < 0.74 ? 'through' : r < 0.86 ? 'switch' : r < 0.95 ? 'dribble' : 'recycle';
        } else { // contre-attaque : temporisation puis accélération franche
            const fast = this.phase === 'transition';
            action = fast
                ? (r < 0.34 ? 'through' : r < 0.56 ? 'long' : r < 0.80 ? 'dribble' : 'carry')
                : (r < 0.34 ? 'short' : r < 0.50 ? 'carry' : r < 0.64 ? 'switch'
                    : r < 0.78 ? 'recycle' : r < 0.90 ? 'through' : 'long');
        }

        // La mentalité tranche : on ose ou on assure.
        if (T.mentality === 'offensive' && action === 'recycle' && Math.random() < 0.6) action = 'through';
        if (T.mentality === 'defensive' && (action === 'through' || action === 'dribble') && Math.random() < 0.5) action = 'recycle';

        // Le couloir d'attaque décide de la conclusion dans le dernier tiers.
        if (inFinalThird) {
            const flankPlay = T.chan === 'flanks' || T.chan === 'left' || T.chan === 'right';
            if (wideCarrier && flankPlay && Math.random() < 0.60) action = 'cross';
            else if (T.chan === 'middle' && Math.random() < 0.45) action = 'through';
            else if (wideCarrier && Math.random() < 0.30) action = 'cross';
            else if (Math.random() < 0.22) action = 'short';
        }
        // Depuis son propre tiers, ni centre ni passe en profondeur : on ressort.
        if (ownThird && (action === 'cross' || action === 'through')) {
            action = st === 'direct' ? 'long' : 'short';
        }

        if (action === 'carry' || action === 'dribble') {
            // Le dribble est une conduite plus longue, plus directe : le
            // porteur élimine et avale du terrain.
            const step = action === 'dribble' ? 9
                : st === 'direct' ? 7
                    : st === 'counter' && this.phase === 'transition' ? 8 : 4.5;
            const drift = action === 'dribble' ? 3 : 6;
            carrier.tx = this.clamp(carrier.x + T.dir * step + (Math.random() * 4 - 2), 6, 94);
            carrier.ty = this.clamp(carrier.y + (Math.random() * drift - drift / 2), 5, 95);
            this.applyTargets();
            carrier.tx = this.clamp(carrier.x + T.dir * step, 6, 94);
            this.commit();
            this.glue(true);
            this.phase = action === 'dribble' ? 'attack' : 'buildup';
            return;
        }

        const rec = this.pickReceiver(T, O, carrier, action, nd);
        if (!rec) { this.applyTargets(); this.commit(); return; }
        this.pass(key, rec.i, action);
        this.applyTargets(); this.commit();
    },

    // Choix du destinataire : progression, distance et démarquage, pondérés par le style
    pickReceiver(T, O, carrier, action, pressure) {
        let best = null, bestScore = -1e9;
        const pressed = (pressure || 99) < 6.5;
        const ownHalf = (carrier.x - 50) * T.dir < 0;
        T.p.forEach(q => {
            if (q === carrier) return;
            // Passe en retrait au gardien : seulement sous pression, dans son
            // camp, et pour une équipe qui sait ressortir proprement.
            if (q.role === 'GK') {
                if (!(pressed && ownHalf && T.style === 'possession' && Math.random() < 0.5)) return;
            }
            const d = this.dist(q, carrier);
            if (d < 3) return;
            const progress = (q.x - carrier.x) * T.dir;      // gain de terrain
            const width = Math.abs(q.y - carrier.y);
            let marked = 999;
            O.p.forEach(o => { const dd = this.dist(o, q); if (dd < marked) marked = dd; });

            let s = 0;
            if (action === 'long') s = progress * 2.4 + Math.min(d, 45) * 0.5 + marked * 1.6 - (d > 55 ? 40 : 0);
            else if (action === 'switch') s = width * 2.2 + marked * 2.0 + progress * 0.4 - Math.abs(d - 28) * 0.8;
            // Le centre cherche une tête au point de penalty : on vise l'axe,
            // devant, et de préférence un attaquant.
            else if (action === 'cross') s = (26 - Math.abs(q.y - 50)) * 1.5 + progress * 1.2
                + marked * 1.0 - Math.abs(d - 24) * 0.6 + (q.role === 'ATT' ? 16 : 0);
            // La passe en profondeur récompense le gain de terrain avant tout.
            else if (action === 'through') s = progress * 3.0 + marked * 1.8
                - Math.abs(d - 22) * 0.7 + (q.role === 'ATT' ? 10 : 0);
            // Le recyclage repasse par derrière pour recommencer.
            else if (action === 'recycle') s = -progress * 2.2 + marked * 1.6 - Math.abs(d - 16) * 0.9;
            else s = marked * 2.2 + progress * 1.4 - Math.abs(d - 15) * 1.1;   // passe courte

            // Couloir d'attaque : à qualité égale, on sert la bande demandée.
            if (T.chan === 'right')       s += (26 - Math.abs(q.y - 22)) * 0.42;
            else if (T.chan === 'left')   s += (26 - Math.abs(q.y - 78)) * 0.42;
            else if (T.chan === 'middle') s += (24 - Math.abs(q.y - 50)) * 0.42;
            else if (T.chan === 'flanks') s += (Math.abs(q.y - 50) - 18) * 0.42;

            // Le meneur de jeu touche plus de ballons : c'est le sens de la
            // consigne « faire jouer le meneur ».
            if (T.pmIdx === q.i && action !== 'cross') s += 9;

            if (T.style === 'possession') s += marked * 1.2 - Math.max(0, d - 25) * 1.5;
            if (T.style === 'direct') s += progress * 1.1;
            // Sous pression, on assure : le démarquage prime, la passe en
            // retrait redevient une option — c'est comme ça qu'on recycle.
            if (pressed) s += marked * 2.6 - Math.max(0, progress) * 0.9 + (progress < 0 ? 10 : 0);
            // En phase de construction dans son camp, on repasse par derrière
            if (ownHalf && T.style === 'possession' && progress < 0) s += 7;
            s += Math.random() * 6;
            if (s > bestScore) { bestScore = s; best = q; }
        });
        return best;
    },

    pass(key, toIdx, action) {
        this.ball.fixed = false;
        const T = this.team(key);
        const from = { x: this.ball.x, y: this.ball.y };
        const to = T.p[toIdx];
        const d = Math.hypot(to.tx - from.x, to.ty - from.y);
        // ~30 m/s sur une passe appuyée, un peu plus vite sur un long ballon.
        // Un ballon de 50 m a le droit de voler plus longtemps qu'un tour de
        // simulation : la passe reste lisible au lieu d'être expédiée.
        const slow = this.TICK / 1100;   // le tempo choisi étire aussi les trajectoires
        // Vitesse du ballon selon le geste : la profondeur fuse au ras du
        // gazon, le centre est enroulé, le recyclage est posé.
        const rate = action === 'long' ? 26 : action === 'through' ? 24
            : action === 'cross' ? 30 : action === 'recycle' ? 38 : 34;
        const dur = this.clamp(d * rate * slow, 320, 2600);
        this.ball.fly = {
            fromX: from.x, fromY: from.y, side: key, idx: toIdx,
            t0: this.now(), dur,
            // Hauteur de balle : un centre et un ballon long survolent, une
            // passe en profondeur reste au sol.
            peak: action === 'long' ? 3.2 : action === 'cross' ? 2.9
                : action === 'switch' ? 2.2 : action === 'through' ? 0.15 : 0.35
        };
        this.ball.idx = toIdx;
        this.ball.side = key;
        this.lastAction = action;
        this.phase = (action === 'long' || action === 'through' || action === 'cross') ? 'attack'
            : action === 'recycle' ? 'buildup'
                : this.phase === 'transition' ? 'attack' : 'buildup';
    },

    // Relance : le gardien de l'équipe `key` récupère le ballon, les deux
    // blocs se remettent en place. C'est la respiration naturelle du match.
    goalKick(key) {
        const T = this.team(key);
        this.ball.side = key;
        this.ball.idx = 0;
        this.ball.fly = null; this.shotFly = null;
        const gk = T.p[0];
        gk.tx = T.goalX + T.dir * 5; gk.ty = 50;
        this.phase = 'buildup';
        this.applyTargets();
        gk.tx = T.goalX + T.dir * 5; gk.ty = 50;
        this.commit();
        this.glue(true);
        this.locked = 1;
    },

    // snap = true : le ballon se pose sur la position DÉFINITIVE du porteur
    // (remise en jeu, engagement, récupération). Sans ça il se collait à
    // l'endroit d'où le joueur vient de partir, puis sautait au tick suivant.
    // Ballon arrêté : il reste où on le pose tant que le porteur désigné
    // n'est pas venu le chercher.
    placeBall(x, y) {
        this.ball.x = x; this.ball.y = y; this.ball.z = 0;
        this.ball.fixed = true;
        this.ball.fly = null;
    },

    glue(snap) {
        const T = this.team(this.ball.side);
        const q = this.team(this.ball.side).p[this.ball.idx];
        const p = snap && q ? { x: q.x, y: q.y } : this.playerNow(this.ball.side, this.ball.idx);
        this.ball.x = p.x + T.dir * 0.9;
        this.ball.y = p.y + 0.4;
        this.ball.z = 0;
    },

    // Position du ballon à l'instant présent (appelée à chaque frame)
    ballNow() {
        const f = this.ball.fly;
        if (f) {
            const a = this.clamp((this.now() - f.t0) / f.dur, 0, 1);
            const tgt = this.playerNow(f.side, f.idx);
            const T = this.team(f.side);
            const ex = tgt.x + T.dir * 0.9, ey = tgt.y + 0.4;
            this.ball.x = f.fromX + (ex - f.fromX) * a;
            this.ball.y = f.fromY + (ey - f.fromY) * a;
            this.ball.z = f.peak * 4 * a * (1 - a);
            if (a >= 1) { this.ball.fly = null; this.ball.z = 0; }
            return this.ball;
        }
        if (this.shotFly) {
            const s = this.shotFly;
            const a = this.clamp((this.now() - s.t0) / s.dur, 0, 1);
            this.ball.x = s.fromX + (s.toX - s.fromX) * a;
            this.ball.y = s.fromY + (s.toY - s.fromY) * a;
            this.ball.z = s.peak * 4 * a * (1 - a);
            if (a >= 1) { this.shotFly = null; this.pendingGoalKick = this.other(this.ball.side); }
            return this.ball;
        }
        if (this.ball.fixed) {
            const p = this.playerNow(this.ball.side, this.ball.idx);
            if (Math.hypot(p.x - this.ball.x, p.y - this.ball.y) < 2.6) this.ball.fixed = false;
            else return this.ball;
        }
        this.glue();
        return this.ball;
    },

    // ---------------------------------------------------------------
    // 3. LE MOTEUR DE MATCH DONNE LES ORDRES
    // ---------------------------------------------------------------
    director(state, opts) {
        if (!this.active) return;
        opts = opts || {};
        // Le moteur de match est le patron : son ordre annule toute action
        // encore en vol et toute relance de but en attente.
        this.pendingGoalKick = null;
        this.ball.fly = null;
        this.shotFly = null;
        this.ball.fixed = false;
        const setSide = (k) => { this.ball.side = k; };

        if (state === 'center') {
            // Engagement : tout le monde dans son camp, ballon au rond central
            ['H', 'A'].forEach(k => {
                const T = this.team(k);
                T.p.forEach(p => { const b = this.baseOf(T, p.i); p.tx = b.x; p.ty = b.y; });
            });
            this.kickoffSide = this.kickoffSide === 'H' ? 'A' : 'H';
            setSide(this.kickoffSide || 'H');
            const T = this.team(this.ball.side);
            const att = T.p.filter(p => p.role === 'ATT');
            this.ball.idx = (att[0] || T.p[9]).i;
            const c = T.p[this.ball.idx];
            c.tx = 50 - T.dir * 1.5; c.ty = 50;
            this.ball.fly = null; this.shotFly = null;
            this.phase = 'kickoff'; this.locked = 1;
            this.commit(this.TICK * 1.1);
            this.placeBall(50, 50);   // ballon posé sur le point central
            return;
        }

        if (state === 'home_attack' || state === 'away_attack') {
            const k = state === 'home_attack' ? 'H' : 'A';
            const Tk = this.team(k);
            // Cette équipe attaque déjà dans le bon camp : on ne coupe rien.
            if (this.ball.side === k && (this.ball.x - 50) * Tk.dir > 6) return;
            setSide(k);
            const T = this.team(k);
            // 1. on annonce d'abord OÙ se passe l'action, 2. les deux blocs se
            // recomposent autour, 3. on désigne le porteur le plus proche.
            this.ball.x = 50 + T.dir * (16 + Math.random() * 14);
            this.ball.y = 25 + Math.random() * 50;
            this.applyTargets();
            this.ball.idx = this.nearestTo(T, this.ball, p => p.role !== 'GK').i;
            this.stickCarrier(T);
            this.phase = 'attack';
            return;
        }

        if (state === 'midfield') {
            // Le jeu est déjà dans l'entrejeu : rien à imposer.
            if (this.ball.x > 32 && this.ball.x < 68) { this.phase = 'buildup'; return; }
            const k = Math.random() < 0.5 ? 'H' : 'A';
            setSide(k);
            const T = this.team(k);
            this.ball.x = 42 + Math.random() * 16;
            this.ball.y = 25 + Math.random() * 50;
            this.applyTargets();
            this.ball.idx = this.nearestTo(T, this.ball, p => p.role === 'MIL').i;
            this.stickCarrier(T);
            this.phase = 'buildup';
            return;
        }

        if (state === 'home_shot' || state === 'away_shot') {
            const k = state === 'home_shot' ? 'H' : 'A';
            setSide(k);
            const T = this.team(k), O = this.team(this.other(k));
            // Le tireur est désigné par le moteur de match. On ne le téléporte
            // pas dans la surface : il progresse depuis là où il se trouvait.
            // Une frappe déclenchée en pleine relance devient donc une tentative
            // de loin, et le xG le reflétera.
            const atts = T.p.filter(p => p.role !== 'GK').sort((a, b) => (b.x - a.x) * T.dir);
            const shooter = (opts.shooterIdx != null && T.p[opts.shooterIdx] && T.p[opts.shooterIdx].role !== 'GK')
                ? T.p[opts.shooterIdx] : atts[0];
            this.ball.idx = shooter.i;
            // La frappe se joue là où est L'ACTION, pas là où le tireur se
            // reposait : on part de la position du ballon et on avance vers la
            // surface. Un défenseur monté sur un corner arrive donc bien dans
            // la surface, au lieu de tirer depuis sa ligne défensive.
            const boxX = T.dir > 0 ? 89 : 11;
            const mix = 0.5 + Math.random() * 0.45;
            const anchorX = (shooter.x + this.ball.x) / 2, anchorY = (shooter.y + this.ball.y) / 2;
            const aimX = anchorX + (boxX - anchorX) * mix;
            const aimY = 50 + (anchorY - 50) * (0.45 + Math.random() * 0.45);
            shooter.tx = this.clamp(aimX, 6, 94);
            shooter.ty = this.clamp(aimY, 14, 86);
            // La défense adverse se jette, le gardien plonge sur son angle
            O.p.forEach(p => {
                if (p.role === 'GK') { p.tx = O.goalX + O.dir * 2; p.ty = 44 + Math.random() * 12; }
                else if (p.role === 'DEF') { p.tx = O.goalX + O.dir * (8 + Math.random() * 8); p.ty = 34 + Math.random() * 32; }
            });
            const sx = shooter.tx, sy = shooter.ty;
            this.applyTargets();
            shooter.tx = sx; shooter.ty = sy;
            // La course au but est un effort bref : on autorise une pointe
            // supérieure au déplacement de placement ordinaire, sans pour
            // autant téléporter le tireur dans la surface.
            this.commit(this.TICK * 1.7);
            this.ball.fly = null;
            // ⚠ Le xG se calcule sur la position ATTEINTE (shooter.x/y après
            // bridage), jamais sur la position visée : sinon on afficherait un
            // tir dans la surface pour un ballon parti de 25 mètres.
            this.lastShot = this.shotQuality(T, shooter.x, shooter.y);
            this.shoot(k, shooter);
            this.locked = 1;
            return;
        }
    },

    nearestTo(T, pos, filter) {
        let best = null, bd = 1e9;
        T.p.forEach(p => {
            if (filter && !filter(p)) return;
            const d = this.dist(p, pos);
            if (d < bd) { bd = d; best = p; }
        });
        return best || T.p[6];
    },

    // Amène le porteur désigné sur le ballon et fige la scène.
    stickCarrier(T) {
        const c = T.p[this.ball.idx];
        c.tx = this.clamp(this.ball.x - T.dir * 0.9, 5, 95);
        c.ty = this.clamp(this.ball.y - 0.4, 4, 96);
        this.commit();
        this.glue(true);
    },

    // Qualité d'une occasion à partir de la position RÉELLE du tireur.
    // Distance au centre du but (converti en mètres : 105 × 68) et angle
    // d'ouverture — un ballon excentré voit une cage bien plus étroite.
    shotQuality(T, gx, gy) {
        const dx = Math.abs(gx - T.atkX) * 1.05;
        const dy = Math.abs(gy - 50) * 0.68;
        const dist = Math.max(2, Math.hypot(dx, dy));
        // Demi-angle sous lequel le tireur voit les 7,32 m de cage
        const angle = Math.atan2(3.66, Math.max(1, dx)) - Math.atan2(Math.max(0, dy - 3.66), Math.max(1, dx));
        const near = 1 / (1 + Math.pow(dist / 12, 2));          // 0→1 selon la distance
        const open = this.clamp(angle / 0.62, 0.05, 1);          // 0→1 selon l'angle
        return {
            x: gx, y: gy,
            dist: Math.round(dist),
            quality: this.clamp(near * 0.62 + open * 0.38, 0.02, 1)
        };
    },

    shoot(key, shooter) {
        const T = this.team(key);
        const from = { x: shooter.x, y: shooter.y };
        const toX = T.dir > 0 ? 99.5 : 0.5, toY = 42 + Math.random() * 16;
        const d = Math.hypot(toX - from.x, toY - from.y);
        this.shotFly = {
            fromX: from.x, fromY: from.y, toX, toY,
            t0: this.now(),
            // Plafond indexé sur le tempo : une frappe ne doit jamais durer
            // plus longtemps que le délai avant le retour au rond central.
            dur: this.clamp(d * 28 * (this.TICK / 1100), 400, 500 + this.TICK * 0.35),   // ≈ 32 m/s
            peak: 1.1 + Math.random() * 1.4
        };
        this.phase = 'shot';
    },

    // Instantané pour les moteurs de rendu
    frame() {
        const b = this.ballNow();
        const pack = key => this.team(key).p.map((p, i) => {
            const n = this.playerNow(key, i);
            return {
                x: n.x, y: n.y, tx: p.x, ty: p.y, role: p.role, slot: p.slot, face: p.face, run: p.run,
                carrier: this.ball.side === key && this.ball.idx === i,
                name: (this.team(key).names[i] || '')
            };
        });
        return { H: pack('H'), A: pack('A'), ball: { x: b.x, y: b.y, z: b.z }, side: this.ball.side, phase: this.phase };
    },

    stop() { this.active = false; this.ball && (this.ball.fly = null); this.shotFly = null; }
};

// =====================================================================
// ⏱️ TEMPO DU MATCH
// =====================================================================
// tick  = durée d'une action de la simulation de placement (ms)
// clock = durée d'une minute de jeu (ms) — c'est lui qui règle la longueur
//         réelle du direct : 90 minutes × clock.
// =====================================================================
// 🎽 RÔLES DES JOUEURS
// =====================================================================
// Un joueur n'est plus seulement « DEF » ou « MIL » : il a un vrai poste,
// avec un nom que le coach reconnaît. C'est ce rôle qui s'affiche dans
// l'effectif, sur le terrain tactique et dans les listes de tireurs.
const ROLE_LABELS = {
    G:   { short: 'GB',  name: 'Gardien de but',    line: 'GB'  },
    DD:  { short: 'DD',  name: 'Latéral droit',     line: 'DEF' },
    DG:  { short: 'DG',  name: 'Latéral gauche',    line: 'DEF' },
    DC:  { short: 'DC',  name: 'Défenseur central', line: 'DEF' },
    MDC: { short: 'MDC', name: 'Milieu défensif',   line: 'MIL' },
    MC:  { short: 'MC',  name: 'Milieu relayeur',   line: 'MIL' },
    MOC: { short: 'MOC', name: 'Meneur de jeu',     line: 'MIL' },
    MOD: { short: 'AID', name: 'Ailier droit',      line: 'MIL' },
    MOG: { short: 'AIG', name: 'Ailier gauche',     line: 'MIL' },
    BT:  { short: 'BU',  name: 'Buteur',            line: 'ATT' }
};

// Tirage d'un poste précis pour les joueurs générés (marché, académie),
// qui n'avaient jusqu'ici qu'une ligne grossière.
const EXACT_BY_LINE = {
    GB:  ['G'],
    DEF: ['DC', 'DC', 'DC', 'DD', 'DG'],
    MIL: ['MDC', 'MDC', 'MC', 'MC', 'MOC', 'MOD', 'MOG'],
    ATT: ['BT', 'BT', 'BT', 'MOD', 'MOG']
};
function randomExactPosition(line) {
    const a = EXACT_BY_LINE[line] || EXACT_BY_LINE.MIL;
    return a[Math.floor(Math.random() * a.length)];
}
function playerRole(p) {
    if (!p) return ROLE_LABELS.MC;
    if (p.exactPosition && ROLE_LABELS[p.exactPosition]) return ROLE_LABELS[p.exactPosition];
    const fall = { GB: 'G', DEF: 'DC', MIL: 'MC', ATT: 'BT' };
    return ROLE_LABELS[fall[p.position]] || ROLE_LABELS.MC;
}

// Les quatre rôles que le coach attribue. Chacun a sa couleur : sur une
// carte de 90 px, la teinte se lit avant le texte.
const SET_PIECE_ROLES = [
    { kind: 'penalty',  icon: '⚽', label: 'Penalty',    hint: 'Le sang-froid sur onze mètres',     accent: '#f59e0b' },
    { kind: 'freekick', icon: '🎯', label: 'Coup franc', hint: 'La frappe par-dessus le mur',       accent: '#38bdf8' },
    { kind: 'corner',   icon: '🚩', label: 'Corner',     hint: 'Le pied qui trouve la tête',        accent: '#a78bfa' },
    { kind: 'captain',  icon: '🅒', label: 'Capitaine',  hint: 'Le patron dans le vestiaire',       accent: '#34d399' },
    { kind: 'playmaker',icon: '🧠', label: 'Meneur de jeu', hint: 'Celui par qui le jeu doit passer', accent: '#fb7185' }
];

// Les consignes collectives, dans le vocabulaire des jeux de gestion.
const TEAM_INSTRUCTIONS = [
    { key: 'attackSide', label: 'Couloir d\'attaque', hint: 'Par où le jeu sort',
      options: [['mixed', 'Mixte'], ['middle', 'Axe'], ['flanks', 'Deux ailes'], ['right', 'Droite'], ['left', 'Gauche']] },
    { key: 'pressing', label: 'Pressing', hint: 'Où on va chercher le ballon',
      options: [['area', 'Sa surface'], ['half', 'Sa moitié'], ['all', 'Tout terrain']] },
    { key: 'line', label: 'Ligne défensive', hint: 'La hauteur du bloc',
      options: [['low', 'Basse'], ['normal', 'Normale'], ['high', 'Haute']] }
];

// Étiquettes courtes affichées sur les pastilles du terrain 2D.
const SLOT_SHORT = {
    GK: 'GB', DC: 'DC', LATD: 'DD', LATG: 'DG', MDC: 'MDC',
    MC: 'MC', MOC: 'MOC', AILD: 'AID', AILG: 'AIG', BT: 'BU'
};

const MATCH_TEMPOS = {
    slow:   { key: 'slow',   label: '🐢 Lent',   tick: 2400, clock: 1600 },
    normal: { key: 'normal', label: '⚽ Normal', tick: 1700, clock: 1100 },
    fast:   { key: 'fast',   label: '⏩ Rapide', tick: 1150, clock: 700  }
};

const FORMATIONS_MAP = {
    '4-4-2': [[5,50], [20,20], [15,40], [15,60], [20,80], [35,20], [30,40], [30,60], [35,80], [45,40], [45,60]],
    '4-3-3': [[5,50], [20,20], [15,40], [15,60], [20,80], [30,50], [35,30], [35,70], [45,50], [40,20], [40,80]],
    '4-2-3-1': [[5,50], [20,20], [15,40], [15,60], [20,80], [30,35], [30,65], [42,50], [38,20], [38,80], [48,50]],
    '3-5-2': [[5,50], [15,30], [15,50], [15,70], [25,15], [30,35], [35,50], [30,65], [25,85], [45,40], [45,60]],
    '5-3-2': [[5,50], [18,15], [15,35], [12,50], [15,65], [18,85], [30,50], [35,30], [35,70], [45,40], [45,60]],
    '4-1-4-1': [[5,50], [20,20], [15,40], [15,60], [20,80], [25,50], [35,20], [32,40], [32,60], [35,80], [45,50]],
    '4-3-2-1': [[5,50], [20,20], [15,40], [15,60], [20,80], [30,30], [28,50], [30,70], [38,35], [38,65], [48,50]],
    '4-1-2-1-2': [[5,50], [20,20], [15,40], [15,60], [20,80], [25,50], [32,30], [32,70], [38,50], [48,40], [48,60]],
    '4-5-1': [[5,50], [20,20], [15,40], [15,60], [20,80], [32,20], [30,35], [28,50], [30,65], [32,80], [48,50]],
    '3-4-3': [[5,50], [15,30], [12,50], [15,70], [28,15], [25,40], [25,60], [28,85], [42,25], [45,50], [42,75]],
    '3-4-2-1': [[5,50], [15,30], [12,50], [15,70], [28,15], [25,40], [25,60], [28,85], [38,35], [38,65], [48,50]],
    '5-4-1': [[5,50], [18,15], [15,35], [12,50], [15,65], [18,85], [32,20], [30,40], [30,60], [32,80], [48,50]],
    '5-2-3': [[5,50], [18,15], [15,35], [12,50], [15,65], [18,85], [28,40], [28,60], [45,25], [48,50], [45,75]],
    '4-2-4': [[5,50], [20,20], [15,40], [15,60], [20,80], [28,40], [28,60], [42,20], [45,40], [45,60], [42,80]],
    '3-1-4-2': [[5,50], [15,30], [12,50], [15,70], [22,50], [32,15], [30,40], [30,60], [32,85], [45,40], [45,60]]
};

const JERSEY_SVG = `<svg class="w-full h-full drop-shadow-md" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 7.4L16 3H8L2.1 7.4C1.6 7.8 1.4 8.5 1.7 9.1L3.6 13.5C3.8 14 4.5 14.2 5 13.9L8 11.8V20C8 20.6 8.4 21 9 21H15C15.6 21 16 20.6 16 20V11.8L19 13.9C19.5 14.3 20.2 14.1 20.4 13.5L22.3 9.1C22.6 8.5 22.4 7.8 21.9 7.4M15 9V19H9V9L5 11.8L3.4 8.1L8.6 4.3C8.8 4.1 9 4 9.3 4H14.8C15 4 15.3 4.1 15.4 4.3L20.6 8.1L19 11.8L15 9Z"/></svg>`;
// =====================================================================
// 🧑 VISAGES DE JOUEURS — SVG PROCÉDURAUX (LOT 9)
// =====================================================================
// Chaque joueur a désormais son propre visage, généré à partir de son id :
// même id = même visage, à vie, sans rien stocker en sauvegarde (le rendu est
// entièrement déterministe). Le tirage couvre le teint, la coupe, la pilosité,
// la forme du visage et des yeux ; l'âge grisonne les tempes et dégarnit le
// front, et le maillot reprend la couleur du poste.

const FACE_SKINS = [
    ['#4a2b1a', '#3a2013'], ['#5c3520', '#472718'], ['#6d4026', '#56301c'],
    ['#7d4b2c', '#633a21'], ['#8e5a35', '#714428'], ['#a26c42', '#835434'],
    ['#b8834f', '#96683d'], ['#c99a68', '#a87c50']
];
const FACE_HAIRS = ['#0c0c11', '#12100e', '#1d1610', '#2c2018'];
const FACE_JERSEYS = {
    GB: ['#f59e0b', '#b45309'], DEF: ['#3b82f6', '#1d4ed8'],
    MIL: ['#10b981', '#047857'], ATT: ['#f43f5e', '#be123c']
};

// Hash FNV-1a : deux joueurs différents ne partagent jamais le même visage.
function faceSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
}
// mulberry32 : suite pseudo-aléatoire reproductible à partir de la graine
function faceRng(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const _FACE_CACHE = new Map();

function playerFaceSVG(player, opts = {}) {
    if (!player) return '';
    const age = player.age || 24;
    const ageBucket = age >= 33 ? 2 : age >= 29 ? 1 : 0;
    const key = (player.id || player.name || 'x') + '|' + ageBucket + '|' + (player.position || 'MIL') + '|' + (opts.plain ? 'p' : 'j');
    if (_FACE_CACHE.has(key)) return _FACE_CACHE.get(key);

    const rnd = faceRng(faceSeed(String(player.id || player.name || 'x')));
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const range = (min, max) => min + rnd() * (max - min);

    const [skin, shade] = pick(FACE_SKINS);
    const jersey = FACE_JERSEYS[player.position] || FACE_JERSEYS.MIL;

    // --- Traits tirés au sort ---
    const hw = range(21, 25);                       // demi-largeur du crâne
    const jaw = range(0.86, 1.04);                  // mâchoire fine ou carrée
    const hairStyle = Math.floor(rnd() * 8);
    const beardStyle = Math.floor(rnd() * 5);
    const eyeW = range(4.8, 6.2);
    const browThick = range(2.2, 3.6);
    const browAngle = range(-4, 3);
    const mouthCurve = range(-1.5, 3.5);
    const noseW = range(4, 7);

    // L'âge marque : tempes grises puis chevelure poivre et sel, front dégarni
    let hair = pick(FACE_HAIRS);
    if (ageBucket === 2 && rnd() < 0.65) hair = '#7d7d86';
    else if (ageBucket === 1 && rnd() < 0.3) hair = '#4a4a52';
    const balding = ageBucket === 2 && rnd() < 0.35;

    const ex = 50 - hw * 0.42, ey = 43;             // ancrage des yeux
    const hairTop = 15;

    // --- Crâne (path : permet une vraie mâchoire, contrairement à une ellipse) ---
    const head = `M50,${hairTop} C${50 + hw * 0.78},${hairTop} ${50 + hw},27 ${50 + hw},41
        C${50 + hw},53 ${50 + hw * jaw * 0.72},70 50,70
        C${50 - hw * jaw * 0.72},70 ${50 - hw},53 ${50 - hw},41
        C${50 - hw},27 ${50 - hw * 0.78},${hairTop} 50,${hairTop} Z`;

    // --- Coupes de cheveux ---
    let hairBack = '', hairFront = '';
    const capTop = balding ? hairTop + 4 : hairTop - 1;
    const cap = (h) => `M${50 - hw - 0.5},${42 - h * 0.25} C${50 - hw - 1},${capTop - h} ${50 + hw + 1},${capTop - h} ${50 + hw + 0.5},${42 - h * 0.25}
        C${50 + hw * 0.7},${balding ? 30 : 24} ${50 - hw * 0.7},${balding ? 30 : 24} ${50 - hw - 0.5},${42 - h * 0.25} Z`;

    if (hairStyle === 0) {                                   // rasé très court
        hairFront = `<path d="${cap(2)}" fill="${hair}" opacity="0.92"/>`;
    } else if (hairStyle === 1) {                            // afro court
        hairFront = `<path d="${cap(7)}" fill="${hair}"/>`;
    } else if (hairStyle === 2) {                            // high-top fade
        hairFront = `<path d="M${50 - hw * 0.82},34 L${50 - hw * 0.82},${hairTop - 9}
            q${hw * 0.82},-5 ${hw * 1.64},0 L${50 + hw * 0.82},34 Z" fill="${hair}"/>
            <path d="${cap(1)}" fill="${hair}" opacity="0.5"/>`;
    } else if (hairStyle === 3) {                            // tresses / cornrows
        hairFront = `<path d="${cap(4)}" fill="${hair}"/>` +
            [-0.66, -0.22, 0.22, 0.66].map(f =>
                `<path d="M${50 + hw * f},${hairTop + 1} L${50 + hw * f * 1.25},34" stroke="${shade}" stroke-width="1.3" opacity="0.55" fill="none"/>`
            ).join('');
    } else if (hairStyle === 4) {                            // dreadlocks
        hairBack = [-1.05, -0.75, 0.75, 1.05].map((f, i) =>
            `<rect x="${50 + hw * f - 3}" y="${30 + i * 2}" width="6" height="${26 + i * 3}" rx="3" fill="${hair}"/>`
        ).join('');
        hairFront = `<path d="${cap(5)}" fill="${hair}"/>`;
    } else if (hairStyle === 5) {                            // crâne rasé
        hairFront = `<path d="M${50 - hw * 0.45},${hairTop + 4} q${hw * 0.45},-4 ${hw * 0.9},0" stroke="#ffffff" stroke-width="2" opacity="0.10" fill="none" stroke-linecap="round"/>`;
    } else if (hairStyle === 6) {                            // coupe nette + line-up
        hairFront = `<path d="${cap(3)}" fill="${hair}"/>
            <path d="M${50 - hw * 0.8},${26 + (balding ? 4 : 0)} q${hw * 0.8},-3.5 ${hw * 1.6},0" stroke="#ffffff" stroke-width="1" opacity="0.16" fill="none"/>`;
    } else {                                                 // frisé volumineux
        hairFront = `<path d="${cap(6)}" fill="${hair}"/>` +
            [[-0.72, 26], [-0.3, 20], [0.15, 19], [0.6, 24], [0.9, 31]].map(([f, y]) =>
                `<circle cx="${50 + hw * f}" cy="${y}" r="${5.2}" fill="${hair}"/>`
            ).join('');
    }

    // --- Pilosité ---
    let beard = '';
    if (beardStyle === 1) {                                   // moustache
        beard = `<path d="M${50 - noseW},56.5 q${noseW},-3 ${noseW * 2},0 q-${noseW},2.5 -${noseW * 2},0 Z" fill="${hair}" opacity="0.9"/>`;
    } else if (beardStyle === 2) {                            // bouc
        beard = `<ellipse cx="50" cy="64" rx="5.5" ry="4.5" fill="${hair}" opacity="0.9"/>
            <path d="M${50 - noseW},56.5 q${noseW},-2.5 ${noseW * 2},0 q-${noseW},2 -${noseW * 2},0 Z" fill="${hair}" opacity="0.9"/>`;
    } else if (beardStyle === 3) {                            // barbe pleine
        beard = `<path d="M${50 - hw * 0.96},46 C${50 - hw},62 ${50 - hw * 0.6},71 50,71
            C${50 + hw * 0.6},71 ${50 + hw},62 ${50 + hw * 0.96},46
            C${50 + hw * 0.8},58 ${50 - hw * 0.8},58 ${50 - hw * 0.96},46 Z" fill="${hair}" opacity="0.92"/>`;
    } else if (beardStyle === 4) {                            // collier / chinstrap
        beard = `<path d="M${50 - hw * 0.98},44 C${50 - hw * 0.98},64 ${50 - hw * 0.55},70.5 50,70.5
            C${50 + hw * 0.55},70.5 ${50 + hw * 0.98},64 ${50 + hw * 0.98},44
            C${50 + hw * 0.8},62 ${50 - hw * 0.8},62 ${50 - hw * 0.98},44 Z" fill="${hair}" opacity="0.75"/>`;
    }

    const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="${opts.className || 'w-full h-full'}" preserveAspectRatio="xMidYMax meet">
  ${opts.plain ? '' : `<path d="M6,100 C9,84 24,77 37,74 L50,84 L63,74 C76,77 91,84 94,100 Z" fill="${jersey[0]}"/>
  <path d="M37,74 L50,84 L63,74 L57,72 L50,78 L43,72 Z" fill="${jersey[1]}"/>`}
  <path d="M41,60 h18 v13 q-9,6 -18,0 Z" fill="${shade}"/>
  ${hairBack}
  <path d="${head}" fill="${skin}"/>
  <ellipse cx="${50 - hw - 1}" cy="46" rx="3.6" ry="5.4" fill="${skin}"/>
  <ellipse cx="${50 + hw + 1}" cy="46" rx="3.6" ry="5.4" fill="${skin}"/>
  <path d="M${50 - hw * 0.55},63 C${50 - hw * 0.3},68.5 ${50 + hw * 0.3},68.5 ${50 + hw * 0.55},63" fill="${shade}" opacity="0.25"/>
  ${hairFront}
  <path d="M${ex - eyeW * 0.9},${ey - 6 + browAngle * 0.4} q${eyeW * 0.9},-${2.5 + browThick * 0.3} ${eyeW * 1.8},${browAngle * 0.25}" stroke="${hair}" stroke-width="${browThick}" fill="none" stroke-linecap="round"/>
  <path d="M${100 - ex - eyeW * 0.9},${ey - 6 + browAngle * 0.25} q${eyeW * 0.9},-${2.5 + browThick * 0.3} ${eyeW * 1.8},${browAngle * 0.4}" stroke="${hair}" stroke-width="${browThick}" fill="none" stroke-linecap="round"/>
  <ellipse cx="${ex}" cy="${ey}" rx="${eyeW}" ry="${eyeW * 0.62}" fill="#f8fafc"/>
  <ellipse cx="${100 - ex}" cy="${ey}" rx="${eyeW}" ry="${eyeW * 0.62}" fill="#f8fafc"/>
  <circle cx="${ex}" cy="${ey}" r="${eyeW * 0.42}" fill="#1a1310"/>
  <circle cx="${100 - ex}" cy="${ey}" r="${eyeW * 0.42}" fill="#1a1310"/>
  <circle cx="${ex + 1}" cy="${ey - 1}" r="0.9" fill="#ffffff" opacity="0.85"/>
  <circle cx="${101 - ex}" cy="${ey - 1}" r="0.9" fill="#ffffff" opacity="0.85"/>
  <path d="M50,${ey + 2} L${50 - noseW * 0.5},${ey + 10} q${noseW * 0.5},2.2 ${noseW},0" stroke="${shade}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${50 - 6.5},59.5 q6.5,${mouthCurve} 13,0" stroke="${shade}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${beard}
</svg>`.replace(/\s+/g, ' ');

    _FACE_CACHE.set(key, svg);
    return svg;
}

const PLAYER_AVATAR_SVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full opacity-90 drop-shadow-lg"><path d="M50 15C38.95 15 30 23.95 30 35C30 46.05 38.95 55 50 55C61.05 55 70 46.05 70 35C70 23.95 61.05 15 50 15ZM23.5 65C15.49 65 9 71.49 9 79.5V95H91V79.5C91 71.49 84.51 65 76.5 65H23.5Z" fill="currentColor"/></svg>`;

class Generator {
    static randomName(regionId = 'francophone') {
        const pool = REGIONAL_NAMES[regionId] || REGIONAL_NAMES.francophone;
        // FIX #77 : prénom complet au lieu de la seule initiale (le tableau de 80 prénoms était inutile sinon)
        return pool.first[Math.floor(Math.random() * pool.first.length)] + ' ' + pool.last[Math.floor(Math.random() * pool.last.length)];
    }
    
    static getPlayerValue(ovr, age = 25, pot = null) {
        // FIX #31 : courbe lissée (exponentielle) au lieu d'un escalier à paliers brutaux
        let base = 200000 * Math.pow(1.15, Math.max(0, ovr - 55));

        // FIX #32a : l'âge influe sur la valeur — pic entre 24 et 29 ans, décote avant/après
        let ageFactor = 1;
        if (age <= 23) ageFactor = 1 + (23 - age) * 0.02; // jeunes prometteurs : légère prime
        else if (age > 29) ageFactor = Math.max(0.35, 1 - (age - 29) * 0.06); // décote progressive après 29 ans

        // FIX #32b : le potentiel influe sur la valeur — un jeune avec une grosse marge de progression vaut plus cher
        let potFactor = 1;
        if (pot !== null && pot > ovr) potFactor = 1 + Math.min(0.4, (pot - ovr) * 0.015);

        let value = base * ageFactor * potFactor;
        value = Math.round(Math.min(80000000, Math.max(150000, value)) / 50000) * 50000;
        return value;
    }

    // FIX #33 : formule de salaire unique (avant : /200 pour les générés, /100 pour les joueurs réels —
    // ces derniers coûtaient donc 2x plus cher à salaire égal). ~0.7%/mois ≈ 8.4%/an de la valeur.
    static getPlayerWage(price) {
        return Math.max(500, Math.floor(price * 0.007));
    }

    static randomPlayer(pos, regionId, minOvr = 60, maxOvr = 80) {
        let ovr = Math.floor(Math.random() * (maxOvr - minOvr + 1)) + minOvr;
        
        // --- NOUVEAU : Génération de l'âge et du potentiel ---
        // Un joueur libre ou du marché a généralement entre 17 et 34 ans
        let age = Math.floor(Math.random() * (34 - 17 + 1)) + 17; 
        
        // Le potentiel dépend de l'âge : un jeune de 17 ans a plus de marge de progression qu'un joueur de 30 ans
        let potentialMargin = Math.max(0, 32 - age); // Marge aléatoire basée sur la jeunesse
        let pot = Math.min(99, ovr + Math.floor(Math.random() * potentialMargin));

        // --- 1. NOUVELLES STATISTIQUES (Sur 100) ---
        // Techniques
        let finishing = Math.floor(ovr * (0.5 + Math.random()*0.6));
        let passing = Math.floor(ovr * (0.6 + Math.random()*0.5));
        let tackling = Math.floor(ovr * (0.5 + Math.random()*0.6));
        let dribbling = Math.floor(ovr * (0.6 + Math.random()*0.5));
        // Mentales
        let positioning = Math.floor(ovr * (0.6 + Math.random()*0.5)); // Défensif
        let vision = Math.floor(ovr * (0.6 + Math.random()*0.5)); // Créativité
        let composure = Math.floor(ovr * (0.5 + Math.random()*0.6)); // Sang-froid (Buteur)
        // Physiques
        let pace = Math.floor(ovr * (0.7 + Math.random()*0.4));
        let strength = Math.floor(ovr * (0.6 + Math.random()*0.5));

        // --- 2. AJUSTEMENTS SELON LE POSTE ---
        if(pos === 'DEF') { tackling += 20; positioning += 15; finishing -= 20; pace -= 5; }
        if(pos === 'ATT') { finishing += 20; composure += 15; tackling -= 20; pace += 10; }
        if(pos === 'MIL') { passing += 15; vision += 15; }
        if(pos === 'GB')  { positioning += 20; pace = 30; finishing = 10; tackling += 10; }

        let stats = { finishing, passing, tackling, dribbling, positioning, vision, composure, pace, strength };
        
        // On s'assure que ça reste entre 30 et 99 (je garde ton minimum de 30)
        Object.keys(stats).forEach(k => stats[k] = Math.min(99, Math.max(30, stats[k])));

        let price = this.getPlayerValue(ovr, age, pot); // FIX #32 : age/pot pris en compte

        // --- 3. RETOUR DE L'OBJET COMPLET ---
        return { 
            id: Math.random().toString(36).substr(2, 9) + '_' + (this._idCounter = (this._idCounter||0)+1), // FIX #85 : compteur ajouté pour éviter toute collision
            name: this.randomName(regionId), 
            position: pos, 
            exactPosition: randomExactPosition(pos),   // rôle précis (ailier, sentinelle…)
            ovr: ovr,
            pot: pot,                 // NOUVEAU: Potentiel maximum du joueur
            age: age,                 // NOUVEAU: Âge du joueur
            stats: stats, 
            energy: 100,
            morale: 80,               // Le moral commence à 80% (Heureux)
            price: price,
            wage: this.getPlayerWage(price), // FIX #33 : formule unifiée
            isScouted: false,                 // Pour le brouillard de guerre (Scouting)
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            injuryDays: 0,        
            suspensionDays: 0,
            // FIX #2a : durée de contrat exprimée en journées réelles (1 saison = 38 journées),
            // avec un étalement aléatoire pour ne pas faire expirer tout l'effectif en même temps
            contract: (() => {
                const duration = Math.floor(Math.random() * 3) + 1; // 1 à 3 saisons
                const nominal = duration * 38;
                const stagger = Math.floor(Math.random() * 38) - 19;
                return { duration, expiresIn: Math.max(5, nominal + stagger) };
            })()
        };
    }
    
    static generateSquad(regionId) {
        let squad = [];
        for(let i=0; i<3; i++) squad.push(this.randomPlayer('GB', regionId));
        for(let i=0; i<8; i++) squad.push(this.randomPlayer('DEF', regionId));
        for(let i=0; i<8; i++) squad.push(this.randomPlayer('MIL', regionId));
        for(let i=0; i<6; i++) squad.push(this.randomPlayer('ATT', regionId));
        
        const posOrder = { 'GB': 1, 'DEF': 2, 'MIL': 3, 'ATT': 4 };
        squad.sort((a,b) => posOrder[a.position] - posOrder[b.position] || b.ovr - a.ovr);
        
        let starters = [
            squad.find(p => p.position === 'GB'),
            ...squad.filter(p => p.position === 'DEF').slice(0,4),
            ...squad.filter(p => p.position === 'MIL').slice(0,4),
            ...squad.filter(p => p.position === 'ATT').slice(0,2)
        ].filter(Boolean);
        
        let bench = squad.filter(p => !starters.includes(p));
        return [...starters, ...bench];
    }

    static getSquadForClub(clubName, regionId) {
        // Si le club existe dans notre base de données réelle
        if (typeof REAL_PLAYERS !== 'undefined' && REAL_PLAYERS[clubName]) {
            let squad = REAL_PLAYERS[clubName].map(p => {
                // 1. Mapping des positions
                let basePos = 'MIL';
                if (p.pos === 'G') { 
                    basePos = 'GB'; 
                } else if (['DC', 'DG', 'DD'].includes(p.pos)) { 
                    basePos = 'DEF'; 
                } else if (['BT', 'AV', 'AI'].includes(p.pos)) { 
                    basePos = 'ATT'; 
                }
                
                // 2. Génération de stats FM cohérentes avec la note globale (OVR)
                let ovr = p.ovr;
                
                // --- LES NOUVELLES STATS ---
                let finishing = Math.floor(ovr * (0.5 + Math.random()*0.6));
                let passing = Math.floor(ovr * (0.6 + Math.random()*0.5));
                let tackling = Math.floor(ovr * (0.5 + Math.random()*0.6));
                let dribbling = Math.floor(ovr * (0.6 + Math.random()*0.5));
                let positioning = Math.floor(ovr * (0.6 + Math.random()*0.5)); 
                let vision = Math.floor(ovr * (0.6 + Math.random()*0.5)); 
                let composure = Math.floor(ovr * (0.5 + Math.random()*0.6)); 
                let pace = Math.floor(ovr * (0.7 + Math.random()*0.4)); // "pace" remplace "pac"
                let strength = Math.floor(ovr * (0.6 + Math.random()*0.5));

                // Ajustements selon le poste
                if(basePos === 'DEF') { tackling += 20; positioning += 15; finishing -= 20; pace -= 5; }
                if(basePos === 'ATT') { finishing += 20; composure += 15; tackling -= 20; pace += 10; }
                if(basePos === 'MIL') { passing += 15; vision += 15; }
                if(basePos === 'GB')  { positioning += 20; pace = 30; finishing = 10; tackling += 10; }
                
                let stats = { finishing, passing, tackling, dribbling, positioning, vision, composure, pace, strength };
                Object.keys(stats).forEach(k => stats[k] = Math.min(99, Math.max(30, stats[k])));

                let price = this.getPlayerValue(ovr, p.age || 24, p.pot || p.ovr + 5); // FIX #32/#33

                return { 
                    id: Math.random().toString(36).substr(2, 9) + '_' + (this._idCounter = (this._idCounter||0)+1), // FIX #85
                    name: p.name, 
                    position: basePos, 
                    exactPosition: p.pos,
                    age: p.age || 24,
                    pot: p.pot || p.ovr + 5,
                    ovr: ovr, 
                    stats: stats,           // On injecte le nouvel objet 'stats'
                    energy: 100,
                    morale: 80,             // NOUVEAU: Moral
                    wage: this.getPlayerWage(price), // FIX #33 : formule unifiée
                    isScouted: true,        // NOUVEAU: Joueur connu
                    price: price,           // Calculé avec getPlayerValue
                    goals: 0,
                    assists: 0,
                    yellowCards: 0,
                    redCards: 0,
                    injuryDays: 0,
                    suspensionDays: 0,
                    // FIX #2b : même correction que randomPlayer (voir plus haut)
                    contract: (() => {
                        const duration = Math.floor(Math.random() * 3) + 1;
                        const nominal = duration * 38;
                        const stagger = Math.floor(Math.random() * 38) - 19;
                        return { duration, expiresIn: Math.max(5, nominal + stagger) };
                    })()
                };
            });

            // On complète à 22 joueurs si nécessaire (avec les nouvelles stats aussi)
            while(squad.length < 22) {
                const positions = ['GB', 'DEF', 'MIL', 'ATT'];
                const randomPos = positions[Math.floor(Math.random() * positions.length)];
                squad.push(this.randomPlayer(randomPos, regionId, 60, 75));
            }

            // Tri et sélection du 11 de départ
            const posOrder = { 'GB': 1, 'DEF': 2, 'MIL': 3, 'ATT': 4 };
            squad.sort((a,b) => posOrder[a.position] - posOrder[b.position] || b.ovr - a.ovr);
            
            let starters = [
                squad.find(p => p.position === 'GB'),
                ...squad.filter(p => p.position === 'DEF').slice(0,4),
                ...squad.filter(p => p.position === 'MIL').slice(0,4),
                ...squad.filter(p => p.position === 'ATT').slice(0,2)
            ].filter(Boolean);
            
            let bench = squad.filter(p => !starters.includes(p));
            return [...starters, ...bench];
        }
        
        return this.generateSquad(regionId);
    }
}


class GameManager {
    constructor() {
        this.globalData = {}; 
        this.fixtures = []; 
        this.matchday = 0;
        this.messages = []; // FIX #1 : évite le crash "Cannot read properties of undefined (reading 'unshift')"
        this.freeAgentPool = []; // FIX #12b : garanti d'exister dès le départ (utilisé avant generateFreeAgents)
        
        this.userLeagueId = null;
        this.userClubName = null;
        this.userSquad = null;
        this.userStaff = [];
        this.userTactics = {
            formation: '4-4-2', mentality: 'balanced', style: 'possession',
            attackSide: 'mixed',   // couloir d'attaque privilégié
            pressing: 'half',      // zone où l'on va chercher le ballon
            line: 'normal'         // hauteur de la ligne défensive
        };
        // Rôles désignés par le coach. `null` = choix automatique (le meilleur
        // homme disponible sur la pelouse est pris pour ce geste).
        this.setPieces = { penalty: null, freekick: null, corner: null, captain: null, playmaker: null };
        
        this.liveMatch = null;
        this.budget = 15000000; 
        this.marketPool = [];
        this.swapSelectedId = null;
        this.reputation = 30;
        this.academy = [];
        this.loansOut = [];   // LOT 8 : prêts en cours (sortants)
        this.loansIn = [];    // LOT 10 : joueurs empruntés à d'autres clubs
        this.history = [];         // LOT 12 : palmarès saison par saison
        this.seasonAwards = null;  // LOT 13 : trophées individuels de la saison en cours
        this.retiredPlayers = [];  // LOT 12 : carrières archivées
        this.monthlyRevenue = 0;
        this.monthlyExpenses = 0;
        this.cafData = null; // CAF Champions League

        this.init();
    }

    init() {
        if (this.loadGame()) {
            // --- CAS 1 : UNE SAUVEGARDE EXISTE ---
            const setupModal = document.getElementById('setup-modal');
            if (setupModal) setupModal.classList.add('hidden'); 
            
            // On remplit quand même le sélecteur de ligue pour la vue Classement (car il est utilisé en jeu)
            const selStandings = document.getElementById('standings-league-selector');
            if (selStandings) {
                selStandings.innerHTML = ""; // On vide pour éviter les doublons
                LEAGUES.forEach(l => selStandings.innerHTML += `<option value="${l.id}">${l.name}</option>`);
            }

            // On rafraîchit tout avec les données chargées
            this.updateHeader();
            this.refreshAllViews();
            this.switchView('dashboard');
            
        } else {
            // --- CAS 2 : NOUVELLE PARTIE (Pas de sauvegarde) ---
            const setupModal = document.getElementById('setup-modal');
            if (setupModal) setupModal.classList.remove('hidden');

            // 1. On initialise les données mondiales (Génération des clubs et joueurs)
            // ON NE FAIT ÇA QUE SI C'EST UNE NOUVELLE PARTIE
            LEAGUES.forEach(l => {
                this.globalData[l.id] = {
                    id: l.id,
                    name: l.name,
                    region: l.region,
                    standings: l.clubs.map(c => {
                        const squad = Generator.getSquadForClub(c, l.region);
                        const force = Math.round(squad.slice(0, 11).reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0) / 11);
                        return {
                            name: c,
                            isUser: false,
                            played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [],
                            force: force,
                            squad: squad
                        };
                    })
                };
            });

            // 2. On remplit le menu de sélection de ligue pour la création de partie
            const selLeague = document.getElementById('setup-league');
            if (selLeague) {
                selLeague.innerHTML = ""; // On vide avant de remplir
                LEAGUES.forEach(l => selLeague.innerHTML += `<option value="${l.id}">${l.name}</option>`);
                
                // 3. On force l'affichage des clubs de la première ligue sélectionnée
                this.updateSetupClubs();
            }
            
            // 4. On remplit aussi le sélecteur du classement
            const selStandings = document.getElementById('standings-league-selector');
            if (selStandings) {
                selStandings.innerHTML = ""; 
                LEAGUES.forEach(l => selStandings.innerHTML += `<option value="${l.id}">${l.name}</option>`);
            }
        }
    }

    updateSetupClubs() {
        const lId = document.getElementById('setup-league').value;
        const league = LEAGUES.find(l => l.id === lId);
        const selClub = document.getElementById('setup-club');
        selClub.innerHTML = league.clubs.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    startGame() {
        this.userLeagueId = document.getElementById('setup-league').value;
        this.userClubName = document.getElementById('setup-club').value;

        let myClub = this.getMyClub();
        myClub.isUser = true;
        this.userSquad = myClub.squad;
        this.updateUserClubForce();

        document.getElementById('tactic-formation').value = this.userTactics.formation;
        document.getElementById('tactic-mentality').value = this.userTactics.mentality;
        document.getElementById('tactic-style').value = this.userTactics.style;
        document.getElementById('standings-league-selector').value = this.userLeagueId;

        document.getElementById('setup-modal').classList.add('hidden');
        
        // 🎓 FORCE L'INITIALISATION DE L'ACADÉMIE ICI !
        this.academyLevel = 1;
        this.academy = []; // On s'assure que le tableau est vierge
        this.loansOut = []; // LOT 8 : aucun prêt en cours au coup d'envoi
        this.loansIn = [];  // LOT 10
        this.history = [];         // LOT 12
        this.retiredPlayers = [];  // LOT 12
        this.seasonAwards = null;  // LOT 13
        this.generateAcademyClass(); // On génère la première cuvée
        
        this.generateFixtures();
        this.generateMarketPool();
        this.updateHeader();
        this.refreshAllViews();
        this.switchView('dashboard');
        this.saveGame();
    }

    getMyClub() {
        return this.globalData[this.userLeagueId].standings.find(c => c.name === this.userClubName);
    }
    
    updateUserClubForce() {
        let myClub = this.getMyClub();
        const starters = this.userSquad.slice(0, 11);
        // FIX #2d : garde-fou anti division par zéro (effectif vide)
        if (starters.length === 0) { myClub.force = 40; return; }
        // Si le joueur met un blessé ou suspendu dans ses 11, la force globale s'effondre
        myClub.force = Math.round(starters.reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0) / starters.length);
    }

    generateFixtures() {
    this.fixtures = [];
    
    // 1. Définition des dates réservées pour la Coupe de la CAF (trous dans le championnat)
    const cafSlots = [4, 9, 14, 19, 24, 29, 34, 37, 41, 44, 48]; 
    this.cafSlots = cafSlots; // Sauvegardé pour les phases finales

    let leagueFixtures = [];

    Object.values(this.globalData).forEach(league => {
        const teams = [...league.standings];
        const n = teams.length;
        const rounds = [];
        
        // Génère les journées aller avec l'algorithme round-robin alterné
        for(let round = 0; round < n - 1; round++) {
            const roundMatches = [];
            for(let i = 0; i < n / 2; i++) {
                let homeTeam = teams[i];
                let awayTeam = teams[n - 1 - i];

                // --- TA CORRECTION : Alternance Domicile / Extérieur ---
                if (i === 0) {
                    if (round % 2 === 1) {
                        homeTeam = teams[n - 1 - i];
                        awayTeam = teams[i];
                    }
                } else {
                    if (round % 2 === 0) {
                        homeTeam = teams[n - 1 - i];
                        awayTeam = teams[i];
                    }
                }

                roundMatches.push({
                    home: homeTeam,
                    away: awayTeam,
                    leagueId: league.id,
                    played: false,
                    type: 'LEAGUE',       // On identifie que c'est un match de ligue
                    roundIndex: round     // On utilise un index temporaire
                });
            }
            rounds.push(roundMatches);
            
            // Rotation de l'algorithme : fixe le premier, fait tourner les autres
            teams.splice(1, 0, teams.pop());
        }

        // Journées retour (domicile/extérieur inversés)
        const retour = rounds.map((round, ri) => 
            round.map(f => ({
                home: f.away,
                away: f.home,
                leagueId: league.id,
                played: false,
                type: 'LEAGUE',
                roundIndex: ri + (n - 1)
            }))
        ).flat();

        leagueFixtures.push(...rounds.flat(), ...retour);
    });

    // 2. Mapping des journées de championnat en évitant les dates CAF
    let leagueRoundToGlobalMatchday = {};
    let globalSlot = 0;
    
    // Nombre total de journées de championnat (ex: 38 si 20 équipes)
    let maxLeagueRounds = (Object.values(this.globalData)[0].standings.length - 1) * 2;
    
    for (let i = 0; i < maxLeagueRounds; i++) {
        while (cafSlots.includes(globalSlot)) {
            globalSlot++; // On saute les dates réservées à la CAF
        }
        leagueRoundToGlobalMatchday[i] = globalSlot; // On fait correspondre l'index au slot global dispo
        globalSlot++;
    }

    // 3. Assignation du vrai "matchday" global aux matchs de ligue
    leagueFixtures.forEach(f => {
        f.matchday = leagueRoundToGlobalMatchday[f.roundIndex];
    });
    
    this.fixtures.push(...leagueFixtures);

    // 4. Injection des matchs de la CAF dans les "trous" créés (si initialisée)
    if (this.cafData && this.cafData.groups) {
        this.injectCAFGroupFixtures();
    }
    
    // 5. Tri final pour s'assurer que l'ordre des matchs est parfait dans this.fixtures
    this.fixtures.sort((a, b) => a.matchday - b.matchday);
}
injectCAFGroupFixtures() {
    // 1. IL MANQUAIT CETTE LIGNE : On récupère les 6 premières dates
    const groupSlots = this.cafSlots.slice(0, 6); 
    
    this.cafData.groups.forEach((group, gi) => { // 'gi' est l'index du groupe
        const teams = group; // group est DÉJÀ le tableau des équipes !        
        
        // Calendrier standard pour 4 équipes (3 matchs aller, 3 matchs retour)
        // h = home (domicile), a = away (extérieur)
        const matchups = [
            [{h:0, a:1}, {h:2, a:3}], // J1
            [{h:3, a:0}, {h:1, a:2}], // J2
            [{h:0, a:2}, {h:1, a:3}], // J3
            [{h:2, a:0}, {h:3, a:1}], // J4 (Retour J3)
            [{h:1, a:0}, {h:3, a:2}], // J5 (Retour J1)
            [{h:0, a:3}, {h:2, a:1}]  // J6 (Retour J2)
        ];

        matchups.forEach((round, index) => {
            let globalDay = groupSlots[index];
            round.forEach(match => {
                this.fixtures.push({
                    home: teams[match.h],
                    away: teams[match.a],
                    type: 'CAF_GROUP',
                    groupId: gi, // 2. CORRECTION ICI : on utilise 'gi'
                    matchday: globalDay,
                    played: false
                });
            });
        });
    });
}
    

    updateHeader() {
        document.getElementById('header-club-name').innerText = this.userClubName;
        document.getElementById('header-club-logo').innerText = this.userClubName.substring(0,3).toUpperCase();
        document.getElementById('header-league-name').innerText = this.globalData[this.userLeagueId].name;
        document.getElementById('header-matchday').innerText = Math.min(this.matchday + 1, 48); // FIX #64
        document.getElementById('header-budget').innerText = formatMoney(this.budget);
        document.getElementById('market-budget').innerText = formatMoney(this.budget);
        const repEl = document.getElementById('header-reputation'); // FIX #57 : jamais mis à jour avant
        if (repEl && typeof this.getReputationLabel === 'function') repEl.innerText = this.getReputationLabel();
        // À ajouter à la fin de updateHeader()
const unread = (this.messages || []).filter(m => !m.read).length;
const badge = document.getElementById('notification-badge');
if (badge) {
    badge.innerText = unread;
    badge.classList.toggle('hidden', unread === 0);
}
    }
    // FIX #97 : le jeu mélangeait des alert()/confirm() natifs (bloquants, hors charte
    // graphique, et bloqués par certains navigateurs mobiles) avec ses propres notifications.
    // showConfirm remplace confirm() : comme il est asynchrone, les appelants passent
    // désormais un callback exécuté à la validation.
    showConfirm(message, onConfirm, options = {}) {
        const okLabel = options.okLabel || 'Confirmer';
        const cancelLabel = options.cancelLabel || 'Annuler';
        const danger = !!options.danger;

        document.getElementById('game-confirm')?.remove();
        const overlay = document.createElement('div');
        overlay.id = 'game-confirm';
        overlay.style.cssText = `position:fixed; inset:0; z-index:10000; display:flex;
            align-items:center; justify-content:center; padding:20px;
            background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);`;
        overlay.innerHTML = `
            <div style="max-width:420px; width:100%; background:#0f172a; border:1px solid rgba(255,255,255,0.08);
                        border-radius:16px; padding:24px; box-shadow:0 20px 60px rgba(0,0,0,0.6);">
                <p style="color:#e2e8f0; font-size:13px; line-height:1.6; white-space:pre-line; margin-bottom:20px;">${message}</p>
                <div style="display:flex; gap:10px;">
                    <button data-act="cancel" style="flex:1; padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);
                            background:transparent; color:#94a3b8; font-size:11px; font-weight:700;
                            text-transform:uppercase; letter-spacing:0.05em; cursor:pointer;">${cancelLabel}</button>
                    <button data-act="ok" style="flex:1; padding:10px; border-radius:10px; border:none;
                            background:${danger ? '#ef4444' : '#ea580c'}; color:#fff; font-size:11px; font-weight:700;
                            text-transform:uppercase; letter-spacing:0.05em; cursor:pointer;">${okLabel}</button>
                </div>
            </div>`;
        const close = () => overlay.remove();
        overlay.addEventListener('click', (e) => {
            const act = e.target?.dataset?.act;
            if (act === 'ok') { close(); onConfirm && onConfirm(); }
            else if (act === 'cancel' || e.target === overlay) close();
        });
        document.body.appendChild(overlay);
    }

    // FIX #97 : remplace les alert() purement informatifs (fin du mois, titre CAF...) par une
    // modale maison à un seul bouton, dans la charte du jeu.
    showAlert(message, options = {}) {
        this.showConfirm(message, null, { okLabel: options.okLabel || 'OK', cancelLabel: 'Fermer' });
    }

    showNotification(message, type = 'success') {
    // Chercher ou créer le toast container
    let toast = document.getElementById('game-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'game-toast';
        toast.style.cssText = `
            position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
            z-index: 9999; padding: 12px 24px; border-radius: 12px;
            font-size: 13px; font-weight: bold; text-align: center;
            max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            transition: opacity 0.4s ease, transform 0.4s ease;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }

    // Couleur selon le type
    const colors = {
        success: 'background:#22c55e; color:#fff;',
        error:   'background:#ef4444; color:#fff;',
        warning: 'background:#f59e0b; color:#fff;',
        info:    'background:#3b82f6; color:#fff;'
    };
    toast.style.cssText += colors[type] || colors.success;
    toast.innerText = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    // Auto-hide après 3 secondes
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 3000);
}

    selectForSwap(playerId) {
        if(!this.swapSelectedId) {
            this.swapSelectedId = playerId;
            this.renderTacticsLists();
        } else {
            if(this.swapSelectedId !== playerId) {
                let idx1 = this.userSquad.findIndex(p => p.id === this.swapSelectedId);
                let idx2 = this.userSquad.findIndex(p => p.id === playerId);
                let temp = this.userSquad[idx1];
                this.userSquad[idx1] = this.userSquad[idx2];
                this.userSquad[idx2] = temp;
                
                this.updateUserClubForce();

                // FIX #71 : avertir si le onze de départ se retrouve sans gardien
                const startersHaveGK = this.userSquad.slice(0, 11).some(p => p.position === 'GB');
                if (!startersHaveGK) {
                    this.showNotification("⚠️ Attention : aucun gardien dans votre onze de départ !", "warning");
                }
            }
            this.swapSelectedId = null;
            this.renderTacticsView();
            this.renderDashboard(); // Update force on dashboard
        }
    }

    updateTactics() {
        this.userTactics.formation = document.getElementById('tactic-formation').value;
        this.userTactics.mentality = document.getElementById('tactic-mentality').value;
        this.userTactics.style = document.getElementById('tactic-style').value;
        this.renderTacticsPitch(); 
    }

    // =====================================================================
    // 🎯 RÔLES & COUPS DE PIED ARRÊTÉS
    // =====================================================================
    // Le coach désigne son tireur de penalty, son spécialiste des coups
    // francs, son tireur de corner et son capitaine. S'il ne désigne
    // personne — ou si l'homme désigné est blessé, suspendu ou sur le banc —
    // le meilleur disponible du onze prend le relais. Aucun match ne se joue
    // donc jamais sans tireur.

    setPieceScore(p, kind) {
        if (!p) return 0;
        const s = p.stats || {};
        const g = k => (s[k] ?? p.ovr ?? 60);
        if (kind === 'penalty')  return g('composure') * 0.50 + g('finishing') * 0.40 + (p.ovr || 60) * 0.10;
        if (kind === 'freekick') return g('finishing') * 0.35 + g('passing') * 0.35 + g('vision') * 0.20 + g('composure') * 0.10;
        if (kind === 'corner')   return g('passing') * 0.50 + g('vision') * 0.40 + (p.ovr || 60) * 0.10;
        if (kind === 'playmaker') return g('vision') * 0.45 + g('passing') * 0.35 + g('dribbling') * 0.20;
        // Capitaine : le patron du vestiaire — niveau, expérience et moral
        return (p.ovr || 60) * 0.70 + Math.min(p.age || 24, 34) * 0.80 + ((p.morale ?? 80) * 0.10);
    }

    eligibleForSetPiece(p, kind) {
        if (!p) return false;
        // Un gardien peut porter le brassard, mais ne tire ni penalty ni corner
        if (kind !== 'captain' && (p.position === 'GB' || p.exactPosition === 'G')) return false;
        return !(p.injuryDays > 0 || p.suspensionDays > 0);
    }

    autoSetPiece(kind, pool) {
        const list = (pool || (this.userSquad || []).slice(0, 11)).filter(p => this.eligibleForSetPiece(p, kind));
        if (!list.length) return null;
        return list.slice().sort((a, b) => this.setPieceScore(b, kind) - this.setPieceScore(a, kind))[0];
    }

    // Le tireur réellement utilisé pendant le match.
    getSetPieceTaker(kind, pool) {
        const onPitch = pool || (this.userSquad || []).slice(0, 11);
        const id = this.setPieces ? this.setPieces[kind] : null;
        const chosen = id ? onPitch.find(p => p.id === id) : null;
        if (chosen && this.eligibleForSetPiece(chosen, kind)) return chosen;
        return this.autoSetPiece(kind, onPitch);
    }

    setSetPiece(kind, id) {
        if (!this.setPieces) this.setPieces = { penalty: null, freekick: null, corner: null, captain: null };
        this.setPieces[kind] = id || null;
        const p = (this.userSquad || []).find(x => x.id === id);
        const labels = { penalty: 'Penalty', freekick: 'Coups francs', corner: 'Corners',
                         captain: 'Capitaine', playmaker: 'Meneur de jeu' };
        this.renderTacticsLists();
        this.showNotification(`${labels[kind]} : ${p ? p.name : 'choix automatique'}`);
    }

    autoAssignAllSetPieces() {
        if (!this.setPieces) this.setPieces = {};
        ['penalty', 'freekick', 'corner', 'captain', 'playmaker'].forEach(k => {
            const p = this.autoSetPiece(k);
            this.setPieces[k] = p ? p.id : null;
        });
        this.renderTacticsLists();
        this.showNotification('🎯 Rôles réattribués automatiquement.');
    }

    // Position du meneur désigné dans le onze aligné, pour que la simulation
    // sache à qui donner le ballon en priorité. -1 = personne.
    playmakerIndex(side) {
        if (!this.liveMatch || !this.setPieces || !this.setPieces.playmaker) return -1;
        const lm = this.liveMatch;
        const list = side === 'H' ? lm.homeStarters : lm.awayStarters;
        if (!list) return -1;
        return list.findIndex(p => p.id === this.setPieces.playmaker);
    }

    // Changement d'une consigne collective. Si un match est en cours, elle
    // s'applique immédiatement, sans remettre le ballon au rond central.
    setInstruction(key, value) {
        this.userTactics[key] = value;
        this.renderTeamInstructions();
        if (this.liveMatch && MATCHSIM.active) this.retuneMatchSim();
        const inst = TEAM_INSTRUCTIONS.find(i => i.key === key);
        const opt = inst && inst.options.find(o => o[0] === value);
        if (inst && opt) this.showNotification(`${inst.label} : ${opt[1]}`);
    }

    captainOnPitch() {
        if (!this.liveMatch || !this.setPieces || !this.setPieces.captain) return false;
        const lm = this.liveMatch;
        const list = lm.home.isUser ? lm.homeStarters : lm.away.isUser ? lm.awayStarters : null;
        return !!(list && list.some(p => p.id === this.setPieces.captain));
    }

    ensureSetPiecePanel() {
        const list = document.getElementById('tactics-titulaires');
        if (!list || !list.parentNode) return null;
        this.injectSetPieceStyles();
        let panel = document.getElementById('setpiece-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'setpiece-panel';
            panel.className = 'sp-panel';
            list.parentNode.insertBefore(panel, list);
        }
        return panel;
    }

    // Une seule feuille de style, injectée à la demande. Tout est écrit à la
    // main plutôt qu'en classes utilitaires : ces composants doivent s'afficher
    // à l'identique quelle que soit la configuration Tailwind du projet.
    injectSetPieceStyles() {
        if (document.getElementById('sp-styles')) return;
        const st = document.createElement('style');
        st.id = 'sp-styles';
        st.textContent = `
.sp-panel{margin-bottom:14px}
.sp-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:10px}
.sp-title{font-size:12px;font-weight:800;color:#f1f5f9;letter-spacing:.02em;margin:0}
.sp-sub{font-size:10px;color:#64748b;margin:2px 0 0}
.sp-auto{flex:none;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
    color:#fb923c;background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.28);
    padding:6px 10px;border-radius:999px;cursor:pointer;transition:transform .12s,background .2s}
.sp-auto:active{transform:scale(.94)}
.sp-auto:hover{background:rgba(249,115,22,.2)}

/* La grille s'adapte à la LARGEUR RÉELLE de la colonne, pas à celle de
   l'écran : 2 cartes sur un téléphone, 3 ou 4 dans un panneau large. */
.sp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:8px}

.sp-card{position:relative;display:flex;flex-direction:column;gap:8px;width:100%;text-align:left;
    padding:10px;border-radius:16px;cursor:pointer;overflow:hidden;
    background:linear-gradient(160deg,rgba(255,255,255,.05),rgba(255,255,255,.015));
    border:1px solid rgba(255,255,255,.07);
    transition:transform .14s cubic-bezier(.2,.9,.3,1.2),border-color .2s,box-shadow .2s}
.sp-card::before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--acc);opacity:.9}
/* Teinte propre à chaque rôle. Déclaration séparée : sur un moteur sans
   color-mix, la carte retombe sur le dégradé neutre ci-dessus. */
.sp-card{background:linear-gradient(155deg,color-mix(in srgb,var(--acc) 13%,transparent) 0%,rgba(255,255,255,.02) 62%)}
.sp-card:hover{border-color:color-mix(in srgb,var(--acc) 45%,transparent);
    box-shadow:0 6px 20px -8px color-mix(in srgb,var(--acc) 40%,transparent)}
.sp-card:active{transform:scale(.97)}
.sp-card:focus-visible{outline:2px solid var(--acc);outline-offset:2px}

.sp-card-top{display:flex;align-items:center;gap:6px;padding-right:44px}
.sp-card-icon{width:22px;height:22px;flex:none;display:grid;place-items:center;border-radius:8px;
    font-size:12px;background:color-mix(in srgb,var(--acc) 18%,transparent)}
.sp-card-role{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--acc)}

.sp-card-player{display:flex;align-items:center;gap:8px;min-width:0}
.sp-face{width:30px;height:30px;flex:none;border-radius:10px;overflow:hidden;background:#020617;
    border:1px solid rgba(255,255,255,.08)}
.sp-face svg{width:100%;height:100%;display:block}
.sp-card-name{font-size:12px;font-weight:700;color:#f8fafc;line-height:1.15;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-card-meta{font-size:9px;color:#64748b;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-card-empty{font-size:11px;color:#64748b;font-style:italic}
.sp-pill{position:absolute;top:8px;right:8px;font-size:8px;font-weight:800;letter-spacing:.06em;
    text-transform:uppercase;padding:2px 6px;border-radius:999px;
    color:#94a3b8;background:rgba(148,163,184,.14)}
.sp-pill--set{color:#0b1220;background:var(--acc)}

/* ---- consignes d'équipe : boutons segmentés ---------------------- */
.ti-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 0;
    border-top:1px solid rgba(255,255,255,.05)}
.ti-row:first-of-type{border-top:0}
.ti-label{flex:1 1 120px;min-width:0}
.ti-label b{display:block;font-size:11px;font-weight:700;color:#e2e8f0;line-height:1.2}
.ti-label span{display:block;font-size:9px;color:#64748b;margin-top:1px}
.ti-segs{display:flex;flex:1 1 190px;gap:3px;padding:3px;border-radius:11px;
    background:rgba(2,6,23,.6);border:1px solid rgba(255,255,255,.06)}
.ti-seg{flex:1;min-height:34px;padding:9px 4px;border:0;border-radius:8px;cursor:pointer;
    font-size:9.5px;font-weight:700;letter-spacing:.01em;color:#94a3b8;background:transparent;
    white-space:nowrap;transition:background .18s,color .18s,transform .12s}
.ti-seg:hover{color:#e2e8f0;background:rgba(255,255,255,.05)}
.ti-seg:active{transform:scale(.95)}
.ti-seg:focus-visible{outline:2px solid #fb923c;outline-offset:-2px}
.ti-seg.is-on{color:#0b1220;background:#fb923c;box-shadow:0 2px 8px -2px rgba(251,146,60,.6)}

/* ---- feuille de sélection --------------------------------------- */
.sp-sheet-wrap{position:fixed;inset:0;z-index:10050;display:flex;align-items:flex-end;justify-content:center}
.sp-scrim{position:absolute;inset:0;background:rgba(2,6,23,.72);backdrop-filter:blur(6px);
    opacity:0;transition:opacity .26s ease}
.sp-sheet{position:relative;width:100%;max-width:520px;max-height:82vh;display:flex;flex-direction:column;
    background:#0b1220;border:1px solid rgba(255,255,255,.08);border-bottom:0;
    border-radius:22px 22px 0 0;box-shadow:0 -20px 60px rgba(0,0,0,.65);
    padding-bottom:max(10px,env(safe-area-inset-bottom));
    transform:translateY(100%);transition:transform .3s cubic-bezier(.16,1,.3,1)}
.sp-sheet-wrap.is-open .sp-scrim{opacity:1}
.sp-sheet-wrap.is-open .sp-sheet{transform:translateY(0)}
@media (min-width:640px){.sp-sheet-wrap{align-items:center}
    .sp-sheet{border-radius:22px;border-bottom:1px solid rgba(255,255,255,.08);max-height:78vh}}

.sp-grip{width:38px;height:4px;border-radius:99px;background:rgba(255,255,255,.18);margin:10px auto 4px}
.sp-sheet-head{display:flex;align-items:center;gap:10px;padding:8px 16px 12px;
    border-bottom:1px solid rgba(255,255,255,.06)}
.sp-sheet-icon{width:36px;height:36px;flex:none;display:grid;place-items:center;border-radius:12px;
    font-size:17px;background:color-mix(in srgb,var(--acc) 20%,transparent)}
.sp-sheet-title{font-size:14px;font-weight:800;color:#f8fafc;margin:0;line-height:1.2}
.sp-sheet-hint{font-size:10px;color:#64748b;margin:2px 0 0}
.sp-close{margin-left:auto;width:30px;height:30px;flex:none;border-radius:10px;cursor:pointer;
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#94a3b8;
    font-size:15px;line-height:1;display:grid;place-items:center;transition:background .2s}
.sp-close:hover{background:rgba(255,255,255,.12);color:#f8fafc}

.sp-list{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:8px;display:flex;flex-direction:column;gap:6px}
.sp-row{display:flex;align-items:center;gap:11px;width:100%;text-align:left;cursor:pointer;
    padding:9px 11px;border-radius:14px;background:rgba(255,255,255,.03);
    border:1px solid transparent;transition:background .18s,border-color .18s,transform .12s}
.sp-row:hover{background:rgba(255,255,255,.07)}
.sp-row:active{transform:scale(.985)}
.sp-row:focus-visible{outline:2px solid var(--acc);outline-offset:-2px}
.sp-row.is-on{background:color-mix(in srgb,var(--acc) 13%,transparent);
    border-color:color-mix(in srgb,var(--acc) 42%,transparent)}
.sp-row-face{width:38px;height:38px;flex:none;border-radius:12px;overflow:hidden;background:#020617;
    border:1px solid rgba(255,255,255,.08)}
.sp-row-face svg{width:100%;height:100%;display:block}
.sp-row-main{flex:1;min-width:0}
.sp-row-name{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:#f8fafc;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-badge{flex:none;font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;
    padding:2px 5px;border-radius:5px;color:#0b1220;background:var(--acc)}
.sp-row-meta{font-size:9.5px;color:#64748b;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-bar{display:block;height:3px;border-radius:99px;background:rgba(255,255,255,.08);margin-top:6px;overflow:hidden}
.sp-bar i{display:block;height:100%;border-radius:99px;background:var(--acc);
    transition:width .4s cubic-bezier(.16,1,.3,1)}
.sp-row-score{flex:none;text-align:right;min-width:30px}
.sp-row-score b{display:block;font-size:19px;font-weight:800;color:#f8fafc;line-height:1}
.sp-row-score span{display:block;font-size:7.5px;letter-spacing:.08em;text-transform:uppercase;color:#475569;margin-top:1px}
.sp-row--auto .sp-row-face{display:grid;place-items:center;font-size:15px;border-style:dashed}
.sp-check{flex:none;color:var(--acc);font-size:14px;font-weight:900}

@media (prefers-reduced-motion:reduce){
    .sp-sheet,.sp-scrim,.sp-card,.sp-row,.sp-bar i{transition:none}
}`;
        document.head.appendChild(st);
    }

    // Note d'aptitude affichée (0–99). Le score brut du capitaine mélange des
    // grandeurs différentes : on le ramène sur la même échelle que les autres
    // pour que les barres restent comparables d'un rôle à l'autre.
    setPieceRating(p, kind) {
        if (!p) return 0;
        if (kind === 'captain') {
            const s = (p.ovr || 60) * 0.60 + (Math.min(p.age || 24, 34) / 34) * 100 * 0.25 + (p.morale ?? 80) * 0.15;
            return Math.max(0, Math.min(99, Math.round(s)));
        }
        return Math.max(0, Math.min(99, Math.round(this.setPieceScore(p, kind))));
    }

    ensureInstructionsPanel() {
        const list = document.getElementById('tactics-titulaires');
        if (!list || !list.parentNode) return null;
        this.injectSetPieceStyles();
        let panel = document.getElementById('team-instructions-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'team-instructions-panel';
            panel.className = 'sp-panel';
            list.parentNode.insertBefore(panel, list);
        }
        return panel;
    }

    renderTeamInstructions() {
        const panel = this.ensureInstructionsPanel();
        if (!panel) return;
        const t = this.userTactics;
        const rows = TEAM_INSTRUCTIONS.map(inst => {
            const cur = t[inst.key];
            const segs = inst.options.map(([val, lab]) => `
                <button type="button" class="ti-seg ${cur === val ? 'is-on' : ''}"
                        onclick="app.setInstruction('${inst.key}','${val}')">${lab}</button>`).join('');
            return `
            <div class="ti-row">
                <div class="ti-label"><b>${inst.label}</b><span>${inst.hint}</span></div>
                <div class="ti-segs">${segs}</div>
            </div>`;
        }).join('');
        panel.innerHTML = `
            <div class="sp-head">
                <div>
                    <h4 class="sp-title">Consignes d'équipe</h4>
                    <p class="sp-sub">Elles changent le jeu à l'écran, même en cours de match</p>
                </div>
            </div>
            ${rows}`;
    }

    renderSetPiecePanel() {
        const panel = this.ensureSetPiecePanel();
        if (!panel) return;
        if (!this.setPieces) this.setPieces = { penalty: null, freekick: null, corner: null, captain: null };
        const starters = (this.userSquad || []).slice(0, 11);

        const cards = SET_PIECE_ROLES.map(r => {
            const explicit = this.setPieces[r.kind];
            const taker = this.getSetPieceTaker(r.kind, starters);
            const body = taker ? `
                <span class="sp-card-player">
                    <span class="sp-face">${playerFaceSVG(taker)}</span>
                    <span style="min-width:0">
                        <span class="sp-card-name">${taker.name.split(' ').pop()}</span>
                        <span class="sp-card-meta">${playerRole(taker).name}</span>
                    </span>
                </span>`
                : `<span class="sp-card-player"><span class="sp-card-empty">Personne de disponible</span></span>`;
            return `
            <button type="button" class="sp-card" style="--acc:${r.accent}"
                    onclick="app.openSetPiecePicker('${r.kind}')"
                    aria-label="${r.label} : ${taker ? taker.name : 'aucun'}">
                <span class="sp-pill ${explicit ? 'sp-pill--set' : ''}">${explicit ? 'Choisi' : 'Auto'}</span>
                <span class="sp-card-top">
                    <span class="sp-card-icon">${r.icon}</span>
                    <span class="sp-card-role">${r.label}</span>
                </span>
                ${body}
            </button>`;
        }).join('');

        panel.innerHTML = `
            <div class="sp-head">
                <div>
                    <h4 class="sp-title">Rôles de l'équipe</h4>
                    <p class="sp-sub">Qui prend le ballon sur coup arrêté</p>
                </div>
                <button type="button" class="sp-auto" onclick="app.autoAssignAllSetPieces()">Tout auto</button>
            </div>
            <div class="sp-grid">${cards}</div>`;
    }

    // La feuille glisse depuis le bas, avec sa poignée : c'est le geste que
    // tout le monde connaît sur téléphone. Elle se ferme au fond, à la croix,
    // à Échap, ou dès qu'un joueur est choisi.
    openSetSheetClose() { this.closeSetPiecePicker(); }

    openSetPiecePicker(kind) {
        this.injectSetPieceStyles();
        this.closeSetPiecePicker(true);
        const role = SET_PIECE_ROLES.find(r => r.kind === kind);
        if (!role) return;
        const starters = (this.userSquad || []).slice(0, 11);
        const explicit = this.setPieces ? this.setPieces[kind] : null;
        const auto = this.autoSetPiece(kind, starters);

        const candidates = starters
            .filter(p => this.eligibleForSetPiece(p, kind))
            .sort((a, b) => this.setPieceScore(b, kind) - this.setPieceScore(a, kind));

        const rows = candidates.map(p => {
            const rating = this.setPieceRating(p, kind);
            const best = auto && p.id === auto.id;
            return `
            <button type="button" class="sp-row ${explicit === p.id ? 'is-on' : ''}"
                    onclick="app.pickSetPiece('${kind}','${p.id}')">
                <span class="sp-row-face">${playerFaceSVG(p)}</span>
                <span class="sp-row-main">
                    <span class="sp-row-name">${p.name}${best ? '<span class="sp-badge">Conseillé</span>' : ''}</span>
                    <span class="sp-row-meta">${playerRole(p).name} · ${p.ovr} OVR · forme ${Math.round(p.energy)}%</span>
                    <span class="sp-bar"><i style="width:${rating}%"></i></span>
                </span>
                <span class="sp-row-score"><b>${rating}</b><span>Aptitude</span></span>
                ${explicit === p.id ? '<span class="sp-check">✓</span>' : ''}
            </button>`;
        }).join('');

        const autoRow = `
            <button type="button" class="sp-row sp-row--auto ${explicit ? '' : 'is-on'}"
                    onclick="app.pickSetPiece('${kind}','')">
                <span class="sp-row-face">✨</span>
                <span class="sp-row-main">
                    <span class="sp-row-name">Choix automatique</span>
                    <span class="sp-row-meta">${auto ? `Aujourd'hui : ${auto.name}` : 'Aucun joueur disponible'}</span>
                </span>
                ${explicit ? '' : '<span class="sp-check">✓</span>'}
            </button>`;

        const wrap = document.createElement('div');
        wrap.id = 'sp-sheet';
        wrap.className = 'sp-sheet-wrap';
        wrap.style.setProperty('--acc', role.accent);
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-modal', 'true');
        wrap.innerHTML = `
            <div class="sp-scrim" data-close="1"></div>
            <div class="sp-sheet">
                <div class="sp-grip"></div>
                <div class="sp-sheet-head">
                    <span class="sp-sheet-icon">${role.icon}</span>
                    <div style="min-width:0">
                        <h3 class="sp-sheet-title">${role.label}</h3>
                        <p class="sp-sheet-hint">${role.hint}</p>
                    </div>
                    <button type="button" class="sp-close" data-close="1" aria-label="Fermer">✕</button>
                </div>
                <div class="sp-list">${autoRow}${rows || ''}</div>
            </div>`;
        wrap.addEventListener('click', (e) => { if (e.target.dataset && e.target.dataset.close) this.closeSetPiecePicker(); });
        document.body.appendChild(wrap);
        // Un frame d'attente : sans lui, la transition d'ouverture est avalée.
        requestAnimationFrame(() => wrap.classList.add('is-open'));
        this._spEsc = (e) => { if (e.key === 'Escape') this.closeSetPiecePicker(); };
        document.addEventListener('keydown', this._spEsc);
    }

    closeSetPiecePicker(immediate) {
        const wrap = document.getElementById('sp-sheet');
        if (this._spEsc) { document.removeEventListener('keydown', this._spEsc); this._spEsc = null; }
        if (!wrap) return;
        if (immediate) { wrap.remove(); return; }
        wrap.classList.remove('is-open');
        setTimeout(() => wrap.remove(), 280);
    }

    pickSetPiece(kind, id) {
        this.closeSetPiecePicker();
        this.setSetPiece(kind, id);
    }

    renderTacticsView() {
        this.renderTacticsPitch();
        this.renderTacticsLists();
    }

    renderTacticsPitch() {
        const layer = document.getElementById('tactics-pitch-layer');
        layer.innerHTML = '';
        const coords = FORMATIONS_MAP[this.userTactics.formation] || FORMATIONS_MAP['4-4-2'];
        const starters = this.userSquad.slice(0, 11);
        
        coords.forEach((pos, i) => {
            const player = starters[i];
            const pName = player ? player.name.split(' ').pop() : 'Joueur';
            const pRole = player ? playerRole(player).short : '';
            const sp = this.setPieces || {};
            let pMarks = '';
            if (player) {
                if (sp.captain === player.id)  pMarks += ' 🅒';
                if (sp.penalty === player.id)  pMarks += ' ⚽';
                if (sp.freekick === player.id) pMarks += ' 🎯';
                if (sp.corner === player.id)   pMarks += ' 🚩';
                if (sp.playmaker === player.id) pMarks += ' 🧠';
            }
            // Alert if player is injured or suspended in the starting 11
            let alertClass = (player && (player.injuryDays > 0 || player.suspensionDays > 0)) ? 'bg-red-600 animate-pulse' : 'bg-ui-900/80';
            
            layer.innerHTML += `
                <div class="absolute z-20 flex flex-col items-center justify-center transition-all duration-700 -translate-x-1/2 -translate-y-1/2" style="left: ${pos[0]*2}%; top: ${pos[1]}%;">
                    <div class="text-brand-500 w-5 h-5 sm:w-7 sm:h-7">${JERSEY_SVG}</div>
                    <span class="text-[8px] sm:text-[9px] font-bold text-white ${alertClass} px-1 sm:px-1.5 rounded -mt-1 shadow border border-white/10 truncate max-w-[50px] sm:max-w-[60px] text-center">${pName}</span>
                    <span class="text-[7px] sm:text-[8px] font-bold text-brand-400/90 leading-none mt-0.5">${pRole}${pMarks}</span>
                </div>
            `;
        });
    }

    renderTacticsLists() {
        this.renderTeamInstructions();
        this.renderSetPiecePanel();
        const listTit = document.getElementById('tactics-titulaires');
        const listRem = document.getElementById('tactics-remplacants');
        const listRes = document.getElementById('tactics-reservistes'); // Nouveau conteneur
        
        listTit.innerHTML = ''; 
        listRem.innerHTML = '';
        if (listRes) listRes.innerHTML = ''; // Sécurité

        const renderPlayerRow = (p) => {
            const energyColor = p.energy > 80 ? 'text-emerald-400' : p.energy > 60 ? 'text-yellow-400' : 'text-red-400';
            const posBg = p.position === 'GB' ? 'bg-amber-500/20 text-amber-400' : p.position === 'DEF' ? 'bg-blue-500/20 text-blue-400' : p.position === 'MIL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400';
            const isSel = this.swapSelectedId === p.id;
            const selClass = isSel ? 'player-selected ring-1 ring-brand-500 bg-ui-700/80' : ''; // Amélioration visuelle du clic

            // Rôle précis + brassards / ballons de spécialiste
            const role = playerRole(p);
            const sp = this.setPieces || {};
            let spIcons = '';
            if (sp.captain === p.id)  spIcons += `<span title="Capitaine" class="text-[9px] ml-1">🅒</span>`;
            if (sp.penalty === p.id)  spIcons += `<span title="Tireur de penalty" class="text-[9px] ml-1">⚽</span>`;
            if (sp.freekick === p.id) spIcons += `<span title="Tireur de coup franc" class="text-[9px] ml-1">🎯</span>`;
            if (sp.corner === p.id)   spIcons += `<span title="Tireur de corner" class="text-[9px] ml-1">🚩</span>`;
            if (sp.playmaker === p.id) spIcons += `<span title="Meneur de jeu" class="text-[9px] ml-1">🧠</span>`;

            // Icônes de statut
            let statusIcon = '';
            if (p.injuryDays > 0) statusIcon = `<span class="bg-red-600 text-white text-[8px] px-1 rounded ml-1" title="Blessé pour ${p.injuryDays} matchs">🏥</span>`;
            else if (p.suspensionDays > 0) statusIcon = `<span class="bg-red-600 text-white text-[8px] px-1 rounded ml-1" title="Suspendu pour ${p.suspensionDays} matchs">🟥</span>`;

            return `
                <div onclick="app.selectForSwap('${p.id}')" class="player-list-item flex items-center justify-between p-2 rounded-lg border border-white/5 bg-ui-800/50 cursor-pointer ${selClass}">
                    <div class="flex items-center gap-3 w-1/2">
                        <div class="w-6 h-6 bg-ui-900 rounded border border-white/5 overflow-hidden shrink-0">${playerFaceSVG(p)}</div>
                        <div class="truncate flex items-center">
                            <div class="truncate">
                                <h5 class="text-xs font-bold text-white truncate">${p.name}</h5>
                                <span title="${role.name}" class="text-[9px] font-bold px-1 py-0.5 rounded uppercase mt-0.5 inline-block ${posBg}">${role.short}</span>${spIcons}
                            </div>
                            ${statusIcon}
                        </div>
                    </div>
                    <div class="flex items-center gap-4 text-right">
                        <div class="flex flex-col items-end">
                            <span class="text-[8px] uppercase font-bold text-slate-500">OVR</span>
                            <span class="font-teko text-lg text-white leading-none">${p.ovr}</span>
                        </div>
                        <div class="flex flex-col items-end w-8">
                            <span class="text-[8px] uppercase font-bold text-slate-500">Forme</span>
                            <span class="text-xs font-bold ${energyColor}">${Math.round(p.energy)}%</span>
                        </div>
                    </div>
                </div>
            `;
        };

        // 1. Titulaires (0 à 10)
        this.userSquad.slice(0, 11).forEach(p => listTit.innerHTML += renderPlayerRow(p));
        
        // 2. Remplaçants (11 à 17) - Limité à 7 joueurs
        this.userSquad.slice(11, 18).forEach(p => listRem.innerHTML += renderPlayerRow(p));
        
        // 3. Réservistes (18 et plus) - Reste de l'effectif
        if (listRes) {
            this.userSquad.slice(18).forEach(p => listRes.innerHTML += renderPlayerRow(p));
        }

        if(this.swapSelectedId) {
            document.getElementById('swap-hint-1').innerText = "Sélectionnez avec qui échanger";
            document.getElementById('swap-hint-2').innerText = "Sélectionnez avec qui échanger";
            if (document.getElementById('swap-hint-3')) document.getElementById('swap-hint-3').innerText = "Sélectionnez avec qui échanger";
        } else {
            document.getElementById('swap-hint-1').innerText = "11 Joueurs";
            document.getElementById('swap-hint-2').innerText = "Banc (7)";
            if (document.getElementById('swap-hint-3')) document.getElementById('swap-hint-3').innerText = "Tribunes";
        }
    }

    generateMarketPool() {
    this.marketPool = [];
    const otherClubs = this.globalData[this.userLeagueId].standings.filter(c => !c.isUser);
    
    // 6 joueurs réels pris dans les squads des autres clubs de VOTRE championnat
    const shuffled = otherClubs.sort(() => Math.random() - 0.5);
    shuffled.slice(0, 6).forEach(club => {
        const bench = club.squad.slice(11); // Remplaçants disponibles
        if(bench.length > 0) {
            const p = bench[Math.floor(Math.random() * bench.length)];
            p.fromClub = club.name;
            this.marketPool.push(p);
        }
    });

    // FIX #53 : 6 joueurs supplémentaires pris au hasard dans les AUTRES championnats africains
    const foreignClubs = Object.entries(this.globalData)
        .filter(([lid]) => lid !== this.userLeagueId)
        .flatMap(([, league]) => league.standings)
        .sort(() => Math.random() - 0.5);
    foreignClubs.slice(0, 6).forEach(club => {
        const bench = club.squad.slice(11);
        if (bench.length > 0) {
            const p = bench[Math.floor(Math.random() * bench.length)];
            p.fromClub = club.name;
            this.marketPool.push(p);
        }
    });
   }
    // =====================================================================
    // 📨 DEMANDES DE PRÊT VENANT DES CLUBS IA (LOT 11)
    // =====================================================================
    // Le pendant des offres d'achat : un club repère un de vos jeunes qui ne
    // joue pas et vous écrit pour le prendre en prêt. On ne vous demande
    // jamais un titulaire — un club sait qu'il se ferait envoyer promener.

    generateIncomingLoanRequests() {
        if (!this.messages) this.messages = [];
        this.loansOut = Array.isArray(this.loansOut) ? this.loansOut : [];

        // Les demandes périmées disparaissent d'elles-mêmes
        this.messages = this.messages.filter(m =>
            m.type !== 'loanRequest' || (m.expiresOn || 0) > (this.matchday || 0));

        if (this.messages.some(m => m.type === 'loanRequest')) return; // une à la fois
        if (Math.random() > 0.22) return;
        if (this.loansOut.length >= 6) return;

        // Cibles : les jeunes qui ne sont pas dans le onze, plus toute l'académie
        const starters = [...this.userSquad].sort((a, b) => b.ovr - a.ovr).slice(0, 11).map(p => p.id);
        const onLoanIds = this.loansOut.map(l => l.playerId);
        const fromSquad = this.userSquad
            .filter(p => (p.age || 30) <= 22 && !starters.includes(p.id) && !p.loanedIn && !onLoanIds.includes(p.id))
            .map(p => ({ player: p, source: 'squad' }));
        const fromAcademy = (this.academy || [])
            .filter(p => !onLoanIds.includes(p.id) && p.ovr >= 50)
            .map(p => ({ player: p, source: 'academy' }));

        const pool = fromSquad.concat(fromAcademy);
        if (pool.length === 0) return;
        if (this.userSquad.length <= 15 && fromAcademy.length === 0) return; // effectif déjà trop court

        const { player, source } = pool[Math.floor(Math.random() * pool.length)];
        const offers = this.getLoanOffers(player);
        if (offers.length === 0) return;
        // Le club qui écrit est celui qui le ferait le plus jouer : c'est son argument
        const offer = offers.sort((a, b) => b.playChance - a.playChance)[0];

        this.messages.unshift({
            id: 'lr_' + Math.random().toString(36).substr(2, 9),
            type: 'loanRequest',
            playerId: player.id,
            playerName: player.name,
            source,
            offer,
            expiresOn: (this.matchday || 0) + 5,
            read: false,
            text: `🤝 ${offer.clubName} souhaite prendre ${player.name} (${player.age} ans, ${player.position}, OVR ${player.ovr}) en prêt pour la saison. `
                + `Temps de jeu estimé : ${offer.playChance}%. Ils prendraient ${Math.round(offer.wageShare * 100)}% de son salaire `
                + `et verseraient ${formatMoney(offer.fee)} d'indemnité.`
        });
    }

    acceptLoanRequest(msgId) {
        const msg = this.messages.find(m => m.id === msgId);
        if (!msg || msg.type !== 'loanRequest') return;
        const found = this.findLoanablePlayer(msg.playerId);
        if (!found) {
            this.messages = this.messages.filter(m => m.id !== msgId);
            this.renderInbox();
            return this.showNotification("Ce joueur n'est plus dans vos rangs.", "error");
        }
        // On réutilise exactement le circuit du prêt manuel : mêmes contrôles,
        // même comptabilité, même suivi dans le panneau du mercato.
        this._loanOffersCache = [msg.offer];
        const before = (this.loansOut || []).length;
        this.confirmLoan(msg.playerId, msg.offer.clubName);
        if ((this.loansOut || []).length > before) {
            this.messages = this.messages.filter(m => m.id !== msgId);
            this.renderInbox();
            this.renderMarket(); // le panneau doit perdre la demande acceptée
            this.saveGame();
        }
    }

    rejectLoanRequest(msgId) {
        const msg = this.messages.find(m => m.id === msgId);
        if (!msg) return;
        this.messages = this.messages.filter(m => m.id !== msgId);
        this.showNotification(`❌ Demande de prêt refusée pour ${msg.playerName}.`);
        this.renderInbox();
        this.renderMarket();
        this.saveGame();
    }

   generateIncomingOffers() {
    if(!this.messages) this.messages = [];
    const mySquad = this.userSquad;
    const otherClubs = Object.values(this.globalData)
        .flatMap(l => l.standings)
        .filter(c => !c.isUser);
    // FIX #92 : on retient l'appartenance de chaque club à sa ligue (nécessaire au
    // coefficient économique du championnat dans getAIClubAnnualBudget)
    this.buildClubLeagueIndex();

    // 1 à 2 offres par journée max
    const numOffers = Math.random() < 0.4 ? 2 : Math.random() < 0.7 ? 1 : 0;
    
    for(let i = 0; i < numOffers; i++) {
        // Cible un joueur de ton squad (pas le gardien titulaire, pas les OVR trop bas)
        const targets = mySquad.slice(1).filter(p => p.ovr >= 70);
        if (targets.length === 0) continue;
        const target = targets[Math.floor(Math.random() * targets.length)];

        // FIX #92 : budget IA basé sur un vrai modèle économique (cf. getAIClubBudget)
        // au lieu de la formule inventée force² × 500.
        const eligibleBuyers = otherClubs.filter(c => {
            const estimatedBudget = this.getAIClubBudget(c);
            const canAfford = estimatedBudget >= target.price * 0.8;
            // Le club cherche à se renforcer : sa force doit être inférieure à l'OVR de la cible
            const needsPlayer = (c.force || 65) < target.ovr + 5;
            return canAfford && needsPlayer;
        });
        if (eligibleBuyers.length === 0) continue;

        const buyer = eligibleBuyers[Math.floor(Math.random() * eligibleBuyers.length)];

        // Offre proportionnelle à la capacité du buyer : entre 85% et 120% de la valeur
        const buyerBudget = this.getAIClubBudget(buyer); // FIX #92 / #101 (solde courant)
const targetPrice = target.price || Generator.getPlayerValue(target.ovr);
const maxOffer = Math.min(targetPrice * 1.2, buyerBudget);
const offerAmount = Math.floor(maxOffer * (0.85 + Math.random() * 0.35));
        
        this.messages.unshift({
            id: Math.random().toString(36).substr(2,9),
            type: 'offer',
            playerId: target.id,
            playerName: target.name,
            buyerName: buyer.name,
            amount: offerAmount,
            read: false,
            text: `${buyer.name} propose ${formatMoney(offerAmount)} pour ${target.name} (${target.position} - OVR ${target.ovr}).`
        });
    }
    }
    // --- NOUVEAU : SIMULATION DU MERCATO IA ---
    simulateAITransfers() {
        if (!this.marketPool || this.marketPool.length === 0) return;

        let transferCount = 0;
        let notableTransfer = null;

        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                // L'utilisateur gère ses propres transferts, l'IA ne touche pas à ton club
                if (team.isUser) return;

                // 15% de chances (par déclenchement) qu'un club IA cherche à se renforcer
                if (Math.random() < 0.15) {
                    
                    // 1. Audit de l'équipe : Trouver le point faible de l'IA
                    // On trie son effectif du moins bon au meilleur
                    let sortedSquad = [...team.squad].sort((a, b) => a.ovr - b.ovr);
                    let weakestLink = sortedSquad[0]; // Le pire joueur de l'effectif

                    // 2. Recherche sur le marché
                    // L'IA cherche un joueur au MÊME POSTE, qui est MEILLEUR (+ de 2 pts d'OVR de diff)
                    let targetIndex = this.marketPool.findIndex(p => p.position === weakestLink.position && p.ovr > weakestLink.ovr + 2);

                    // 3. Le Transfert
                    if (targetIndex !== -1) {
                        let newPlayer = this.marketPool[targetIndex];

                        // FIX #101 : l'IA doit pouvoir se payer le joueur — avant, elle recrutait
                        // sans jamais regarder ses finances, et son budget était de toute façon
                        // recalculé à neuf à chaque appel.
                        const fee = newPlayer.price || Generator.getPlayerValue(newPlayer.ovr, newPlayer.age, newPlayer.pot);
                        if (this.getAIClubBudget(team) < fee) return; // pas les moyens, on passe

                        // FIX #4b : retirer le joueur de son club d'origine AVANT de l'ajouter
                        // ailleurs, sinon il se retrouve dupliqué dans deux effectifs
                        const originClubName = newPlayer.fromClub;
                        if (originClubName) {
                            const originClub = league.standings.find(c => c.name === originClubName)
                                || Object.values(this.globalData).flatMap(l => l.standings).find(c => c.name === originClubName);
                            if (originClub) {
                                const oIdx = originClub.squad.findIndex(p => p.id === newPlayer.id);
                                if (oIdx !== -1) originClub.squad.splice(oIdx, 1);
                            }
                        }

                        // Le club IA recrute le joueur
                        newPlayer.isScouted = true;
                        newPlayer.fromClub = team.name; // Historique
                        team.squad.push(newPlayer);

                        // FIX #101 : l'acheteur paie, le vendeur encaisse
                        this.adjustAIClubBudget(team, -fee);
                        if (originClubName) {
                            const seller = Object.values(this.globalData).flatMap(l => l.standings)
                                .find(c => c.name === originClubName && !c.isUser);
                            if (seller) this.adjustAIClubBudget(seller, fee);
                        }
                        
                        // Retirer le joueur du marché pour qu'il ne soit plus dispo pour toi !
                        this.marketPool.splice(targetIndex, 1);
                        transferCount++;
                        
                        // On garde en mémoire le plus gros transfert pour l'annoncer au joueur
                        if (!notableTransfer || newPlayer.ovr > notableTransfer.ovr) {
                            notableTransfer = { player: newPlayer, club: team.name };
                        }
                        
                        // Gestion de la taille de l'effectif : le joueur coupé part en agent libre
                        // FIX #82 (cohérence) : splice en place plutôt que réaffectation
                        if (team.squad.length > 25) {
                            const wIdx = team.squad.findIndex(p => p.id === weakestLink.id);
                            if (wIdx !== -1) team.squad.splice(wIdx, 1);
                            if (!this.freeAgentPool) this.freeAgentPool = [];
                            weakestLink.contract = null;
                            weakestLink.fromClub = team.name;
                            this.freeAgentPool.push(weakestLink);
                        }
                    }
                }
            });
        });

        // 4. Feedback pour le joueur (Immersion !)
        if (transferCount > 0 && notableTransfer) {
            // Un petit pop-up ou une notification pour te faire stresser un peu
            setTimeout(() => {
                if(this.showNotification) {
                    this.showNotification(`📰 Mercato IA : ${notableTransfer.club} vient de recruter ${notableTransfer.player.name} (OVR ${notableTransfer.player.ovr}) !`);
                }
            }, 2000);
        }
    }

    // FIX #110 : jusqu'ici les clubs IA ne pouvaient recruter QUE dans `marketPool` (le vivier
    // commun) et n'initiaient jamais de vente. Ils ne se parlaient pas entre eux : un club en
    // difficulté financière ne pouvait pas se refaire une trésorerie, et un joueur remarquable
    // coincé en 15e position d'un effectif ne bougeait jamais.
    // Le marché IA <-> IA ci-dessous ajoute les deux : achats ciblés d'un club à un autre, et
    // ventes forcées quand le vendeur est à sec (il accepte alors une décote).
    simulateAIToAITransfers() {
        const allClubs = Object.values(this.globalData)
            .flatMap(l => l.standings)
            .filter(c => !c.isUser && Array.isArray(c.squad) && c.squad.length > 0);
        if (allClubs.length < 2) return;

        const POSITIONS = ['GB', 'DEF', 'MIL', 'ATT'];
        const MIN_SELLER_SQUAD = 17; // le vendeur ne descend jamais sous ce seuil
        const MAX_BUYER_SQUAD = 25;
        let done = 0;
        let notable = null;

        // 3 à 5 négociations par fenêtre : assez pour que le marché vive, assez peu pour que
        // la hiérarchie ne soit pas rebattue en une journée.
        const attempts = 3 + Math.floor(Math.random() * 3);

        for (let a = 0; a < attempts; a++) {
            const buyer = allClubs[Math.floor(Math.random() * allClubs.length)];
            if (buyer.squad.length >= MAX_BUYER_SQUAD) continue;

            const buyerBudget = this.getAIClubBudget(buyer);
            if (buyerBudget < 150000) continue; // trop juste pour négocier quoi que ce soit

            // 1. Où le club a-t-il besoin de se renforcer ? On regarde son poste le plus faible
            //    parmi les titulaires.
            const starters = buyer.squad.slice(0, 11);
            const avgAt = (pos) => {
                const list = starters.filter(p => p.position === pos);
                return list.length ? list.reduce((s, p) => s + p.ovr, 0) / list.length : 0;
            };
            const weakPos = POSITIONS
                .filter(pos => avgAt(pos) > 0)
                .sort((x, y) => avgAt(x) - avgAt(y))[0];
            if (!weakPos) continue;
            const bar = avgAt(weakPos);

            // 2. Qui, ailleurs, a mieux — et peut s'en séparer ?
            //    Le prix demandé est calculé DÈS la prospection et les cibles hors budget sont
            //    écartées tout de suite : un club fait son marché dans ses moyens, il ne
            //    négocie pas d'abord pour la star inaccessible. (Sans ce filtre en amont, la
            //    quasi-totalité des négociations échouaient au dernier moment et le marché
            //    IA <-> IA ne produisait qu'une poignée de transferts par saison.)
            const candidates = [];
            for (const seller of allClubs) {
                if (seller === buyer || seller.squad.length <= MIN_SELLER_SQUAD) continue;
                const samePos = seller.squad.filter(p => p.position === weakPos);
                if (samePos.length < 2) continue; // il lui faut un remplaçant à ce poste

                // Un club à sec brade : c'est le seul moyen pour lui de renflouer sa
                // trésorerie, ce qu'il ne pouvait pas faire du tout avant.
                const sellerBudget = this.getAIClubBudget(seller);
                const distressed = sellerBudget < this.getAIClubAnnualBudget(seller) * 0.2;

                // On ne prend jamais son meilleur joueur au poste : un club ne brade pas son titulaire
                const sellable = samePos.sort((x, y) => y.ovr - x.ovr).slice(1);
                for (const p of sellable) {
                    if (p.onLoan) continue; // LOT 8 : un joueur prêté ne lui appartient pas
                    if (p.ovr <= bar + 1) continue; // n'améliore pas l'acheteur
                    const value = p.price || Generator.getPlayerValue(p.ovr, p.age, p.pot);
                    const asking = Math.round(value * (distressed ? 0.75 : 1.05 + Math.random() * 0.15));
                    if (asking > buyerBudget) continue; // hors de portée
                    candidates.push({ seller, player: p, value, asking, distressed });
                }
            }
            if (candidates.length === 0) continue;

            // 3. Parmi ce qu'il peut se payer, le club vise le meilleur renfort
            candidates.sort((x, y) => y.player.ovr - x.player.ovr);
            const shortlist = candidates.slice(0, 5);
            const deal = shortlist[Math.floor(Math.random() * shortlist.length)];
            const { seller, player, value, asking, distressed } = deal;

            // 5. Transaction
            const sIdx = seller.squad.findIndex(p => p.id === player.id);
            if (sIdx === -1) continue;
            seller.squad.splice(sIdx, 1);
            player.fromClub = buyer.name;
            player.contract = { duration: 2 + Math.floor(Math.random() * 2), expiresIn: 76 };
            player.price = value;
            buyer.squad.push(player);

            this.adjustAIClubBudget(buyer, -asking);
            this.adjustAIClubBudget(seller, asking);

            // 6. L'acheteur remonte sa recrue dans la hiérarchie si elle vaut mieux que son
            //    titulaire au poste, sinon elle reste sur le banc.
            this.reorderAISquad(buyer);
            this.reorderAISquad(seller);

            done++;
            if (!notable || player.ovr > notable.player.ovr) notable = { player, buyer, seller, asking, distressed };
        }

        if (done > 0 && notable && notable.player.ovr >= 78) {
            setTimeout(() => this.showNotification(
                `📰 Mercato : ${notable.buyer.name} s'offre ${notable.player.name} (OVR ${notable.player.ovr}) à ${notable.seller.name} pour ${formatMoney(notable.asking)}` +
                (notable.distressed ? ' — vente forcée, le vendeur avait besoin de liquidités.' : '.'),
                'info'), 2500);
        }
    }

    // FIX #110 : après un mouvement, l'effectif d'un club IA doit rester trié (gardien en tête,
    // puis par niveau) — sinon `squad.slice(0, 11)` alignerait la recrue au hasard, ou pire,
    // laisserait le club sans gardien parmi les titulaires.
    reorderAISquad(team) {
        if (!team || !Array.isArray(team.squad)) return;
        const gks = team.squad.filter(p => p.position === 'GB').sort((a, b) => b.ovr - a.ovr);
        const outfield = team.squad.filter(p => p.position !== 'GB').sort((a, b) => b.ovr - a.ovr);
        team.squad.splice(0, team.squad.length, ...gks, ...outfield);
        const st = team.squad.slice(0, 11);
        team.force = Math.round(
            st.reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0)
            / (st.length || 1)
        );
    }

    // FIX #111 : les clubs IA n'avaient pas d'académie. Ils ne se renouvelaient que par le
    // marché et, depuis le lot 7, par les agents libres — aucun jeune ne sortait jamais de
    // leur centre de formation, alors que le vôtre en produit chaque saison. À long terme,
    // le continent vieillissait sans relève.
    // La qualité d'une promotion dépend de la stature du club et du poids de son championnat :
    // Al Ahly ou les Sundowns sortent de bien meilleurs jeunes qu'un club de milieu de tableau
    // camerounais, ce qui est conforme à la réalité des centres de formation africains.
    promoteAIAcademyGraduates() {
        const REGION_BY_LEAGUE = {};
        LEAGUES.forEach(l => { REGION_BY_LEAGUE[l.id] = l.region; });
        let best = null;
        let total = 0;

        Object.entries(this.globalData).forEach(([lid, league]) => {
            const region = REGION_BY_LEAGUE[lid] || 'francophone';
            const tier = LEAGUE_TIER[lid] ?? 0.8;

            league.standings.forEach(team => {
                if (team.isUser) return;               // vous avez votre propre académie
                if (team.squad.length >= 24) return;   // effectif déjà plein

                // 0 à 2 jeunes par saison, plus souvent dans les grands clubs
                const stature = ((team.force || 65) - 55) / 35;               // ~0 à 1
                const chance = Math.max(0.15, Math.min(0.85, 0.35 + stature * 0.4));
                let count = Math.random() < chance ? 1 : 0;
                if (count === 1 && Math.random() < chance * 0.35) count = 2;
                if (count === 0) return;

                for (let i = 0; i < count; i++) {
                    const pos = ['GB', 'DEF', 'MIL', 'ATT'][Math.floor(Math.random() * 4)];
                    // Niveau de sortie : nettement sous l'équipe première, mais adossé à elle
                    const base = Math.round((team.force || 65) - 22 + tier * 4);
                    const minOvr = Math.max(38, base - 4);
                    const maxOvr = Math.max(minOvr + 1, base + 5);

                    const youth = Generator.randomPlayer(pos, region, minOvr, maxOvr);
                    youth.age = 17 + Math.floor(Math.random() * 3);
                    // Un jeune de centre de formation a une vraie marge de progression
                    youth.pot = Math.min(95, youth.ovr + 12 + Math.floor(Math.random() * (10 + tier * 6)));
                    youth.contract = { duration: 3, expiresIn: 114 };
                    youth.fromClub = team.name;
                    youth.isAcademyGraduate = true;
                    youth.price = Generator.getPlayerValue(youth.ovr, youth.age, youth.pot);
                    youth.wage = Generator.getPlayerWage(youth.price);

                    team.squad.push(youth);
                    total++;
                    if (!best || youth.pot > best.player.pot) best = { player: youth, team };
                }
                this.reorderAISquad(team);
            });
        });

        // On ne signale que les vraies pépites — sinon c'est du bruit chaque saison
        if (best && best.player.pot >= 85) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'info', read: false,
                text: `🌱 Pépite repérée : ${best.player.name} (${best.player.age} ans, ${best.player.position}, OVR ${best.player.ovr} — potentiel ${best.player.pot}) sort du centre de formation de ${best.team.name}.`
            });
        }
        if (total > 0) console.log(`Académies IA : ${total} jeunes promus cette saison.`);
    }

    scoutPlayers() {
        if(this.budget < 500000) {
            this.showNotification("Fonds insuffisants pour envoyer un recruteur.", "error"); // FIX #97
            return;
        }
        this.budget -= 500000;
        
        const randRegion = ['francophone', 'arab', 'anglophone'][Math.floor(Math.random()*3)];
        const pos = ['DEF', 'MIL', 'ATT'][Math.floor(Math.random()*3)];
        this.marketPool.unshift(Generator.randomPlayer(pos, randRegion, 75, 88));
        this.marketPool.unshift(Generator.randomPlayer('MIL', randRegion, 72, 85));
        
        this.updateHeader();
        this.renderMarket();
        this.saveGame(); // FIX #52a
    }

    buyPlayer(id) {
        // Chercher d'abord dans le marché, puis dans les agents libres
        let playerIndex = this.marketPool.findIndex(p => p.id === id);
        let isFreeAgent = false;
        if (playerIndex === -1 && this.freeAgentPool) {
            playerIndex = this.freeAgentPool.findIndex(p => p.id === id);
            isFreeAgent = playerIndex !== -1;
        }
        if (playerIndex === -1) return;
        const player = isFreeAgent ? this.freeAgentPool[playerIndex] : this.marketPool[playerIndex];

        // Vérification réputation
        if (player.ovr >= 85 && this.reputation < 50) {
            this.showNotification(`❌ ${player.name} refuse ! Réputation insuffisante (${this.reputation}/100 — besoin de 50).`, 'error');
            return;
        }
        if (player.ovr >= 78 && this.reputation < 25) {
            this.showNotification(`❌ ${player.name} refuse ! Réputation trop faible (${this.reputation}/100).`, 'error');
            return;
        }

        if (!isFreeAgent && this.budget < player.price) {
            this.showNotification("Fonds insuffisants pour ce transfert.", "error"); // FIX #97
            return;
        }

        // FIX #54 : plafond d'effectif (cohérent avec promoteFromAcademy)
        if (this.userSquad.length >= 30) {
            this.showNotification("Votre effectif est plein (30 joueurs max) !", "error");
            return;
        }

        if (!isFreeAgent) {
            this.budget -= player.price;
            this.marketPool.splice(playerIndex, 1);

            // FIX #4 : retirer le joueur du club vendeur pour éviter la duplication
            // (le joueur était référencé dans marketPool ET dans club.squad — même objet)
            if (player.fromClub) {
                for (const league of Object.values(this.globalData)) {
                    const originClub = league.standings.find(c => c.name === player.fromClub);
                    if (originClub) {
                        const idx = originClub.squad.findIndex(p => p.id === player.id);
                        if (idx !== -1) originClub.squad.splice(idx, 1);
                        break;
                    }
                }
            }
        } else {
            this.freeAgentPool.splice(playerIndex, 1);
        }

        if (!player.contract) player.contract = { duration: 2, expiresIn: 76 };
        this.userSquad.push(player);
        this.updateUserClubForce();
        this.updateHeader();
        this.renderMarket();
        this.renderSquad();
        this.renderTacticsView();
        this.saveGame();
    }

    healPlayer(id) {
        const cost = 50000;
        if (this.budget < cost) {
            this.showNotification("Fonds insuffisants pour payer le kiné (50 K€ requis).", "error"); // FIX #97
            return;
        }
        
        let player = this.userSquad.find(p => p.id === id);
        if (player && (player.energy < 100 || player.injuryDays > 0)) {
            this.budget -= cost;
            player.energy = 100;
            player.injuryDays = 0; // Le kiné guérit la blessure !
            
            this.updateUserClubForce();
            this.updateHeader();
            this.refreshAllViews();
            this.saveGame(); // FIX #52b
        }
    }

    renderMarket() {
        // Injecter la barre de filtres si pas encore présente
        const filterBar = document.getElementById('market-filter-bar');
        if (filterBar) {
            filterBar.innerHTML = `
                <div class="flex flex-wrap gap-2 mb-4 p-3 panel-glass rounded-xl border border-white/5">
                    <select id="filter-pos" onchange="app.applyMarketFilters()" class="bg-ui-900 text-white text-xs px-3 py-2 rounded-lg border border-white/10 outline-none focus:border-brand-500">
                        <option value="ALL">Tous postes</option>
                        <option value="GB">Gardien</option>
                        <option value="DEF">Défenseur</option>
                        <option value="MIL">Milieu</option>
                        <option value="ATT">Attaquant</option>
                    </select>
                    <select id="filter-price" onchange="app.applyMarketFilters()" class="bg-ui-900 text-white text-xs px-3 py-2 rounded-lg border border-white/10 outline-none focus:border-brand-500">
                        <option value="999999999">Tous prix</option>
                        <option value="1000000">Max 1M€</option>
                        <option value="5000000">Max 5M€</option>
                        <option value="12000000">Max 12M€</option>
                    </select>
                    <select id="filter-ovr" onchange="app.applyMarketFilters()" class="bg-ui-900 text-white text-xs px-3 py-2 rounded-lg border border-white/10 outline-none focus:border-brand-500">
                        <option value="0">OVR min: tous</option>
                        <option value="70">OVR 70+</option>
                        <option value="75">OVR 75+</option>
                        <option value="80">OVR 80+</option>
                    </select>
                    <button onclick="app.generateFreeAgents(); app.applyMarketFilters();" class="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs px-3 py-2 rounded-lg font-bold transition-colors">
                        🆓 Agents libres
                    </button>
                </div>`;
        }
        // FIX #7 : on ne (re)génère les agents libres "aléatoires" que s'il n'y en a pas encore.
        // Avant, generateFreeAgents() était appelé à CHAQUE rendu du marché (donc après chaque
        // match), ce qui effaçait les joueurs réellement libérés (fin de contrat, dégraissage IA).
        if (!this.freeAgentPool || this.freeAgentPool.length === 0) {
            this.generateFreeAgents();
        }
        this.renderLoansPanel(); // LOT 8
        this.renderMarketFiltered();
    }
scoutPlayerAction(id) {
        const hasScout = this.userStaff && this.userStaff.includes('scout'); // FIX #37d
        const cost = hasScout ? 5000 : 10000;
        if (this.budget < cost) {
            this.showNotification(`Fonds insuffisants pour superviser ce joueur (${formatMoney(cost)}).`, "error"); // FIX #97
            return;
        }
        // FIX #51 : chercher aussi dans les agents libres (avant, ça ne cherchait que le marché
        // et facturait quand même 10K€ pour rien si le joueur cliqué était un agent libre)
        const player = this.marketPool.find(p => p.id === id) || (this.freeAgentPool || []).find(p => p.id === id);
        if (!player) return; // FIX #52c : pas de débit si aucun joueur trouvé
        this.budget -= cost;
        player.isScouted = true;
        this.updateHeader();
        this.renderMarket();
        this.saveGame();
    }
    acceptOffer(offerId) {
        const offer = this.messages.find(m => m.id === offerId);
        if(!offer) return;
        
        // 1. Sécurité : on empêche la vente si l'effectif tombe en dessous de 14 joueurs
        if (this.userSquad.length <= 14) {
            this.showNotification("Impossible de vendre : effectif minimum de 14 joueurs.", "error");
            return;
        }
        
        const playerIdx = this.userSquad.findIndex(p => p.id === offer.playerId);
        if(playerIdx === -1) return;
        if (this.userSquad[playerIdx].loanedIn) { // LOT 10
            return this.showNotification("Ce joueur est emprunté : vous ne pouvez pas le vendre.", "error");
        }

        // 2. On effectue la vente (ajout de l'argent et suppression du joueur)
        this.budget += offer.amount;
        const [sold] = this.userSquad.splice(playerIdx, 1);

        // FIX #102 : le joueur vendu était retiré de votre effectif... et n'arrivait JAMAIS
        // chez l'acheteur. Il disparaissait purement et simplement du jeu : plus jamais
        // croisé en championnat, jamais revendu, jamais dans le classement des buteurs.
        // Il rejoint désormais l'effectif du club acheteur, qui paie le transfert.
        const buyer = Object.values(this.globalData).flatMap(l => l.standings)
            .find(c => c.name === offer.buyerName && !c.isUser);
        if (buyer && sold) {
            sold.fromClub = buyer.name;
            sold.contract = sold.contract || { duration: 3, expiresIn: 114 };
            buyer.squad.push(sold);
            this.adjustAIClubBudget(buyer, -offer.amount); // FIX #101
        }

        this.messages = this.messages.filter(m => m.id !== offerId); // On retire le message
        
        // 3. On actualise l'interface
        this.updateHeader();
        this.refreshAllViews();
        this.renderInbox(); // On rafraîchit la boîte de réception visuellement pour faire disparaître le message
        this.updateUserClubForce(); // On met à jour la note globale de votre club
        
        if(this.showNotification) this.showNotification(`✅ ${offer.playerName} vendu pour ${formatMoney(offer.amount)} !`);
        this.saveGame();
    }

    rejectOffer(offerId) {
        this.messages = this.messages.filter(m => m.id !== offerId);
        
        this.renderMarket();
        this.renderInbox(); // On rafraîchit la boîte de réception visuellement pour faire disparaître le message
        
        if(this.showNotification) this.showNotification(`❌ Offre refusée.`);
        this.saveGame();
    }
sellPlayer(playerId) {
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;
    if (player.loanedIn) { // LOT 10
        return this.showNotification(`${player.name} ne vous appartient pas : il est prêté par ${player.loanedIn.ownerClub}.`, "error");
    }
    if (this.userSquad.length <= 14) {
        this.showNotification("Impossible : effectif minimum de 14 joueurs.", "error");
        return;
    }
    // FIX #35 : décote de 12% à la vente — un club acheteur négocie, il ne paie jamais le prix catalogue exact
    const catalogPrice = player.price || Generator.getPlayerValue(player.ovr, player.age, player.pot);
    const price = Math.round(catalogPrice * 0.88 / 10000) * 10000;
    // FIX #97 : confirm() natif remplacé par la modale maison (asynchrone -> callback)
    this.showConfirm(
        `Vendre ${player.name} ?\n\nOffre reçue : ${formatMoney(price)}\nValeur estimée : ${formatMoney(catalogPrice)} (négociation à la baisse)`,
        () => {
            // Re-vérification après coup : l'effectif a pu changer pendant que la modale était ouverte
            const idx = this.userSquad.findIndex(p => p.id === playerId);
            if (idx === -1) return;
            if (this.userSquad.length <= 14) {
                this.showNotification("Impossible : effectif minimum de 14 joueurs.", "error");
                return;
            }

            this.budget += price;
            this.userSquad.splice(idx, 1); // FIX #82 : splice en place

            // Synchroniser globalData (déjà la même référence grâce au splice, mais on s'assure)
            const league = this.globalData[this.userLeagueId];
            const myClub = league.standings.find(c => c.name === this.userClubName);
            myClub.squad = this.userSquad;

            document.getElementById('header-budget').innerText = formatMoney(this.budget);
            this.showNotification(`💰 ${player.name} vendu pour ${formatMoney(price)} !`);
            this.renderSquad();
            this.saveGame();
        },
        { okLabel: 'Vendre' }
    );
}

    startSimulationSequence() {
    // Nettoyer les fixtures corrompues (home ou away null)
    this.fixtures = this.fixtures.filter(f => f.home && f.away);

    // 1. Vérifier si la saison est complètement terminée
    // FIX #3 : on inclut toujours les matchs CAF (même si le club n'y participe pas)
    // pour que la finale (journée 48) soit bien jouée et la compétition se termine.
    const relevantFixtures = this.fixtures.filter(f =>
        f.home?.isUser || f.away?.isUser ||
        (f.type === 'LEAGUE' && f.leagueId === this.userLeagueId) ||
        (f.type && f.type.startsWith('CAF'))
    );
    const maxMatchday = relevantFixtures.length > 0
        ? Math.max(...relevantFixtures.map(f => f.matchday))
        : Math.max(...this.fixtures.map(f => f.matchday));
    if (this.matchday > maxMatchday) {
        this.showNotification("La saison est terminée !");
        return;
    }

    // 2. Trouver les matchs de la journée
    let userMatchInfo = this.fixtures.find(f => (f.home?.isUser || f.away?.isUser) && !f.played && f.matchday === this.matchday);
    let otherMatches = this.fixtures.filter(f => !f.played && f.matchday === this.matchday && f !== userMatchInfo);

    // 3. Pas de match utilisateur, mais des matchs IA → journée CAF ou autre
    if (!userMatchInfo && otherMatches.length > 0) {
        this.simulateAIBypassMatchday(otherMatches);
        return;
    }

    // 4. Aucun match du tout à cette journée → trou dans le calendrier, on avance
    if (!userMatchInfo && otherMatches.length === 0) {
        this.matchday++;
        this.updateHeader();
        this.saveGame();
        this.showNotification("📅 Journée sans match, on avance.");
        return;
    }

    // 5. Lancement normal
    if (userMatchInfo) {
        const isCAFMatch = !!(userMatchInfo.type && userMatchInfo.type.startsWith('CAF')); // FIX #61a
        if (isCAFMatch) {
            const commentaryDiv = document.getElementById('live-commentary');
            if (commentaryDiv) {
                commentaryDiv.innerHTML = '<div class="text-yellow-500 font-bold mb-2">🏆 SOIRÉE AFRICAINE</div>';
            }
        }
        this.runLiveMatch(userMatchInfo.home, userMatchInfo.away, otherMatches, isCAFMatch, userMatchInfo); // FIX #98
    }
}
simulateAIBypassMatchday(otherMatches) {
        otherMatches.forEach(match => {
            if (!match.home || !match.away) { match.played = true; return; }

            let hG = Math.floor(Math.random() * 4);
            let aG = Math.floor(Math.random() * 4);

            // --- CORRECTION INTÉGRÉE : GESTION DE TOUTES LES PHASES FINALES ---
            if (match.type === 'LEAGUE') {
                this.processMatchStats(match.home, match.away, hG, aG);
            } else if (match.type === 'CAF_GROUP') {
                if (typeof this.processCAFGroupStats === 'function') {
                    this.processCAFGroupStats(match.home, match.away, hG, aG, match.groupId);
                }
            } else if (match.type === 'CAF_QUARTER') {
                this.processCAFKnockoutStats(match.home, match.away, hG, aG, 'CAF_QUARTER', match.quarterIndex);
            } else if (match.type === 'CAF_SEMI') {
                this.processCAFKnockoutStats(match.home, match.away, hG, aG, 'CAF_SEMI', match.semiIndex);
            } else if (match.type === 'CAF_FINAL') {
                this.processCAFKnockoutStats(match.home, match.away, hG, aG, 'CAF_FINAL', 0);
            }
            
            match.played = true;
        });

        // FIX #10 : recalcul de la force + tri des classements, comme après un match live.
        // Sans ça, les journées "bypass" (CAF en arrière-plan) laissaient le classement et
        // les forces des clubs périmés jusqu'au prochain match joué par l'utilisateur.
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                team.force = Math.round(team.squad.slice(0, 11).reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0) / (team.squad.slice(0,11).length || 1));
            });
            league.standings.sort((a, b) => (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga)) || (b.gf - a.gf));
        });
        this.refreshCAFForces(); // FIX #91

        this.matchday++;
        this.updateHeader();
        this.refreshAllViews();

        // Message contextuel selon le type de journée sautée
        const hadCAFMatches = otherMatches.some(f => f.type && f.type.startsWith('CAF'));
        if (hadCAFMatches) {
            const isQualified = this.cafData && this.cafData.userGroup !== -1;
            if (!isQualified) {
                this.showNotification("🌍 Journée CAF — Votre club n'est pas qualifié.", "warning");
                this.messages.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'info', read: false,
                    text: `🌍 Journée de Ligue des Champions CAF en cours. Votre club n'est pas qualifié cette saison — terminez dans le top 2 de votre championnat pour y participer !`
                });
            } else {
                this.showNotification("📅 Matchs CAF simulés automatiquement.");
            }

            // --- AUTO-TRANSITION CAF (bypass) ---
            if (this.cafData) {
                const groupLeft   = this.fixtures.filter(f => f.type === 'CAF_GROUP'   && !f.played).length;
                const quarterLeft = this.fixtures.filter(f => f.type === 'CAF_QUARTER' && !f.played).length;
                const semiLeft    = this.fixtures.filter(f => f.type === 'CAF_SEMI'    && !f.played).length;
                const finalLeft   = this.fixtures.filter(f => f.type === 'CAF_FINAL'   && !f.played).length;

                if (this.cafData.phase === 'groupes' && groupLeft === 0)        this.simulateCAFGroupMatches();
                else if (this.cafData.phase === 'quarts' && quarterLeft === 0)  this.simulateCAFSemiFinals();
                else if (this.cafData.phase === 'semis'  && semiLeft === 0)     this.simulateCAFFinal();
                else if (this.cafData.phase === 'finale' && finalLeft === 0)    this.simulateCAFWinner();
            }
        } else {
            this.showNotification("📅 Journée simulée automatiquement.");
        }

        // Vérifier fin de saison
        // FIX #3 : idem (voir startSimulationSequence)
        const relevantFixtures = this.fixtures.filter(f =>
            f.home?.isUser || f.away?.isUser ||
            (f.type === 'LEAGUE' && f.leagueId === this.userLeagueId) ||
            (f.type && f.type.startsWith('CAF'))
        );
        const maxMatchday = relevantFixtures.length > 0
            ? Math.max(...relevantFixtures.map(f => f.matchday))
            : Math.max(...this.fixtures.map(f => f.matchday));

        if (this.matchday > maxMatchday) {
            let finalRank = this.globalData[this.userLeagueId].standings.findIndex(c => c.isUser) + 1;
            let prizeMoney = Math.max(300000, 4000000 - ((finalRank - 1) * 200000)); // FIX #40 : prime de championnat revue à la baisse (était jusqu'à 15M€, dépassait presque la prime CAF de 5M€)
            this.budget += prizeMoney;
            // LOT 13 : trophées individuels + primes des sponsors, calculés
            // AVANT toute remise à zéro des statistiques.
            try {
                this.seasonAwards = this.applySeasonAwards(this.computeSeasonAwards());
            } catch (e) { console.error('Trophées : calcul impossible', e); this.seasonAwards = null; }
            this.updateHeader();
            setTimeout(() => app.showEndOfSeasonModal(finalRank, prizeMoney), 500);
        }

        this.saveGame();
    }

    runLiveMatch(home, away, otherMatches, isCAF = false, fixture = null) {
        document.getElementById('main-header').classList.add('hidden');
        document.getElementById('mobile-nav').classList.add('hidden');
        this.switchView('match');

        document.getElementById('live-home-name').innerHTML = `${home.name} <span class="text-[10px] opacity-75 font-normal">(${home.force})</span>`;
        document.getElementById('live-home-logo').innerText = home.name.substring(0,3).toUpperCase();
        document.getElementById('live-away-name').innerHTML = `${away.name} <span class="text-[10px] opacity-75 font-normal">(${away.force})</span>`;
        document.getElementById('live-away-logo').innerText = away.name.substring(0,3).toUpperCase();
        
        document.getElementById('live-score').innerText = '0 - 0';
        document.getElementById('live-commentary').innerHTML = '';
        document.getElementById('btn-end-match').classList.add('hidden');
        document.getElementById('match-loading-msg').classList.remove('hidden');
        
        MATCHSIM.stop();          // LOT 15 : nouvelle rencontre = simulation neuve
        this._matchOver = false;
        this.initPitchTokens();
        
        // Initialisation de la mémoire du match avec les joueurs disponibles sur le terrain
        this.liveMatch = {
            home: home,
            away: away,
            otherMatches: otherMatches,
            isCAF: isCAF, // FIX #61c
            fixture: fixture, // FIX #98 : nécessaire pour savoir si le match peut aller en prolongation
            phase: 'regulation', // FIX #98 : 'regulation' | 'extratime'
            minute: 0,
            homeScore: 0,
            awayScore: 0,
            // On copie les 11 premiers pour les titulaires
            homeStarters: [...home.squad.slice(0, 11)],
            awayStarters: [...away.squad.slice(0, 11)],
            // Snapshot des stats avant le match (titulaires + remplaçants)
            preMatchStats: Object.fromEntries([...home.squad.slice(0, 18), ...away.squad.slice(0, 18)].map(p => [p.name, { goals: p.goals || 0, assists: p.assists || 0 }])),
            // FIX #6a : snapshot des joueurs DÉJÀ blessés/suspendus AVANT ce match, pour ne
            // décrémenter que les sanctions qui viennent d'être "purgées" par ce match — pas
            // celles infligées pendant ce match même (qui doivent s'appliquer au match SUIVANT)
            preMatchStatusIds: new Set(
                [...home.squad, ...away.squad]
                    .filter(p => p.injuryDays > 0 || p.suspensionDays > 0)
                    .map(p => p.id)
            ),
            // NOUVEAU : On récupère les joueurs du banc (du 12ème au 18ème)
            homeBench: [...home.squad.slice(11, 18)], 
            awayBench: [...away.squad.slice(11, 18)],
            // NOUVEAU : Compteur de remplacements
            subsMade: { home: 0, away: 0 },
            penaltyGiven: false,
            // FIX #89 : temps additionnel. Avant, le match s'arrêtait pile a 90'00.
            // stoppage.first : arrets de jeu de la 1re periode (1 a 3 min)
            // stoppage.second : arrets de jeu de la 2e periode (2 a 5 min)
            // Le compteur interne `minute` va de 1 a maxMinute ; l'affichage est
            // remappe par matchClock() en 45+X' / 90+X'.
            stoppage: {
                first: 1 + Math.floor(Math.random() * 3),
                second: 2 + Math.floor(Math.random() * 4)
            },
            interval: null
        };
        this.liveMatch.maxMinute = 90 + this.liveMatch.stoppage.first + this.liveMatch.stoppage.second;
        this.liveMatch.regulationMax = this.liveMatch.maxMinute; // FIX #98 : borne du temps réglementaire
        this.pendingShootout = null; // FIX #98
        
        this.updateLiveStatus('En Cours'); // FIX #95
        this.logCommentary(`L'arbitre siffle le coup d'envoi. C'est parti !`, "text-brand-400 border-brand-500/20");
        this.animatePitch('center');

        this.applyTempo();   // règle MATCHSIM.TICK avant de lancer l'horloge
        this.liveMatch.interval = setInterval(() => { this.tickLiveMatch(); },
            MATCH_TEMPOS[this.getTempo()].clock);
    }


    // =====================================================================
    // 🏟️ VUE TERRAIN 2D — ET SEULEMENT 2D
    // =====================================================================
    // La vue 2.5D en perspective a été retirée : un seul terrain, vu du
    // dessus, lisible sur téléphone comme sur écran. Le seul réglage qui
    // subsiste est celui qui comptait vraiment : la VITESSE.

    getTempo() {
        if (!this._tempo) {
            try { this._tempo = localStorage.getItem('AECM_Tempo') || 'slow'; }
            catch (e) { this._tempo = 'slow'; }
        }
        if (!MATCH_TEMPOS[this._tempo]) this._tempo = 'slow';
        return this._tempo;
    }

    // Applique le tempo choisi À CHAUD : la simulation de placement ET
    // l'horloge du match sont réglées ensemble, sinon l'animation se
    // désynchronise du chronomètre.
    applyTempo() {
        const t = MATCH_TEMPOS[this.getTempo()];
        MATCHSIM.TICK = t.tick;
        if (this.liveMatch && this.liveMatch.interval) {
            clearInterval(this.liveMatch.interval);
            this.liveMatch.interval = setInterval(() => { this.tickLiveMatch(); }, t.clock);
        }
        const btn = document.getElementById('pitch-tempo-btn');
        if (btn) btn.textContent = t.label;
    }

    // Convertit un délai écrit à l'époque où une minute durait 800 ms.
    // Sans ça, chaque changement de tempo désynchronise les temporisations
    // codées en dur et l'animation se met à couper les actions en deux.
    tempoMs(ms) {
        return Math.round(ms * (MATCH_TEMPOS[this.getTempo()].clock / 800));
    }

    cycleTempo() {
        const order = ['slow', 'normal', 'fast'];
        this._tempo = order[(order.indexOf(this.getTempo()) + 1) % order.length];
        try { localStorage.setItem('AECM_Tempo', this._tempo); } catch (e) {}
        this.applyTempo();
        this.showNotification(`Vitesse du match : ${MATCH_TEMPOS[this._tempo].label}`);
    }

    // Masque (ou restaure) les lignes de terrain en CSS.
    setPitchDecor(visible) {
        const box = document.getElementById('pitch-container');
        if (!box) return;
        box.querySelectorAll('.pitch-lines').forEach(el => { el.style.display = visible ? '' : 'none'; });
        box.classList.toggle('pitch-bg', visible);
        box.style.backgroundColor = '';
    }

    // Petit bouton flottant : Lent → Normal → Rapide
    injectTempoButton() {
        const box = document.getElementById('pitch-container');
        if (!box) return;
        const legacy = document.getElementById('pitch-mode-btn');   // ancien bouton 2D/2.5D
        if (legacy) legacy.remove();
        let btn = document.getElementById('pitch-tempo-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'pitch-tempo-btn';
            btn.className = 'absolute top-2 right-2 z-40 bg-black/50 hover:bg-black/70 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10 backdrop-blur-sm transition-colors';
            btn.title = "Vitesse de l'animation";
            btn.onclick = () => app.cycleTempo();
            box.appendChild(btn);
        }
        btn.textContent = MATCH_TEMPOS[this.getTempo()].label;
    }

    initPitchTokens() {
        const layer = document.getElementById('match-tokens-layer');
        if (!layer) return;
        this.injectTempoButton();
        this.applyTempo();
        this._pitchBuilt = true;
        this.setPitchDecor(true);
        this._pitch2DFresh = true;
        this.initPitchTokens2D();
    }

    // Le moteur de match donne un ordre de scène ; la simulation de placement
    // s'exécute, et les deux vues (2D comme 2.5D) lisent le même état.
    animatePitch(state, opts) {
        this._lastPitchState = state;
        if (!this.liveMatch || this._matchOver) return; // LOT 15 : ordre arrivé après le coup de sifflet
        if (!MATCHSIM.active) this.initMatchSim();
        MATCHSIM.director(state, opts);
        this.startPitchLoop();
        // Un engagement renvoie tout le monde dans son camp : ça se parcourt
        // au pas, pas en un clignement d'œil.
        const dur = state === 'center' ? Math.round(MATCHSIM.TICK * 1.1) : MATCHSIM.TICK;
        MATCHSIM.hold(dur);
        this._pitchLast = MATCHSIM.now() + dur - MATCHSIM.TICK;
        this.renderPitchFrame(dur);
    }

    // Prépare la simulation avec les VRAIES formations et les VRAIS styles des
    // deux équipes. Le club de l'IA reçoit un style déterministe tiré de son
    // nom et de sa force : un cador tient le ballon, un promu se recroqueville.
    initMatchSim() {
        if (!this.liveMatch) return;
        const lm = this.liveMatch;
        const userTac = this.userTactics;
        const hForm = FORMATIONS_MAP[lm.home.isUser ? userTac.formation : this.aiFormationFor(lm.home)] || FORMATIONS_MAP['4-4-2'];
        const aForm = FORMATIONS_MAP[lm.away.isUser ? userTac.formation : this.aiFormationFor(lm.away)] || FORMATIONS_MAP['4-4-2'];
        const shortName = p => p ? (p.name || '').split(' ').pop() : '';
        const hTac = MATCHSIM.styleFor(lm.home, lm.home.isUser, userTac);
        const aTac = MATCHSIM.styleFor(lm.away, lm.away.isUser, userTac);
        if (lm.home.isUser) hTac.pmIdx = this.playmakerIndex('H');
        if (lm.away.isUser) aTac.pmIdx = this.playmakerIndex('A');
        MATCHSIM.init({
            homeForm: hForm, awayForm: aForm,
            homeTac: hTac,
            awayTac: aTac,
            homeForce: lm.home.force, awayForce: lm.away.force,
            homeNames: lm.home.isUser ? (lm.homeStarters || []).map(shortName) : [],
            awayNames: lm.away.isUser ? (lm.awayStarters || []).map(shortName) : []
        });
        // Les noms ne sont connus qu'ici (initPitchTokens tourne avant que
        // liveMatch existe) : on redessine les pastilles avec leurs étiquettes.
        this.initPitchTokens2D();
        this._pitch2DFresh = true;
    }

    // Changement de formation, de mentalité ou d'effectif en cours de match :
    // on met la simulation à jour sans remettre le ballon au rond central.
    retuneMatchSim() {
        if (!this.liveMatch || !MATCHSIM.active) return;
        const lm = this.liveMatch;
        const shortName = p => p ? (p.name || '').split(' ').pop() : '';
        const side = lm.home.isUser ? 'H' : lm.away.isUser ? 'A' : null;
        if (!side) return;
        const T = MATCHSIM.team(side);
        T.form = FORMATIONS_MAP[this.userTactics.formation] || T.form;
        T.style = this.userTactics.style;
        T.mentality = this.userTactics.mentality;
        T.chan  = this.userTactics.attackSide || 'mixed';
        T.press = this.userTactics.pressing   || 'half';
        T.line  = this.userTactics.line       || 'normal';
        T.pmIdx = this.playmakerIndex(side);
        T.names = (side === 'H' ? lm.homeStarters : lm.awayStarters || []).map(shortName);
        T.p.forEach(p => { p.role = MATCHSIM.roleOf(p.i, T.form); p.slot = MATCHSIM.slotOf(p.i, T.form); });
        MATCHSIM.applyTargets();
        MATCHSIM.commit();
        this.renderPitchFrame(MATCHSIM.TICK);
    }

    // Formation de l'IA : stable pour un club donné, variée d'un club à l'autre.
    aiFormationFor(club) {
        const keys = Object.keys(FORMATIONS_MAP);
        const name = (club && club.name) || 'X';
        let h = 0;
        for (let i = 0; i < name.length; i++) h = (h * 33 + name.charCodeAt(i)) >>> 0;
        return keys[h % keys.length];
    }

    // Boucle de rendu : une décision toutes les MATCHSIM.TICK ms, mais le
    // ballon est redessiné à chaque frame pour rester collé au pied.
    startPitchLoop() {
        if (this._pitchRAF) return;
        if (this._pitchLast == null) this._pitchLast = 0;
        const loop = (now) => {
            if (!this.liveMatch || !MATCHSIM.active) { this._pitchRAF = null; return; }
            if (now - this._pitchLast >= MATCHSIM.TICK) {
                this._pitchLast = now;
                MATCHSIM.tick();
                this.renderPitchFrame(MATCHSIM.TICK);
            } else {
                this.renderBallOnly();
            }
            this._pitchRAF = requestAnimationFrame(loop);
        };
        this._pitchRAF = requestAnimationFrame(loop);
    }

    stopPitchLoop() {
        if (this._pitchRAF) cancelAnimationFrame(this._pitchRAF);
        this._pitchRAF = null;
        MATCHSIM.stop();
    }

    renderPitchFrame(dur) {
        if (!MATCHSIM.active) return;
        this.render2DFrame(MATCHSIM.frame(), dur);
    }

    renderBallOnly() {
        if (!MATCHSIM.active) return;
        const b = MATCHSIM.ballNow();
        const ball = document.getElementById('anim-ball');
        if (!ball) return;
        ball.style.transition = 'none';
        ball.style.left = `${b.x}%`;
        ball.style.top = `${b.y}%`;
        const lift = 1 + Math.min(0.8, (b.z || 0) * 0.22);
        ball.style.transform = `translate(-50%,-50%) scale(${lift.toFixed(2)})`;
        ball.style.boxShadow = b.z > 0.4 ? `0 ${(b.z * 1.6).toFixed(1)}px ${(b.z * 2).toFixed(1)}px rgba(0,0,0,0.55)` : 'none';
    }

    // Vue 2D — vue du dessus, alimentée par la simulation de placement.
    // Chaque pastille porte son POSTE : on voit d'un coup d'œil que l'ailier
    // gauche reste sur sa touche et que la sentinelle ne quitte pas l'axe.
    render2DFrame(f, dur) {
        if (this._pitch2DFresh) { dur = 0; this._pitch2DFresh = false; }
        const put = (id, d, isCarrier) => {
            const el = document.getElementById(id);
            if (!el) return;
            // Transition linéaire sur toute la durée du tour : le déplacement
            // se voit, au lieu d'un saut suivi d'une attente.
            el.style.transition = `left ${dur}ms linear, top ${dur}ms linear`;
            el.style.left = `${d.tx}%`;
            el.style.top = `${d.ty}%`;
            const want = isCarrier ? 'drop-shadow(0 0 4px #fde047)' : '';
            if (el._fx !== want) { el.style.filter = want; el._fx = want; }
            const lb = document.getElementById(id + '-lb');
            if (lb) {
                const txt = d.name ? `${SLOT_SHORT[d.slot] || ''} ${d.name}`.trim() : (SLOT_SHORT[d.slot] || '');
                if (lb._t !== txt) { lb.textContent = txt; lb._t = txt; }
            }
        };
        for (let i = 0; i < 11; i++) {
            put(`ht-${i}`, f.H[i], f.H[i].carrier);
            put(`at-${i}`, f.A[i], f.A[i].carrier);
        }
        this.renderBallOnly();
    }

    initPitchTokens2D() {
        const layer = document.getElementById('match-tokens-layer');
        if (!layer) return;
        const token = (id, color) => `
            <div id="${id}" class="player-token absolute z-20 ${color} w-4 h-4 sm:w-5 sm:h-5">
                ${JERSEY_SVG}
                <span id="${id}-lb" class="absolute left-1/2 top-full -translate-x-1/2 mt-[1px] text-[6px] sm:text-[7px] leading-none font-bold text-white/90 bg-black/55 px-[2px] rounded whitespace-nowrap pointer-events-none"></span>
            </div>`;
        let html = '<div id="anim-ball" class="match-ball absolute w-3 h-3 bg-white rounded-full z-30" style="left:50%; top:50%;"></div>';
        for (let i = 0; i < 11; i++) {
            html += token(`ht-${i}`, 'text-brand-500');
            html += token(`at-${i}`, 'text-slate-400');
        }
        layer.innerHTML = html;
    }

    // FIX #95 : le badge #live-status-text était figé sur "En Cours" dans le HTML, y compris
    // à la mi-temps et après le coup de sifflet final.
    updateLiveStatus(forced = null) {
        const el = document.getElementById('live-status-text');
        if (!el) return;
        let label = forced;
        if (!label && this.liveMatch) {
            const m = this.liveMatch.minute;
            const n1 = this.liveMatch.stoppage?.first ?? 0;
            const R = this.liveMatch.regulationMax ?? this.liveMatch.maxMinute ?? 90;
            if (m >= (this.liveMatch.maxMinute || 90)) label = 'Terminé';
            else if (m === 45 + n1) label = 'Mi-temps';
            else if (this.liveMatch.phase === 'extratime') label = 'Prolong.'; // FIX #98
            else if (m > 90) label = 'Temps add.';
            else label = 'En Cours';
        }
        el.innerText = label || 'En Cours';
        const styles = {
            'Terminé':    ['bg-slate-500/20', 'text-slate-300'],
            'Mi-temps':   ['bg-amber-500/20', 'text-amber-400'],
            'Temps add.': ['bg-amber-500/20', 'text-amber-400'],
            'Prolong.':   ['bg-red-500/20', 'text-red-400'],   // FIX #98
            'T.a.b.':     ['bg-red-500/20', 'text-red-400'],   // FIX #98
            'En Cours':   ['bg-emerald-500/20', 'text-emerald-400']
        };
        const [bg, fg] = styles[el.innerText] || styles['En Cours'];
        el.className = `text-[10px] ${bg} ${fg} px-2 rounded font-bold`;
    }

    showHighlightAlert() {
        const alert = document.getElementById('highlight-alert');
        alert.classList.remove('opacity-0');
        setTimeout(() => alert.classList.add('opacity-0'), 1500);
    }

    // Fonction utilitaire pour calculer la stat réelle (Fatigue + Moral)
    calculateEffectiveStat(player, statName) {
        if (!player) return 50; // FIX #22b : garde-fou si aucun joueur disponible
        let base = player.stats?.[statName] || player.ovr || 50;
        let energyMod = 0.6 + (player.energy / 250); // Un joueur à 0% garde 60% de sa force
        let moraleMod = 0.9 + ((player.morale ?? 80) / 800); // FIX #73
        return base * energyMod * moraleMod;
    }

    // FIX #89 : convertit la minute interne (1..maxMinute) en horloge affichée.
    // 1..45 -> "12'" | arrêts 1re période -> "45+2'" | 2e période -> "58'" | arrêts -> "90+3'"
    matchClock(minute) {
        if (!this.liveMatch) return minute + "'";
        const n1 = this.liveMatch.stoppage?.first ?? 0;
        const m = minute ?? this.liveMatch.minute;
        const R = this.liveMatch.regulationMax ?? this.liveMatch.maxMinute ?? 90;

        // Temps réglementaire
        if (m <= R) {
            if (m <= 45) return m + "'";
            if (m <= 45 + n1) return "45+" + (m - 45) + "'";
            if (m <= 90 + n1) return (m - n1) + "'";
            return "90+" + (m - 90 - n1) + "'";
        }

        // FIX #98 : prolongation — 91'..105' (+arrêts), puis 106'..120' (+arrêts)
        const n3 = this.liveMatch.stoppage?.extraFirst ?? 0;
        const e = m - R; // minute de prolongation, arrêts de jeu compris
        if (e <= 15) return (90 + e) + "'";
        if (e <= 15 + n3) return "105+" + (e - 15) + "'";
        if (e <= 30 + n3) return (90 + e - n3) + "'";
        return "120+" + (e - 30 - n3) + "'";
    }

    // FIX #98 : le match à élimination directe joué en direct s'arrêtait à 90' et le vainqueur
    // était décidé aussitôt aux tirs au but. On joue maintenant la prolongation réglementaire.
    // Renvoie true si, au coup de sifflet, rien n'a départagé les deux clubs.
    liveMatchIsStillTied() {
        const lm = this.liveMatch;
        const f = lm?.fixture;
        if (!f || !f.type || !f.type.startsWith('CAF') || f.type === 'CAF_GROUP') return false;

        const hG = lm.homeScore, aG = lm.awayScore;
        if (f.type === 'CAF_FINAL') return hG === aG;

        // Quarts / demies : seul le match RETOUR peut aller en prolongation
        let matchObj = null;
        if (f.type === 'CAF_QUARTER') matchObj = this.cafData?.quarterFinals?.[f.quarterIndex];
        if (f.type === 'CAF_SEMI') matchObj = this.cafData?.semiFinals?.[f.semiIndex];
        if (!matchObj || !matchObj.home) return false;
        if (matchObj.home.name === lm.home.name) return false; // c'est l'aller

        // Sur le retour, les équipes sont inversées par rapport à matchObj
        const hG2 = aG, aG2 = hG;
        const totalHome = (matchObj.hG || 0) + hG2;
        const totalAway = (matchObj.aG || 0) + aG2;
        if (totalHome !== totalAway) return false;
        return hG2 === (matchObj.aG || 0); // égalité aussi sur les buts à l'extérieur
    }

    // FIX #98 : bascule en prolongation (2 × 15 min + arrêts de jeu)
    startExtraTime() {
        const lm = this.liveMatch;
        lm.phase = 'extratime';
        lm.stoppage.extraFirst = Math.floor(Math.random() * 2);       // 0-1 min
        lm.stoppage.extraSecond = 1 + Math.floor(Math.random() * 2);  // 1-2 min
        lm.maxMinute = lm.regulationMax + 30 + lm.stoppage.extraFirst + lm.stoppage.extraSecond;

        // Coup de fatigue : 30 minutes de plus dans les jambes
        [...lm.homeStarters, ...lm.awayStarters].forEach(p => {
            p.energy = Math.max(0, Math.round((p.energy ?? 100) - 8));
        });

        this.updateLiveStatus('Prolong.');
        this.logCommentary("⏱️ Toujours rien pour départager les deux clubs — on joue la prolongation (2 × 15 min).", "text-amber-400 font-bold text-center mt-2");
        this.showNotification("⏱️ Prolongation ! Un 6e remplacement vous est accordé.", "warning");
        this.animatePitch('center');
    }

    // FIX #88 : un seul événement par minute.
    // Avant, chaque événement (penalty, corner, coup franc, carton, blessure, action de but)
    // était tiré indépendamment : on pouvait avoir un corner + un coup franc + un carton +
    // un but sur la même minute, avec un commentaire incohérent et 3 tirs simultanés.
    // On tire maintenant UN seul nombre aléatoire comparé aux poids cumulés : les
    // probabilités marginales de chaque événement sont conservées, mais ils s'excluent.
    pickMinuteEvent() {
        const m = this.liveMatch.minute;
        const candidates = [];
        const end = this.liveMatch.maxMinute || 90; // FIX #98 : fenêtres relatives à la fin réelle
        if (!this.liveMatch.penaltyGiven && m > 15 && m < end - 5) candidates.push(['penalty', 0.008]);
        if (m > 5) candidates.push(['corner', 0.09]);
        if (m > 10 && m < end - 2) candidates.push(['freekick', 0.045]);
        if (m > 5) candidates.push(['yellow', 0.015]);
        if (m > 20) candidates.push(['red', 0.001]);
        if (m > 10) candidates.push(['injury', 0.005]);
        candidates.push(['action', 0.16]);

        let roll = Math.random();
        for (const [name, weight] of candidates) {
            if (roll < weight) return name;
            roll -= weight;
        }
        return null;
    }

    // FIX #87 : filet de sécurité générique. Avant, la moindre exception dans un tick
    // (imprévue, même après tous les correctifs ci-dessus) tuait silencieusement le setInterval
    // et figeait le match pour toujours — sans message, sans moyen de continuer.
    tickLiveMatch() {
        try {
            this._tickLiveMatchInner();
        } catch (e) {
            console.error('Erreur pendant le match (récupération auto) :', e);
            if (this.liveMatch) {
                clearInterval(this.liveMatch.interval);
                this.liveMatch.minute = this.liveMatch.maxMinute || 90;
                const timeEl = document.getElementById('live-time');
                if (timeEl) timeEl.innerText = "FIN";
                this.updateLiveStatus('Terminé'); // FIX #95
                const btn = document.getElementById('btn-end-match');
                if (btn) btn.classList.remove('hidden');
                this.showNotification("⚠️ Incident technique — match arrêté proprement, vous pouvez continuer.", "warning");
            }
        }
    }

    _tickLiveMatchInner() {
        if (!this.liveMatch || this.liveMatch.minute >= this.liveMatch.maxMinute) return;

        this.liveMatch.minute++;
        document.getElementById('live-time').innerText = this.matchClock(); // FIX #89

        // FIX #95 : le badge de statut du direct était figé sur "En Cours" en dur dans le HTML
        this.updateLiveStatus();

        // FIX #88 : un seul événement tiré pour cette minute
        const minuteEvent = this.pickMinuteEvent();

        // Perte d'énergie initiale
        if (this.liveMatch.minute === 1) {
            let isHomeUser = this.liveMatch.home.isUser;
            let aiSquad = isHomeUser ? [...this.liveMatch.awayStarters, ...this.liveMatch.awayBench] : [...this.liveMatch.homeStarters, ...this.liveMatch.homeBench];
            aiSquad.forEach(p => {
                if (p.energy === undefined) p.energy = 100;
                p.energy = Math.max(60, p.energy - Math.floor(Math.random() * 25)); 
            });
        }

        // Fatigue progressive toutes les 5 minutes
        if (this.liveMatch.minute % 5 === 0) {
            // Le pressing tout terrain est le réglage le plus exigeant du jeu :
            // il se paie en jambes, exactement comme dans la vraie vie.
            const pressDrain = this.userTactics.pressing === 'all' ? 1.35
                : this.userTactics.pressing === 'area' ? 0.85 : 1;
            const userStarters = this.liveMatch.home.isUser ? this.liveMatch.homeStarters
                : this.liveMatch.away.isUser ? this.liveMatch.awayStarters : null;
            [...this.liveMatch.homeStarters, ...this.liveMatch.awayStarters].forEach(p => {
                let drain = p.position === 'MIL' ? 2.5 : 1.8;
                if (userStarters && userStarters.indexOf(p) > -1) drain *= pressDrain;
                p.energy = Math.max(0, Math.round((p.energy ?? 100) - drain)); // FIX #73
            });
        }

        // Remplacements IA
        if ([60, 70, 80].includes(this.liveMatch.minute)) {
            this.handleAICoaching();
        }
        // FIX #98 : l'IA a aussi le droit de changer en prolongation
        if (this.liveMatch.phase === 'extratime' && this.liveMatch.minute === this.liveMatch.regulationMax + 5) {
            this.handleAICoaching();
        }

        // PENALTY
        if (minuteEvent === 'penalty') { // FIX #88
            let hForceEvt = this.liveMatch.home.force || 60;
            let aForceEvt = this.liveMatch.away.force || 60;
            let hPressure = hForceEvt / (hForceEvt + aForceEvt);
            {
                const isEvtHome = Math.random() < hPressure;
                const teamName = isEvtHome ? this.liveMatch.home.name : this.liveMatch.away.name;
                this.liveMatch.penaltyGiven = true;
                {
                    const userSideP = isEvtHome ? this.liveMatch.home.isUser : this.liveMatch.away.isUser;
                    const pkTaker = userSideP ? this.getSetPieceTaker('penalty', isEvtHome ? this.liveMatch.homeStarters : this.liveMatch.awayStarters) : null;
                    this.logCommentary(`🚨 PENALTY sifflé pour ${teamName} !${pkTaker ? ` ${pkTaker.name} place le ballon sur le point.` : ''}`, "text-red-400 font-bold");
                }
                setTimeout(() => { if (this.liveMatch && this.liveMatch.minute < this.liveMatch.maxMinute) this.executeShot(isEvtHome, true); }, this.tempoMs(600)); // FIX #28
            }
        }
        
        // CORNER
        if (minuteEvent === 'corner') { // FIX #88
            let hForceEvt2 = this.liveMatch.home.force || 60;
            let aForceEvt2 = this.liveMatch.away.force || 60;
            const isEvtHome2 = Math.random() < (hForceEvt2 / (hForceEvt2 + aForceEvt2));
            const teamName2 = isEvtHome2 ? this.liveMatch.home.name : this.liveMatch.away.name;
            this.logCommentary(`🚩 Corner pour ${teamName2}...`, "text-slate-400 italic");
            if (Math.random() < 0.18) setTimeout(() => { if (this.liveMatch && this.liveMatch.minute < this.liveMatch.maxMinute) this.executeShot(isEvtHome2, false, 'corner'); }, this.tempoMs(600)); // FIX #28
        }
        
        // COUP FRANC
        if (minuteEvent === 'freekick') { // FIX #88
            let hForceEvt3 = this.liveMatch.home.force || 60;
            let aForceEvt3 = this.liveMatch.away.force || 60;
            const isEvtHome3 = Math.random() < (hForceEvt3 / (hForceEvt3 + aForceEvt3));
            const teamName3 = isEvtHome3 ? this.liveMatch.home.name : this.liveMatch.away.name;
            {
                const userSide3 = isEvtHome3 ? this.liveMatch.home.isUser : this.liveMatch.away.isUser;
                const fkTaker = userSide3 ? this.getSetPieceTaker('freekick', isEvtHome3 ? this.liveMatch.homeStarters : this.liveMatch.awayStarters) : null;
                this.logCommentary(`🎯 Coup franc dangereux pour ${teamName3}${fkTaker ? ` — ${fkTaker.name} se charge du ballon.` : '.'}`, "text-slate-400 italic");
            }
            if (Math.random() < 0.14) setTimeout(() => { if (this.liveMatch && this.liveMatch.minute < this.liveMatch.maxMinute) this.executeShot(isEvtHome3, false, 'freekick'); }, this.tempoMs(600)); // FIX #28
        }

        // CARTONS JAUNES ET 2E JAUNE
        if (minuteEvent === 'yellow') { // FIX #88
            let team = Math.random() < 0.5 ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
            if (team.length > 0) {
                let player = team.find(p => p.yellowCards >= 1 && Math.random() < 0.2) || team[Math.floor(Math.random() * team.length)];
                if (player.yellowCards >= 1 && Math.random() < 0.10) {
                    player.yellowCards++;
                    player.redCards++;
                    team.splice(team.indexOf(player), 1); // Pour un rouge, on sort définitivement le joueur
                    this.logCommentary(`🟥 EXPULSION ! ${player.name} voit son 2e carton jaune !`, "text-red-500 font-bold");
                } else {
                    player.yellowCards++;
                    this.logCommentary(`🟨 Faute tactique. Carton jaune pour ${player.name}.`, "text-yellow-400");
                }
            }
        }
        
        // CARTON ROUGE DIRECT
        if (minuteEvent === 'red') { // FIX #88
            let team = Math.random() < 0.5 ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
            if (team.length > 0) {
                let player = team[Math.floor(Math.random() * team.length)];
                player.redCards++;
                team.splice(team.indexOf(player), 1); // L'équipe finit à 10
                this.logCommentary(`🟥 CARTON ROUGE DIRECT ! Faute grossière de ${player.name} !`, "text-red-500 font-bold");
            }
        }

        // 🚑 NOUVEAU SYSTÈME DE BLESSURE (CORRIGÉ)
        if (minuteEvent === 'injury') { // FIX #88
            let isHomeTeam = Math.random() < 0.5;
            let team = isHomeTeam ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
            // FIX #37a : le Médecin du Sport réduit de 15% le risque, mais seulement pour l'équipe du joueur
            const injuredIsUser = isHomeTeam ? this.liveMatch.home.isUser : this.liveMatch.away.isUser;
            const avoidedByDoctor = injuredIsUser && this.userStaff && this.userStaff.includes('doctor') && Math.random() < 0.15;

            if (!avoidedByDoctor) {
            let bench = isHomeTeam ? this.liveMatch.homeBench : this.liveMatch.awayBench;
            let isUser = isHomeTeam ? this.liveMatch.home.isUser : this.liveMatch.away.isUser;

            if (team.length > 0) {
                let candidates = team.filter(p => p.position === 'MIL' || p.position === 'ATT');
                let player = (candidates.length > 0 && Math.random() < 0.6) ? candidates[Math.floor(Math.random() * candidates.length)] : team[Math.floor(Math.random() * team.length)];
                
                player.injuryDays = Math.floor(Math.random() * 5) + 1;
                player.energy = 5; // Son énergie s'effondre dans le rouge (diminué sur le terrain)

                if (isUser) {
                    // Pour le joueur humain : On avertit. Le joueur RESTE sur le terrain (avec 5 d'énergie) jusqu'à ce que tu le remplaces !
                    this.logCommentary(`🏥 BLESSURE ! ${player.name} est touché (${player.injuryDays}j). Son énergie s'effondre, remplacez-le vite !`, "text-orange-500 font-bold text-base");
                } else {
                    // Pour l'IA : L'ordinateur regarde son banc et fait le changement tout seul
                    let sub = bench.length > 0 ? (bench.find(p => p.position === player.position) || bench[0]) : null;
                    
                    if (sub) {
                        team.splice(team.indexOf(player), 1);
                        bench.splice(bench.indexOf(sub), 1);
                        team.push(sub);
                        sub.matchEntryMinute = this.liveMatch.minute;
                        // FIX #24 : incrémenter le compteur de changements (manquait — l'IA pouvait dépasser 5)
                        if (isHomeTeam) this.liveMatch.subsMade.home++; else this.liveMatch.subsMade.away++;
                        this.logCommentary(`🔄 Changement IA : ${sub.name} remplace ${player.name} sorti sur blessure.`, "text-blue-400 italic");
                    } else {
                        // S'il n'y a plus personne sur le banc de l'IA, le joueur sort définitivement
                        team.splice(team.indexOf(player), 1);
                        this.logCommentary(`🏥 Coup dur pour l'IA : ${player.name} sort sur civière et l'équipe n'a plus de remplaçant !`, "text-red-500 font-bold");
                    }
                }
            }
            }
        }

        // ACTION DE BUT / POSSESSION AU CARRÉ
        if (minuteEvent === 'action') { // FIX #88
            let hForce = (this.liveMatch.home.force || 60);
            let aForce = (this.liveMatch.away.force || 60);

            if (this.liveMatch.home.isUser) hForce *= (this.userTactics.mentality === 'offensive' ? 1.2 : 0.85);
            if (this.liveMatch.away.isUser) aForce *= (this.userTactics.mentality === 'offensive' ? 1.2 : 0.85);

            // Le brassard : un capitaine désigné et présent sur la pelouse
            // tient le groupe (+3 % sur la force de son équipe).
            if (this.captainOnPitch()) {
                if (this.liveMatch.home.isUser) hForce *= 1.03;
                if (this.liveMatch.away.isUser) aForce *= 1.03;
            }

            // FIX #37c : bonus tactique de l'Entraîneur Adjoint (+5% sur la force du club utilisateur)
            if (this.userStaff && this.userStaff.includes('coach_adj')) {
                if (this.liveMatch.home.isUser) hForce *= 1.05;
                if (this.liveMatch.away.isUser) aForce *= 1.05;
            }

            let hDom = Math.pow(hForce, 2);
            let aDom = Math.pow(aForce, 2);
            let isHomeAttack = Math.random() < (hDom / (hDom + aDom));
            
            let attackerTeam = isHomeAttack ? this.liveMatch.home : this.liveMatch.away;
            let attackingForce = isHomeAttack ? hForce : aForce;
            
            this.animatePitch(isHomeAttack ? 'home_attack' : 'away_attack');

            const formPartsT = this.userTactics.formation.split('-').map(Number);
            const formAttT = formPartsT[formPartsT.length - 1] || 2;
            const userAttacking = (isHomeAttack && this.liveMatch.home.isUser) || (!isHomeAttack && this.liveMatch.away.isUser);
            const formShotBonus = userAttacking ? (formAttT - 2) * 0.04 : 0;
            
            let shotChance = 0.30 + (attackingForce / 500) + formShotBonus;

            if (Math.random() < shotChance) {
                this.showHighlightAlert();
                this.logCommentary(`🔥 Action fulgurante de ${attackerTeam.name}...`, "text-yellow-400");
                
                setTimeout(() => {
                    if (this.liveMatch && this.liveMatch.minute < this.liveMatch.maxMinute) {
                        this.executeShot(isHomeAttack); 
                    }
                }, 800);
            } else {
                this.logCommentary(`🛡️ La défense de ${isHomeAttack ? this.liveMatch.away.name : this.liveMatch.home.name} repousse le danger.`, "text-slate-500 text-[10px]");
            }
        } else {
            if (this.liveMatch.minute % 2 === 0) this.animatePitch('midfield');
        }

        // FIX #89 : annonce du temps additionnel de chaque période
        if (this.liveMatch.minute === 45) {
            this.logCommentary(`⏱️ ${this.liveMatch.stoppage.first} minute(s) de temps additionnel.`, "text-slate-400 italic text-center");
        }
        if (this.liveMatch.minute === 90) {
            this.logCommentary(`⏱️ ${this.liveMatch.stoppage.second} minute(s) de temps additionnel.`, "text-slate-400 italic text-center");
        }

        // MI-TEMPS (après les arrêts de jeu de la 1re période) — FIX #89
        if (this.liveMatch.minute === 45 + this.liveMatch.stoppage.first) {
            this.logCommentary("⏸️ Mi-temps. Les équipes rentrent aux vestiaires.", "text-slate-500 italic text-center mt-2");
            this.animatePitch('center');
        }

        // FIX #98 : annonce et pause de la mi-temps de prolongation
        if (this.liveMatch.phase === 'extratime') {
            const etHalf = this.liveMatch.regulationMax + 15 + (this.liveMatch.stoppage.extraFirst || 0);
            if (this.liveMatch.minute === etHalf) {
                this.logCommentary("⏸️ Fin de la première période de prolongation.", "text-slate-500 italic text-center mt-2");
                this.animatePitch('center');
            }
        }

        // FIN DU MATCH
        if (this.liveMatch.minute >= this.liveMatch.maxMinute) {
            // FIX #98 : avant de siffler la fin, on vérifie si une prolongation s'impose
            if (this.liveMatch.phase === 'regulation' && this.liveMatchIsStillTied()) {
                this.logCommentary("🏁 Fin du temps réglementaire.", "text-slate-400 font-bold text-center mt-2");
                this.startExtraTime();
                return;
            }

            clearInterval(this.liveMatch.interval);
            document.getElementById('live-time').innerText = "FIN";
            this.logCommentary("🏁 Coup de sifflet final !", "text-brand-500 font-bold text-center mt-4");

            // FIX #98 : toujours à égalité après prolongation -> séance de tirs au but, jouée
            // ici pour pouvoir l'afficher, puis réutilisée telle quelle par
            // processCAFKnockoutStats (pas de double tirage).
            if (this.liveMatchIsStillTied()) {
                const result = this.simulatePenaltyShootout(this.liveMatch.home, this.liveMatch.away);
                this.pendingShootout = result;
                this.updateLiveStatus('T.a.b.');
                this.logCommentary(
                    `🥅 Séance de tirs au but : ${this.liveMatch.home.name} ${result.scoreA} — ${result.scoreB} ${this.liveMatch.away.name}.`,
                    "text-amber-400 font-bold text-center mt-2");
                this.logCommentary(`🏆 ${result.winner.name} se qualifie !`, "text-brand-500 font-bold text-center");
            } else {
                this.updateLiveStatus('Terminé'); // FIX #95
            }

            document.getElementById('btn-end-match').classList.remove('hidden');
        }
    }

    clampNum(v, a, b) { return v < a ? a : v > b ? b : v; }

    // =====================================================================
    // 🎯 AUTO-CALIBRAGE DU xG GÉOMÉTRIQUE
    // =====================================================================
    // Problème : le xG dépend maintenant de la distance de frappe, or cette
    // distance dépend elle-même de TICK, de TOP_SPEED et du facteur qui
    // rapproche le tireur de la surface. Figer un coefficient en dur, c'est
    // garantir que le prochain réglage de vitesse cassera silencieusement le
    // nombre de buts.
    //
    // Solution : on ne fige rien. On observe la qualité MOYENNE des occasions
    // réellement produites par la simulation, et on en déduit le coefficient
    // qui maintient la moyenne des baseXG sur sa cible historique.
    //
    //   baseXG = 0,02 + qualité × coef + aléa(0 → 0,10)
    //   moyenne visée = 0,22   (le moteur d'origine tirait uniformément
    //                           entre 0,02 et 0,42, soit 0,22 de moyenne)
    //   partie fixe   = 0,02 + 0,05 = 0,07
    //   ⇒ coef × qualité_moyenne = 0,15
    //
    // Changez la vitesse des joueurs : les frappes partent de plus loin, la
    // qualité moyenne baisse, le coefficient monte, le nombre de buts ne
    // bouge pas. Le réglage se répare tout seul.
    xgCoefficient() {
        const CIBLE = 0.15;   // = moyenne visée (0,22) − partie fixe (0,07)
        if (!this.xgCalib) this.xgCalib = { q: 0.25, n: 0 };
        return this.clampNum(CIBLE / Math.max(0.06, this.xgCalib.q), 0.35, 1.20);
    }

    noteShotQuality(q) {
        if (!this.xgCalib) this.xgCalib = { q: 0.25, n: 0 };
        // Convergence rapide sur les 40 premières frappes, puis mémoire longue
        // (~200 tirs) pour qu'une équipe dominante ne s'auto-pénalise pas.
        const a = this.xgCalib.n < 40 ? 0.08 : 0.005;
        this.xgCalib.q += (q - this.xgCalib.q) * a;
        this.xgCalib.n++;
    }

    // setPiece : null | 'freekick' | 'corner'. Un penalty passe par isPenalty.
    executeShot(isHome, isPenalty = false, setPiece = null) {
        if (!this.liveMatch) return;

        const attStarters = isHome ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
        const defStarters = isHome ? this.liveMatch.awayStarters : this.liveMatch.homeStarters;

        // 1. RÉPARTITION DES BUTEURS (Plus de chances pour les défenseurs sur corner)
        let shooterPool = [];
        attStarters.forEach(p => {
            if (p.position === 'ATT') shooterPool.push(p, p, p, p, p); // 5 tickets
            else if (p.position === 'MIL') shooterPool.push(p, p); // 2 tickets
            else if (p.position === 'DEF') shooterPool.push(p, p); // 2 tickets pour les défenseurs !
        });
        
        let striker = shooterPool[Math.floor(Math.random() * shooterPool.length)] || attStarters[0];

        // --- COUPS DE PIED ARRÊTÉS : le spécialiste prend le ballon --------
        // Pour le club de l'utilisateur, c'est le tireur désigné dans l'onglet
        // Tactique. Pour l'IA, c'est le meilleur homme du onze sur ce geste :
        // les deux camps jouent donc avec la même règle.
        const attIsUser = isHome ? this.liveMatch.home.isUser : this.liveMatch.away.isUser;
        const bestOf = (kind) => {
            const pool = attStarters.filter(p => this.eligibleForSetPiece(p, kind));
            if (!pool.length) return null;
            return pool.slice().sort((a, b) => this.setPieceScore(b, kind) - this.setPieceScore(a, kind))[0];
        };
        const takerFor = (kind) => attIsUser ? this.getSetPieceTaker(kind, attStarters) : bestOf(kind);

        // Le corner ne change pas le buteur (c'est une tête au second poteau),
        // mais il change le passeur décisif : c'est le tireur qui centre.
        let cornerTaker = null;
        if (isPenalty) {
            const t = takerFor('penalty');
            if (t) striker = t;
        } else if (setPiece === 'freekick') {
            const t = takerFor('freekick');
            if (t) striker = t;
        } else if (setPiece === 'corner') {
            cornerTaker = takerFor('corner');
        }

        let defenders = defStarters.filter(p => p.position === 'DEF' || p.position === 'MIL');
        let defender = defenders.length > 0 ? defenders[Math.floor(Math.random() * defenders.length)] : null;
        let gk = defStarters.find(p => p.position === 'GB') || defStarters[0];

        if (!striker) return;
        if (!gk) return; // FIX #22a : plus aucun défenseur sur le terrain (cas extrême, cartons + blessures) — pas de tir possible

        // LOT 15 : on anime la frappe APRÈS avoir désigné le tireur, pour que
        // la silhouette qui frappe à l'écran soit bien celle qui marque, et que
        // le xG soit calculé sur sa position réelle sur la pelouse.
        const shooterIdx = attStarters.indexOf(striker);
        this.animatePitch(isHome ? 'home_shot' : 'away_shot', { shooterIdx });
        const shot = (!isPenalty && MATCHSIM.active) ? MATCHSIM.lastShot : null;

        const userIsAttacking = (isHome && this.liveMatch.home.isUser) || (!isHome && this.liveMatch.away.isUser);
        const userIsDefending = (isHome && this.liveMatch.away.isUser) || (!isHome && this.liveMatch.home.isUser);

        // ==========================================
        // 🚀 MOTEUR xG RÉVISÉ 🚀
        // ==========================================
        // La part « situation » ne se tire plus au hasard : elle vient de la
        // distance et de l'angle du tir tel qu'il est joué à l'écran. Le
        // coefficient est AUTO-CALIBRÉ (voir xgCoefficient) : la géométrie
        // décide de la hiérarchie des occasions, jamais du nombre de buts.
        let baseXG = isPenalty ? 0.78
            : shot ? this.clampNum(0.02 + shot.quality * this.xgCoefficient() + Math.random() * 0.10, 0.02, 0.72)
                : (0.02 + (Math.random() * 0.40));
        if (shot) this.noteShotQuality(shot.quality); 
        
        // Un coup franc direct part de loin : la qualité du tireur fait tout.
        if (setPiece === 'freekick' && !isPenalty) {
            baseXG = this.clampNum(0.05 + (this.setPieceScore(striker, 'freekick') / 100) * 0.15, 0.05, 0.24);
        }
        if (userIsAttacking && this.userTactics.mentality === 'offensive' && !isPenalty) baseXG += 0.03;
        if (userIsDefending && this.userTactics.mentality === 'defensive' && !isPenalty) baseXG -= 0.03;

        // Le prix de la hauteur du bloc. Une ligne haute étouffe l'adversaire
        // loin de votre but — mais le moindre ballon dans le dos devient une
        // occasion franche. Une ligne basse fait l'inverse : on subit
        // davantage, mais on subit de loin.
        if (userIsDefending && !isPenalty) {
            const ln = this.userTactics.line;
            if (ln === 'high') baseXG += 0.05;
            else if (ln === 'low') baseXG -= 0.035;
            // Et un pressing tout terrain finit par craquer physiquement.
            if (this.userTactics.pressing === 'all' && this.liveMatch.minute > 60) baseXG += 0.03;
        }

        let strikerStat = (this.calculateEffectiveStat(striker, 'finishing') || striker.ovr || 60) * 0.7 
                        + (this.calculateEffectiveStat(striker, 'composure') || striker.ovr || 60) * 0.3;
        
        let gkStat = this.calculateEffectiveStat(gk, 'positioning') || gk.ovr || 60;
        let defStat = defender ? (this.calculateEffectiveStat(defender, 'tackling') || defender.ovr || 60) : gkStat; 
        let defenseStat = (gkStat * 0.8) + (defStat * 0.2);

        let statDifference = strikerStat - defenseStat;
        let finalXG = baseXG + (statDifference * 0.004); 

        finalXG = Math.max(0.01, Math.min(0.85, finalXG));
        let displayXG = finalXG.toFixed(2);

        // LE LANCER DE DÉ
        let isGoal = Math.random() < finalXG;

        if (isGoal) {
            if (isHome) this.liveMatch.homeScore++; else this.liveMatch.awayScore++;
            document.getElementById('live-score').innerText = `${this.liveMatch.homeScore} - ${this.liveMatch.awayScore}`;
            striker.goals = (striker.goals || 0) + 1;
            if (this.liveMatch.isCAF) striker.cafGoals = (striker.cafGoals || 0) + 1; // FIX #61 : compté à part pour ne pas polluer le classement des buteurs du championnat

            // RÉPARTITION DES PASSEURS DÉCISIFS (Les latéraux participent beaucoup !)
            let passersPool = [];
            attStarters.forEach(p => {
                if (p.id !== striker.id) {
                    if (p.position === 'MIL') passersPool.push(p, p, p, p); // 4 tickets
                    else if (p.position === 'ATT') passersPool.push(p, p, p); // 3 tickets
                    else if (p.position === 'DEF') passersPool.push(p, p, p); // 3 tickets pour les défenseurs !
                }
            });

            if (passersPool.length > 0 && Math.random() < 0.72 && !isPenalty) {
                let assister = passersPool[Math.floor(Math.random() * passersPool.length)];
                // Sur corner, c'est presque toujours le tireur désigné qui centre
                if (cornerTaker && cornerTaker.id !== striker.id && Math.random() < 0.80) assister = cornerTaker;
                assister.assists = (assister.assists || 0) + 1;
                if (this.liveMatch.isCAF) assister.cafAssists = (assister.cafAssists || 0) + 1; // FIX #61
                
                const assistComments = [
                    `⚽ BUT ! ${assister.name} sert ${striker.name} qui conclut en beauté ! (xG: ${displayXG})`,
                    `⚽ BUT ! Quelle passe de ${assister.name} ! ${striker.name} ne pouvait pas rater ! (xG: ${displayXG})`,
                    `⚽ BUT ! Superbe centre de ${assister.name} pour ${striker.name} ! (xG: ${displayXG})`
                ];
                this.logCommentary(assistComments[Math.floor(Math.random() * assistComments.length)], "text-emerald-400 font-bold text-base");
            } else if (isPenalty) {
                this.logCommentary(`⚽ BUT SUR PENALTY ! ${striker.name} transforme avec sang-froid ! (xG: ${displayXG})`, "text-emerald-400 font-bold text-base");
            } else {
                let goalTxt = setPiece === 'freekick' ?
                    `⚽ COUP FRANC DIRECT ! ${striker.name} enroule par-dessus le mur !` :
                    finalXG < 0.15 ?
                    `⚽ BUT EXCEPTIONNEL ! Frappe de ${striker.name}${shot ? ` à ${shot.dist} mètres` : ''} !` :
                    `⚽ BUT ! ${striker.name} place parfaitement son tir${shot && shot.dist < 12 ? ' à bout portant' : ''} !`;
                    
                this.logCommentary(`${goalTxt} (xG: ${displayXG})`, "text-emerald-400 font-bold text-base");
            }
            setTimeout(() => this.animatePitch('center'), Math.round(MATCHSIM.TICK * 0.85));
        } else {
            let missComments = [];
            if (finalXG > 0.45) { 
                missComments = [
                    `😱 INCROYABLE RATÉ ! ${striker.name} était seul face au but ! (xG: ${displayXG})`,
                    `🧤 ARRÊT MIRACULEUX ! Le gardien sauve son équipe face à ${striker.name} ! (xG: ${displayXG})`
                ];
            } else if (finalXG < 0.10) { 
                missComments = [
                    `❌ Frappe lointaine de ${striker.name} qui passe loin du cadre. (xG: ${displayXG})`,
                    `🧤 Tir dans un angle fermé de ${striker.name}, capté tranquillement par le gardien. (xG: ${displayXG})`
                ];
            } else { 
                missComments = [
                    `🧤 Bel arrêt du gardien sur cette frappe de ${striker.name}. (xG: ${displayXG})`,
                    `❌ ${striker.name} dévisse légèrement son tir. (xG: ${displayXG})`,
                    `🛡️ La défense se jette et contre la frappe de ${striker.name} ! (xG: ${displayXG})`
                ];
            }
            
            this.logCommentary(missComments[Math.floor(Math.random() * missComments.length)], "text-slate-400");
            setTimeout(() => this.animatePitch('midfield'), Math.round(MATCHSIM.TICK * 0.85));
        }
    }

    // FIX #99 : la règle IFAB accorde un remplacement supplémentaire en prolongation.
    subsAllowed() {
        return this.liveMatch && this.liveMatch.phase === 'extratime' ? 6 : 5;
    }

    handleAICoaching() {
        let isHomeUser = this.liveMatch.home.isUser;
        let aiStarters = isHomeUser ? this.liveMatch.awayStarters : this.liveMatch.homeStarters;
        let aiBench = isHomeUser ? this.liveMatch.awayBench : this.liveMatch.homeBench;
        let aiSubs = isHomeUser ? this.liveMatch.subsMade.away : this.liveMatch.subsMade.home;

        if (aiSubs < this.subsAllowed() && aiBench.length > 0) { // FIX #99
            let tired = [...aiStarters].sort((a, b) => a.energy - b.energy)[0];
            if (tired && tired.energy < 65) {
                let pIn = aiBench.find(p => p.position === tired.position) || aiBench[0];
                let idx = aiStarters.findIndex(p => p.id === tired.id);
                aiStarters.splice(idx, 1, pIn);
                aiBench.splice(aiBench.indexOf(pIn), 1);
                if (isHomeUser) this.liveMatch.subsMade.away++; else this.liveMatch.subsMade.home++;
                this.logCommentary(`🔄 Changement tactique pour l'adversaire.`, "text-blue-400 text-[10px] mt-1");
            }
        }
    }
    

    // Affiche le menu des remplacements et met le match en PAUSE
    showSubstitutions() {
        if (!this.liveMatch || this.liveMatch.minute >= this.liveMatch.maxMinute) return; // FIX #89
        
        const isHome = this.liveMatch.home.isUser;
        const starters = isHome ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
        const bench = isHome ? this.liveMatch.homeBench : this.liveMatch.awayBench;
        const subsMade = isHome ? this.liveMatch.subsMade.home : this.liveMatch.subsMade.away;

        if (subsMade >= this.subsAllowed()) { // FIX #99
            this.showNotification(`Vous avez déjà effectué vos ${this.subsAllowed()} changements autorisés !`, "error"); // FIX #97 / #99
            return;
        }

        // METTRE LE MATCH EN PAUSE
        clearInterval(this.liveMatch.interval);
        document.getElementById('live-time').classList.remove('animate-pulse');

        // Création de l'interface (Modale)
        let html = `
        <div id="sub-modal" class="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-ui-800 border border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl">
                <div class="flex justify-between items-center mb-5 border-b border-white/10 pb-3">
                    <h3 class="text-white font-teko text-3xl leading-none">🔄 Remplacements</h3>
                    <span class="bg-brand-500/20 text-brand-400 px-2 py-1 rounded text-xs font-bold">${this.subsAllowed() - subsMade} restants</span>
                </div>

                <div class="mb-4">
                    <label class="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2 block">1. Joueur à sortir (Terrain)</label>
                    <select id="sub-out" class="w-full bg-ui-900 text-white p-3 rounded-lg border border-white/10 outline-none focus:border-brand-500">
                        ${starters.map(p => `<option value="${p.id}">[${p.position}] ${p.name} - Énergie: ${Math.round(p.energy)}%</option>`).join('')}
                    </select>
                </div>

                <div class="mb-6">
                    <label class="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2 block">2. Joueur à faire entrer (Banc)</label>
                    <select id="sub-in" class="w-full bg-ui-900 text-white p-3 rounded-lg border border-white/10 outline-none focus:border-brand-500">
                        ${bench.length > 0 
                            ? bench.map(p => `<option value="${p.id}">[${p.position}] ${p.name} - OVR: ${p.ovr}</option>`).join('')
                            : `<option disabled>Banc vide</option>`}
                    </select>
                </div>

                <div class="flex gap-3">
                    <button onclick="app.cancelSub()" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold text-sm transition-colors">Annuler (Reprendre)</button>
                    ${bench.length > 0 ? `<button onclick="app.confirmSub()" class="flex-1 btn-primary py-3 rounded-lg font-bold text-sm">Valider</button>` : ''}
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // Annuler le changement et relancer le chrono
    cancelSub() {
        const modal = document.getElementById('sub-modal');
        if(modal) modal.remove();
        
        // REPRENDRE LE MATCH
        if(this.liveMatch && this.liveMatch.minute < this.liveMatch.maxMinute) { // FIX #89
            document.getElementById('live-time').classList.add('animate-pulse');
            // Remets bien la même vitesse que celle que tu as réglée (ex: 800ms)
            this.liveMatch.interval = setInterval(() => this.tickLiveMatch(), 800); 
        }
    }

    // Appliquer le changement
    confirmSub() {
        const outId = document.getElementById('sub-out').value;
        const inId = document.getElementById('sub-in').value;

        const isHome = this.liveMatch.home.isUser;
        let starters = isHome ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
        let bench = isHome ? this.liveMatch.homeBench : this.liveMatch.awayBench;

        let outIdx = starters.findIndex(p => p.id === outId);
        let inIdx = bench.findIndex(p => p.id === inId);

        if (outIdx > -1 && inIdx > -1) {
            let pOut = starters[outIdx];
            let pIn = bench[inIdx];

            // Échange des joueurs
            starters.splice(outIdx, 1, pIn);
            bench.splice(inIdx, 1); // Le joueur quitte le banc, il ne peut plus rentrer
            pIn.matchEntryMinute = this.liveMatch.minute; // Minute d'entrée du remplaçant

            // Incrémentation du compteur
            if (isHome) this.liveMatch.subsMade.home++;
            else this.liveMatch.subsMade.away++;

            // Commentaire du match
            this.logCommentary(`🔄 CHANGEMENT TACTIQUE : ${pIn.name} entre à la place de ${pOut.name}.`, "text-blue-400 font-bold border-blue-500/20 text-sm mt-2 mb-2");
        }

        this.retuneMatchSim(); // LOT 15 : le nom au-dessus du maillot suit le changement

        // On ferme la fenêtre, ce qui relance le match automatiquement
        this.cancelSub(); 
    }

    logCommentary(text, cssClasses) {
        const div = document.createElement('div');
        div.className = `pb-2 border-b border-white/5 ${cssClasses} animate-[fadeIn_0.3s_ease-out]`;
        div.innerHTML = `<span class="font-bold opacity-50 w-8 inline-block">${this.matchClock()}</span> ${text}`; // FIX #89
        const container = document.getElementById('live-commentary');
        container.prepend(div);
        // FIX #30 : on purge les commentaires trop anciens pour éviter l'accumulation de nœuds DOM
        while (container.children.length > 60) {
            container.removeChild(container.lastChild);
        }
    }

    toggleLiveTacticsModal() {
        const modal = document.getElementById('live-tactics-modal');
        if(modal.classList.contains('hidden')) {
            document.getElementById('live-formation').value = this.userTactics.formation;
            document.getElementById('live-mentality').value = this.userTactics.mentality;
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }

    applyLiveTactics() {
        this.userTactics.formation = document.getElementById('live-formation').value;
        this.userTactics.mentality = document.getElementById('live-mentality').value;
        document.getElementById('tactic-formation').value = this.userTactics.formation;
        document.getElementById('tactic-mentality').value = this.userTactics.mentality;
        
        this.renderTacticsPitch();
        this.logCommentary("Changement tactique effectué par l'entraineur.", "text-brand-400 font-bold italic");
        this.toggleLiveTacticsModal();
        if (this.liveMatch) this.retuneMatchSim(); // LOT 15 : nouvelle formation appliquée sans arrêter le jeu 
    }

    finishLiveMatch() {
        this._matchOver = true; // LOT 15 : plus aucun ordre de scène accepté
        this.stopPitchLoop(); // LOT 15
        // FIX #6b : on ne décrémente que les blessures/suspensions déjà actives AVANT ce match
        // (preMatchStatusIds) — une sanction infligée PENDANT ce match reste donc pleine pour
        // le prochain, au lieu d'être purgée instantanément.
        const preStatusIds = this.liveMatch?.preMatchStatusIds || new Set();
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                team.squad.forEach(p => {
                    if (!preStatusIds.has(p.id)) return;
                    if (p.injuryDays > 0) p.injuryDays--;
                    if (p.suspensionDays > 0) p.suspensionDays--;
                });
            });
        });

        // 2. Assigner les résultats du joueur
        let userFixture = this.fixtures.find(f => f.matchday === this.matchday && !f.played && f.home.name === this.liveMatch.home.name);
        
        // --- CORRECTION INTÉGRÉE ICI POUR LES PHASES FINALES DU JOUEUR ---
        if (userFixture && userFixture.type && userFixture.type.startsWith('CAF')) {
            if (userFixture.type === 'CAF_GROUP') {
                this.processCAFGroupStats(this.liveMatch.home, this.liveMatch.away, this.liveMatch.homeScore, this.liveMatch.awayScore, userFixture.groupId);
            } else if (userFixture.type === 'CAF_QUARTER') {
                this.processCAFKnockoutStats(this.liveMatch.home, this.liveMatch.away, this.liveMatch.homeScore, this.liveMatch.awayScore, 'CAF_QUARTER', userFixture.quarterIndex);
            } else if (userFixture.type === 'CAF_SEMI') {
                this.processCAFKnockoutStats(this.liveMatch.home, this.liveMatch.away, this.liveMatch.homeScore, this.liveMatch.awayScore, 'CAF_SEMI', userFixture.semiIndex);
            } else if (userFixture.type === 'CAF_FINAL') {
                this.processCAFKnockoutStats(this.liveMatch.home, this.liveMatch.away, this.liveMatch.homeScore, this.liveMatch.awayScore, 'CAF_FINAL', 0);
            }
        } else {
            this.processMatchStats(this.liveMatch.home, this.liveMatch.away, this.liveMatch.homeScore, this.liveMatch.awayScore);
        }
        
        // assignMatchEvents sert uniquement aux stats IA (classement buteurs)
        // Pour le match du joueur, les buts sont déjà attribués en live (executeShot) pour LES DEUX équipes.
        // FIX #5 : on ne réattribue plus les buts adverses ici — ça les comptait une 2e fois.
        
        // --- NOUVEAU SYSTÈME ÉCONOMIQUE (Modèle FM) ---
        let userTeam = this.liveMatch.home.isUser ? this.liveMatch.home : (this.liveMatch.away.isUser ? this.liveMatch.away : null);
        
        if (userTeam) {
            let clubOvr = userTeam.force || 65; 
            let isHome = this.liveMatch.home.isUser;
            let userWon = (isHome && this.liveMatch.homeScore > this.liveMatch.awayScore) || (!isHome && this.liveMatch.awayScore > this.liveMatch.homeScore);
            let userDraw = this.liveMatch.homeScore === this.liveMatch.awayScore;

            let matchIncome = 0;
            let tvRights = 80000; // FIX #40 : droits TV revus à la baisse (était 250K€ fixe, trop généreux pour une ligue domestique africaine)
            matchIncome += tvRights;

            // FIX #40 : Billetterie recalibrée sur une base réaliste (affluence × prix moyen du billet ~7€,
            // cohérent avec les tarifs observés en Afrique : 5-20$/billet en championnat domestique)
            let ticketing = 0;
            if (isHome) {
                const attendance = Math.min(25000, 2000 + Math.max(0, clubOvr - 40) * 150);
                ticketing = Math.round(attendance * 7);
                matchIncome += ticketing;
            }

            // Primes de match (revues à la baisse en cohérence avec la billetterie)
            let performanceBonus = 0;
            if (userWon) performanceBonus = 150000;
            else if (userDraw) performanceBonus = 50000;
            
            matchIncome += performanceBonus;
            this.budget += matchIncome;
            this.monthlyRevenue += matchIncome;

            // Réputation : évolue selon les résultats
            if (userWon) this.reputation = Math.min(100, this.reputation + 1);
            else if (!userDraw) this.reputation = Math.max(0, this.reputation - 1);

            console.log(`Revenus du match : Droits TV (${formatMoney(tvRights)}) + Billetterie (${formatMoney(ticketing)}) + Performance (${formatMoney(performanceBonus)}) = ${formatMoney(matchIncome)}`);
        }

        // 3. Simuler les autres matchs — modèle Poisson pondéré par la force
        // Réalisme : moyenne ~2.5 buts/match, avantage domicile +0.3 but, force impacte le λ
        this.liveMatch.otherMatches.forEach(match => {
            const poissonRand = (lambda) => {
                let L = Math.exp(-lambda), k = 0, p = 1;
                do { k++; p *= Math.random(); } while (p > L);
                return k - 1;
            };
            let hForce = match.home.force || 65;
            let aForce = match.away.force || 65;
            // λ de base : 1.4 buts/équipe/match (moyenne Ligue 1 / championnats africains)
            // Avantage domicile : +0.25 λ pour l'équipe à domicile
            // Écart de force : chaque point d'OVR vaut 0.015 λ
            let forceDiff = (hForce - aForce) * 0.015;
            let hLambda = Math.max(0.3, 1.25 + 0.15 + forceDiff);
            let aLambda = Math.max(0.3, 1.25 - 0.15 - forceDiff);
            // Plafonner à 5 buts max par équipe (éviter les 8-0 aberrants)
            let hG = Math.min(4, poissonRand(hLambda));
            let aG = Math.min(4, poissonRand(aLambda));

            // --- CORRECTION INTÉGRÉE ICI POUR LES PHASES FINALES IA ---
            if (match.type && match.type.startsWith('CAF')) {
                if (match.type === 'CAF_GROUP') {
                    this.processCAFGroupStats(match.home, match.away, hG, aG, match.groupId);
                } else if (match.type === 'CAF_QUARTER') {
                    this.processCAFKnockoutStats(match.home, match.away, hG, aG, 'CAF_QUARTER', match.quarterIndex);
                } else if (match.type === 'CAF_SEMI') {
                    this.processCAFKnockoutStats(match.home, match.away, hG, aG, 'CAF_SEMI', match.semiIndex);
                } else if (match.type === 'CAF_FINAL') {
                    this.processCAFKnockoutStats(match.home, match.away, hG, aG, 'CAF_FINAL', 0);
                }
            } else {
                // Pour les matchs de championnat classiques
                this.processMatchStats(match.home, match.away, hG, aG);
            }
            
            const matchIsCAF = !!(match.type && match.type.startsWith('CAF')); // FIX #61d
            this.assignMatchEvents(match.home, hG, matchIsCAF);
            this.assignMatchEvents(match.away, aG, matchIsCAF);
            this.assignDisciplineEvents(match.home);
            this.assignDisciplineEvents(match.away);
        });

        // --- DÉDUCTION AUTOMATIQUE DES SALAIRES ---
        const totalWages = this.userSquad.reduce((s, p) => s + (p.wage || 0), 0);
        const staffCost = this.userStaff.reduce((s, id) => {
            const t = STAFF_TYPES.find(x => x.id === id);
            return s + (t ? t.salary : 0);
        }, 0);
        const academyCost = (this.academy || []).reduce((s, p) => s + (p.wage || 500), 0); // FIX #48
        const loanCost = (this.loansOut || []).reduce((s, l) => s + (l.wageKept || 0), 0); // LOT 8
        const matchdayWageCost = Math.round((totalWages + staffCost + academyCost + loanCost) / 4);
        this.budget -= matchdayWageCost;
        this.monthlyExpenses += matchdayWageCost;

        // Alerte si budget dans le rouge
        if (this.budget < 0) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'warning', read: false,
                text: `🚨 Budget négatif ! La masse salariale (${formatMoney(matchdayWageCost)}/match) dépasse vos revenus. Vendez des joueurs ou réduisez le staff.`
            });
        } else if (this.budget < matchdayWageCost * 4) {
            this.showNotification(`⚠️ Attention : budget faible (${formatMoney(this.budget)} restant, masse sal. ${formatMoney(matchdayWageCost)}/match).`, 'warning');
        }

        // --- 4. GESTION D'ÉNERGIE, MORAL et Force globale ---
        // Vérifier si le joueur a gagné pour le moral
        let wonMatch = (this.liveMatch.home.isUser && this.liveMatch.homeScore > this.liveMatch.awayScore) || 
                       (this.liveMatch.away.isUser && this.liveMatch.awayScore > this.liveMatch.homeScore);

        this.userSquad.forEach((p, index) => {
            if (p.morale === undefined) p.morale = 80; // Sécurité pour les anciennes sauvegardes
            const physioBonus = (this.userStaff && this.userStaff.includes('physio')) ? 1.10 : 1; // FIX #37b
            if (index < 11) { // Titulaires
                p.energy = Math.max(30, p.energy - Math.round((Math.floor(Math.random() * 11) + 10) / physioBonus));
                // Gain de moral si victoire, perte si défaite/nul
                if (wonMatch) p.morale = Math.min(100, p.morale + 5);
                else p.morale = Math.max(0, p.morale - 5);
            } else { // Remplaçants
                p.energy = Math.min(100, p.energy + Math.round((Math.floor(Math.random() * 11) + 15) * physioBonus));
                // Baisse de moral s'il ne joue pas alors qu'il est en forme
                if (p.energy >= 90) p.morale = Math.max(0, p.morale - 2); 
            }
        });

        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                team.force = Math.round(team.squad.slice(0, 11).reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0) / 11);
            });
            league.standings.sort((a,b) => (b.points - a.points) || ((b.gf-b.ga) - (a.gf-a.ga)) || (b.gf - a.gf));
        });
        this.updateUserClubForce();
        this.refreshCAFForces(); // FIX #91 : la force des clubs CAF suit désormais leur effectif réel

        // FIX #8 : "GESTION FINANCIÈRE" mensuelle — les salaires sont DÉJÀ prélevés à chaque
        // journée juste au-dessus (matchdayWageCost = mensuel/4). Ce bloc ne fait plus qu'un
        // récapitulatif visuel tous les 4 matchs, sans re-déduire le budget une 2e fois.
        if (this.matchday > 0 && this.matchday % 4 === 0) {
            let totalWages = this.userSquad.reduce((sum, p) => sum + (p.wage || Math.floor(p.price / 200)), 0);
            let staffWages = this.userStaff.reduce((sum, id) => {
                const type = STAFF_TYPES.find(t => t.id === id);
                return sum + (type ? type.salary : 0);
            }, 0);
            let totalMonth = totalWages + staffWages;
            const monthlyExpensesSnapshot = this.monthlyExpenses;
            this.monthlyExpenses = 0; // repart à 0 pour le mois suivant (affichage dashboard)
            this.speechUsedThisMonth = false; // FIX #9a : le discours motivant redevient utilisable chaque mois

            if (this.budget < 0) {
                this.userSquad.forEach(p => p.morale = Math.max(0, p.morale - 20));
                setTimeout(() => this.showAlert(`🚨 ALERTE FINANCIÈRE\n\nClub dans le rouge de ${formatMoney(Math.abs(this.budget))} !\nMasse salariale mensuelle : ${formatMoney(totalMonth)} (déjà prélevée par journée)\nVendez des joueurs !`), 1500); // FIX #97
            } else {
                setTimeout(() => this.showAlert(`💰 Fin du mois\n\nSalaires joueurs : ${formatMoney(totalWages)}\nSalaires staff : ${formatMoney(staffWages)}\nTotal prélevé ce mois : ${formatMoney(monthlyExpensesSnapshot)}`), 1500); // FIX #97
            }
        }

        // Marquer TOUS les fixtures de la journée qui vient d'être jouée comme played
        this.fixtures.filter(f => f.matchday === this.matchday).forEach(f => f.played = true);

        this.matchday++;

        // --- GESTION DES CONTRATS ---
        this.processAIContracts(); // FIX #106
        const MIN_SQUAD_SIZE = 16; // FIX #2c : effectif plancher pour rester jouable (11 titulaires + marge blessures/suspensions)
        const expiredPlayers = [];
        this.userSquad.forEach(p => {
            if (!p.contract) p.contract = { duration: 2, expiresIn: 20 };
            p.contract.expiresIn--;
            if (p.contract.expiresIn === 10) {
                this.messages.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'contract_alert',
                    playerId: p.id,
                    playerName: p.name,
                    read: false,
                    text: `📋 ${p.name} (OVR ${p.ovr}) arrive en fin de contrat dans 10 journées. Prolongez-le ou il partira libre !`
                });
            }
            if (p.contract.expiresIn <= 0) expiredPlayers.push(p.id);
        });
        expiredPlayers.forEach(pid => {
            // FIX #82 : on utilise splice() sur le tableau existant au lieu de réaffecter this.userSquad,
            // pour ne jamais casser la référence partagée avec myClub.squad
            const idx = this.userSquad.findIndex(pl => pl.id === pid);
            if (idx === -1) return;

            // FIX #2c : filet de sécurité — on ne laisse jamais l'effectif descendre sous le seuil jouable
            if (this.userSquad.length <= MIN_SQUAD_SIZE) {
                const p = this.userSquad[idx];
                p.contract = { duration: 1, expiresIn: 38 }; // prolongation d'urgence automatique
                this.messages.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'info', read: false,
                    text: `⚠️ Effectif trop juste : ${p.name} a été prolongé d'office pour 1 saison (club en dessous du seuil minimum de ${MIN_SQUAD_SIZE} joueurs).`
                });
                return;
            }

            const p = this.userSquad[idx];
            this.userSquad.splice(idx, 1);
            if (!this.freeAgentPool) this.freeAgentPool = [];
            p.contract = null;
            this.freeAgentPool.unshift(p);
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'info', read: false,
                text: `🚪 ${p.name} a quitté le club — contrat expiré (départ libre).`
            });
        });

        // FIX #2c (suite) : recrutement d'urgence si l'effectif est quand même passé sous le seuil
        // (ex: ventes cumulées, blessures longues) — on complète automatiquement jusqu'au seuil minimum
        if (this.userSquad.length < MIN_SQUAD_SIZE) {
            const region = this.globalData[this.userLeagueId]?.region || 'francophone';
            const posNeeded = ['GB', 'DEF', 'DEF', 'MIL', 'MIL', 'ATT'];
            let added = 0;
            while (this.userSquad.length < MIN_SQUAD_SIZE) {
                const pos = posNeeded[added % posNeeded.length];
                const baseOvr = Math.max(55, (this.getMyClub().force || 65) - 8);
                const recruit = Generator.randomPlayer(pos, region, baseOvr, baseOvr + 8);
                this.userSquad.push(recruit);
                added++;
            }
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'info', read: false,
                text: `🆘 Effectif sous le seuil critique : la direction a recruté ${added} joueur(s) d'urgence pour compléter le groupe.`
            });
        }

        // --- MORAL VESTIAIRE : messages contextuels ---
        const myClub = this.getMyClub();
        const recentForm = myClub.form.slice(0, 3);
        const losses = recentForm.filter(f => f === 'L').length;
        const avgMorale = this.userSquad.length > 0
            ? Math.round(this.userSquad.reduce((s, p) => s + (p.morale ?? 80), 0) / this.userSquad.length) // FIX #73
            : 80;
        if (losses >= 3 && Math.random() < 0.5) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'morale', read: false,
                text: `😤 3 défaites consécutives — les joueurs doutent (moral moyen: ${avgMorale}%). Faites un discours motivant !`
            });
        }
        const unhappyPlayer = this.userSquad.find(p => (p.morale ?? 80) < 25); // FIX #73
        if (unhappyPlayer && Math.random() < 0.4) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'morale', read: false,
                text: `😞 ${unhappyPlayer.name} est très mécontent (moral: ${unhappyPlayer.morale}%). Il pourrait demander un transfert !`
            });
        }
        const benchWarmer = this.userSquad.slice(11).find(p => (p.energy ?? 100) >= 90 && (p.morale ?? 80) < 50); // FIX #73
        if (benchWarmer && Math.random() < 0.3) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'morale', read: false,
                text: `🪑 ${benchWarmer.name} ronge son frein sur le banc. Il veut jouer davantage.`
            });
        }

        this.generateIncomingOffers();
        this.generateIncomingLoanRequests(); // LOT 11

        // --- AUTO-TRANSITION CAF ---
        if (this.cafData) {
            const groupLeft   = this.fixtures.filter(f => f.type === 'CAF_GROUP'   && !f.played).length;
            const quarterLeft = this.fixtures.filter(f => f.type === 'CAF_QUARTER' && !f.played).length;
            const semiLeft    = this.fixtures.filter(f => f.type === 'CAF_SEMI'    && !f.played).length;
            const finalLeft   = this.fixtures.filter(f => f.type === 'CAF_FINAL'   && !f.played).length;

            if (this.cafData.phase === 'groupes' && groupLeft === 0)   this.simulateCAFGroupMatches();
            else if (this.cafData.phase === 'quarts' && quarterLeft === 0) this.simulateCAFSemiFinals();
            else if (this.cafData.phase === 'semis'  && semiLeft === 0)    this.simulateCAFFinal();
            else if (this.cafData.phase === 'finale' && finalLeft === 0)   this.simulateCAFWinner();
        }

        // --- NOTES YAO BABA SPORT ---
        const isUserHome = this.liveMatch.home.isUser;
        const userStarters = isUserHome ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
        const preStats = this.liveMatch.preMatchStats || {};
        const userScore  = isUserHome ? this.liveMatch.homeScore : this.liveMatch.awayScore;
        const oppScore   = isUserHome ? this.liveMatch.awayScore : this.liveMatch.homeScore;
        const cleanSheet = oppScore === 0;
        const matchRatings = [];

        userStarters.forEach(p => {
            const pre = preStats[p.name] || { goals: 0, assists: 0 };
            const matchGoals   = Math.max(0, (p.goals || 0) - pre.goals);
            const matchAssists = Math.max(0, (p.assists || 0) - pre.assists);
            const pos = p.position || 'MIL';
            const minutesPlayed = 90 - (p.matchEntryMinute || 0);

            // --- BASE OVR (centre autour de 6.0 pour OVR 75) ---
            let note = 5.5 + ((p.ovr || 70) - 75) * 0.035;

            // --- BUTS (pondérés par poste) ---
            const goalBonus = pos === 'G' ? 1.5 : pos === 'DEF' ? 1.8 : pos === 'MIL' ? 1.5 : 1.3;
            note += matchGoals * goalBonus;

            // --- PASSES DÉCISIVES ---
            const assistBonus = pos === 'DEF' ? 1.0 : pos === 'MIL' ? 0.9 : 0.7;
            note += matchAssists * assistBonus;

            // --- RÉSULTAT DU MATCH ---
            if (userScore > oppScore) note += 0.4;
            else if (userScore < oppScore) note -= 0.5;

            // --- CLEAN SHEET (gardien & défenseurs) ---
            if (cleanSheet) {
                if (pos === 'G')   note += 1.0;
                if (pos === 'DEF') note += 0.5;
            }

            // --- MALUS BUTS ENCAISSÉS (gardien & défenseurs) ---
            if (pos === 'G')   note -= oppScore * 0.6;
            if (pos === 'DEF') note -= oppScore * 0.25;

            // --- ÉNERGIE FINALE ---
            const energy = p.energy ?? 100; // FIX #73
            if (energy > 80) note += 0.3;
            else if (energy < 35) note -= 0.4;

            // --- REMPLAÇANT (minutes limitées) ---
            if (p.matchEntryMinute && minutesPlayed < 45) note -= 0.3;

            // --- ALÉATOIRE (réduit pour plus de cohérence) ---
            note += (Math.random() - 0.5) * 0.8;

            note = Math.max(3.0, Math.min(9.5, note));
            note = Math.round(note * 10) / 10;
            p.lastRating = note;
            p.seasonApps = (p.seasonApps || 0) + 1; // LOT 10 : compte aussi pour les empruntés
            matchRatings.push({ name: p.name, position: p.position, note, goals: matchGoals, assists: matchAssists });
        });
        this.lastMatchRatings = matchRatings;

        this.liveMatch = null; 
        
        document.getElementById('main-header').classList.remove('hidden');
        document.getElementById('mobile-nav').classList.remove('hidden');
        document.getElementById('live-time').classList.add('animate-pulse', 'bg-brand-500/10', 'text-brand-500'); 
        
        if(this.matchday > 0 && this.matchday % 3 === 0) {
            // De nouveaux joueurs arrivent sur le marché...
            const randRegion = ['francophone', 'arab', 'anglophone'][Math.floor(Math.random()*3)];
            this.marketPool.push(Generator.randomPlayer('ATT', randRegion, 65, 80));
            this.marketPool.push(Generator.randomPlayer('MIL', randRegion, 65, 80));
            this.marketPool.push(Generator.randomPlayer('DEF', randRegion, 65, 80)); // Un peu de défenseurs aussi

            // ...ET LES CLUBS IA FONT LEUR MARCHÉ !
            this.simulateAITransfers();
            this.simulateAIToAITransfers(); // FIX #110
        }

        this.updateHeader();
        this.refreshAllViews();

        // --- POPUP YAO BABA SPORT ---
        if (this.lastMatchRatings && this.lastMatchRatings.length > 0) {
            const ratingRows = [...this.lastMatchRatings]
                .sort((a, b) => b.note - a.note)
                .map(p => {
                    const noteColor = p.note >= 7.5 ? 'text-emerald-400' : p.note >= 6.0 ? 'text-yellow-400' : 'text-red-400';
                    const goals = p.goals > 0 ? ` ⚽×${p.goals}` : '';
                    const assists = p.assists > 0 ? ` 🅰️×${p.assists}` : '';
                    return `<tr class="border-b border-white/5">
                        <td class="py-1.5 px-2 text-[11px] text-slate-300 font-bold">${p.name}</td>
                        <td class="py-1.5 px-2 text-[10px] text-slate-500 uppercase">${p.position}</td>
                        <td class="py-1.5 px-2 text-[10px] text-slate-400">${goals}${assists}</td>
                        <td class="py-1.5 px-2 text-right font-black text-base font-teko ${noteColor}">${p.note}</td>
                    </tr>`;
                }).join('');

            const modal = document.createElement('div');
            modal.id = 'nci-ratings-modal';
            modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="bg-ui-900 border border-white/10 rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden">
                    <div class="bg-gradient-to-r from-brand-600 to-brand-400 px-4 py-3 flex justify-between items-center">
                        <div>
                            <div class="font-teko text-xl text-white uppercase tracking-wider">📺 Yao Baba Sport</div>
                            <div class="text-[10px] text-white/70">Notes du match</div>
                        </div>
                        <button onclick="document.getElementById('nci-ratings-modal').remove(); app.switchView('dashboard');"
                            class="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                            Fermer
                        </button>
                    </div>
                    <div class="overflow-y-auto max-h-80">
                        <table class="w-full">
                            <thead><tr class="border-b border-white/10">
                                <th class="py-1.5 px-2 text-left text-[9px] text-slate-500 uppercase font-bold">Joueur</th>
                                <th class="py-1.5 px-2 text-left text-[9px] text-slate-500 uppercase font-bold">Poste</th>
                                <th class="py-1.5 px-2 text-[9px] text-slate-500 uppercase font-bold"></th>
                                <th class="py-1.5 px-2 text-right text-[9px] text-slate-500 uppercase font-bold">Note</th>
                            </tr></thead>
                            <tbody>${ratingRows}</tbody>
                        </table>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        } else {
            this.switchView('dashboard');
        }
        
        // ✅ LE NOUVEAU CODE DYNAMIQUE DE FIN DE SAISON EST CONSERVÉ
        // FIX #3 : idem (voir startSimulationSequence) + protection optionnelle (f.home peut être undefined)
        const relevantFixtures = this.fixtures.filter(f =>
            f.home?.isUser || f.away?.isUser ||
            (f.type === 'LEAGUE' && f.leagueId === this.userLeagueId) ||
            (f.type && f.type.startsWith('CAF'))
        );
        const maxMatchday = relevantFixtures.length > 0
            ? Math.max(...relevantFixtures.map(f => f.matchday))
            : Math.max(...this.fixtures.map(f => f.matchday));

        if (this.matchday > maxMatchday) {
            let finalRank = this.globalData[this.userLeagueId].standings.findIndex(c => c.isUser) + 1;
            let prizeMoney = Math.max(300000, 4000000 - ((finalRank - 1) * 200000)); // FIX #40 : prime de championnat revue à la baisse (était jusqu'à 15M€, dépassait presque la prime CAF de 5M€)
            this.budget += prizeMoney;
            // LOT 13 : trophées individuels + primes des sponsors, calculés
            // AVANT toute remise à zéro des statistiques.
            try {
                this.seasonAwards = this.applySeasonAwards(this.computeSeasonAwards());
            } catch (e) { console.error('Trophées : calcul impossible', e); this.seasonAwards = null; }
            this.updateHeader();
            setTimeout(() => app.showEndOfSeasonModal(finalRank, prizeMoney), 500);
        } else {
            // (fixtures déjà marqués joués plus haut)
        }
        this.saveGame();
    }

    showEndOfSeasonModal(finalRank, prizeMoney) {
        // Supprimer un éventuel modal déjà présent
        const existing = document.getElementById('end-season-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'end-season-modal';
        modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-ui-900 border border-white/10 rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden">
                <div class="bg-gradient-to-r from-yellow-600 to-yellow-400 px-4 py-4 text-center">
                    <div class="text-4xl mb-1">🏆</div>
                    <div class="font-teko text-2xl text-white uppercase tracking-wider">Fin de Saison ${this.currentSeason || 1}</div>
                </div>
                <div class="p-5 text-center">
                    <p class="text-slate-300 text-sm mb-1">Votre club termine à la</p>
                    <p class="font-teko text-5xl text-white font-black leading-none mb-1">${finalRank}<span class="text-2xl text-slate-400">e place</span></p>
                    <p class="text-emerald-400 font-bold text-sm mt-3">Prime de championnat : +${formatMoney(prizeMoney)}</p>
                    ${this.seasonAwards ? `<p class="text-yellow-400 font-bold text-xs mt-2">🏅 Gala des trophées : ${this.seasonAwards.paid > 0 ? `+${formatMoney(this.seasonAwards.paid)} de primes` : 'aucun lauréat chez vous'}</p>` : ''}
                </div>
                <div class="px-5 pb-5 flex flex-col gap-3">
                    ${this.seasonAwards ? `<button onclick="app.showAwardsModal()"
                        class="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-400 text-white font-bold rounded-xl text-sm transition-opacity hover:opacity-90">
                        🏅 Voir les trophées de la saison
                    </button>` : ''}
                    <button onclick="document.getElementById('end-season-modal').remove(); app.startNextSeason();"
                        class="w-full py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm transition-colors">
                        ▶ Démarrer la saison suivante
                    </button>
                    <button onclick="document.getElementById('end-season-modal').remove(); app.showSeasonEndStandby();"
                        class="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl text-sm transition-colors">
                        Consulter les stats d'abord
                    </button>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }

    showSeasonEndStandby() {
        // Affiche un bouton flottant persistant pour lancer la saison quand le joueur est prêt
        const existing = document.getElementById('season-standby-btn');
        if (existing) return;

        const btn = document.createElement('button');
        btn.id = 'season-standby-btn';
        btn.className = 'fixed bottom-24 left-1/2 z-[9998] -translate-x-1/2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-5 py-3 rounded-full shadow-2xl text-sm transition-colors flex items-center gap-2';
        btn.innerHTML = `▶ Démarrer la saison suivante`;
        btn.onclick = () => { btn.remove(); app.startNextSeason(); };
        document.body.appendChild(btn);

        this.switchView('standings');
    }

    startNextSeason() {
        // LOT 12 : on fige le palmarès de la saison écoulée avant que quoi que ce
        // soit ne soit remis à zéro (classements, buts, effectifs).
        this.recordSeasonHistory();
        this.seasonAwards = null; // LOT 13 : la course au Ballon d'Or repart de zéro

         this.currentSeason = (this.currentSeason || 1) + 1;

        // LOT 8 : les prêtés rentrent AVANT la boucle de vieillissement, qui remet
        // goals/seasonApps à zéro — sinon on perdrait le bilan de leur saison.
        this.processLoanReturns();
        this.processLoanInReturns(); // LOT 10 : les empruntés repartent chez eux
        // 1. Vieillissement des joueurs (+1 an) + progression/régression OVR
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                team.squad.forEach(p => {
                    
                    // --- PATCH POUR LES ANCIENNES SAUVEGARDES ---
                    if (p.age === undefined || isNaN(p.age)) {
                        p.age = Math.floor(Math.random() * (32 - 17 + 1)) + 17;
                    }

                    p.age += 1;

                    // LOT 12 : cumul carrière AVANT la remise à zéro plus bas.
                    // Format compact [matchs, buts, passes, saisons] : un objet
                    // nommé par joueur ferait exploser la taille de la sauvegarde.
                    const _ap = p.seasonApps || 0, _gl = p.goals || 0, _as = p.assists || 0;
                    if (_ap || _gl || _as) {
                        if (!Array.isArray(p.car)) p.car = [0, 0, 0, 0];
                        p.car[0] += _ap; p.car[1] += _gl; p.car[2] += _as; p.car[3] += 1;
                    }

                    // Progression des jeunes joueurs (< 27 ans)
                    if (p.age < 27 && p.ovr < (p.pot || 85)) {
                        const gain = Math.floor(Math.random() * 2) + 1; // +1 ou +2
                        p.ovr = Math.min((p.pot || 85), p.ovr + gain);
                    }
                    // Légère régression des joueurs âgés (> 32 ans)
                    if (p.age > 32) {
                        const loss = Math.random() < 0.5 ? 1 : 0;
                        p.ovr = Math.max(60, p.ovr - loss);
                    }
                    
                    // --- Gestion de la retraite ---
                    // LOT 12 : courbe croissante (cf. retirementRisk) au lieu d'un
                    // plat 30 % à partir de 35 ans, qui laissait traîner des joueurs
                    // de 40 ans sur le terrain.
                    if (Math.random() < this.retirementRisk(p)) {
                        p.isRetired = true;
                        this.archiveRetiredPlayer(p, team.name, !!team.isUser);
                        if (team.isUser) {
                            this.messages.unshift({
                                id: Math.random().toString(36).substr(2, 9),
                                type: 'news', read: false,
                                text: `👴 Retraite : Votre joueur ${p.name} (${p.age} ans) a pris sa retraite sportive.`
                            });
                        }
                    }

                    // Remettre énergie, blessures et suspensions à zéro
                    p.energy = 100;
                    p.injuryDays = 0;
                    p.suspensionDays = 0;
                    p.yellowCards = 0;
                    p.redCards = 0;
                    p.goals = 0;
                    p.assists = 0;
                    p.seasonApps = 0; // LOT 12
                    p.cafGoals = 0; // FIX #61g
                    p.cafAssists = 0;
                });
                
                // Retirer définitivement les retraités de l'effectif
                // FIX #82 : splice en place (pas de réaffectation) pour préserver la référence
                // partagée entre team.squad et this.userSquad côté club du joueur
                for (let i = team.squad.length - 1; i >= 0; i--) {
                    if (team.squad[i].isRetired) team.squad.splice(i, 1);
                }

                // --- L'IA RECRUTE POUR REMPLACER LES RETRAITES ---
                if (!team.isUser) {
                    while (team.squad.length < 18) {
                        let positions = ['GB', 'DEF', 'DEF', 'MIL', 'MIL', 'ATT'];
                        let pos = positions[Math.floor(Math.random() * positions.length)];
                        
                        let baseOvr = team.force ? team.force - 5 : 65;
                        let minOvr = Math.max(50, baseOvr);
                        let maxOvr = Math.min(90, baseOvr + 10);
                        
                        let region = team.region || 'francophone';
                        let newRecruit = Generator.randomPlayer(pos, region, minOvr, maxOvr);
                        
                        newRecruit.age = 17 + Math.floor(Math.random() * 4); 
                        team.squad.push(newRecruit);
                    }
                }
            });
        });

        // --- Vieillissement et progression des joueurs de l'académie ---
        if (this.academy) {
            const levelBonus = Math.max(0, (this.academyLevel || 1) - 1); // FIX #47 : bonus de progression par niveau d'infrastructure
            this.academy.forEach(p => {
                if (p.age === undefined || isNaN(p.age)) p.age = 15;
                p.age += 1;
                p.energy = 100;
                p.injuryDays = 0;
                p.yellowCards = 0;
                p.redCards = 0;
                
                // Progression plus rapide que les pros
                if (p.age < 19 && p.ovr < (p.pot || 85)) {
                    const gain = Math.floor(Math.random() * 4) + 3 + levelBonus; // +3 à +6, + bonus de niveau
                    p.ovr = Math.min((p.pot || 85), p.ovr + gain);
                } else if (p.age < 22 && p.ovr < (p.pot || 85)) {
                    const gain = Math.floor(Math.random() * 3) + 2 + levelBonus; // +2 à +4, + bonus de niveau
                    p.ovr = Math.min((p.pot || 85), p.ovr + gain);
                }
                
                // Notification si joueur prêt
                if (p.ovr >= 70 && !p.readyNotified) {
                    p.readyNotified = true;
                    this.messages.unshift({
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'academy', read: false,
                        text: `🌟 ${p.name} (Académie, ${p.age} ans) a atteint OVR ${p.ovr} — il est prêt pour l'équipe première !`
                    });
                }
            });

            // FIX #45 : notification avant de libérer les jeunes non signés à 21 ans révolus
            // (avant, ils disparaissaient silencieusement — aucune trace pour le joueur)
            const released = this.academy.filter(p => p.age > 21);
            released.forEach(p => {
                this.messages.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'academy', read: false,
                    text: `📤 ${p.name} (${p.age} ans, OVR ${p.ovr}) quitte l'académie faute d'avoir été signé en pro à temps.`
                });
            });
            // Libérer les jeunes qui ont atteint 21 ans sans être signés en pro
            this.academy = this.academy.filter(p => p.age <= 21);
        }

        // --- Lancement automatique de la CAF Champions League ---
        const userLeagueStandings = this.globalData[this.userLeagueId]?.standings;
        const userRank = userLeagueStandings
            ? [...userLeagueStandings].sort((a, b) => (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga))).findIndex(c => c.isUser)
            : -1;
        const userQualifiedForCAF = userRank !== -1 && userRank < 2;
        this.initCAF(userQualifiedForCAF);

        // 2. Remise à zéro des statistiques
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                team.played = 0; team.won = 0; team.drawn = 0; team.lost = 0;
                team.gf = 0; team.ga = 0; team.points = 0; team.form = [];
            });
        });

        // 3. Remise à zéro de la journée et des fixtures
        this.matchday = 0;
        this.generateFixtures(); 

        // 4. Nouveau marché de transfert frais
        this.generateMarketPool();

        // 5. Nettoyer les anciennes offres et messages
        this.messages = this.messages.filter(m => !m.read);

        // 6. Recalcul des forces
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                if (!team.isUser) {
                    const gks = team.squad.filter(p => p.position === 'GB').sort((a, b) => b.ovr - a.ovr);
                    const outfield = team.squad.filter(p => p.position !== 'GB').sort((a, b) => b.ovr - a.ovr);
                    team.squad = [...gks, ...outfield];
                }
                team.force = Math.round(team.squad.slice(0, 11).reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0) / 11);
            });
        });
        this.updateUserClubForce();

        // 6bis. FIX #101 : recettes de la saison écoulée versées aux clubs IA
        this.creditAIClubBudgets();

        // 6ter. FIX #107 : les agents libres vieillissent aussi, et le vivier est borné
        this.ageFreeAgents();

        // 6quater. FIX #111 : les centres de formation des clubs IA sortent leur promotion
        this.promoteAIAcademyGraduates();

        // 7. 🔥 NOUVELLE PROMOTION À L'ACADÉMIE ! 🔥
        // Arrive en fin de cycle pour s'ajouter aux anciens qui viennent de vieillir
        this.generateAcademyClass();

        // 8. Mise à jour de l'UI
        this.updateHeader();
        this.refreshAllViews();
        this.switchView('dashboard');
        this.saveGame();

        this.showNotification('🌟 Nouvelle saison démarrée ! Bonne chance !');
    }

    assignMatchEvents(team, goalsCount, isCAF = false) {
        if (!team || !team.squad || goalsCount <= 0) return;
        const starters = team.squad.slice(0, 11); 

        for (let i = 0; i < goalsCount; i++) {
            let scorer = this.pickPlayerByProbability(starters, { 'ATT': 55, 'MIL': 30, 'DEF': 13, 'GB': 2 });
            if (scorer) {
                scorer.goals = (scorer.goals || 0) + 1;
                if (isCAF) scorer.cafGoals = (scorer.cafGoals || 0) + 1; // FIX #61
            }

            if (Math.random() < 0.8) {
                let assister = this.pickPlayerByProbability(starters, { 'MIL': 50, 'ATT': 30, 'DEF': 18, 'GB': 2 });
                if (assister && (!scorer || assister.id !== scorer.id)) {
                    assister.assists = (assister.assists || 0) + 1;
                    if (isCAF) assister.cafAssists = (assister.cafAssists || 0) + 1; // FIX #61
                }
            }
        }
    }
    
    assignDisciplineEvents(team) {
        team.squad.slice(0, 11).forEach(p => {
            p.seasonApps = (p.seasonApps || 0) + 1; // LOT 8 : temps de jeu réel
            if (Math.random() < 0.02) p.injuryDays = Math.floor(Math.random() * 3) + 1;
            if (Math.random() < 0.01) { p.redCards++; p.suspensionDays = 1; }
            if (Math.random() < 0.05) p.yellowCards++;
        });
    }

    pickPlayerByProbability(players, probs) {
        let rand = Math.random() * 100;
        let currentProb = 0;
        let selectedPos = 'ATT';

        for (let pos in probs) {
            currentProb += probs[pos];
            if (rand <= currentProb) {
                selectedPos = pos;
                break;
            }
        }

        let candidates = players.filter(p => p.position === selectedPos);
        if (candidates.length === 0) candidates = players; 
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    processMatchStats(home, away, hG, aG) {
        if (!home.form || !away.form) return;
        home.played++; home.gf += hG; home.ga += aG;
        away.played++; away.gf += aG; away.ga += hG;
        if(hG > aG) { home.won++; home.points += 3; home.form.unshift('W'); away.lost++; away.form.unshift('L'); }
        else if (hG < aG) { away.won++; away.points += 3; away.form.unshift('W'); home.lost++; home.form.unshift('L'); }
        else { home.drawn++; home.points += 1; home.form.unshift('D'); away.drawn++; away.points += 1; away.form.unshift('D'); }
        if(home.form.length > 5) home.form.pop();
        if(away.form.length > 5) away.form.pop();
    }
    processCAFGroupStats(home, away, hG, aG, groupId) {
    if (!this.cafData || !this.cafData.groups) return;
    
    // SÉCURITÉ : Si groupId est absent, on cherche dans quel groupe sont les équipes
    if (groupId === undefined) {
        for (let id in this.cafData.groups) {
            if (this.cafData.groups[id].some(t => t.name === home.name)) {
                groupId = id;
                break;
            }
        }
    }


    const group = this.cafData.groups[groupId];
    if (!group) return; // Si toujours pas de groupe trouvé, on sort sans crash

    const homeTeam = group.find(t => t.name === home.name);
    const awayTeam = group.find(t => t.name === away.name);

    if (homeTeam && awayTeam) {
        const hPoints = hG > aG ? 3 : (hG === aG ? 1 : 0);
        const aPoints = aG > hG ? 3 : (hG === aG ? 1 : 0);
        
        homeTeam.cafPoints = (homeTeam.cafPoints || 0) + hPoints;
        awayTeam.cafPoints = (awayTeam.cafPoints || 0) + aPoints;

        // FIX #14 : on enregistre les buts pour/contre CAF (absents avant), utilisés pour le départage
        homeTeam.cafGF = (homeTeam.cafGF || 0) + hG;
        homeTeam.cafGA = (homeTeam.cafGA || 0) + aG;
        awayTeam.cafGF = (awayTeam.cafGF || 0) + aG;
        awayTeam.cafGA = (awayTeam.cafGA || 0) + hG;
        
        if (hG > aG) { 
            homeTeam.cafW = (homeTeam.cafW || 0) + 1; 
            awayTeam.cafL = (awayTeam.cafL || 0) + 1; 
        } else if (hG === aG) { 
            homeTeam.cafD = (homeTeam.cafD || 0) + 1; 
            awayTeam.cafD = (awayTeam.cafD || 0) + 1; 
        } else { 
            awayTeam.cafW = (awayTeam.cafW || 0) + 1; 
            homeTeam.cafL = (homeTeam.cafL || 0) + 1; 
        }
    }
}
// FIX #90 : les tirs au but étaient un pile ou face (Math.random() > 0.5), ce qui pouvait
// éliminer un club nettement supérieur une fois sur deux. On simule maintenant une vraie
// séance : 5 tireurs (les meilleurs `finishing`/`composure` du onze) contre le gardien
// adverse (`positioning`), puis mort subite.
// FIX #100 : renvoie désormais { winner, scoreA, scoreB } — le score de la séance est
// affiché en commentaire de match et dans le tableau de la CAF ("4-3 t.a.b.").
simulatePenaltyShootout(teamA, teamB) {
    const shooters = (team) => {
        const squad = (team.squad || []).slice(0, 11);
        if (squad.length === 0) return [team.force || 65];
        const outfield = squad.filter(p => p.position !== 'GB');
        const list = (outfield.length ? outfield : squad);
        const val = p => ((p.stats?.finishing ?? p.ovr ?? 65) * 0.6) + ((p.stats?.composure ?? p.ovr ?? 65) * 0.4);
        const sorted = list.slice().sort((a, b) => val(b) - val(a));
        // Le tireur désigné par le coach ouvre toujours la séance.
        const takerId = (team.isUser && this.setPieces) ? this.setPieces.penalty : null;
        if (takerId) {
            const i = sorted.findIndex(p => p.id === takerId);
            if (i > 0) sorted.unshift(sorted.splice(i, 1)[0]);
        }
        return sorted.slice(0, 5).map(val);
    };
    const keeper = (team) => {
        const gk = (team.squad || []).slice(0, 11).find(p => p.position === 'GB');
        return gk ? (gk.stats?.positioning ?? gk.ovr ?? 65) : Math.max(40, (team.force || 65) - 8);
    };

    const shotsA = shooters(teamA), shotsB = shooters(teamB);
    const gkA = keeper(teamA), gkB = keeper(teamB);

    // Probabilité de marquer : 75% de base, ±0,4 point par unité d'écart tireur/gardien,
    // bornée à [0,55 ; 0,92] — un penalty reste très majoritairement converti.
    const scores = (shooterStat, gkStat) => {
        const p = Math.min(0.92, Math.max(0.55, 0.75 + (shooterStat - gkStat) * 0.004));
        return Math.random() < p;
    };

    let a = 0, b = 0;
    for (let i = 0; i < 5; i++) {
        if (scores(shotsA[i % shotsA.length], gkB)) a++;
        if (scores(shotsB[i % shotsB.length], gkA)) b++;
    }
    // Mort subite (plafonnée pour éviter toute boucle infinie)
    let round = 0;
    while (a === b && round < 20) {
        const ha = scores(shotsA[round % shotsA.length], gkB);
        const hb = scores(shotsB[round % shotsB.length], gkA);
        if (ha) a++;
        if (hb) b++;
        round++;
    }
    if (a === b) { // filet de sécurité
        const w = Math.random() < 0.5 ? teamA : teamB;
        return { winner: w, scoreA: a, scoreB: b };
    }
    return { winner: a > b ? teamA : teamB, scoreA: a, scoreB: b }; // FIX #100
}

processCAFKnockoutStats(home, away, hG, aG, matchType, index) {
        if (!this.cafData) return;
        
        let matchObj = null;
        if (matchType === 'CAF_QUARTER') matchObj = this.cafData.quarterFinals[index];
        if (matchType === 'CAF_SEMI') matchObj = this.cafData.semiFinals[index];
        if (matchType === 'CAF_FINAL') matchObj = this.cafData.final; 
        
        if (!matchObj) return;

        // Finale : 1 seul match (sur terrain neutre)
        if (matchType === 'CAF_FINAL') {
            matchObj.hG = hG;
            matchObj.aG = aG;
            if (hG > aG) {
                matchObj.winner = home;
            } else if (aG > hG) {
                matchObj.winner = away;
            } else {
                // Égalité en finale -> Tirs au but (FIX #90 : basés sur les stats)
                // FIX #98 : si la séance a déjà été jouée en direct, on la réutilise
                matchObj.penalties = true;
                const r = this.pendingShootout || this.simulatePenaltyShootout(home, away);
                this.pendingShootout = null;
                matchObj.winner = r.winner;
                matchObj.penaltyScore = `${r.scoreA}-${r.scoreB}`; // FIX #100
            }
            return;
        }

        // Quarts et Demis : Match Aller / Match Retour
        let isAller = matchObj.home.name === home.name; // Vérifie si on joue l'aller

        if (isAller) {
            // Match Aller
            matchObj.hG = hG; 
            matchObj.aG = aG; 
        } else {
            // Match Retour (les équipes sont inversées sur le terrain)
            matchObj.hG2 = aG; // Buts de l'équipe 1 (matchObj.home) qui joue mtn à l'extérieur
            matchObj.aG2 = hG; // Buts de l'équipe 2 (matchObj.away) qui joue mtn à domicile
            
            // Calcul du score cumulé
            let totalHome = matchObj.hG + matchObj.hG2;
            let totalAway = matchObj.aG + matchObj.aG2;
            
            if (totalHome > totalAway) {
                matchObj.winner = matchObj.home;
            } else if (totalAway > totalHome) {
                matchObj.winner = matchObj.away;
            } else {
                // Égalité parfaite au cumulé -> Règle du but à l'extérieur
                let awayGoalsHomeTeam = matchObj.hG2; // Buts marqués par l'équipe 1 à l'extérieur
                let awayGoalsAwayTeam = matchObj.aG;  // Buts marqués par l'équipe 2 à l'extérieur
                
                if (awayGoalsHomeTeam > awayGoalsAwayTeam) {
                    matchObj.winner = matchObj.home;
                } else if (awayGoalsAwayTeam > awayGoalsHomeTeam) {
                    matchObj.winner = matchObj.away;
                } else {
                    // Égalité totale -> Tirs au but (FIX #90 : basés sur les stats)
                    // FIX #98 : si la séance a déjà été jouée en direct, on la réutilise.
                    // Attention : pendingShootout est exprimé dans l'ordre du terrain (home/away
                    // du match retour), donc inversé par rapport à matchObj.
                    matchObj.penalties = true;
                    let r;
                    if (this.pendingShootout) {
                        r = { winner: this.pendingShootout.winner,
                              scoreA: this.pendingShootout.scoreB,
                              scoreB: this.pendingShootout.scoreA };
                        this.pendingShootout = null;
                    } else {
                        r = this.simulatePenaltyShootout(matchObj.home, matchObj.away);
                    }
                    matchObj.winner = r.winner;
                    matchObj.penaltyScore = `${r.scoreA}-${r.scoreB}`; // FIX #100
                }
            }
        }
    }
    refreshAllViews() {
        this.renderDashboard();
        this.renderStandings(); 
        this.renderSquad();
        this.renderTacticsView();
        this.renderMarket();
    }

    renderDashboard() {
        const myClub = this.getMyClub();
        const myRank = this.globalData[this.userLeagueId].standings.findIndex(c => c.isUser) + 1;
        const totalMatchdays = (this.globalData[this.userLeagueId].standings.length - 1) * 2;

        // KPI STRIP
        const posEl = document.getElementById('dash-position');
        if (posEl) posEl.innerText = myRank + (myRank === 1 ? 'er' : 'e'); // FIX #65 (était 'ème')
        
        const ptsEl = document.getElementById('dash-points');
        if (ptsEl) ptsEl.innerText = myClub.points;

        // ==========================================
        // FORME RÉCENTE ET STATS CONDENSÉES
        // ==========================================
        let formHTML = '';
        if (!myClub.form || myClub.form.length === 0) {
            formHTML = '<span class="text-xs text-slate-500 italic">Aucun match</span>';
        } else {
            myClub.form.forEach(f => {
                let cls = f === 'W' ? 'fw' : f === 'D' ? 'fd' : 'fl';
                let txt = f === 'W' ? 'V' : f === 'D' ? 'N' : 'D';
                formHTML += `<span class="form-dot ${cls}">${txt}</span>`;
            });
        }
        const formGuideEl = document.getElementById('dash-form-guide');
        if (formGuideEl) formGuideEl.innerHTML = formHTML;

        const posLabel = document.getElementById('dash-position-label');
        if (posLabel) posLabel.innerText = myRank + (myRank === 1 ? 'er' : 'e');

        const goalsLabel = document.getElementById('dash-goals-label');
        if (goalsLabel) goalsLabel.innerText = `${myClub.gf || 0}/${myClub.ga || 0}`;

        const ptsLabel = document.getElementById('dash-points-label');
        if (ptsLabel) ptsLabel.innerText = myClub.points || 0;

        // ==========================================
        // PROCHAIN MATCH
        // ==========================================
        let userFixture = this.fixtures
            .filter(f => !f.played && f.home && f.away && (f.home.isUser || f.away.isUser))
            .sort((a, b) => a.matchday - b.matchday)[0];
        if (userFixture) {
            let isHome = userFixture.home.isUser;
            let nextOpp = isHome ? userFixture.away : userFixture.home;
            
            // 1. Infos des équipes (Noms, Logos, OVR)
            document.getElementById('dash-home-name').innerHTML = `${myClub.name}<br><span class="text-[10px] text-brand-500 font-normal tracking-widest">OVR ${myClub.force}</span>`;
            document.getElementById('dash-home-logo').innerText = myClub.name.substring(0, 3).toUpperCase();
            const cafBadge = userFixture.type && userFixture.type.startsWith('CAF') ? '<br><span style="font-size:10px;color:#facc15;">🌍 CAF CL</span>' : '';

            // FIX #94 : #dash-match-competition affichait "Championnat" en dur, même pour un match de CAF
            const compEl = document.getElementById('dash-match-competition');
            if (compEl) {
                const t = userFixture.type || '';
                compEl.innerText =
                    t === 'CAF_FINAL'   ? 'CAF — Finale' :
                    t === 'CAF_SEMI'    ? 'CAF — Demi-finale' :
                    t === 'CAF_QUARTER' ? 'CAF — Quart de finale' :
                    t.startsWith('CAF') ? 'CAF — Phase de groupes' :
                    'Championnat';
            }
            document.getElementById('dash-away-name').innerHTML = `${nextOpp.name}<br><span class="text-[10px] text-slate-500 font-normal tracking-widest">OVR ${nextOpp.force}</span>${cafBadge}`;
            document.getElementById('dash-away-logo').innerText = nextOpp.name.substring(0, 3).toUpperCase();

            // 2. Différence de niveau (OVR)
            let diff = myClub.force - nextOpp.force; // Positif si vous êtes plus fort
            let diffEl = document.getElementById('dash-next-diff');
            if (diffEl) {
                diffEl.innerText = diff > 0 ? `+${diff}` : diff;
                // Vert si on est meilleur, Rouge si on est plus faible, Gris si égalité
                diffEl.style.color = diff > 0 ? '#34d399' : (diff < 0 ? '#ef4444' : '#94a3b8');
            }

            // 3. Fonction pour générer les bulles de forme (3 derniers matchs)
            const renderMiniForm = (club, elementId) => {
                let el = document.getElementById(elementId);
                if (!el) return;
                if (!club.form || club.form.length === 0) {
                    el.innerHTML = '<span class="text-[10px] text-slate-500">-</span>';
                    return;
                }
                let html = '';
                club.form.slice(0, 3).forEach(f => { // FIX #66 (était slice(-3), affichait les plus anciens)
                    let cls = f === 'W' ? 'fw' : f === 'D' ? 'fd' : 'fl';
                    let txt = f === 'W' ? 'V' : f === 'D' ? 'N' : 'D';
                    html += `<span class="form-dot ${cls}">${txt}</span>`;
                });
                el.innerHTML = html;
            };

            // Application de la forme (Gauche = Vous, Droite = Adversaire)
            renderMiniForm(myClub, 'dash-next-home-form');
            renderMiniForm(nextOpp, 'dash-next-away-form');

        } else {
            // S'il n'y a plus de match (Fin de saison)
            document.getElementById('dash-home-name').innerHTML = `${myClub.name}`;
            document.getElementById('dash-away-name').innerHTML = `Fin de saison`;
            
            // On vide l'analyse pré-match
            let diffEl = document.getElementById('dash-next-diff');
            if (diffEl) diffEl.innerText = '--';
            let homeForm = document.getElementById('dash-next-home-form');
            if (homeForm) homeForm.innerHTML = '';
            let awayForm = document.getElementById('dash-next-away-form');
            if (awayForm) awayForm.innerHTML = '';
        }

        // ==========================================
        // RÉPUTATION, FINANCES, PROJECTION & DISCOURS
        // ==========================================
        const repEl = document.getElementById('dash-reputation');
        if (repEl) {
            const repBar = Math.round(this.reputation);
            const repColor = repBar >= 70 ? 'bg-yellow-500' : repBar >= 45 ? 'bg-brand-500' : 'bg-slate-600';
            repEl.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] text-slate-400 uppercase font-bold">Réputation</span>
                    <span class="text-xs font-bold text-white">${repBar}/100 — ${this.getReputationLabel()}</span>
                </div>
                <div class="h-1.5 w-full bg-ui-900 rounded-full overflow-hidden">
                    <div class="h-full ${repColor} transition-all" style="width:${repBar}%"></div>
                </div>`;
        }

        const finEl = document.getElementById('dash-financial');
        if (finEl) {
            const totalWages = this.userSquad.reduce((s, p) => s + (p.wage || 0), 0);
            const staffCost = this.userStaff.reduce((s, id) => {
                const t = STAFF_TYPES.find(x => x.id === id); return s + (t ? t.salary : 0);
            }, 0);
            finEl.innerHTML = `
                <div class="grid grid-cols-3 gap-2 text-center">
                    <div class="panel-glass rounded-lg p-2 border border-white/5">
                        <div class="text-[9px] text-slate-400 uppercase mb-0.5">Masse sal.</div>
                        <div class="font-teko text-base text-red-400">${formatMoney(totalWages + staffCost)}/m</div>
                    </div>
                    <div class="panel-glass rounded-lg p-2 border border-white/5">
                        <div class="text-[9px] text-slate-400 uppercase mb-0.5">Contrats</div>
                        <div class="font-teko text-base text-yellow-400">${this.userSquad.filter(p => p.contract && p.contract.expiresIn <= 10).length} exp.</div>
                    </div>
                    <div class="panel-glass rounded-lg p-2 border border-white/5">
                        <div class="text-[9px] text-slate-400 uppercase mb-0.5">Académie</div>
                        <div class="font-teko text-base text-brand-400">${this.academy.length} jeune${this.academy.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>`;
        }

        const projEl = document.getElementById('dash-projection');
        if (projEl && myClub.played > 0) {
            const ppg = myClub.points / myClub.played;
            const remaining = totalMatchdays - myClub.played;
            const projected = Math.round(myClub.points + ppg * remaining);
            const projColor = projected >= 70 ? 'text-yellow-400' : projected >= 50 ? 'text-emerald-400' : 'text-slate-400';
            projEl.innerHTML = `<span class="text-[10px] text-slate-400">Projection fin de saison : </span><span class="font-bold ${projColor}">${projected} pts</span>`;
        }

        const speechEl = document.getElementById('dash-speech-btn');
        if (speechEl) {
            speechEl.disabled = !!this.speechUsedThisMonth;
            speechEl.className = `w-full py-2 rounded-lg text-xs font-bold uppercase transition-colors ${this.speechUsedThisMonth ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-white'}`;
            speechEl.innerText = this.speechUsedThisMonth ? '💬 Discours utilisé ce mois' : '💬 Discours motivant (+15 moral)';
        }

        // ==========================================
        // ACTUALITÉS (Boîte de réception)
        // ==========================================
        const newsContainer = document.getElementById('dash-news');
        if (newsContainer) {
            if (!this.messages || this.messages.length === 0) {
                newsContainer.innerHTML = '<p class="text-slate-500 italic text-[11px]">Aucune actualité pour le moment…</p>';
            } else {
                let newsHTML = '';
                // Inverser pour afficher les messages les plus récents en premier
                const recentMessages = [...this.messages].reverse().slice(0, 3);
                
                recentMessages.forEach(m => {
                    let dotColor = '';
                    if (m.type === 'warning' || m.type === 'contract_alert') dotColor = 'background:#ef4444'; // Rouge
                    else if (m.type === 'offer') dotColor = 'background:#10b981'; // Vert
                    else if (m.type === 'morale') dotColor = 'background:#f59e0b'; // Jaune
                    else dotColor = 'background:#3b82f6'; // Bleu

                    newsHTML += `
                    <div class="news-item">
                        <div class="news-dot" style="${dotColor}"></div>
                        <div>
                            <div class="news-txt">${m.text}</div>
                        </div>
                    </div>`;
                });
                newsContainer.innerHTML = newsHTML;
            }
        }

        // ==========================================
        // OBJECTIFS SAISON DYNAMIQUES
        // ==========================================
        const objContainer = document.getElementById('dash-objectives');
        if (objContainer) {
            let objectivesHTML = '';
            
            // A. Objectif Sportif
            let targetRank = myClub.force >= 82 ? 1 : myClub.force >= 78 ? 3 : 10;
            let targetText = targetRank === 1 ? "Remporter le titre" : targetRank === 3 ? "Top 3 en championnat" : "Maintien (Top 10)";
            let statusClass = myRank <= targetRank ? 'ok' : (myRank <= targetRank + 2 ? 'warn' : 'ko');
            
            objectivesHTML += `
            <div class="obj-row">
                <div class="obj-status ${statusClass}"></div>
                <div class="obj-txt">${targetText}</div>
                <div class="obj-val">${myRank}e</div>
            </div>`;

            // B. Objectif Financier (Masse salariale)
            const totalWages = (this.userSquad || []).reduce((s, p) => s + (p.wage || 0), 0);
            const staffCost = (this.userStaff || []).reduce((s, id) => {
                const t = (typeof STAFF_TYPES !== 'undefined' ? STAFF_TYPES : []).find(x => x.id === id);
                return s + (t ? t.salary : 0);
            }, 0);
            
            const totalCost = totalWages + staffCost;
            const wageLimit = Math.max(100000, (this.budget || 0) * 0.25); // Limite estimée
            
            let wageStatus = totalCost <= wageLimit ? 'ok' : 'ko';
            let wageValText = totalCost <= wageLimit ? 'OK' : `+${Math.round(((totalCost - wageLimit) / wageLimit) * 100)}%`;

            objectivesHTML += `
            <div class="obj-row">
                <div class="obj-status ${wageStatus}"></div>
                <div class="obj-txt">Limiter la masse salariale</div>
                <div class="obj-val">${wageValText}</div>
            </div>`;

            // C. Objectif Vestiaire (Moral global)
            const avgMorale = this.userSquad && this.userSquad.length > 0 
                ? Math.round(this.userSquad.reduce((s, p) => s + (p.morale ?? 80), 0) / this.userSquad.length) 
                : 80;
            let moraleStatus = avgMorale >= 75 ? 'ok' : avgMorale >= 50 ? 'warn' : 'ko';
            
            objectivesHTML += `
            <div class="obj-row">
                <div class="obj-status ${moraleStatus}"></div>
                <div class="obj-txt">Maintenir un bon moral</div>
                <div class="obj-val">${avgMorale}%</div>
            </div>`;

            objContainer.innerHTML = objectivesHTML;
        }
        // ==========================================
        // DYNAMIQUE DU MORAL VESTIAIRE
        // ==========================================
        const moraleEmoji = document.getElementById('dash-morale-emoji');
        if (moraleEmoji && this.userSquad) {
            // Calcul de la moyenne du moral de tous vos joueurs
            const avgMorale = this.userSquad.length > 0 
                ? Math.round(this.userSquad.reduce((s, p) => s + (p.morale ?? 80), 0) / this.userSquad.length) 
                : 80;

            let emoji = '😐', label = 'Neutre', sub = 'Stabilité dans le groupe', color = '#f59e0b';

            if (avgMorale >= 85) { emoji = '😁'; label = 'Excellente'; sub = 'Le groupe vit très bien'; color = '#10b981'; } // Vert
            else if (avgMorale >= 70) { emoji = '😊'; label = 'Bonne ambiance'; sub = 'Le groupe est soudé'; color = '#34d399'; } // Vert clair
            else if (avgMorale >= 50) { emoji = '😐'; label = 'Moyenne'; sub = 'Stabilité dans le groupe'; color = '#f59e0b'; } // Jaune
            else if (avgMorale >= 30) { emoji = '😠'; label = 'Mauvaise'; sub = 'Des joueurs sont mécontents'; color = '#f97316'; } // Orange
            else { emoji = '🤬'; label = 'Crise !'; sub = 'Le vestiaire est fracturé'; color = '#ef4444'; } // Rouge

            moraleEmoji.innerText = emoji;
            document.getElementById('dash-morale-label').innerText = label;
            document.getElementById('dash-morale-sub').innerText = sub;
            
            const moraleBar = document.getElementById('dash-morale-bar');
            if (moraleBar) {
                moraleBar.style.width = `${avgMorale}%`;
                moraleBar.style.background = color;
            }
        }
    }

    renderStandings(forcedLeagueId = null) {
        const viewLeagueId = forcedLeagueId || document.getElementById('standings-league-selector').value || this.userLeagueId;
        const leagueData = this.globalData[viewLeagueId];
        
        const tbody = document.getElementById('standings-body');
        tbody.innerHTML = '';
        
        leagueData.standings.forEach((t, i) => {
            const isMe = t.isUser ? 'bg-brand-500/10 border-l-2 border-brand-500' : '';
            const rCol = i === 0 ? 'text-yellow-500 font-bold' : i < 3 ? 'text-orange-400 font-medium' : 'text-slate-400';
            tbody.innerHTML += `
                <tr class="hover:bg-white/5 transition-colors ${isMe}">
                    <td class="px-6 py-3 text-center ${rCol}">${i+1}</td>
                    <td class="px-6 py-3 font-bold text-white flex items-center gap-3">
                        <div class="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-400">${t.name.substring(0,2).toUpperCase()}</div>
                        <div class="flex flex-col leading-tight">
                            <span class="cursor-pointer hover:text-brand-400 transition-colors" onclick="app.showTeamSquad('${t.name}', '${viewLeagueId}')">${t.name}</span>
                            <span class="text-[9px] text-slate-400 font-normal mt-0.5">Force: <span class="text-white">${t.force}</span></span>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center text-slate-400">${t.played}</td>
                    <td class="px-4 py-3 text-center text-slate-400">${t.won}</td>
                    <td class="px-4 py-3 text-center text-slate-400">${t.drawn}</td>
                    <td class="px-4 py-3 text-center text-slate-400">${t.lost}</td>
                    <td class="px-4 py-3 text-center text-slate-500 text-xs">${t.gf}</td>
                    <td class="px-4 py-3 text-center text-slate-500 text-xs">${t.ga}</td>
                    <td class="px-4 py-3 text-center font-medium ${t.gf-t.ga > 0 ? 'text-emerald-400' : t.gf-t.ga < 0 ? 'text-red-400' : 'text-slate-400'}">${t.gf-t.ga > 0 ? '+':''}${t.gf-t.ga}</td>
                    <td class="px-6 py-3 text-center font-teko text-xl text-white">${t.points}</td>
                </tr>
            `;
        });

        let allPlayers = [];
        leagueData.standings.forEach(team => {
            team.squad.forEach(p => {
                // FIX #61f : on retire les buts/passes CAF du total pour ce classement de championnat
                allPlayers.push({...p, teamName: team.name,
                    goals: Math.max(0, (p.goals || 0) - (p.cafGoals || 0)),
                    assists: Math.max(0, (p.assists || 0) - (p.cafAssists || 0))
                });
            });
        });

        let topScorers = [...allPlayers].sort((a, b) => b.goals - a.goals).slice(0, 5);
        let topAssisters = [...allPlayers].sort((a, b) => b.assists - a.assists).slice(0, 5);

        let statsContainer = document.getElementById('standings-stats-container');
        if (!statsContainer) {
            const viewStandings = document.getElementById('view-standings');
            statsContainer = document.createElement('div');
            statsContainer.id = 'standings-stats-container';
            statsContainer.className = 'grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6';
            viewStandings.appendChild(statsContainer);
        }

        statsContainer.innerHTML = `
            <div class="panel-glass rounded-2xl p-6">
                <h4 class="font-teko text-2xl text-white uppercase mb-4 flex items-center gap-2">
                    <span class="text-brand-500">⚽</span> Meilleurs Buteurs
                </h4>
                <div class="flex flex-col gap-2">
                    ${topScorers.map((p, i) => `
                        <div class="flex items-center justify-between p-2 rounded-lg bg-ui-800/50 border border-white/5">
                            <div class="flex items-center gap-3">
                                <span class="text-slate-500 font-bold text-xs w-3">${i+1}.</span>
                                <div>
                                    <p class="text-sm font-bold text-white leading-none">${p.name}</p>
                                    <p class="text-[9px] text-slate-400 uppercase mt-1">${p.teamName}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="font-teko text-xl text-brand-500 font-bold leading-none">${p.goals}</span>
                                <span class="text-[8px] text-slate-500 uppercase">Buts</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="panel-glass rounded-2xl p-6">
                <h4 class="font-teko text-2xl text-white uppercase mb-4 flex items-center gap-2">
                    <span class="text-emerald-500">🎯</span> Meilleurs Passeurs
                </h4>
                <div class="flex flex-col gap-2">
                    ${topAssisters.map((p, i) => `
                        <div class="flex items-center justify-between p-2 rounded-lg bg-ui-800/50 border border-white/5">
                            <div class="flex items-center gap-3">
                                <span class="text-slate-500 font-bold text-xs w-3">${i+1}.</span>
                                <div>
                                    <p class="text-sm font-bold text-white leading-none">${p.name}</p>
                                    <p class="text-[9px] text-slate-400 uppercase mt-1">${p.teamName}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="font-teko text-xl text-emerald-500 font-bold leading-none">${p.assists}</span>
                                <span class="text-[8px] text-slate-500 uppercase">Passes</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSquad() {
        const grid = document.getElementById('squad-grid');
        grid.innerHTML = '';
        this.userSquad.forEach(p => {
            const posColors = {
                'GB': { bg: 'from-amber-400 to-amber-600', text: 'text-amber-400' },
                'DEF': { bg: 'from-blue-500 to-blue-700', text: 'text-blue-400' },
                'MIL': { bg: 'from-emerald-500 to-emerald-700', text: 'text-emerald-400' },
                'ATT': { bg: 'from-rose-500 to-rose-700', text: 'text-rose-400' }
            };
            const c = posColors[p.position] || posColors['MIL'];
            const energyColor = p.energy > 80 ? 'bg-emerald-500' : p.energy > 60 ? 'bg-yellow-500' : 'bg-red-500';

            // Affichage UI Blessures et Cartons
            let statusBadge = '';
            if (p.injuryDays > 0) statusBadge = `<div class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-30">🏥 ${p.injuryDays}J</div>`;
            else if (p.suspensionDays > 0) statusBadge = `<div class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-30">🟥 ${p.suspensionDays}J</div>`;
            else if (p.yellowCards > 0) statusBadge = `<div class="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow z-30">🟨 ${p.yellowCards}</div>`;

            // LOT 9 : visage propre au joueur (généré depuis son id)
            const avatarSvg = typeof playerFaceSVG === 'function' ? playerFaceSVG(p) : `<svg viewBox="0 0 24 24" class="w-full h-full fill-current opacity-50"><path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"/></svg>`;

            grid.innerHTML += `
                <div class="relative bg-gradient-to-br ${c.bg} rounded-2xl p-[2px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all group cursor-pointer">
                    ${statusBadge}
                    <div class="h-full w-full bg-ui-900/90 rounded-xl p-3 flex flex-col justify-between backdrop-blur-md">
                        <div class="absolute -right-2 -top-2 text-7xl opacity-[0.03] font-teko italic font-black text-white pointer-events-none">${p.ovr}</div>
                        
                        <div class="flex justify-between items-start mb-2 relative z-10">
                            <div class="flex flex-col items-center">
                                <span class="font-teko text-3xl font-black text-white leading-none drop-shadow-md">${p.ovr}</span>
                                <span class="text-[10px] font-bold ${c.text} uppercase tracking-wider">${p.position}</span>
                                ${p.lastRating ? `<span class="mt-0.5 text-[9px] font-black px-1.5 py-0.5 rounded ${p.lastRating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400' : p.lastRating >= 6.0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}">★ ${p.lastRating}</span>` : ''}
                            </div>
                            <div class="w-12 h-12 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 overflow-hidden shadow-inner">
                                ${avatarSvg}
                            </div>
                        </div>

                        <div class="text-center border-b border-white/10 pb-1 mb-2 relative z-10">
                            <h4 class="font-bold text-white text-xs truncate uppercase tracking-widest">${p.name}</h4>
                            <div class="text-[9px] text-slate-400 mt-0.5">${p.age || '?'} ans &bull; Salaire: ${formatMoney(p.wage || 0)}/m</div>
                        </div>

                        <div class="grid grid-cols-2 gap-x-3 gap-y-0 text-[9px] uppercase font-bold text-slate-400 relative z-10 mb-3">
                            <div class="flex justify-between items-center"><span class="font-medium text-slate-500">VIT</span> <span class="text-white">${p.stats?.pace || p.stats?.pac || '?'}</span></div>
                            <div class="flex justify-between items-center"><span class="font-medium text-slate-500">PAS</span> <span class="text-white">${p.stats?.passing || p.stats?.pas || '?'}</span></div>
                            <div class="flex justify-between items-center"><span class="font-medium text-slate-500">FIN</span> <span class="text-white">${p.stats?.finishing || p.stats?.sho || '?'}</span></div>
                            <div class="flex justify-between items-center"><span class="font-medium text-slate-500">TAC</span> <span class="text-white">${p.stats?.tackling || p.stats?.def || '?'}</span></div>
                            <div class="flex justify-between items-center"><span class="font-medium text-slate-500">VIS</span> <span class="text-white">${p.stats?.vision || p.stats?.dri || '?'}</span></div>
                            <div class="flex justify-between items-center"><span class="font-medium text-slate-500">PLA</span> <span class="text-white">${p.stats?.positioning || p.stats?.phy || '?'}</span></div>
                        </div>

                        <div class="relative z-10 bg-ui-800 rounded-lg p-1.5 border border-white/5 mt-2">
                            <div class="flex justify-between text-[8px] text-slate-400 font-bold uppercase mb-1">
                                <span>Forme: <span class="text-white">${Math.floor(p.energy)}%</span></span>
                                <span>Moral: <span class="${(p.morale ?? 80) < 50 ? 'text-red-400' : 'text-blue-400'}">${p.morale ?? 80}%</span></span>
                            </div>
                            <div class="h-1 w-full bg-ui-900 rounded-full overflow-hidden mb-1.5"><div class="h-full ${energyColor}" style="width: ${p.energy}%"></div></div>
                            <button onclick="app.healPlayer('${p.id}')" ${p.energy === 100 && p.injuryDays === 0 ? 'disabled' : ''} class="w-full py-1 text-[9px] font-bold uppercase rounded transition-colors ${(p.energy < 100 || p.injuryDays > 0) ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-ui-900 text-slate-600'}">
    ${(p.energy < 100 || p.injuryDays > 0) ? 'Kiné (50 K€)' : 'Prêt'}
</button>
${(p.contract && p.contract.expiresIn <= 10)
    ? `<button onclick="app.renewContract('${p.id}')" class="w-full mt-1 py-1 text-[9px] font-bold uppercase rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white transition-colors">📋 Renouveler (${p.contract.expiresIn}j)</button>`
    : ''}
${p.loanedIn
    ? `<div class="w-full mt-1 py-1 text-[9px] font-bold uppercase rounded bg-sky-500/10 text-sky-400 text-center">🤝 Prêté par ${p.loanedIn.ownerClub}</div>`
    : `<button onclick="event.stopPropagation(); app.openLoanMarket('${p.id}')" class="w-full mt-1 py-1 text-[9px] font-bold uppercase rounded bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors">🤝 Prêter</button>
       <button onclick="event.stopPropagation(); app.sellPlayer('${p.id}')" class="w-full mt-1 py-1 text-[9px] font-bold uppercase rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
           💸 Vendre (${formatMoney(p.price || Generator.getPlayerValue(p.ovr))})
       </button>`}
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById('squad-count').innerText = this.userSquad.length;
    }

    switchView(viewId) {
    // Sécurité pendant un match en direct
    if(this.liveMatch && this.liveMatch.interval && viewId !== 'match') return;

    const inbox = document.getElementById('inbox-overlay');

    // === CAS SPÉCIAL : BOÎTE DE RÉCEPTION ===
    if (viewId === 'inbox') {
    if (inbox) {
        inbox.classList.toggle('hidden');
        if (!inbox.classList.contains('hidden')) {
            this.renderInbox();
            const badge = document.getElementById('notification-badge');
            if (badge) badge.classList.add('hidden');
        }
    }
    return;
} else {
    if (inbox) inbox.classList.add('hidden');
}
    // =========================================

    // Navigation classique pour les autres vues
    ['dashboard', 'standings', 'squad', 'tactics', 'market', 'match', 'staff', 'academy', 'caf', 'legacy'].forEach(id => {
        const el = document.getElementById('view-' + id);
        if(el) el.classList.add('hidden-view');
        document.querySelectorAll(`[data-target="${id}"]`).forEach(btn => {
            btn.classList.remove('text-brand-500', 'bg-brand-500/10');
            btn.classList.add('text-slate-400', 'text-slate-500');
        });
    });

    const targetEl = document.getElementById('view-' + viewId);
    if(targetEl) targetEl.classList.remove('hidden-view');
    
    document.querySelectorAll(`[data-target="${viewId}"]`).forEach(btn => {
        btn.classList.remove('text-slate-400', 'text-slate-500', 'hover:bg-white/5');
        if(btn.classList.contains('p-3')) btn.classList.add('text-brand-500', 'bg-brand-500/10'); 
        else btn.classList.add('text-brand-500'); 
    });
    
    if(viewId === 'tactics') this.renderTacticsView();
    if (viewId === 'staff') this.updateStaffUI();
if (viewId === 'academy') this.renderAcademy();
    if (viewId === 'caf') this.renderCAF();
    if (viewId === 'legacy') this.renderLegacy(); // LOT 12
    if (viewId === 'dashboard') this.renderDashboard();
}

// =============================================
// ÉTAPE 2 — CONTRATS & NÉGOCIATIONS
// =============================================
renewContract(playerId) {
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;
    if (!player.contract) player.contract = { duration: 2, expiresIn: 76 };
    const raise = Math.floor(player.wage * (0.10 + (player.ovr / 1000)));
    const newWage = player.wage + raise;
    const msg = `📋 Renouvellement de contrat\n\n${player.name} (OVR ${player.ovr})\nSalaire actuel : ${formatMoney(player.wage)}/mois\nNouveau salaire demandé : ${formatMoney(newWage)}/mois (+${formatMoney(raise)})\nDurée : 2 saisons`;
    // FIX #97 : confirm() natif remplacé par la modale maison (asynchrone -> callback)
    this.showConfirm(msg, () => {
        player.wage = newWage;
        player.contract = { duration: 2, expiresIn: 76 };
        this.messages = this.messages.filter(m => !(m.playerId === playerId && m.type === 'contract_alert'));
        this.showNotification(`✅ Contrat de ${player.name} renouvelé (2 saisons) !`);
        this.saveGame();
        this.renderSquad();
        this.updateHeader();
    }, { okLabel: 'Prolonger' });
}
renderInbox() {
    const container = document.getElementById('inbox-content');
    if (!container) return;

    const msgs = this.messages || [];
    if (msgs.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">Aucun message.</p>`;
        return;
    }

    container.innerHTML = msgs.map(m => {
        const isOffer = m.type === 'offer';
        const isLoanReq = m.type === 'loanRequest'; // LOT 11
        return `
        <div class="panel-glass rounded-xl p-4 mb-2 border ${m.read ? 'border-white/5' : isLoanReq ? 'border-sky-500/30' : 'border-brand-500/30'}">
            <p class="text-white text-sm ${m.read ? 'opacity-60' : 'font-bold'}">${m.text}</p>
            ${isOffer ? `
            <div class="flex gap-2 mt-3">
                <button onclick="app.acceptOffer('${m.id}')" class="btn-primary px-3 py-1 rounded-lg text-xs font-bold text-white">Accepter</button>
                <button onclick="app.rejectOffer('${m.id}')" class="btn-secondary px-3 py-1 rounded-lg text-xs font-bold">Refuser</button>
            </div>` : ''}
            ${isLoanReq ? `
            <div class="flex gap-2 mt-3">
                <button onclick="app.acceptLoanRequest('${m.id}')" class="px-3 py-1 rounded-lg text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 transition-colors">Prêter</button>
                <button onclick="app.rejectLoanRequest('${m.id}')" class="btn-secondary px-3 py-1 rounded-lg text-xs font-bold">Refuser</button>
            </div>` : ''}
        </div>`;
    }).join('');

    // Marquer tous comme lus
    this.messages.forEach(m => m.read = true);
}


// =============================================
// ÉTAPE 3 — RÉPUTATION
// =============================================
getReputationLabel() {
    if (this.reputation >= 80) return '⭐ Élite';
    if (this.reputation >= 60) return '🔶 Reconnu';
    if (this.reputation >= 40) return '📈 En progression';
    return '🌱 Débutant';
}
    // ==========================================
    // 🎓 SYSTÈME D'ACADÉMIE COMPLET
    // ==========================================

    generateAcademyClass() {
        this.academyLevel = parseInt(this.academyLevel) || 1;
        const numPlayers = 3 + Math.floor(Math.random() * (this.academyLevel + 1));
        const newYouths = [];
        // FIX #78 : réutilisation de REGIONAL_NAMES (déjà défini plus haut) au lieu d'un
        // duplicata de ~160 lignes réalloué à chaque appel de generateAcademyClass()
        const REGEN_NAMES = REGIONAL_NAMES;
        const league = LEAGUES.find(l => l.clubs.includes(this.userClubName)); // FIX #42 (était this.clubName, toujours undefined)
        const region = (league && REGEN_NAMES[league.region]) ? league.region : 'francophone';
        const fn = REGEN_NAMES[region].first;
        const ln = REGEN_NAMES[region].last;

        for(let i = 0; i < numPlayers; i++) {
            const baseOvr = 40 + (this.academyLevel * 3) + Math.floor(Math.random() * 10);
            const potBonus = Math.floor(Math.random() * 12) + (this.academyLevel * 4);
            let pot = Math.min(95, baseOvr + potBonus + 10);
            const pos = ['GB', 'DEF', 'MIL', 'ATT'][Math.floor(Math.random() * 4)];

            // FIX #43/#44 : stats variées par poste dès la génération (au lieu de "ovr-5" identique
            // pour tout le monde au moment de la promotion, qui ne différenciait aucun jeune)
            let finishing = Math.floor(baseOvr * (0.5 + Math.random()*0.6));
            let passing = Math.floor(baseOvr * (0.6 + Math.random()*0.5));
            let tackling = Math.floor(baseOvr * (0.5 + Math.random()*0.6));
            let dribbling = Math.floor(baseOvr * (0.6 + Math.random()*0.5));
            let positioning = Math.floor(baseOvr * (0.6 + Math.random()*0.5));
            let vision = Math.floor(baseOvr * (0.6 + Math.random()*0.5));
            let composure = Math.floor(baseOvr * (0.5 + Math.random()*0.6));
            let pace = Math.floor(baseOvr * (0.7 + Math.random()*0.4));
            let strength = Math.floor(baseOvr * (0.6 + Math.random()*0.5));
            if (pos === 'DEF') { tackling += 15; positioning += 10; finishing -= 15; }
            if (pos === 'ATT') { finishing += 15; composure += 10; tackling -= 15; pace += 5; }
            if (pos === 'MIL') { passing += 10; vision += 10; }
            if (pos === 'GB')  { positioning += 15; pace = 25; finishing = 10; tackling += 5; }
            let stats = { finishing, passing, tackling, dribbling, positioning, vision, composure, pace, strength };
            Object.keys(stats).forEach(k => stats[k] = Math.min(99, Math.max(20, stats[k])));

            newYouths.push({
                id: 'y_' + Math.random().toString(36).substr(2, 9) + '_' + (this._academyIdCounter = (this._academyIdCounter||0)+1), // FIX #85
                name: fn[Math.floor(Math.random() * fn.length)] + ' ' + ln[Math.floor(Math.random() * ln.length)],
                age: 15 + Math.floor(Math.random() * 3),
                position: pos,
                exactPosition: randomExactPosition(pos),   // rôle précis dès l'académie
                ovr: baseOvr,
                pot: pot,
                stats: stats, // FIX #43
                energy: 100,
                morale: 100,
                wage: 500,
                goals: 0, assists: 0, yellowCards: 0, redCards: 0, injuryDays: 0, suspensionDays: 0, // FIX #43
                contract: { duration: 1, expiresIn: 38 } // FIX #43
            });
        }
        
        // Ajouter les nouveaux joueurs à la promo existante (sans tout effacer)
        if (!Array.isArray(this.academy)) this.academy = [];
        this.academy.push(...newYouths);
    }

    upgradeAcademy() {
        this.academyLevel = parseInt(this.academyLevel) || 1;
        if (this.academyLevel >= 5) return app.showNotification("Niveau maximum atteint !", "error");
        
        const costs = { 1: 500000, 2: 1500000, 3: 3000000, 4: 6000000 };
        const cost = costs[this.academyLevel];

        if (this.budget >= cost) {
            this.budget -= cost;
            this.academyLevel++;
            app.showNotification(`✅ Académie améliorée au Niveau ${this.academyLevel} !`);
            this.saveGame();
            if (typeof this.updateHeader === 'function') this.updateHeader();
            // Générer une nouvelle promo au nouveau niveau SANS effacer les jeunes déjà présents
            this.generateAcademyClass();
            this.renderAcademy();
        } else {
            app.showNotification(`❌ Budget insuffisant (${formatMoney(cost)} requis).`, "error");
        }
    }
    renderAcademy() {
        const container = document.getElementById('academy-grid');
        if (!container) return;

        this.academyLevel = parseInt(this.academyLevel) || 1;
        
        // Initialisation uniquement au premier accès (pas après une promotion)
        if (!Array.isArray(this.academy)) this.academy = [];
        if (this.academy.length === 0 && !this._academyInitialized) {
            this.generateAcademyClass();
        }
        this._academyInitialized = true;

        const costs = { 1: 500000, 2: 1500000, 3: 3000000, 4: 6000000 };
        const nextCost = costs[this.academyLevel];
        const isMaxLevel = this.academyLevel >= 5;

        // 1. En-tête : Infrastructures
        let html = `
        <div class="panel-glass rounded-xl p-4 mb-6 border border-white/5 flex flex-wrap justify-between items-center gap-3 w-full col-span-full">
            <div>
                <h3 class="font-teko text-xl text-white uppercase">Infrastructures <span class="text-brand-400">Niv. ${this.academyLevel}</span></h3>
                <p class="text-[10px] text-slate-400">Plus le niveau est élevé, plus vous attirez de pépites.</p>
            </div>
            <div>
                ${isMaxLevel 
                    ? `<span class="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded text-xs font-bold uppercase border border-emerald-500/20">Niv. Max Atteint</span>`
                    : `<button onclick="app.upgradeAcademy()" class="py-1.5 px-3 ${this.budget >= nextCost ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} rounded text-xs font-bold transition-colors uppercase">
                        Améliorer (${formatMoney(nextCost)})
                       </button>`
                }
            </div>
        </div>`;

        // 2. Joueurs
        html += this.academy.map(p => {
            // CSS dynamique et sécurisé
            const pc = p.position === 'GB' ? 'text-amber-400 bg-amber-500/10' : p.position === 'DEF' ? 'text-blue-400 bg-blue-500/10' : p.position === 'ATT' ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'; 
            const potColor = p.pot >= 88 ? 'text-yellow-400' : p.pot >= 82 ? 'text-emerald-400' : 'text-slate-400';
            
            return `
            <div class="panel-glass rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                <div class="flex justify-between items-start gap-2">
                    <div class="w-11 h-11 rounded-full bg-ui-900 border border-white/10 overflow-hidden shrink-0">${playerFaceSVG(p)}</div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-white text-sm truncate">${p.name}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase ${pc}">${p.position}</span>
                            <span class="text-[10px] text-slate-400">${p.age} ans</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-teko text-2xl text-white leading-none">${p.ovr}</div>
                        <div class="text-[9px] font-bold ${potColor}">POT ${p.pot}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-1 text-[9px] text-slate-400">
                    <span>💰 ${formatMoney(p.wage || 500)}/mois</span>
                    <span>📋 En formation</span>
                </div>
                <button onclick="app.promoteFromAcademy('${p.id}')"
                    class="w-full py-2 bg-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-white rounded-lg text-xs font-bold transition-colors uppercase tracking-wide">
                    ↑ Promouvoir
                </button>
                <button onclick="app.openLoanMarket('${p.id}')"
                    class="w-full py-1.5 bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white rounded-lg text-[11px] font-bold transition-colors uppercase tracking-wide">
                    🤝 Prêter
                </button>
            </div>`;
        }).join('');

        container.innerHTML = html;
    }

    // ✍️ SIGNER UN JEUNE EN PRO
    // CORRECTION : Renommé en promoteFromAcademy pour matcher avec ton bouton existant
    // ✍️ SIGNER UN JEUNE EN PRO
    // CORRECTION : Renommé en promoteFromAcademy pour matcher avec ton bouton existant
    promoteFromAcademy(id) {
        if (this.userSquad.length >= 30) {
            app.showNotification("Votre effectif pro est plein (30 joueurs max) !", "error");
            return;
        }

        const index = this.academy.findIndex(y => y.id === id);
        if (index > -1) {
            const player = this.academy[index];

            // Normalisation position académie → squad
            const posMap = { 'GB': 'GB', 'DEF': 'DEF', 'MIL': 'MIL', 'ATT': 'ATT' };
            player.position = posMap[player.position] || 'MIL';

            // Stats par défaut si absentes (vieilles sauvegardes d'avant le FIX #43)
            // FIX #108 : il manquait `composure`, `dribbling` et `strength` — trois stats
            // utilisées par le moteur de match, qui retombaient silencieusement sur l'OVR brut
            // et ignoraient donc fatigue et moral.
            if (!player.stats) {
                const b = player.ovr - 5;
                player.stats = { pace: b, passing: b, finishing: b, tackling: b, vision: b,
                                 positioning: b, composure: b, dribbling: b, strength: b };
            }

            // Contrat par défaut
            if (!player.contract) {
                player.contract = { duration: 1, expiresIn: 38 };
            }

            // Champs manquants
            // FIX #108 : `||` traitait une énergie ou un moral à 0 comme absents et les
            // remontait à 100 / 80 — le même piège que le FIX #73, resté ici.
            player.energy = player.energy ?? 100;
            player.morale = player.morale ?? 80;
            player.wage = player.wage || 500;
            player.goals = 0;
            player.assists = 0;
            player.injuryDays = 0;
            player.suspensionDays = 0;
            player.yellowCards = 0;
            player.price = player.price || Math.floor(player.ovr * 1000);

            this.userSquad.push(player);
            this.academy.splice(index, 1);

            app.showNotification(`✍️ ${player.name} a signé son premier contrat pro !`);
            this.saveGame();
            this.renderAcademy();
            if (typeof this.renderSquad === 'function') this.renderSquad();
        }
    }


    // =====================================================================
    // 🏆 PALMARÈS, RECORDS ET FINS DE CARRIÈRE (LOT 12)
    // =====================================================================
    // Trois manques liés : le jeu oubliait tout d'une saison sur l'autre.
    // On archive donc le palmarès de chaque saison, on cumule les statistiques
    // de carrière de chaque joueur (compactées en tableau pour ménager la
    // sauvegarde), et on garde une trace des joueurs qui raccrochent.
    // Le tout s'inspecte dans un onglet Histoire.

    // Probabilité qu'un joueur prenne sa retraite à la fin de la saison.
    // Avant, c'était un plat "35 ans et plus : 30 % par saison" — un joueur
    // de 41 ans pouvait donc encore traîner. La courbe monte désormais.
    retirementRisk(player) {
        const age = player.age || 25;
        if (age < 33) return 0;
        let r = { 33: 0.04, 34: 0.10, 35: 0.28, 36: 0.45, 37: 0.65, 38: 0.85 }[age];
        if (r === undefined) r = 0.95;
        if ((player.ovr || 70) < 65) r += 0.10;  // un joueur en fin de course insiste moins
        if ((player.ovr || 70) >= 82) r -= 0.08; // une star tient un peu plus longtemps
        return Math.max(0, Math.min(0.98, r));
    }

    retirementLabel(risk) {
        if (risk >= 0.6) return { txt: 'Très probable', cls: 'text-red-400 bg-red-500/10' };
        if (risk >= 0.35) return { txt: 'Probable', cls: 'text-orange-400 bg-orange-500/10' };
        if (risk >= 0.15) return { txt: 'Possible', cls: 'text-yellow-400 bg-yellow-500/10' };
        return { txt: 'Peu probable', cls: 'text-emerald-400 bg-emerald-500/10' };
    }

    // =====================================================================
    // 🏅 LOT 13 — TROPHÉES INDIVIDUELS & PRIMES DE SPONSORS
    // =====================================================================
    // Ballon d'Or Africain, Soulier d'Or, Gant d'Or, meilleur passeur,
    // meilleur espoir, et meilleur buteur de CHACUN des 10 championnats.
    //
    // Les primes ne tombent que si le lauréat porte VOS couleurs. Elles sont
    // calibrées sur l'économie du jeu (prime de titre max 4 M€, prime CAF
    // 5 M€) puis pondérées par la surface financière du club : championnat
    // riche + gros budget + forte réputation = sponsors plus généreux.
    // L'enveloppe totale d'une saison est plafonnée pour ne jamais dépasser
    // la prime de champion d'Afrique.

    awardDefs() {
        return [
            { key: 'ballonDor',  icon: '🏅',  label: "Ballon d'Or Africain",           base: 2200000, desc: "Le meilleur joueur du continent, tous postes confondus." },
            { key: 'soulierDor', icon: '👟',  label: "Soulier d'Or Africain",          base: 1200000, desc: "Le plus grand buteur des 10 championnats." },
            { key: 'passeurDor', icon: '🎯',  label: "Meilleur Passeur Africain",      base:  700000, desc: "Le maître à jouer de la saison." },
            { key: 'gantDor',    icon: '🧤',  label: "Gant d'Or Africain",             base:  700000, desc: "Le gardien le plus infranchissable." },
            { key: 'espoirDor',  icon: '🌱',  label: "Meilleur Espoir Africain",       base:  600000, desc: "Le meilleur joueur de 21 ans ou moins." },
            { key: 'topScorer',  icon: '⚽',  label: "Meilleur buteur du championnat", base:  450000, desc: "Le canonnier de votre championnat." }
        ];
    }

    // Coefficient économique : 0,45 (petit club du Cameroun) à ~2,6 (mastodonte
    // sud-africain plein aux as). Sert de multiplicateur à toutes les primes.
    awardMoneyScale() {
        const tier = LEAGUE_TIER[this.userLeagueId] || 1;                 // richesse du championnat
        const budgetFactor = Math.min(2.0, Math.max(0.45, (this.budget || 0) / 15000000)); // 15 M€ = budget de départ
        const repFactor = 0.85 + Math.min(100, Math.max(0, this.reputation || 30)) / 200;  // 0,85 → 1,35
        const scale = (0.50 + tier * 0.35) * (0.50 + budgetFactor * 0.50) * repFactor;
        return Math.round(scale * 100) / 100;
    }

    awardAmount(key, scale) {
        const def = this.awardDefs().find(d => d.key === key);
        if (!def) return 0;
        const s = scale !== undefined ? scale : this.awardMoneyScale();
        // Arrondi aux 10 K€ pour un affichage propre
        return Math.round((def.base * s) / 10000) * 10000;
    }

    // Note « Ballon d'Or » d'un joueur. Utilisée aussi en cours de saison pour
    // afficher la course au trophée (rien n'est figé avant la dernière journée).
    ballonDorScore(p, team, leagueId) {
        const cafG = p.cafGoals || 0;
        const cafA = p.cafAssists || 0;
        const g = Math.max(0, (p.goals || 0) - cafG);
        const a = Math.max(0, (p.assists || 0) - cafA);
        const apps = p.seasonApps || 0;

        let s = g * 4 + a * 2.6 + cafG * 6 + cafA * 3.5 + apps * 0.35 + Math.max(0, (p.ovr || 60) - 68) * 1.5;

        // Un gardien ne marque pas : on le juge sur le mur qu'il a tenu.
        if (p.position === 'GB') s += this.gkCleanScore(p, team) * 0.8;
        if (p.position === 'DEF') s += this.gkCleanScore(p, team) * 0.35;

        // Le classement du club compte : un buteur d'une équipe reléguée ne
        // vaut pas un buteur champion.
        const league = this.globalData[leagueId];
        if (league) {
            const idx = league.standings.findIndex(t => t.name === team.name);
            if (idx === 0) s += 30; else if (idx === 1) s += 18; else if (idx === 2) s += 12; else if (idx > -1 && idx < 6) s += 6;
        }

        // Épopée continentale
        const caf = this.cafData || {};
        if (caf.winner && caf.winner === team.name) s += 30;
        else if (caf.final && ((caf.final.home && caf.final.home.name === team.name) || (caf.final.away && caf.final.away.name === team.name))) s += 15;

        // Prestige du championnat (un but en Betway Prem pèse plus qu'en Elite One)
        const prestige = 0.75 + (LEAGUE_TIER[leagueId] || 1) * 0.20;
        return Math.round(s * prestige * 10) / 10;
    }

    // Indice de solidité défensive rapporté au temps de jeu réel.
    gkCleanScore(p, team) {
        const played = Math.max(1, team.played || 1);
        const share = Math.min(1, (p.seasonApps || 0) / played);
        const gaPerGame = (team.ga || 0) / played;
        return Math.round(((2.0 - gaPerGame) * 38 * share + Math.max(0, (p.ovr || 60) - 65) * 1.2 + share * 12) * 10) / 10;
    }

    // Parcourt tout le continent et renvoie une liste à plat exploitable.
    allLeaguePlayers() {
        const out = [];
        Object.entries(this.globalData || {}).forEach(([lid, league]) => {
            const lname = (LEAGUES.find(l => l.id === lid) || {}).name || lid;
            (league.standings || []).forEach(team => {
                (team.squad || []).forEach(p => {
                    const cafG = p.cafGoals || 0, cafA = p.cafAssists || 0;
                    out.push({
                        id: p.id, name: p.name, position: p.position, age: p.age, ovr: p.ovr,
                        club: team.name, isUser: !!team.isUser, leagueId: lid, leagueName: lname,
                        goals: Math.max(0, (p.goals || 0) - cafG),
                        assists: Math.max(0, (p.assists || 0) - cafA),
                        cafGoals: cafG, apps: p.seasonApps || 0,
                        score: this.ballonDorScore(p, team, lid),
                        gkScore: this.gkCleanScore(p, team),
                        _ref: p
                    });
                });
            });
        });
        return out;
    }

    // Construit le palmarès individuel de la saison. Aucune écriture ici :
    // la fonction est réutilisée telle quelle pour la « course au Ballon d'Or »
    // affichée en cours de saison.
    computeSeasonAwards() {
        const pool = this.allLeaguePlayers();
        if (!pool.length) return null;

        const played = pool.filter(p => p.apps > 0);
        const byScore = [...played].sort((a, b) => b.score - a.score);
        const byGoals = [...played].sort((a, b) => b.goals - a.goals || b.assists - a.assists);
        const byAssists = [...played].sort((a, b) => b.assists - a.assists || b.goals - a.goals);
        const byGk = played.filter(p => p.position === 'GB' && p.apps >= 5).sort((a, b) => b.gkScore - a.gkScore);
        const byYoung = played.filter(p => (p.age || 30) <= 21 && p.apps >= 5).sort((a, b) => b.score - a.score);

        // Meilleur buteur de chaque championnat
        const leagueScorers = {};
        Object.keys(this.globalData || {}).forEach(lid => {
            const local = played.filter(p => p.leagueId === lid).sort((a, b) => b.goals - a.goals || b.assists - a.assists);
            const lname = (LEAGUES.find(l => l.id === lid) || {}).name || lid;
            leagueScorers[lid] = {
                leagueName: lname,
                podium: local.slice(0, 3).map(p => ({ name: p.name, club: p.club, goals: p.goals, assists: p.assists, isUser: p.isUser, id: p.id }))
            };
        });

        const light = p => p && {
            id: p.id, name: p.name, club: p.club, position: p.position, age: p.age, ovr: p.ovr,
            goals: p.goals, assists: p.assists, cafGoals: p.cafGoals, apps: p.apps,
            score: p.score, gkScore: p.gkScore, isUser: p.isUser,
            leagueId: p.leagueId, leagueName: p.leagueName
        };

        return {
            season: this.currentSeason || 1,
            scale: this.awardMoneyScale(),
            ballonDor: light(byScore[0]),
            nominees: byScore.slice(0, 5).map(light),
            soulierDor: byGoals[0] && byGoals[0].goals > 0 ? light(byGoals[0]) : null,
            passeurDor: byAssists[0] && byAssists[0].assists > 0 ? light(byAssists[0]) : null,
            gantDor: byGk[0] ? light(byGk[0]) : null,
            espoirDor: byYoung[0] ? light(byYoung[0]) : null,
            leagueScorers,
            paid: 0
        };
    }

    // Verse les primes, gonfle le moral des lauréats maison et note le trophée
    // sur leur fiche. Appelée UNE fois, à la dernière journée.
    applySeasonAwards(awards) {
        if (!awards || awards.applied) return awards;
        const scale = awards.scale || this.awardMoneyScale();
        const season = awards.season || this.currentSeason || 1;
        const defs = this.awardDefs();
        const lines = [];
        let total = 0;

        const winners = [
            ['ballonDor', awards.ballonDor],
            ['soulierDor', awards.soulierDor],
            ['passeurDor', awards.passeurDor],
            ['gantDor', awards.gantDor],
            ['espoirDor', awards.espoirDor],
            ['topScorer', (awards.leagueScorers[this.userLeagueId] || {}).podium ? awards.leagueScorers[this.userLeagueId].podium[0] : null]
        ];

        winners.forEach(([key, w]) => {
            if (!w) return;
            const def = defs.find(d => d.key === key);
            const amount = this.awardAmount(key, scale);
            const mine = key === 'topScorer' ? !!w.isUser : !!w.isUser;
            if (mine) {
                total += amount;
                lines.push({ key, icon: def.icon, label: def.label, player: w.name, amount });
            }
            // Marque le trophée sur la fiche du joueur (tous clubs confondus)
            const ref = this.findPlayerAnywhere(w.id);
            if (ref) {
                ref.tro = Array.isArray(ref.tro) ? ref.tro : [];
                ref.tro.unshift({ s: season, k: key });
                if (ref.tro.length > 12) ref.tro.length = 12;
                if (mine) {
                    ref.morale = Math.min(100, (ref.morale ?? 80) + 12);
                    if (Math.random() < 0.5 && ref.ovr < (ref.pot || 99)) ref.ovr += 1;
                }
            }
        });

        // Garde-fou : l'enveloppe ne doit jamais éclipser la prime de champion
        // d'Afrique (5 M€). Au-delà, les sponsors « lissent » leur chèque.
        const cap = 5000000;
        if (total > cap) {
            const ratio = cap / total;
            lines.forEach(l => l.amount = Math.round((l.amount * ratio) / 10000) * 10000);
            total = lines.reduce((s, l) => s + l.amount, 0);
        }

        if (total > 0) {
            this.budget += total;
            this.reputation = Math.min(100, (this.reputation || 30) + Math.min(8, lines.length * 2));
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'info', read: false,
                text: `🏅 Gala des trophées africains — ${lines.length} distinction${lines.length > 1 ? 's' : ''} pour ${this.userClubName} : ${lines.map(l => `${l.icon} ${l.player}`).join(', ')}. Primes des sponsors : +${formatMoney(total)}.`
            });
            this.updateHeader();
        }

        awards.rewards = lines;
        awards.paid = total;
        awards.applied = true;
        return awards;
    }

    findPlayerAnywhere(id) {
        if (!id) return null;
        let found = null;
        Object.values(this.globalData || {}).forEach(league => {
            (league.standings || []).forEach(team => {
                if (found) return;
                const p = (team.squad || []).find(x => x.id === id);
                if (p) found = p;
            });
        });
        return found;
    }

    // ---------- AFFICHAGE ----------

    awardCardHtml(def, w, scale, showMoney) {
        if (!w) return `
            <div class="bg-ui-800 rounded-lg p-3 border border-white/5 opacity-50">
                <div class="text-[10px] uppercase text-slate-500">${def.icon} ${def.label}</div>
                <div class="text-xs text-slate-600 mt-1">Non attribué cette saison</div>
            </div>`;
        const amount = this.awardAmount(def.key, scale);
        const stat = def.key === 'gantDor'
            ? `${w.apps} m. joués`
            : def.key === 'passeurDor'
                ? `${w.assists} passes déc.`
                : `${w.goals} buts &bull; ${w.assists} passes`;
        return `
            <div class="rounded-lg p-3 border ${w.isUser ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-ui-800 border-white/5'}">
                <div class="text-[10px] uppercase tracking-wider ${w.isUser ? 'text-yellow-400' : 'text-slate-500'}">${def.icon} ${def.label}</div>
                <div class="text-sm font-bold text-white mt-1 truncate">${w.name}</div>
                <div class="text-[10px] text-slate-400 truncate">${w.club} &bull; ${w.leagueName || ''}</div>
                <div class="text-[10px] text-slate-500 mt-0.5">${stat}</div>
                ${showMoney ? `<div class="text-[10px] font-bold mt-1 ${w.isUser ? 'text-emerald-400' : 'text-slate-600'}">${w.isUser ? `Prime sponsors : +${formatMoney(amount)}` : `Prime versée à ${w.club}`}</div>` : ''}
            </div>`;
    }

    // Cérémonie de fin de saison
    showAwardsModal(awards) {
        awards = awards || this.seasonAwards;
        if (!awards) { this.showAlert("Les trophées seront décernés à la fin de la saison."); return; }
        const existing = document.getElementById('awards-modal');
        if (existing) existing.remove();

        const defs = this.awardDefs();
        const scale = awards.scale || 1;
        const cards = ['ballonDor', 'soulierDor', 'passeurDor', 'gantDor', 'espoirDor']
            .map(k => this.awardCardHtml(defs.find(d => d.key === k), awards[k], scale, true)).join('');

        const scorersRows = Object.entries(awards.leagueScorers || {}).map(([lid, d]) => {
            const p = (d.podium || [])[0];
            const mine = lid === this.userLeagueId;
            return `
            <tr class="border-b border-white/5 ${mine ? 'bg-brand-500/5' : ''}">
                <td class="py-1.5 px-2 text-[10px] ${mine ? 'text-brand-400 font-bold' : 'text-slate-400'}">${d.leagueName}</td>
                <td class="py-1.5 px-2 text-[11px] ${p && p.isUser ? 'text-yellow-400 font-bold' : 'text-white'}">${p ? p.name : '—'}</td>
                <td class="py-1.5 px-2 text-[10px] text-slate-500 truncate">${p ? p.club : ''}</td>
                <td class="py-1.5 px-2 text-right font-teko text-base text-white">${p ? p.goals : '—'}</td>
            </tr>`;
        }).join('');

        const podium = (awards.nominees || []).map((n, i) => `
            <div class="flex items-center gap-2 py-1 border-b border-white/5 last:border-0">
                <span class="font-teko text-sm w-4 ${i === 0 ? 'text-yellow-400' : 'text-slate-600'}">${i + 1}</span>
                <div class="min-w-0 flex-1">
                    <div class="text-[11px] ${n.isUser ? 'text-yellow-400 font-bold' : 'text-white'} truncate">${n.name}</div>
                    <div class="text-[9px] text-slate-500 truncate">${n.club} &bull; ${n.goals} b. / ${n.assists} p.</div>
                </div>
                <span class="font-teko text-base text-slate-300">${Math.round(n.score)}</span>
            </div>`).join('');

        const modal = document.createElement('div');
        modal.id = 'awards-modal';
        modal.className = 'fixed inset-0 z-[9999] flex items-start justify-center bg-black/85 backdrop-blur-sm overflow-y-auto py-6';
        modal.innerHTML = `
            <div class="bg-ui-900 border border-white/10 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden">
                <div class="bg-gradient-to-r from-yellow-600 to-amber-400 px-4 py-4 flex items-center justify-between">
                    <div>
                        <div class="font-teko text-2xl text-white uppercase tracking-wider">🏅 Gala des Trophées Africains</div>
                        <div class="text-[10px] text-white/80">Saison ${awards.season} &bull; coefficient sponsors ×${scale}</div>
                    </div>
                    <button onclick="document.getElementById('awards-modal').remove()" class="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Fermer</button>
                </div>
                <div class="p-4">
                    ${awards.paid > 0 ? `<div class="mb-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-center">
                        <span class="text-emerald-400 font-bold text-sm">Primes encaissées : +${formatMoney(awards.paid)}</span>
                        <span class="block text-[10px] text-slate-400">${(awards.rewards || []).map(r => `${r.icon} ${r.player} (${formatMoney(r.amount)})`).join(' &bull; ') || ''}</span>
                    </div>` : `<div class="mb-3 text-center text-[11px] text-slate-500">Aucun de vos joueurs n'a été distingué cette saison. Les primes vont à leurs clubs.</div>`}

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">${cards}</div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                            <h5 class="font-teko text-base text-white uppercase mb-2">🏅 Top 5 Ballon d'Or</h5>
                            ${podium || '<p class="text-[10px] text-slate-500">Aucune donnée.</p>'}
                        </div>
                        <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                            <h5 class="font-teko text-base text-white uppercase mb-2">⚽ Meilleur buteur par championnat</h5>
                            <table class="w-full"><tbody>${scorersRows}</tbody></table>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }

    // Panneau « course aux trophées » (en direct pendant la saison) + palmarès
    // individuel des saisons passées, injecté dans l'onglet Héritage.
    awardsPanelHtml() {
        const live = this.computeSeasonAwards();
        const defs = this.awardDefs();
        const scale = this.awardMoneyScale();

        const liveCards = live
            ? ['ballonDor', 'soulierDor', 'passeurDor', 'gantDor', 'espoirDor']
                .map(k => this.awardCardHtml(defs.find(d => d.key === k), live[k], scale, false)).join('')
            : '';

        const scorersRows = live ? Object.entries(live.leagueScorers).map(([lid, d]) => {
            const p = (d.podium || [])[0];
            const mine = lid === this.userLeagueId;
            return `
            <tr class="border-b border-white/5 ${mine ? 'bg-brand-500/5' : ''}">
                <td class="py-1.5 px-2 text-[10px] ${mine ? 'text-brand-400 font-bold' : 'text-slate-400'}">${d.leagueName}</td>
                <td class="py-1.5 px-2 text-[11px] ${p && p.isUser ? 'text-yellow-400 font-bold' : 'text-white'}">${p ? p.name : '—'}</td>
                <td class="py-1.5 px-2 text-[10px] text-slate-500">${p ? p.club : ''}</td>
                <td class="py-1.5 px-2 text-right font-teko text-base text-white">${p ? p.goals : '—'}</td>
            </tr>`;
        }).join('') : '';

        const race = live ? (live.nominees || []).map((n, i) => `
            <div class="flex items-center gap-2 py-1 border-b border-white/5 last:border-0">
                <span class="font-teko text-sm w-4 ${i === 0 ? 'text-yellow-400' : 'text-slate-600'}">${i + 1}</span>
                <div class="min-w-0 flex-1">
                    <div class="text-[11px] ${n.isUser ? 'text-yellow-400 font-bold' : 'text-white'} truncate">${n.name} <span class="text-slate-600">${n.position}</span></div>
                    <div class="text-[9px] text-slate-500 truncate">${n.club} &bull; ${n.goals} b. / ${n.assists} p. / ${n.apps} m.</div>
                </div>
                <span class="font-teko text-base text-slate-300">${Math.round(n.score)}</span>
            </div>`).join('') : '';

        // Barème des primes, calibré sur le budget actuel
        const grid = defs.map(d => `
            <div class="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span class="text-[10px] text-slate-400">${d.icon} ${d.label}</span>
                <span class="font-teko text-base text-emerald-400">${formatMoney(this.awardAmount(d.key, scale))}</span>
            </div>`).join('');

        // Palmarès individuel des saisons archivées
        const hist = (this.history || []).filter(h => h.awards);
        const histHtml = hist.length === 0
            ? `<p class="text-[10px] text-slate-500">Le palmarès individuel se remplira à la fin de votre première saison.</p>`
            : `<div class="overflow-x-auto"><table class="w-full text-xs">
                <thead><tr class="text-slate-500 uppercase text-[9px] tracking-wider border-b border-white/5">
                    <th class="text-left py-2 px-2">Saison</th>
                    <th class="text-left py-2 px-2">🏅 Ballon d'Or</th>
                    <th class="text-left py-2 px-2">👟 Soulier d'Or</th>
                    <th class="text-left py-2 px-2">🧤 Gant d'Or</th>
                    <th class="text-left py-2 px-2">🌱 Espoir</th>
                    <th class="text-right py-2 px-2">💰 Primes</th>
                </tr></thead><tbody>
                ${hist.map(h => {
                    const a = h.awards;
                    const cell = w => w ? `<span class="${w.isUser ? 'text-yellow-400 font-bold' : 'text-slate-300'}">${w.name}</span><span class="block text-[9px] text-slate-600">${w.club}</span>` : '—';
                    return `<tr class="border-b border-white/5">
                        <td class="py-2 px-2 font-teko text-base text-white">S${h.season}</td>
                        <td class="py-2 px-2">${cell(a.ballonDor)}</td>
                        <td class="py-2 px-2">${cell(a.soulierDor)}</td>
                        <td class="py-2 px-2">${cell(a.gantDor)}</td>
                        <td class="py-2 px-2">${cell(a.espoirDor)}</td>
                        <td class="py-2 px-2 text-right ${a.paid > 0 ? 'text-emerald-400' : 'text-slate-600'}">${a.paid > 0 ? '+' + formatMoney(a.paid) : '—'}</td>
                    </tr>`;
                }).join('')}
                </tbody></table></div>`;

        return `
        <div class="panel-glass rounded-xl p-4 mb-4 border border-white/5">
            <div class="flex flex-wrap justify-between items-center gap-2 mb-3">
                <h4 class="font-teko text-xl text-white uppercase">🏅 Course aux trophées ${this.seasonAwards ? '' : '(en direct)'}</h4>
                <span class="text-[10px] text-slate-500">Saison ${this.currentSeason || 1} &bull; coefficient sponsors ×${scale}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">${liveCards}</div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                    <h5 class="font-teko text-base text-white uppercase mb-2">🏅 Top 5 Ballon d'Or</h5>
                    ${race || '<p class="text-[10px] text-slate-500">Aucune donnée pour l&rsquo;instant.</p>'}
                </div>
                <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                    <h5 class="font-teko text-base text-white uppercase mb-2">⚽ Buteurs par championnat</h5>
                    <table class="w-full"><tbody>${scorersRows}</tbody></table>
                </div>
                <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                    <h5 class="font-teko text-base text-white uppercase mb-2">💰 Barème des primes</h5>
                    ${grid}
                    <p class="text-[9px] text-slate-600 mt-2">Montants recalculés en direct selon votre budget, votre réputation et la richesse de votre championnat. Versés uniquement si le lauréat est chez vous.</p>
                </div>
            </div>
        </div>

        <div class="panel-glass rounded-xl p-4 mb-4 border border-white/5">
            <h4 class="font-teko text-xl text-white uppercase mb-3">📜 Palmarès individuel</h4>
            ${histHtml}
        </div>`;
    }

    // Version compacte archivée dans l'historique : on ne garde que les
    // lauréats et le buteur de VOTRE championnat, sinon la sauvegarde enfle.
    lightenAwards(a) {
        if (!a) return null;
        const w = p => p && { name: p.name, club: p.club, isUser: !!p.isUser, goals: p.goals, assists: p.assists };
        const mine = (a.leagueScorers || {})[this.userLeagueId];
        return {
            season: a.season,
            ballonDor: w(a.ballonDor),
            soulierDor: w(a.soulierDor),
            passeurDor: w(a.passeurDor),
            gantDor: w(a.gantDor),
            espoirDor: w(a.espoirDor),
            myLeagueScorer: mine && mine.podium ? w(mine.podium[0]) : null,
            paid: a.paid || 0,
            rewards: (a.rewards || []).map(r => ({ icon: r.icon, label: r.label, player: r.player, amount: r.amount }))
        };
    }

    // Archive du palmarès — appelée AVANT la remise à zéro des classements.
    recordSeasonHistory() {
        this.history = Array.isArray(this.history) ? this.history : [];
        const season = this.currentSeason || 1;
        if (this.history.some(h => h.season === season)) return; // pas deux fois la même

        const rank = (standings) => [...standings].sort((a, b) =>
            (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga)) || (b.gf - a.gf));

        const champions = {};
        Object.entries(this.globalData).forEach(([lid, league]) => {
            const sorted = rank(league.standings);
            if (sorted[0]) champions[lid] = sorted[0].name;
        });

        const mine = rank(this.globalData[this.userLeagueId].standings);
        const myIdx = mine.findIndex(c => c.isUser);
        const myClub = myIdx > -1 ? mine[myIdx] : null;

        // Meilleur buteur, tous championnats confondus
        let best = null;
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                (team.squad || []).forEach(p => {
                    if ((p.goals || 0) > 0 && (!best || p.goals > best.goals)) {
                        best = { name: p.name, club: team.name, goals: p.goals };
                    }
                });
            });
        });

        this.history.unshift({
            season,
            champions,
            userLeagueChampion: champions[this.userLeagueId] || '—',
            userClubName: this.userClubName,
            userRank: myIdx > -1 ? myIdx + 1 : null,
            userPoints: myClub ? myClub.points : null,
            cafWinner: (this.cafData && this.cafData.winner) || null,
            topScorer: best,
            awards: this.lightenAwards(this.seasonAwards), // LOT 13
            retired: []   // complété par la boucle de vieillissement, juste après
        });
    }

    // Un joueur raccroche : on garde sa fiche pour les classements de tous les temps.
    archiveRetiredPlayer(player, clubName, isUserClub) {
        this.retiredPlayers = Array.isArray(this.retiredPlayers) ? this.retiredPlayers : [];
        const car = player.car || [0, 0, 0, 0];

        // La liste « Ils ont raccroché » doit citer TOUS vos joueurs, y compris
        // une doublure qui n'a jamais foulé la pelouse.
        if (isUserClub && this.history && this.history[0]) {
            this.history[0].retired.push(`${player.name} (${player.age} ans)`);
        }
        if (car[0] === 0 && car[1] === 0) return; // aucune carrière à archiver

        this.retiredPlayers.push({
            name: player.name, position: player.position, age: player.age,
            ovr: player.ovr, club: clubName, isUserClub: !!isUserClub,
            season: this.currentSeason || 1, car
        });

        // La sauvegarde tient dans le localStorage : on ne conserve que les
        // 250 carrières les plus fournies.
        if (this.retiredPlayers.length > 250) {
            this.retiredPlayers.sort((a, b) => (b.car[1] + b.car[2]) - (a.car[1] + a.car[2]));
            this.retiredPlayers.length = 250;
        }
    }

    // Fusionne joueurs actifs et retraités pour les classements de tous les temps.
    allTimeRegistry() {
        const rows = [];
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                (team.squad || []).forEach(p => {
                    const car = p.car;
                    if (!car || (car[0] === 0 && car[1] === 0)) return;
                    rows.push({
                        name: p.name, position: p.position, club: team.name,
                        isUserClub: !!team.isUser, active: true, car, ovr: p.ovr, age: p.age
                    });
                });
            });
        });
        (this.retiredPlayers || []).forEach(r => rows.push({ ...r, active: false }));
        return rows;
    }

    renderLegacy() {
        const container = document.getElementById('legacy-container');
        if (!container) return;

        this.history = Array.isArray(this.history) ? this.history : [];
        const registry = this.allTimeRegistry();
        const onlyMine = !!this._legacyOnlyMine;

        // ---------- 1. PALMARÈS ----------
        let palmares;
        if (this.history.length === 0) {
            palmares = `<p class="text-slate-500 text-xs py-6 text-center">Aucune saison terminée pour l'instant. Le palmarès se remplira à la fin de votre première saison.</p>`;
        } else {
            palmares = `
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="text-slate-500 uppercase text-[9px] tracking-wider border-b border-white/5">
                            <th class="text-left py-2 px-2">Saison</th>
                            <th class="text-left py-2 px-2">Champion</th>
                            <th class="text-center py-2 px-2">Vous</th>
                            <th class="text-left py-2 px-2">🌍 CAF</th>
                            <th class="text-left py-2 px-2">⚽ Meilleur buteur</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.history.map(h => {
                            const isChamp = h.userLeagueChampion === h.userClubName;
                            const rankTxt = h.userRank ? `${h.userRank}${h.userRank === 1 ? 'er' : 'e'}` : '—';
                            const rankCls = h.userRank === 1 ? 'text-yellow-400' : h.userRank && h.userRank <= 3 ? 'text-emerald-400' : 'text-slate-400';
                            const cafMine = h.cafWinner === h.userClubName;
                            return `
                            <tr class="border-b border-white/5 ${isChamp ? 'bg-yellow-500/5' : ''}">
                                <td class="py-2 px-2 font-teko text-base text-white">S${h.season}</td>
                                <td class="py-2 px-2 ${isChamp ? 'text-yellow-400 font-bold' : 'text-slate-300'}">${isChamp ? '🏆 ' : ''}${h.userLeagueChampion}</td>
                                <td class="py-2 px-2 text-center font-bold ${rankCls}">${rankTxt}${h.userPoints !== null ? `<span class="block text-[9px] text-slate-600 font-normal">${h.userPoints} pts</span>` : ''}</td>
                                <td class="py-2 px-2 ${cafMine ? 'text-yellow-400 font-bold' : 'text-slate-400'}">${h.cafWinner || '—'}</td>
                                <td class="py-2 px-2 text-slate-400">${h.topScorer ? `${h.topScorer.name} <span class="text-brand-400 font-bold">${h.topScorer.goals}</span> <span class="text-slate-600 text-[9px]">${h.topScorer.club}</span>` : '—'}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
        }

        // ---------- 2. RECORDS DE TOUS LES TEMPS ----------
        const pool = onlyMine ? registry.filter(r => r.isUserClub) : registry;
        const board = (title, idx, unit) => {
            const top = [...pool].sort((a, b) => b.car[idx] - a.car[idx]).filter(r => r.car[idx] > 0).slice(0, 8);
            if (top.length === 0) return `
                <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                    <h5 class="font-teko text-base text-white uppercase mb-2">${title}</h5>
                    <p class="text-[10px] text-slate-500">Pas encore de données — les cumuls démarrent à la fin de la première saison.</p>
                </div>`;
            return `
            <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                <h5 class="font-teko text-base text-white uppercase mb-2">${title}</h5>
                ${top.map((r, i) => `
                    <div class="flex items-center gap-2 py-1 ${i < top.length - 1 ? 'border-b border-white/5' : ''}">
                        <span class="font-teko text-sm w-4 ${i === 0 ? 'text-yellow-400' : 'text-slate-600'}">${i + 1}</span>
                        <div class="min-w-0 flex-1">
                            <div class="text-[11px] text-white truncate">${r.name} ${r.active ? '' : '<span class="text-slate-600">†</span>'}</div>
                            <div class="text-[9px] ${r.isUserClub ? 'text-brand-400' : 'text-slate-500'} truncate">${r.club} &bull; ${r.car[3]} saison${r.car[3] > 1 ? 's' : ''}</div>
                        </div>
                        <span class="font-teko text-base text-white shrink-0">${r.car[idx]}<span class="text-[9px] text-slate-500 ml-0.5">${unit}</span></span>
                    </div>`).join('')}
            </div>`;
        };

        // ---------- 3. FIN DE CARRIÈRE ----------
        const veterans = this.userSquad
            .map(p => ({ p, risk: this.retirementRisk({ age: (p.age || 25) + 1, ovr: p.ovr }) }))
            .filter(v => v.risk > 0)
            .sort((a, b) => b.risk - a.risk);

        const veteranHtml = veterans.length === 0
            ? `<p class="text-slate-500 text-xs py-6 text-center">Aucun joueur de votre effectif n'approche de la fin de carrière. Le compteur s'allume à partir de 32 ans.</p>`
            : `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                ${veterans.map(({ p, risk }) => {
                    const lab = this.retirementLabel(risk);
                    const car = p.car || [0, 0, 0, 0];
                    return `
                    <div class="bg-ui-800 rounded-lg p-3 border border-white/5 flex items-center gap-3">
                        <div class="w-11 h-11 rounded-full bg-ui-900 border border-white/10 overflow-hidden shrink-0">${playerFaceSVG(p)}</div>
                        <div class="min-w-0 flex-1">
                            <div class="text-white text-xs font-bold truncate">${p.name}</div>
                            <div class="text-[10px] text-slate-400">${p.age} ans &bull; ${p.position} &bull; OVR ${p.ovr}</div>
                            <div class="text-[9px] text-slate-500 mt-0.5">Carrière : ${car[0]} m. &bull; ${car[1]} b. &bull; ${car[2]} p.</div>
                        </div>
                        <div class="text-right shrink-0">
                            <span class="text-[9px] font-bold px-2 py-0.5 rounded uppercase ${lab.cls}">${lab.txt}</span>
                            <div class="font-teko text-lg text-white leading-none mt-1">${Math.round(risk * 100)}%</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;

        const recentlyRetired = this.history.filter(h => h.retired && h.retired.length > 0).slice(0, 3);

        container.innerHTML = `
        ${this.awardsPanelHtml()}

        <div class="panel-glass rounded-xl p-4 mb-4 border border-white/5">
            <h4 class="font-teko text-xl text-white uppercase mb-3">🏆 Palmarès saison par saison</h4>
            ${palmares}
        </div>

        <div class="panel-glass rounded-xl p-4 mb-4 border border-white/5">
            <div class="flex flex-wrap justify-between items-center gap-2 mb-3">
                <h4 class="font-teko text-xl text-white uppercase">📊 Records de tous les temps</h4>
                <div class="flex gap-1">
                    <button onclick="app.setLegacyScope(false)" class="px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${onlyMine ? 'bg-ui-800 text-slate-400' : 'bg-brand-500 text-white'}">Afrique</button>
                    <button onclick="app.setLegacyScope(true)" class="px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${onlyMine ? 'bg-brand-500 text-white' : 'bg-ui-800 text-slate-400'}">Mon club</button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                ${board('⚽ Buteurs', 1, 'b')}
                ${board('🅰️ Passeurs', 2, 'p')}
                ${board('👟 Matchs joués', 0, 'm')}
            </div>
            <p class="text-[9px] text-slate-600 mt-3">† joueur retraité. Les cumuls démarrent à la fin de la première saison jouée.</p>
        </div>

        <div class="panel-glass rounded-xl p-4 border border-white/5">
            <h4 class="font-teko text-xl text-white uppercase mb-1">👴 Fin de carrière</h4>
            <p class="text-[10px] text-slate-400 mb-3">Risque de retraite à l'issue de la saison en cours, à l'âge qu'ils auront alors.</p>
            ${veteranHtml}
            ${recentlyRetired.length > 0 ? `
            <div class="mt-4 pt-3 border-t border-white/5">
                <h5 class="font-teko text-base text-slate-300 uppercase mb-2">Ils ont raccroché</h5>
                ${recentlyRetired.map(h => `<p class="text-[10px] text-slate-500">Saison ${h.season} : ${h.retired.join(', ')}</p>`).join('')}
            </div>` : ''}
        </div>`;
    }

    setLegacyScope(onlyMine) {
        this._legacyOnlyMine = !!onlyMine;
        this.renderLegacy();
    }

    // =====================================================================
    // 🤝 NÉGOCIATIONS AVEC LES CLUBS ADVERSES (LOT 10)
    // =====================================================================
    // Jusqu'ici le mercato était à sens unique : on achetait dans un vivier
    // anonyme et on vendait quand l'IA daignait faire une offre. On peut
    // désormais aller frapper à la porte d'un club précis, depuis sa fiche
    // d'effectif, pour lui acheter un joueur ou lui en emprunter un.
    //
    // Un club refuse pour de vraies raisons — piliers intouchables, effectif
    // déjà court, joueur lui-même déjà prêté, stature du demandeur — et le
    // prix demandé n'est pas le prix catalogue : il monte pour un titulaire
    // ou une pépite, il baisse si le vendeur est aux abois.

    askBuy(playerId) {
        const c = this._modalTeamCtx;
        if (c) this.requestTransfer(c.leagueId, c.name, playerId);
    }

    askLoan(playerId) {
        const c = this._modalTeamCtx;
        if (c) this.requestLoanIn(c.leagueId, c.name, playerId);
    }

    _negotiationContext(leagueId, clubName, playerId) {
        const club = this.globalData[leagueId]?.standings.find(c => c.name === clubName);
        if (!club || club.isUser || !Array.isArray(club.squad)) return null;
        const player = club.squad.find(p => p.id === playerId);
        if (!player) return null;
        const ranked = [...club.squad].sort((a, b) => b.ovr - a.ovr);
        const rank = ranked.findIndex(p => p.id === playerId);
        const value = player.price || Generator.getPlayerValue(player.ovr, player.age, player.pot);
        const budget = this.getAIClubBudget(club);
        const distressed = budget < this.getAIClubAnnualBudget(club) * 0.2;
        return { club, player, rank, value, distressed, isStarter: rank < 11 };
    }

    // --- 💰 OFFRE D'ACHAT sur la fiche d'un club ---------------------------
    requestTransfer(leagueId, clubName, playerId) {
        const ctx = this._negotiationContext(leagueId, clubName, playerId);
        if (!ctx) return;
        const { club, player, rank, value, distressed, isStarter } = ctx;

        if (this.userSquad.length >= 30) {
            return this.showNotification("Effectif complet (30 joueurs maximum).", "error");
        }
        if (player.onLoan) {
            return this.showAlert(`${club.name} ne peut pas vendre ${player.name} : il n'est chez eux qu'en prêt, il ne leur appartient pas.`);
        }
        if (club.squad.length <= 17) {
            return this.showAlert(`${club.name} refuse de négocier.\n\nLeur effectif est déjà trop court (${club.squad.length} joueurs) pour se séparer de qui que ce soit.`);
        }
        // Un club ne brade pas son ossature — sauf s'il a désespérément besoin de liquidités
        if (rank < 3 && !distressed && Math.random() < 0.8) {
            return this.showAlert(`${club.name} refuse net.\n\n${player.name} est un pilier du club : il n'est pas à vendre, quel que soit le montant.`);
        }

        let mult = 1.15 + Math.random() * 0.35;
        if (isStarter) mult += 0.25;
        if ((player.age || 25) <= 21 && (player.pot || 0) - player.ovr >= 8) mult += 0.4; // pépite
        if ((player.age || 25) >= 31) mult -= 0.25;
        if (distressed) mult -= 0.35;
        const asking = Math.max(50000, Math.round(value * Math.max(0.6, mult) / 10000) * 10000);
        const wageDemand = Math.round((player.wage || 1000) * (1.1 + Math.random() * 0.35) / 100) * 100;

        if (this.budget < asking) {
            return this.showAlert(`${club.name} réclame ${formatMoney(asking)} pour ${player.name} (OVR ${player.ovr}).\n\nVos fonds : ${formatMoney(this.budget)}. Il vous manque ${formatMoney(asking - this.budget)}.`);
        }

        this.showConfirm(
            `${club.name} accepte de négocier ${player.name}.\n\n` +
            `${player.position} • ${player.age} ans • OVR ${player.ovr} (POT ${player.pot || '?'})\n` +
            `Indemnité de transfert : ${formatMoney(asking)}\n` +
            `Salaire réclamé : ${formatMoney(wageDemand)}/mois\n` +
            (distressed ? `\n💡 Le club a besoin de liquidités : le prix est en dessous de sa valeur.` : '') +
            (isStarter ? `\n⚠️ C'est un titulaire chez eux, d'où la majoration.` : ''),
            () => {
                if (this.budget < asking) return this.showNotification("Fonds insuffisants.", "error");
                const idx = club.squad.findIndex(p => p.id === playerId);
                if (idx === -1) return this.showNotification("Ce joueur n'est plus disponible.", "error");

                club.squad.splice(idx, 1);
                this.budget -= asking;
                this.adjustAIClubBudget(club, asking);

                player.fromClub = club.name;
                player.wage = wageDemand;
                player.contract = { duration: 3, expiresIn: 114 };
                player.price = value;
                player.morale = 85;
                player.energy = 100;
                player.goals = 0; player.assists = 0;
                player.injuryDays = 0; player.suspensionDays = 0;
                player.yellowCards = 0; player.redCards = 0;
                delete player.seasonApps;
                this.userSquad.push(player);

                this.reorderAISquad(club);
                this.showNotification(`✍️ ${player.name} rejoint ${this.userClubName} pour ${formatMoney(asking)} !`);
                this.updateHeader();
                this.updateUserClubForce();
                this.refreshAllViews();
                document.getElementById('team-squad-modal')?.classList.add('hidden');
                this.saveGame();
            },
            { okLabel: 'Signer' }
        );
    }

    // --- 🤝 DEMANDE DE PRÊT à un club adverse ------------------------------
    requestLoanIn(leagueId, clubName, playerId) {
        const ctx = this._negotiationContext(leagueId, clubName, playerId);
        if (!ctx) return;
        const { club, player, rank, value, isStarter } = ctx;

        this.loansIn = Array.isArray(this.loansIn) ? this.loansIn : [];
        if (this.loansIn.length >= 4) {
            return this.showNotification("Maximum 4 joueurs empruntés simultanément.", "error");
        }
        if (this.userSquad.length >= 30) {
            return this.showNotification("Effectif complet (30 joueurs maximum).", "error");
        }
        if (player.onLoan) {
            return this.showAlert(`${player.name} est déjà en prêt à ${club.name} : il ne peut pas être re-prêté.`);
        }
        if (club.squad.length <= 17) {
            return this.showAlert(`${club.name} refuse : leur effectif (${club.squad.length}) est trop court pour se priver de quelqu'un.`);
        }
        // On ne prête pas un titulaire — sauf un jeune qu'on accepte parfois d'aguerrir ailleurs
        if (isStarter && !((player.age || 25) <= 21 && Math.random() < 0.35)) {
            return this.showAlert(`${club.name} refuse.\n\n${player.name} est titulaire chez eux (${rank + 1}e de la hiérarchie). On ne prête pas un homme dont on a besoin le week-end.`);
        }
        const myForce = this.getMyClub()?.force || 60;
        if (player.ovr > myForce + 7) {
            return this.showAlert(`${club.name} décline poliment.\n\nÀ OVR ${player.ovr}, ${player.name} vise plus haut que ${this.userClubName} (force ${myForce}). Renforcez d'abord la stature du club.`);
        }

        const fee = Math.max(0, Math.round(value * (0.03 + Math.random() * 0.03) / 1000) * 1000);
        // Plus le joueur est bon, plus son club vous laisse porter son salaire
        const shareUser = Math.min(0.95, 0.55 + (player.ovr - 55) / 100);
        const wageUser = Math.max(300, Math.round((player.wage || 1000) * shareUser / 100) * 100);

        if (this.budget < fee) {
            return this.showAlert(`Indemnité de prêt réclamée : ${formatMoney(fee)}. Vos fonds ne suffisent pas.`);
        }

        this.showConfirm(
            `${club.name} accepte de vous prêter ${player.name} pour une saison.\n\n` +
            `${player.position} • ${player.age} ans • OVR ${player.ovr}\n` +
            `Indemnité de prêt : ${formatMoney(fee)}\n` +
            `Salaire à votre charge : ${formatMoney(wageUser)}/mois (${Math.round(shareUser * 100)}%)\n\n` +
            `Il repartira automatiquement chez lui en fin de saison. Vous ne pourrez ni le vendre, ni le re-prêter.`,
            () => {
                const idx = club.squad.findIndex(p => p.id === playerId);
                if (idx === -1) return this.showNotification("Ce joueur n'est plus disponible.", "error");
                club.squad.splice(idx, 1);
                this.budget -= fee;
                this.adjustAIClubBudget(club, fee);

                const originalWage = player.wage || 1000;
                player.loanedIn = { ownerClub: club.name, leagueId, originalWage };
                player.wage = wageUser;
                player.energy = 100;
                player.morale = 80;
                player.goals = 0; player.assists = 0;
                player.injuryDays = 0; player.suspensionDays = 0;
                player.yellowCards = 0; player.redCards = 0;
                player.seasonApps = 0;
                this.userSquad.push(player);

                this.loansIn.push({
                    id: 'loanin_' + Math.random().toString(36).substr(2, 9),
                    playerId, playerName: player.name,
                    clubName: club.name, leagueId,
                    startOvr: player.ovr, originalWage,
                    season: this.currentSeason || 1
                });

                this.reorderAISquad(club);
                this.showNotification(`🤝 ${player.name} arrive en prêt de ${club.name} pour une saison.`);
                this.updateHeader();
                this.updateUserClubForce();
                this.refreshAllViews();
                document.getElementById('team-squad-modal')?.classList.add('hidden');
                this.saveGame();
            },
            { okLabel: 'Accepter le prêt' }
        );
    }

    // Fin de saison : les joueurs empruntés repartent chez eux.
    processLoanInReturns() {
        if (!Array.isArray(this.loansIn) || this.loansIn.length === 0) return;
        const loans = [...this.loansIn];
        this.loansIn = [];
        loans.forEach(loan => {
            const idx = this.userSquad.findIndex(p => p.id === loan.playerId);
            if (idx === -1) return;
            const [player] = this.userSquad.splice(idx, 1);
            const apps = player.seasonApps || 0;
            const goals = player.goals || 0;

            delete player.loanedIn;
            player.wage = loan.originalWage || player.wage;
            player.energy = 100;
            player.injuryDays = 0; player.suspensionDays = 0;
            player.yellowCards = 0; player.redCards = 0;
            player.seasonApps = 0;

            const owner = this.globalData[loan.leagueId]?.standings.find(c => c.name === loan.clubName);
            if (owner) { owner.squad.push(player); this.reorderAISquad(owner); }

            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'news', read: false,
                text: `↩️ Fin de prêt : ${player.name} retourne à ${loan.clubName} après ${apps} match${apps > 1 ? 's' : ''} et ${goals} but${goals > 1 ? 's' : ''} sous vos couleurs.`
            });
        });
    }

    // =====================================================================
    // 🤝 SYSTÈME DE PRÊTS  (LOT 8)
    // =====================================================================
    // Un jeune de l'académie qui reste sur le banc ne progresse pas : il gagne
    // ses +3/+4 OVR d'intersaison "à l'entraînement" et c'est tout. Le prêt lui
    // fait jouer de VRAIS matchs — il intègre l'effectif d'un club IA, apparaît
    // dans son onze, marque, prend des cartons — et revient avec une progression
    // proportionnelle à son temps de jeu réel.
    //
    // L'arbitrage est le vrai sel du système : un gros club forme mieux mais
    // laisse peu de place ; un club modeste garantit le temps de jeu. Le calcul
    // de `playChance` compare l'OVR du jeune au 11e homme du club d'accueil.

    findLoanablePlayer(playerId) {
        const sIdx = this.userSquad.findIndex(p => p.id === playerId);
        if (sIdx > -1) return { player: this.userSquad[sIdx], source: 'squad' };
        const aIdx = (this.academy || []).findIndex(p => p.id === playerId);
        if (aIdx > -1) return { player: this.academy[aIdx], source: 'academy' };
        return null;
    }

    // Propositions de prêt reçues pour un joueur donné.
    getLoanOffers(player) {
        const offers = [];
        Object.entries(this.globalData).forEach(([leagueId, league]) => {
            league.standings.forEach(club => {
                if (club.isUser || !Array.isArray(club.squad) || club.squad.length < 11) return;
                if (club.squad.length >= 24) return; // effectif déjà saturé, il ne prendra personne

                const sorted = [...club.squad].sort((a, b) => b.ovr - a.ovr);
                const bar = sorted[10] ? sorted[10].ovr : 60; // niveau du 11e homme = ticket d'entrée
                const force = club.force || Math.round(sorted.slice(0, 11).reduce((s, p) => s + p.ovr, 0) / 11);

                // Chance de s'installer dans le onze
                const playChance = Math.max(5, Math.min(95, Math.round(50 + (player.ovr - bar) * 7)));
                if (playChance < 12) return; // ce club-là ne le ferait jamais jouer : pas d'offre

                const value = player.price || Generator.getPlayerValue(player.ovr, player.age, player.pot);
                // Plus le club compte sur lui, plus il prend son salaire en charge
                const wageShare = Math.min(0.9, 0.35 + playChance / 220);
                const fee = Math.max(0, Math.round(value * 0.02 * (force / 70) / 1000) * 1000);

                offers.push({ clubName: club.name, leagueId, force, bar, playChance, wageShare, fee });
            });
        });
        if (offers.length === 0) return [];

        // 4 propositions contrastées : du cador (formation ++, temps de jeu --)
        // au club modeste (temps de jeu garanti).
        offers.sort((a, b) => b.force - a.force);
        const pick = [];
        const buckets = 4;
        for (let i = 0; i < buckets; i++) {
            const start = Math.floor(offers.length * i / buckets);
            const end = Math.max(start + 1, Math.floor(offers.length * (i + 1) / buckets));
            const slice = offers.slice(start, end);
            if (slice.length) pick.push(slice[Math.floor(Math.random() * slice.length)]);
        }
        return pick.filter((o, i, arr) => arr.findIndex(x => x.clubName === o.clubName) === i);
    }

    openLoanMarket(playerId) {
        const found = this.findLoanablePlayer(playerId);
        if (!found) return;
        const { player, source } = found;

        if (player.loanedIn) { // LOT 10 : on ne re-prête pas un joueur emprunté
            return this.showNotification(`${player.name} est déjà en prêt chez vous, il ne peut pas être re-prêté.`, "error");
        }
        if (source === 'squad' && this.userSquad.length <= 15) {
            return this.showNotification("Effectif trop court pour prêter (15 joueurs minimum).", "error");
        }
        if ((this.loansOut || []).length >= 6) {
            return this.showNotification("Maximum 6 joueurs prêtés simultanément.", "error");
        }
        if ((this.loansOut || []).some(l => l.playerId === playerId)) {
            return this.showNotification("Ce joueur est déjà en prêt.", "error");
        }

        const offers = this.getLoanOffers(player);
        this._loanOffersCache = offers;

        if (offers.length === 0) {
            return this.showAlert(`Aucun club ne souhaite prêter ${player.name} pour l'instant.\n\nÀ OVR ${player.ovr}, il ne trouverait de temps de jeu nulle part. Faites-le progresser à l'académie avant de le relancer sur le marché des prêts.`);
        }

        document.getElementById('loan-modal')?.remove();
        const overlay = document.createElement('div');
        overlay.id = 'loan-modal';
        overlay.style.cssText = `position:fixed; inset:0; z-index:10000; display:flex;
            align-items:center; justify-content:center; padding:16px;
            background:rgba(2,6,23,0.8); backdrop-filter:blur(4px);`;

        const rows = offers.map(o => {
            const timeColor = o.playChance >= 65 ? '#34d399' : o.playChance >= 35 ? '#fbbf24' : '#f87171';
            const timeLabel = o.playChance >= 65 ? 'Titulaire' : o.playChance >= 35 ? 'Rotation' : 'Banc';
            return `
            <div style="background:#111827; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:12px; margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <div style="min-width:0;">
                        <div style="color:#fff; font-weight:700; font-size:12px;">${o.clubName}</div>
                        <div style="color:#64748b; font-size:10px; margin-top:2px;">Force ${o.force} &bull; 11e homme OVR ${o.bar}</div>
                    </div>
                    <div style="text-align:right; flex-shrink:0;">
                        <div style="color:${timeColor}; font-weight:800; font-size:13px;">${o.playChance}%</div>
                        <div style="color:${timeColor}; font-size:9px; text-transform:uppercase; letter-spacing:0.05em;">${timeLabel}</div>
                    </div>
                </div>
                <div style="display:flex; gap:10px; margin-top:8px; font-size:10px; color:#94a3b8;">
                    <span>💰 Indemnité ${formatMoney(o.fee)}</span>
                    <span>🧾 Salaire pris en charge : ${Math.round(o.wageShare * 100)}%</span>
                </div>
                <button data-club="${o.clubName}" style="width:100%; margin-top:10px; padding:8px; border:none; border-radius:8px;
                        background:#ea580c; color:#fff; font-size:10px; font-weight:700; text-transform:uppercase;
                        letter-spacing:0.05em; cursor:pointer;">Prêter à ${o.clubName}</button>
            </div>`;
        }).join('');

        overlay.innerHTML = `
            <div style="max-width:460px; width:100%; max-height:85vh; overflow-y:auto; background:#0f172a;
                        border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:20px;
                        box-shadow:0 20px 60px rgba(0,0,0,0.6);">
                <h3 style="color:#fff; font-size:16px; font-weight:800; margin:0;">🤝 Prêter ${player.name}</h3>
                <p style="color:#94a3b8; font-size:11px; line-height:1.6; margin:6px 0 14px;">
                    ${player.age} ans &bull; ${player.position} &bull; OVR ${player.ovr} (POT ${player.pot || '?'})<br>
                    Prêt d'une saison. Sa progression au retour dépendra du <b style="color:#e2e8f0;">temps de jeu réel</b> obtenu.
                </p>
                ${rows}
                <button data-act="cancel" style="width:100%; margin-top:6px; padding:10px; border-radius:10px;
                        border:1px solid rgba(255,255,255,0.1); background:transparent; color:#94a3b8;
                        font-size:11px; font-weight:700; text-transform:uppercase; cursor:pointer;">Annuler</button>
            </div>`;

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target?.dataset?.act === 'cancel') return overlay.remove();
            const club = e.target?.dataset?.club;
            if (club) this.confirmLoan(playerId, club);
        });
        document.body.appendChild(overlay);
    }

    confirmLoan(playerId, clubName) {
        document.getElementById('loan-modal')?.remove();
        const found = this.findLoanablePlayer(playerId);
        if (!found) return;
        const { player, source } = found;

        const offer = (this._loanOffersCache || []).find(o => o.clubName === clubName);
        if (!offer) return;
        const club = this.globalData[offer.leagueId]?.standings.find(c => c.name === clubName);
        if (!club) return;

        // Retrait de l'effectif d'origine (splice en place : la référence partagée
        // avec globalData reste valide — même précaution que le FIX #82)
        if (source === 'squad') {
            const i = this.userSquad.findIndex(p => p.id === playerId);
            if (i === -1) return;
            this.userSquad.splice(i, 1);
        } else {
            const i = this.academy.findIndex(p => p.id === playerId);
            if (i === -1) return;
            this.academy.splice(i, 1);
        }

        // Il rejoint réellement l'effectif du club d'accueil : il jouera, marquera,
        // sera aligné (ou pas) selon son niveau.
        player.onLoan = { owner: this.userClubName };
        player.seasonApps = 0;
        player.goals = 0;
        player.assists = 0;
        player.energy = 100;
        player.injuryDays = 0;
        player.suspensionDays = 0;
        player.yellowCards = 0;
        player.redCards = 0;
        club.squad.push(player);
        this.reorderAISquad(club);

        this.budget += offer.fee;

        this.loansOut = this.loansOut || [];
        this.loansOut.push({
            id: 'loan_' + Math.random().toString(36).substr(2, 9),
            playerId,
            playerName: player.name,
            source,
            clubName,
            leagueId: offer.leagueId,
            startOvr: player.ovr,
            startAge: player.age,
            wageKept: Math.round((player.wage || 500) * (1 - offer.wageShare)),
            playChance: offer.playChance,
            force: offer.force,
            season: this.currentSeason || 1
        });

        this.showNotification(`🤝 ${player.name} est prêté à ${clubName} pour une saison (+${formatMoney(offer.fee)}).`);
        this.updateHeader();
        this.updateUserClubForce();
        this.renderSquad();
        this.renderAcademy();
        this.renderMarket();
        this.saveGame();
    }

    // Rappel anticipé : le joueur revient tout de suite, mais sans le bénéfice
    // d'une saison complète.
    recallFromLoan(loanId) {
        const loan = (this.loansOut || []).find(l => l.id === loanId);
        if (!loan) return;
        this.showConfirm(
            `Rappeler ${loan.playerName} de ${loan.clubName} ?\n\nLe prêt sera interrompu : il ne bénéficiera que d'une progression partielle.`,
            () => {
                this.returnLoanedPlayer(loan, { early: true });
                this.loansOut = this.loansOut.filter(l => l.id !== loanId);
                this.updateHeader();
                this.updateUserClubForce();
                this.renderSquad();
                this.renderAcademy();
                this.renderMarket();
                this.saveGame();
            },
            { okLabel: 'Rappeler' }
        );
    }

    // Appelé en TOUT DÉBUT d'intersaison : il faut lire les stats de la saison
    // écoulée AVANT que la boucle de vieillissement ne remette goals/apps à zéro.
    processLoanReturns() {
        if (!Array.isArray(this.loansOut) || this.loansOut.length === 0) return;
        const loans = [...this.loansOut];
        this.loansOut = [];
        loans.forEach(loan => this.returnLoanedPlayer(loan, { early: false }));
    }

    returnLoanedPlayer(loan, opts = {}) {
        const club = this.globalData[loan.leagueId]?.standings.find(c => c.name === loan.clubName);
        let player = null;
        if (club) {
            const idx = club.squad.findIndex(p => p.id === loan.playerId);
            if (idx > -1) player = club.squad.splice(idx, 1)[0];
            this.reorderAISquad(club);
        }
        if (!player) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'warning', read: false,
                text: `⚠️ ${loan.playerName} est introuvable à ${loan.clubName} — le prêt est annulé.`
            });
            return;
        }

        delete player.onLoan;

        const apps = player.seasonApps || 0;
        const goals = player.goals || 0;
        const assists = player.assists || 0;
        const totalMatches = Math.max(1, ((this.globalData[loan.leagueId]?.standings.length || 19) - 1) * 2);
        const ratio = Math.min(1, apps / totalMatches);
        // Être formé au-dessus de son niveau accélère la progression
        const levelBonus = (loan.force || 65) >= player.ovr + 5 ? 1 : 0;

        let gain = 0;
        let verdict = '';
        if (opts.early) {
            gain = Math.max(0, Math.round(ratio * 2));
            verdict = 'Prêt interrompu en cours de route';
        } else if (ratio >= 0.6) {
            gain = 3 + Math.floor(Math.random() * 3) + levelBonus;
            verdict = 'Saison pleine, il a tout joué';
        } else if (ratio >= 0.3) {
            gain = 1 + Math.floor(Math.random() * 3);
            verdict = 'Temps de jeu correct';
        } else {
            gain = Math.floor(Math.random() * 2);
            verdict = 'Trop peu utilisé, prêt raté';
        }
        gain += Math.min(2, Math.floor(goals / 6));

        const pot = player.pot || 85;
        const before = player.ovr;
        player.ovr = Math.min(pot, player.ovr + gain);
        const realGain = player.ovr - before;

        // Les stats détaillées suivent la progression, sinon le moteur de match
        // continuerait à le faire jouer comme avant son départ.
        if (player.stats && realGain > 0) {
            Object.keys(player.stats).forEach(k => {
                player.stats[k] = Math.min(99, player.stats[k] + Math.round(realGain * (0.5 + Math.random() * 0.7)));
            });
        }

        player.morale = Math.max(30, Math.min(100, 55 + Math.round(ratio * 45)));
        player.energy = 100;
        player.injuryDays = 0;
        player.suspensionDays = 0;
        player.yellowCards = 0;
        player.redCards = 0;
        player.seasonApps = 0;
        player.goals = 0;
        player.assists = 0;
        player.price = Generator.getPlayerValue(player.ovr, player.age, player.pot);

        // Retour dans sa structure d'origine
        let destination;
        if (loan.source === 'academy' && (player.age || 18) <= 21) {
            if (!Array.isArray(this.academy)) this.academy = [];
            this.academy.push(player);
            destination = "à l'académie";
        } else if (this.userSquad.length < 30) {
            player.contract = player.contract || { duration: 2, expiresIn: 76 };
            player.wage = player.wage || 500;
            this.userSquad.push(player);
            destination = "dans l'effectif pro";
        } else {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'warning', read: false,
                text: `⚠️ ${player.name} rentre de prêt mais votre effectif est plein (30). Il est laissé libre.`
            });
            return;
        }

        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'academy', read: false,
            text: `🔙 Retour de prêt : ${player.name} rentre de ${loan.clubName} ${destination}. ` +
                  `${apps} match${apps > 1 ? 's' : ''}, ${goals} but${goals > 1 ? 's' : ''}, ${assists} passe${assists > 1 ? 's' : ''} — ` +
                  `${verdict}. OVR ${before} → ${player.ovr} (${realGain >= 0 ? '+' : ''}${realGain}).`
        });
    }

    // LOT 10 : les joueurs qu'on a fait venir en prêt
    renderLoansInPanel() {
        this.loansIn = Array.isArray(this.loansIn) ? this.loansIn : [];
        if (this.loansIn.length === 0) return '';
        const cards = this.loansIn.map(l => {
            const p = this.userSquad.find(x => x.id === l.playerId);
            const apps = p?.seasonApps || 0;
            const goals = p?.goals || 0;
            return `
            <div class="bg-ui-800 rounded-lg p-3 border border-sky-500/20 flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-ui-900 border border-white/10 overflow-hidden shrink-0">${playerFaceSVG(p || { id: l.playerId, name: l.playerName, position: 'MIL' })}</div>
                <div class="min-w-0 flex-1">
                    <div class="text-white text-xs font-bold truncate">${l.playerName} <span class="text-slate-500 font-normal">OVR ${p?.ovr ?? l.startOvr}</span></div>
                    <div class="text-[10px] text-slate-400 truncate">emprunté à ${l.clubName} &bull; ${apps} match${apps > 1 ? 's' : ''}, ⚽ ${goals}</div>
                </div>
            </div>`;
        }).join('');
        return `
            <div class="panel-glass rounded-xl p-4 mb-4 border border-sky-500/20">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-teko text-lg text-white uppercase">⬇️ Emprunts en cours (${this.loansIn.length}/4)</h4>
                    <span class="text-[10px] text-slate-400">Repartent en fin de saison</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${cards}</div>
            </div>`;
    }

    renderLoansPanel() {
        const container = document.getElementById('loans-panel');
        if (!container) return;

        this.loansOut = Array.isArray(this.loansOut) ? this.loansOut : [];

        if (this.loansOut.length === 0) {
            container.innerHTML = this.renderLoansInPanel() + `
                <div class="panel-glass rounded-xl p-4 mb-4 border border-white/5">
                    <h4 class="font-teko text-lg text-white uppercase">🤝 Prêts sortants</h4>
                    <p class="text-[11px] text-slate-400 mt-1">
                        Aucun joueur prêté. Envoyez vos jeunes de l'académie chercher du temps de jeu ailleurs :
                        ils reviendront plus forts. Le bouton « Prêter » se trouve sur chaque fiche de joueur (Académie et Effectif).
                    </p>
                </div>`;
            return;
        }

        const cards = this.loansOut.map(l => {
            const club = this.globalData[l.leagueId]?.standings.find(c => c.name === l.clubName);
            const p = club?.squad.find(x => x.id === l.playerId);
            const apps = p?.seasonApps || 0;
            const goals = p?.goals || 0;
            const ovrNow = p?.ovr ?? l.startOvr;
            const total = Math.max(1, ((this.globalData[l.leagueId]?.standings.length || 19) - 1) * 2);
            const pct = Math.min(100, Math.round(apps / total * 100));
            const barColor = pct >= 60 ? 'bg-emerald-500' : pct >= 30 ? 'bg-yellow-500' : 'bg-red-500';
            return `
            <div class="bg-ui-800 rounded-lg p-3 border border-white/5">
                <div class="flex justify-between items-start gap-2">
                    <div class="w-9 h-9 rounded-full bg-ui-900 border border-white/10 overflow-hidden shrink-0">${playerFaceSVG(p || { id: l.playerId, name: l.playerName, age: l.startAge, position: 'MIL' })}</div>
                    <div class="min-w-0 flex-1">
                        <div class="text-white text-xs font-bold truncate">${l.playerName}</div>
                        <div class="text-[10px] text-slate-400 truncate">→ ${l.clubName}</div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <div class="font-teko text-xl text-white leading-none">${ovrNow}</div>
                        <div class="text-[9px] text-slate-500">départ ${l.startOvr}</div>
                    </div>
                </div>
                <div class="mt-2">
                    <div class="flex justify-between text-[9px] text-slate-400 mb-1">
                        <span>Temps de jeu : ${apps}/${total}</span><span>⚽ ${goals}</span>
                    </div>
                    <div class="h-1 w-full bg-ui-900 rounded-full overflow-hidden">
                        <div class="h-full ${barColor}" style="width:${pct}%"></div>
                    </div>
                </div>
                <button onclick="app.recallFromLoan('${l.id}')" class="w-full mt-2 py-1 text-[9px] font-bold uppercase rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                    ↩ Rappeler
                </button>
            </div>`;
        }).join('');

        container.innerHTML = `
            ${this.renderLoansInPanel()}
            <div class="panel-glass rounded-xl p-4 mb-4 border border-white/5">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-teko text-lg text-white uppercase">🤝 Prêts sortants (${this.loansOut.length}/6)</h4>
                    <span class="text-[10px] text-slate-400">Retour automatique en fin de saison</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${cards}</div>
            </div>`;
    }


// =============================================
// ÉTAPE 5 — CAF CHAMPIONS LEAGUE
// =============================================
// FIX #91 : les clubs CAF sont des COPIES faites au tirage (nom + force figée), mais leur
// `squad` pointe sur le vrai effectif. Leur `force` restait donc celle du jour du tirage
// pendant toute la compétition : blessures, suspensions, transferts et progression des
// joueurs n'avaient aucun effet sur les matchs de CAF. On la recalcule ici, comme pour
// les clubs de championnat.
refreshCAFForces() {
    if (!this.cafData || !Array.isArray(this.cafData.groups)) return;
    const recalc = (club) => {
        if (!club || !Array.isArray(club.squad) || club.squad.length === 0) return;
        const starters = club.squad.slice(0, 11);
        club.force = Math.round(
            starters.reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0)
            / (starters.length || 1)
        );
    };
    this.cafData.groups.forEach(g => g.forEach(recalc));
    (this.cafData.quarterFinals || []).forEach(m => { recalc(m.home); recalc(m.away); });
    (this.cafData.semiFinals || []).forEach(m => { recalc(m.home); recalc(m.away); });
    if (this.cafData.final) { recalc(this.cafData.final.home); recalc(this.cafData.final.away); }
}

initCAF(userQualified = false) {
    // 1 champion par ligue (10 clubs) + les 6 meilleurs 2es (wild cards) = 16 clubs → 4 groupes de 4
    const champions = [];
    const runners = [];

    Object.values(this.globalData).forEach(league => {
        const sorted = [...league.standings].sort((a, b) =>
            (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga)));
        // FIX #103 : on référence directement le club du classement au lieu d'en faire une COPIE.
        // Avant, `initCAF` créait des objets neufs — mais au rechargement, la réhydratation
        // (`findRealClub`) remplaçait ces copies par les vrais clubs. Résultat : le jeu se
        // comportait différemment avant et après un rechargement, et les compteurs CAF finissaient
        // écrits sur les objets réels sans jamais être remis à zéro (cf. #104).
        if (sorted[0]) champions.push(sorted[0]);
        if (sorted[1]) runners.push(sorted[1]);
    });

    // Les 6 meilleures wild cards triées par force
    const wildCards = runners.sort((a, b) => b.force - a.force).slice(0, 6);
    const qualifiedClubs = [...champions, ...wildCards]; // 10 + 6 = 16 clubs

    // FIX #104 : remise à zéro des compteurs de la compétition au tirage.
    // Ils n'étaient JAMAIS réinitialisés : le classement du championnat l'était bien en début
    // de saison (points, gf, ga…), mais pas cafPoints/cafW/cafD/cafL/cafGF/cafGA. Dès la
    // saison 2, les groupes démarraient donc avec les points de la saison précédente et la
    // qualification pour les quarts se jouait sur des résultats périmés.
    qualifiedClubs.forEach(c => {
        c.cafPoints = 0; c.cafW = 0; c.cafD = 0; c.cafL = 0; c.cafGF = 0; c.cafGA = 0;
    });

    // 4 groupes de 4 clubs
    const shuffled = qualifiedClubs.sort(() => Math.random() - 0.5);
    const groups = [[], [], [], []];
    shuffled.forEach((c, i) => groups[i % 4].push(c));

    this.cafData = {
        phase: 'groupes',
        groups: groups,
        groupResults: groups.map(() => []),
        userGroup: groups.findIndex(g => g.some(c => c.name === this.userClubName)),
        semiFinals: [],
        final: null,
        winner: null,
        // Journées calendrier où chaque phase se déverrouille
        unlockMatchday: {
            groupes: 6,
            quarts: 9, // FIX #15 : clé manquante (badge "déverrouillé" affiché en permanence sinon)
            semis: 18,
            finale: 24
        }
    };

    if (userQualified) {
        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'info', read: false,
            text: `🏆 CAF Champions League lancée ! Votre club est qualifié. Rendez-vous dans l'onglet Coupes !`
        });
        this.showNotification('🌍 Qualifié pour la CAF Champions League !');
    } else {
    const userLeagueStandings = this.globalData[this.userLeagueId]?.standings;
    const userRank = userLeagueStandings
        ? [...userLeagueStandings].sort((a, b) => (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga))).findIndex(c => c.isUser) + 1
        : '?';
    this.messages.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: 'warning', read: false,
        text: `😤 Vous avez terminé ${userRank}e — la CAF vous a échappé ! Terminez top 2 la saison prochaine pour vous qualifier. Les meilleurs clubs africains s'affrontent sans vous...`
    });
    this.showNotification(`🌍 Non qualifié pour la CAF (${userRank}e). Visez le top 2 !`, 'warning');
}
}

simulateCAFGroupMatches() {
    if (!this.cafData || this.cafData.phase !== 'groupes') return;

    // 2. Les 2 premiers de chaque groupe → 8 clubs pour les quarts
    // Tirage : 1er Groupe A vs 2e Groupe B, 1er Groupe B vs 2e Groupe A, etc.
    const qualifiers = [];
    this.cafData.groups.forEach(g => {
        const sorted = [...g].sort((a, b) => (b.cafPoints || 0) - (a.cafPoints || 0) || (((b.cafGF||0)-(b.cafGA||0)) - ((a.cafGF||0)-(a.cafGA||0)))); // FIX #14
        qualifiers.push(sorted[0], sorted[1]); // [0]=1er, [1]=2e par groupe
    });
    // qualifiers : [1erA, 2eA, 1erB, 2eB, 1erC, 2eC, 1erD, 2eD]
    this.cafData.quarterFinals = [
        { home: qualifiers[0], away: qualifiers[3] }, // 1erA vs 2eB
        { home: qualifiers[2], away: qualifiers[1] }, // 1erB vs 2eA
        { home: qualifiers[4], away: qualifiers[7] }, // 1erC vs 2eD
        { home: qualifiers[6], away: qualifiers[5] }, // 1erD vs 2eC
    ];
    this.cafData.phase = 'quarts';

    // 3. Injecter les Quarts (Aller/Retour) slots [6] et [7]
    const quarterSlot1 = this.cafSlots ? this.cafSlots[6] : this.matchday + 3;
    const quarterSlot2 = this.cafSlots ? this.cafSlots[7] : this.matchday + 6;

    this.cafData.quarterFinals.forEach((qf, index) => {
        this.fixtures.push({ home: qf.home, away: qf.away, type: 'CAF_QUARTER', quarterIndex: index, matchday: quarterSlot1, played: false });
        this.fixtures.push({ home: qf.away, away: qf.home, type: 'CAF_QUARTER', quarterIndex: index, matchday: quarterSlot2, played: false });
    });
    this.fixtures.sort((a, b) => a.matchday - b.matchday);

    // 4. Message joueur
    const userQualified = qualifiers.some(c => c.name === this.userClubName);
    if (userQualified) {
        this.budget += 1000000;
        this.reputation = Math.min(100, this.reputation + 3);
        this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `🌍 Qualifié en Quarts de finale CAF ! +1M€` });
        this.showNotification('🏆 Qualifié pour les quarts CAF ! +1M€');
    } else if (this.cafData.userGroup !== -1) {
        this.cafData.userEliminated = 'groupes';
        this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `😞 Votre club est éliminé de la CAF Champions League dès la phase de groupes. Terminez Top 2 la saison prochaine pour aller plus loin.` });
        this.showNotification('❌ Élimination en phase de groupes CAF.');
    }
    this.saveGame();
    this.renderCAF();
}

simulateCAFSemiFinals() {
    if (!this.cafData || this.cafData.phase !== 'quarts') return;

    // Les vainqueurs des quarts → 4 demi-finalistes
    // On détermine le vainqueur par aggrégat ou aléatoirement si pas stocké
    const semiTeams = [];
    this.cafData.quarterFinals.forEach(qf => {
        // Si un winner est déjà stocké (via processCAFKnockoutStats), on l'utilise
        if (qf.winner) {
            semiTeams.push(qf.winner);
        } else {
            // Fallback aléatoire pondéré par force
            const total = (qf.home.force || 70) + (qf.away.force || 70);
            semiTeams.push(Math.random() * total < (qf.home.force || 70) ? qf.home : qf.away);
        }
    });

    this.cafData.semiFinals = [
        { home: semiTeams[0], away: semiTeams[1] },
        { home: semiTeams[2], away: semiTeams[3] },
    ];
    this.cafData.phase = 'semis';

    // Slots [8] et [9]
    const semiSlot1 = this.cafSlots ? this.cafSlots[8] : this.matchday + 3;
    const semiSlot2 = this.cafSlots ? this.cafSlots[9] : this.matchday + 6;

    this.cafData.semiFinals.forEach((sf, index) => {
        this.fixtures.push({ home: sf.home, away: sf.away, type: 'CAF_SEMI', semiIndex: index, matchday: semiSlot1, played: false });
        this.fixtures.push({ home: sf.away, away: sf.home, type: 'CAF_SEMI', semiIndex: index, matchday: semiSlot2, played: false });
    });
    this.fixtures.sort((a, b) => a.matchday - b.matchday);

    const userQualified = semiTeams.some(c => c.name === this.userClubName);
    if (userQualified) {
        this.budget += 2000000;
        this.reputation = Math.min(100, this.reputation + 5);
       this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `🌍 Qualifié en Demi-finale CAF ! +2M€` });
        this.showNotification('🏆 Qualifié pour les demi-finales CAF ! +2M€');
    } else if (this.cafData.userGroup !== -1) {
        this.cafData.userEliminated = 'quarts';
        this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `😞 Votre club est éliminé en Quarts de finale de la CAF Champions League. Belle campagne continentale !` });
        this.showNotification('❌ Élimination en Quarts de finale CAF.');
    }
    this.saveGame();
    this.renderCAF();
}

simulateCAFFinal() {
    if (!this.cafData || this.cafData.phase !== 'semis') return;

    const finalists = [];
    this.cafData.semiFinals.forEach(sf => {
        if (sf.winner) {
            finalists.push(sf.winner);
        } else {
            const total = (sf.home.force || 70) + (sf.away.force || 70);
            finalists.push(Math.random() * total < (sf.home.force || 70) ? sf.home : sf.away);
        }
    });

    this.cafData.final = { home: finalists[0], away: finalists[1] };
    this.cafData.phase = 'finale';

    // Slot [10] pour la finale
    const finalSlot = this.cafSlots ? this.cafSlots[10] : this.matchday + 3;
    this.fixtures.push({ home: finalists[0], away: finalists[1], type: 'CAF_FINAL', matchday: finalSlot, played: false });
    this.fixtures.sort((a, b) => a.matchday - b.matchday);

    const userInFinal = finalists.some(c => c.name === this.userClubName);
    if (userInFinal) {
        this.budget += 3000000;
        this.reputation = Math.min(100, this.reputation + 8);
        this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `🌍 FINALE CAF ! +3M€` });
        this.showNotification('🏆 Votre club est en FINALE CAF ! +3M€');
    } else if (this.cafData.userGroup !== -1 && !this.cafData.userEliminated) {
        this.cafData.userEliminated = 'semis';
        this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `😞 Votre club est éliminé en Demi-finale de la CAF Champions League. Quelle belle aventure continentale !` });
        this.showNotification('❌ Élimination en Demi-finale CAF.');
    }
    this.saveGame();
    this.renderCAF();
}

simulateCAFWinner() {
        if (!this.cafData || this.cafData.phase !== 'finale' || !this.cafData.final) return;

        // --- CORRECTION : On récupère le vrai vainqueur calculé lors de la finale ---
        const winner = this.cafData.final.winner || this.cafData.final.home; 
        
        this.cafData.winner = winner.name;
        this.cafData.phase = 'terminé';

        if (winner.name === this.userClubName) {
            this.budget += 5000000;
            this.reputation = Math.min(100, this.reputation + 15);
            setTimeout(() => this.showAlert(`🏆🌍 CHAMPION D'AFRIQUE !\n\n${this.userClubName} remporte la CAF Champions League !\nPrime : +5 M€`), 500); // FIX #97
        } else {
            setTimeout(() => this.showAlert(`🏆 La CAF Champions League est remportée par ${winner.name}.`), 500); // FIX #97
        }
        
        this.saveGame();
        this.renderCAF();
    }


renderCAF() {
    const container = document.getElementById('caf-container');
    if (!container) return;

    // ── STYLES INJECTÉS UNE SEULE FOIS ──────────────────────────────────────
    if (!document.getElementById('caf-styles')) {
        const style = document.createElement('style');
        style.id = 'caf-styles';
        style.textContent = `
        .caf-wrapper { font-family:'Inter',sans-serif; color:#e2e8f0; }

        .caf-hero {
            position:relative; overflow:hidden; border-radius:16px;
            margin-bottom:20px; padding:28px 24px 22px;
            background:linear-gradient(135deg,#0a0e17 0%,#0f1a2e 50%,#0a0e17 100%);
            border:1px solid rgba(234,179,8,0.25);
        }
        .caf-hero::before {
            content:''; position:absolute; inset:0;
            background:radial-gradient(ellipse 70% 80% at 50% -10%,rgba(234,179,8,0.12) 0%,transparent 65%);
            pointer-events:none;
        }
        .caf-hero-stars {
            position:absolute; top:0; left:0; right:0; height:100%;
            background-image:
                radial-gradient(1px 1px at 15% 20%,rgba(255,255,255,0.5) 0%,transparent 100%),
                radial-gradient(1px 1px at 35% 40%,rgba(255,255,255,0.3) 0%,transparent 100%),
                radial-gradient(1px 1px at 60% 15%,rgba(255,255,255,0.4) 0%,transparent 100%),
                radial-gradient(1px 1px at 80% 30%,rgba(255,255,255,0.3) 0%,transparent 100%),
                radial-gradient(1px 1px at 90% 60%,rgba(255,255,255,0.2) 0%,transparent 100%),
                radial-gradient(1px 1px at 25% 70%,rgba(255,255,255,0.3) 0%,transparent 100%);
            pointer-events:none;
        }
        .caf-logo-ring {
            width:64px; height:64px; border-radius:50%;
            border:2px solid rgba(234,179,8,0.5);
            display:flex; align-items:center; justify-content:center;
            background:radial-gradient(circle,rgba(234,179,8,0.15) 0%,transparent 70%);
            box-shadow:0 0 20px rgba(234,179,8,0.2),inset 0 0 10px rgba(234,179,8,0.1);
            font-size:28px; flex-shrink:0;
        }
        .caf-competition-name {
            font-family:'Teko',sans-serif; font-size:28px; font-weight:700;
            line-height:1; letter-spacing:0.06em; text-transform:uppercase;
            background:linear-gradient(135deg,#fde68a 0%,#f59e0b 50%,#fde68a 100%);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .caf-phase-badge {
            display:inline-flex; align-items:center; gap:6px;
            padding:4px 12px; border-radius:20px;
            font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;
        }
        .caf-phase-badge.locked { background:rgba(100,116,139,0.1); border:1px solid rgba(100,116,139,0.3); color:#64748b; }
        .caf-phase-badge.unlocked { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); color:#34d399; }
        .caf-meta { font-size:11px; color:#475569; text-transform:uppercase; letter-spacing:0.08em; font-weight:600; }
        .caf-btn-action {
            display:inline-flex; align-items:center; gap:8px;
            padding:10px 20px; border-radius:10px;
            font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;
            cursor:pointer; transition:all 0.2s;
            background:linear-gradient(135deg,#b45309,#d97706,#b45309);
            border:1px solid rgba(234,179,8,0.4); color:#fef3c7;
            box-shadow:0 4px 15px rgba(180,83,9,0.4);
        }
        .caf-btn-action:hover {
            background:linear-gradient(135deg,#d97706,#f59e0b,#d97706);
            box-shadow:0 4px 20px rgba(245,158,11,0.5); transform:translateY(-1px);
        }
        .caf-hint { font-size:10px; color:#475569; display:flex; align-items:center; gap:5px; }
        .caf-section-title {
            font-family:'Teko',sans-serif; font-size:13px; font-weight:700;
            text-transform:uppercase; letter-spacing:0.15em; color:#94a3b8;
            display:flex; align-items:center; gap:8px; margin-bottom:14px;
        }
        .caf-section-title::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(255,255,255,0.08),transparent); }
        .caf-group-card { border-radius:14px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); background:#111827; }
        .caf-group-card.is-user-group { border-color:rgba(249,115,22,0.35); box-shadow:0 0 20px rgba(249,115,22,0.06); }
        .caf-group-header {
            padding:10px 16px; display:flex; align-items:center; justify-content:space-between;
            background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.05);
        }
        .caf-group-letter { font-family:'Teko',sans-serif; font-size:20px; font-weight:700; color:#f59e0b; letter-spacing:0.05em; }
        .caf-group-yours {
            font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:#f97316; font-weight:700;
            background:rgba(249,115,22,0.1); padding:2px 8px; border-radius:10px; border:1px solid rgba(249,115,22,0.2);
        }
        .caf-col-headers {
            display:grid; grid-template-columns:1fr 28px 28px 28px 44px;
            padding:5px 16px; font-size:9px; font-weight:700;
            text-transform:uppercase; letter-spacing:0.1em; color:#334155;
            border-bottom:1px solid rgba(255,255,255,0.04);
        }
        .caf-team-row {
            display:grid; grid-template-columns:1fr 28px 28px 28px 44px;
            align-items:center; padding:9px 16px;
            border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s;
        }
        .caf-team-row:last-child { border-bottom:none; }
        .caf-team-row:hover { background:rgba(255,255,255,0.03); }
        .caf-team-row.qualified { background:rgba(16,185,129,0.05); }
        .caf-team-row.qualified .caf-rank { color:#34d399; }
        .caf-rank { font-family:'Teko',sans-serif; font-size:15px; color:#475569; width:18px; flex-shrink:0; }
        .caf-team-name { font-size:12px; font-weight:600; color:#cbd5e1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .caf-team-name.is-user { color:#f97316; }
        .caf-stat { font-family:'Teko',sans-serif; font-size:14px; color:#475569; text-align:center; }
        .caf-pts { font-family:'Teko',sans-serif; font-size:17px; font-weight:700; color:#f1f5f9; text-align:right; }
        .caf-pts.top { color:#f59e0b; }
        .caf-bracket-card { border-radius:14px; background:#111827; border:1px solid rgba(255,255,255,0.06); overflow:hidden; }
        .caf-bracket-header {
            padding:12px 18px; background:linear-gradient(90deg,rgba(234,179,8,0.08),transparent);
            border-bottom:1px solid rgba(234,179,8,0.15); display:flex; align-items:center; gap:10px;
        }
        .caf-bracket-title { font-family:'Teko',sans-serif; font-size:18px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#fbbf24; }
        .caf-match-block { padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.05); }
        .caf-match-block:last-child { border-bottom:none; }
        .caf-match-label { font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:#334155; font-weight:700; margin-bottom:8px; }
        .caf-match-clubs { display:flex; align-items:center; gap:10px; }
        .caf-club-chip { flex:1; display:flex; align-items:center; gap:8px; min-width:0; }
        .caf-club-chip.right { flex-direction:row-reverse; }
        .caf-club-crest {
            width:32px; height:32px; border-radius:6px;
            background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
            display:flex; align-items:center; justify-content:center;
            font-family:'Teko',sans-serif; font-size:11px; font-weight:700; color:#94a3b8; flex-shrink:0;
        }
        .caf-club-chip.is-user .caf-club-crest { border-color:rgba(249,115,22,0.4); color:#f97316; background:rgba(249,115,22,0.08); }
        .caf-club-chip-name { font-size:12px; font-weight:700; color:#e2e8f0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .caf-club-chip.is-user .caf-club-chip-name { color:#f97316; }
        .caf-score-block { display:flex; flex-direction:column; align-items:center; gap:2px; flex-shrink:0; }
        .caf-score-main { font-family:'Teko',sans-serif; font-size:24px; font-weight:700; color:#f1f5f9; letter-spacing:0.05em; line-height:1; }
        .caf-score-main.pending { color:#334155; }
        .caf-score-sub { font-size:9px; color:#475569; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; }
        .caf-winner-tag { display:inline-flex; align-items:center; gap:4px; margin-top:8px; font-size:10px; font-weight:700; color:#34d399; text-transform:uppercase; letter-spacing:0.08em; }
        .caf-winner-screen {
            border-radius:16px; background:linear-gradient(135deg,#0a0e17,#1a1200,#0a0e17);
            border:1px solid rgba(234,179,8,0.4); padding:36px 24px; text-align:center;
            position:relative; overflow:hidden; margin-bottom:20px;
        }
        .caf-winner-screen::before {
            content:''; position:absolute; inset:0;
            background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(234,179,8,0.18) 0%,transparent 70%);
        }
        .caf-winner-trophy { font-size:56px; margin-bottom:12px; filter:drop-shadow(0 0 20px rgba(234,179,8,0.6)); position:relative; }
        .caf-winner-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:#92400e; margin-bottom:6px; position:relative; }
        .caf-winner-name {
            font-family:'Teko',sans-serif; font-size:38px; font-weight:700;
            text-transform:uppercase; letter-spacing:0.05em; line-height:1;
            background:linear-gradient(135deg,#fde68a,#f59e0b,#fde68a);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; position:relative;
        }
        .caf-locked-screen { border-radius:16px; background:#111827; border:1px solid rgba(255,255,255,0.06); padding:48px 24px; text-align:center; }
        .caf-locked-icon { font-size:44px; margin-bottom:14px; }
        .caf-locked-title { font-family:'Teko',sans-serif; font-size:26px; color:#e2e8f0; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px; }
        .caf-locked-sub { font-size:12px; color:#475569; max-width:320px; margin:0 auto; line-height:1.6; }
        `;
        document.head.appendChild(style);
    }

    // ── VUE : AUCUNE DONNÉE ──────────────────────────────────────────────────
    if (!this.cafData) {
        container.innerHTML = `
        <div class="caf-wrapper">
            <div class="caf-locked-screen">
                <div class="caf-locked-icon">🌍</div>
                <div class="caf-locked-title">CAF Champions League</div>
                <p class="caf-locked-sub">La compétition continentale se lance en fin de saison. Terminez dans le <strong style="color:#f97316">Top 2</strong> de votre ligue pour y participer.</p>
            </div>
        </div>`;
        return;
    }

    const { phase, groups, semiFinals, final, winner } = this.cafData;
    const isUserInCAF = this.cafData.userGroup !== -1;
    const currentMd = this.matchday;
    const unlock = this.cafData?.unlockMatchday || { groupes: 6, semis: 18, finale: 24 };
    const phaseUnlock = unlock[phase] ?? 0;
    const isLocked = currentMd < phaseUnlock;
    const phaseLabels = { groupes: 'Phase de Groupes', quarts: 'Quarts de Finale', semis: 'Demi-Finales', finale: 'Finale' };
    const phaseLabel = phaseLabels[phase] || phase;

    let html = `<div class="caf-wrapper">`;

    // ── HERO BANNER ──────────────────────────────────────────────────────────
    html += `
    <div class="caf-hero">
        <div class="caf-hero-stars"></div>
        <div style="position:relative;display:flex;align-items:center;gap:18px;margin-bottom:16px">
            <div class="caf-logo-ring">🏆</div>
            <div>
                <div class="caf-competition-name">CAF Champions League</div>
                <div class="caf-meta" style="margin-top:4px">Compétition Continentale Africaine &middot; Saison en cours</div>
            </div>
        </div>
        <div style="position:relative;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <span class="caf-phase-badge" style="background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.3);color:#f97316">
                    &#9670; ${phaseLabel.toUpperCase()}
                </span>
                <span class="caf-phase-badge ${isLocked ? 'locked' : 'unlocked'}">
                    ${isLocked ? `&#128274; Disponible J${phaseUnlock}` : '&#10003; Déverrouillé'}
                </span>
                <span class="caf-meta">J${currentMd}</span>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                <span class="caf-hint">&#128161; Jouez vos matchs depuis l'écran Accueil</span>
            </div>
        </div>
        ${!isUserInCAF ? `<div style="position:relative;margin-top:14px;padding:10px 14px;border-radius:10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2)">
            <span style="font-size:11px;color:#fca5a5">&#9888; Votre club n'est pas qualifié cette saison — terminez <strong>Top 2</strong> de votre championnat pour participer.</span>
        </div>` : this.cafData.userEliminated ? `<div style="position:relative;margin-top:14px;padding:12px 14px;border-radius:10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25)">
            <div style="font-size:13px;font-weight:700;color:#f87171;margin-bottom:2px">❌ Votre club est éliminé</div>
            <div style="font-size:11px;color:#fca5a5">Sorti en <strong>${
                this.cafData.userEliminated === 'groupes' ? 'Phase de groupes' :
                this.cafData.userEliminated === 'quarts'  ? 'Quarts de finale' :
                'Demi-finale'
            }</strong> — vous pouvez suivre la suite de la compétition en spectateur.</div>
        </div>` : ''}
    </div>`;

    // ── WINNER SCREEN ────────────────────────────────────────────────────────
    if (winner) {
        html += `
        <div class="caf-winner-screen">
            <div class="caf-winner-trophy">&#127942;</div>
            <div class="caf-winner-label">Champion d'Afrique</div>
            <div class="caf-winner-name">${winner}</div>
        </div>`;
    }

    // ── PHASE DE GROUPES ─────────────────────────────────────────────────────
    html += `<div class="caf-section-title">Phase de groupes</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:24px">`;

    groups.forEach((g, gi) => {
        const isUserGroup = gi === this.cafData.userGroup;
        const sorted = [...g].sort((a, b) => (b.cafPoints||0) - (a.cafPoints||0) || (((b.cafGF||0)-(b.cafGA||0)) - ((a.cafGF||0)-(a.cafGA||0)))); // FIX #14
        html += `
        <div class="caf-group-card ${isUserGroup ? 'is-user-group' : ''}">
            <div class="caf-group-header">
                <span class="caf-group-letter">GROUPE ${['A','B','C','D','E','F','G','H'][gi]}</span>
                ${isUserGroup ? `<span class="caf-group-yours">Votre groupe</span>` : ''}
            </div>
            <div class="caf-col-headers">
                <div>Club</div>
                <div style="text-align:center">V</div>
                <div style="text-align:center">N</div>
                <div style="text-align:center">D</div>
                <div style="text-align:right">Pts</div>
            </div>
            ${sorted.map((c, ri) => {
                const isUser = c.name === this.userClubName;
                const qualified = ri < 2;
                return `
                <div class="caf-team-row ${qualified ? 'qualified' : ''}">
                    <div style="display:flex;align-items:center;gap:8px;min-width:0">
                        <span class="caf-rank">${ri+1}</span>
                        <span class="caf-team-name ${isUser ? 'is-user' : ''}">${c.name}</span>
                    </div>
                    <span class="caf-stat">${c.cafW||0}</span>
                    <span class="caf-stat">${c.cafD||0}</span>
                    <span class="caf-stat">${c.cafL||0}</span>
                    <span class="caf-pts ${ri===0 ? 'top' : ''}">${c.cafPoints||0}</span>
                </div>`;
            }).join('')}
        </div>`;
    });
    html += `</div>`;

    // ── QUARTS DE FINALE ─────────────────────────────────────────────────────
    if (this.cafData.quarterFinals && this.cafData.quarterFinals.length > 0) {
        html += `<div class="caf-section-title">Quarts de finale</div>`;
        html += `<div class="caf-bracket-card" style="margin-bottom:20px">`;
        html += `<div class="caf-bracket-header"><span class="caf-bracket-title">Quarts de finale</span><span class="caf-meta">Aller / Retour</span></div>`;
        this.cafData.quarterFinals.forEach((qf, i) => {
            const isUserHome = qf.home.name === this.userClubName;
            const isUserAway = qf.away.name === this.userClubName;
            // FIX #16 : affichage des scores aller/retour (avant : toujours "vs", même après les matchs)
            const played = qf.hG !== undefined;
            const score1 = played ? `${qf.hG} — ${qf.aG}` : null;
            const score2 = played ? `${qf.hG2 ?? '?'} — ${qf.aG2 ?? '?'}` : null; // FIX #17 (?? au lieu de ||, sinon un 0-0 affichait "?")
            const tab = played && qf.penalties ? `<span style="font-size:9px;color:#fbbf24;font-weight:700;text-transform:uppercase">${qf.penaltyScore ? qf.penaltyScore + ' t.a.b.' : 'TAB'}</span>` : ''; // FIX #100
            html += `
            <div class="caf-match-block">
                <div class="caf-match-label">Quart ${i+1}</div>
                <div class="caf-match-clubs">
                    <div class="caf-club-chip ${isUserHome ? 'is-user' : ''}">
                        <div class="caf-club-crest">${qf.home.name.substring(0,3).toUpperCase()}</div>
                        <span class="caf-club-chip-name">${qf.home.name}</span>
                    </div>
                    <div class="caf-score-block">
                        ${played
                            ? `<span class="caf-score-main">${score1}</span>
                               <span class="caf-score-sub">Aller</span>
                               <span class="caf-score-main" style="font-size:18px;color:#94a3b8">${score2}</span>
                               <span class="caf-score-sub">Retour</span>${tab}`
                            : `<span class="caf-score-main pending">vs</span>`
                        }
                    </div>
                    <div class="caf-club-chip right ${isUserAway ? 'is-user' : ''}">
                        <div class="caf-club-crest">${qf.away.name.substring(0,3).toUpperCase()}</div>
                        <span class="caf-club-chip-name">${qf.away.name}</span>
                    </div>
                </div>
                ${qf.winner ? `<div class="caf-winner-tag">&#10230; Qualifié : ${qf.winner.name}</div>` : ''}
            </div>`;
        });
        html += `</div>`;
    }

    // ── DEMI-FINALES ─────────────────────────────────────────────────────────
    if (semiFinals && semiFinals.length > 0) {
        html += `<div class="caf-section-title">Demi-finales</div>`;
        html += `<div class="caf-bracket-card" style="margin-bottom:20px">`;
        html += `<div class="caf-bracket-header"><span class="caf-bracket-title">Demi-finales</span><span class="caf-meta">Aller / Retour</span></div>`;
        semiFinals.forEach((sf, i) => {
            const played = sf.hG !== undefined;
            const score1 = played ? `${sf.hG} — ${sf.aG}` : null;
            const score2 = played ? `${sf.hG2 ?? '?'} — ${sf.aG2 ?? '?'}` : null; // FIX #17
            const tab = played && sf.penalties ? `<span style="font-size:9px;color:#fbbf24;font-weight:700;text-transform:uppercase">${sf.penaltyScore ? sf.penaltyScore + ' t.a.b.' : 'TAB'}</span>` : ''; // FIX #100
            const isUserHome = sf.home.name === this.userClubName;
            const isUserAway = sf.away.name === this.userClubName;
            html += `
            <div class="caf-match-block">
                <div class="caf-match-label">Demi-finale ${i+1}</div>
                <div class="caf-match-clubs">
                    <div class="caf-club-chip ${isUserHome ? 'is-user' : ''}">
                        <div class="caf-club-crest">${sf.home.name.substring(0,3).toUpperCase()}</div>
                        <span class="caf-club-chip-name">${sf.home.name}</span>
                    </div>
                    <div class="caf-score-block">
                        ${played
                            ? `<span class="caf-score-main">${score1}</span>
                               <span class="caf-score-sub">Aller</span>
                               <span class="caf-score-main" style="font-size:18px;color:#94a3b8">${score2}</span>
                               <span class="caf-score-sub">Retour</span>${tab}`
                            : `<span class="caf-score-main pending">vs</span>`
                        }
                    </div>
                    <div class="caf-club-chip right ${isUserAway ? 'is-user' : ''}">
                        <div class="caf-club-crest">${sf.away.name.substring(0,3).toUpperCase()}</div>
                        <span class="caf-club-chip-name">${sf.away.name}</span>
                    </div>
                </div>
                ${sf.winner ? `<div class="caf-winner-tag">&#10230; Qualifié : ${sf.winner.name}</div>` : ''}
            </div>`;
        });
        html += `</div>`;
    }

    // ── FINALE ───────────────────────────────────────────────────────────────
    if (final) {
        html += `<div class="caf-section-title">Finale</div>`;
        const played = final.hG !== undefined;
        const isUserHome = final.home.name === this.userClubName;
        const isUserAway = final.away.name === this.userClubName;
        html += `
        <div class="caf-bracket-card">
            <div class="caf-bracket-header" style="background:linear-gradient(90deg,rgba(234,179,8,0.15),transparent)">
                <span style="font-size:20px">&#127942;</span>
                <span class="caf-bracket-title" style="font-size:22px">Grande Finale</span>
            </div>
            <div class="caf-match-block" style="padding:24px 20px">
                <div class="caf-match-clubs">
                    <div class="caf-club-chip ${isUserHome ? 'is-user' : ''}">
                        <div class="caf-club-crest" style="width:42px;height:42px;font-size:13px">${final.home.name.substring(0,3).toUpperCase()}</div>
                        <span class="caf-club-chip-name" style="font-size:14px">${final.home.name}</span>
                    </div>
                    <div class="caf-score-block">
                        ${played
                            ? `<span class="caf-score-main" style="font-size:32px;color:#f59e0b">${final.hG} — ${final.aG}</span>`
                            : `<span class="caf-score-main pending" style="font-size:28px">vs</span>
                               <span class="caf-score-sub" style="color:#f97316;letter-spacing:0.1em">Finale</span>`
                        }
                    </div>
                    <div class="caf-club-chip right ${isUserAway ? 'is-user' : ''}">
                        <div class="caf-club-crest" style="width:42px;height:42px;font-size:13px">${final.away.name.substring(0,3).toUpperCase()}</div>
                        <span class="caf-club-chip-name" style="font-size:14px">${final.away.name}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
}

// =============================================
// DISCOURS MOTIVANT
// =============================================
motivationalSpeech() {
    if (this.speechUsedThisMonth) {
        this.showNotification('⏳ Discours déjà utilisé ce mois-ci.', 'error');
        return;
    }
    this.userSquad.forEach(p => p.morale = Math.min(100, (p.morale ?? 80) + 15)); // FIX #73
    this.speechUsedThisMonth = true;
    this.showNotification('💬 Discours motivant ! +15 moral pour tous les joueurs.');
    this.renderSquad();
    this.saveGame();
}

// =============================================
// ÉTAPES 7 & 8 — DASHBOARD ANALYTIQUE + MARCHÉ FILTRÉ
// =============================================
renderDashboardFinancial() {
    const el = document.getElementById('dash-financial');
    if (!el) return;
    const totalWages = this.userSquad.reduce((s, p) => s + (p.wage || 0), 0);
    const staffCost = this.userStaff.reduce((s, id) => {
        const t = STAFF_TYPES.find(x => x.id === id); return s + (t ? t.salary : 0);
    }, 0);
    el.innerHTML = `
        <div class="grid grid-cols-3 gap-3 text-center">
            <div class="panel-glass rounded-lg p-3 border border-white/5">
                <div class="text-[10px] text-slate-400 uppercase mb-1">Masse sal./mois</div>
                <div class="font-teko text-lg text-red-400">${formatMoney(totalWages + staffCost)}</div>
            </div>
            <div class="panel-glass rounded-lg p-3 border border-white/5">
                <div class="text-[10px] text-slate-400 uppercase mb-1">Réputation</div>
                <div class="font-teko text-lg text-brand-400">${this.reputation}/100</div>
                <div class="text-[9px] text-slate-500">${this.getReputationLabel()}</div>
            </div>
            <div class="panel-glass rounded-lg p-3 border border-white/5">
                <div class="text-[10px] text-slate-400 uppercase mb-1">Effectif</div>
                <div class="font-teko text-lg text-white">${this.userSquad.length} joueurs</div>
            </div>
        </div>`;
}

renderMarketFiltered(posFilter = 'ALL', maxPrice = Infinity, minOvr = 0) {
    const grid = document.getElementById('market-grid');
    if (!grid) return;

    // Offres entrantes en premier
    const offers = (this.messages || []).filter(m => m.type === 'offer');
    const loanReqs = (this.messages || []).filter(m => m.type === 'loanRequest'); // LOT 11
    let html = '';
    if (loanReqs.length > 0) {
        html += `<div class="col-span-full mb-4">
            <h4 class="font-teko text-xl text-white uppercase mb-3">🤝 Demandes de prêt</h4>
            ${loanReqs.map(r => `
                <div class="panel-glass rounded-xl p-4 mb-2 flex flex-wrap justify-between items-center gap-3 border border-sky-500/20">
                    <p class="text-slate-300 text-xs flex-1 min-w-[220px]">${r.text}</p>
                    <div class="flex gap-2">
                        <button onclick="app.acceptLoanRequest('${r.id}')" class="px-3 py-2 rounded-lg text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 transition-colors">Prêter</button>
                        <button onclick="app.rejectLoanRequest('${r.id}')" class="btn-secondary px-3 py-2 rounded-lg text-xs font-bold text-white">Refuser</button>
                    </div>
                </div>`).join('')}
        </div>`;
    }
    if (offers.length > 0) {
        html += `<div class="col-span-full mb-4">
            <h4 class="font-teko text-xl text-white uppercase mb-3">📨 Offres reçues</h4>
            ${offers.map(o => `
                <div class="panel-glass rounded-xl p-4 mb-2 flex justify-between items-center border border-brand-500/20">
                    <div>
                        <p class="text-white font-bold text-sm">${o.playerName} <span class="text-slate-400 font-normal text-xs">← ${o.buyerName}</span></p>
                        <p class="text-brand-500 font-bold">${formatMoney(o.amount)}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="app.acceptOffer('${o.id}')" class="btn-primary px-3 py-2 rounded-lg text-xs font-bold text-white">Accepter</button>
                        <button onclick="app.rejectOffer('${o.id}')" class="btn-secondary px-3 py-2 rounded-lg text-xs font-bold text-white">Refuser</button>
                    </div>
                </div>`).join('')}
        </div>`;
    }

    // Filtrer le marché
    const filtered = this.marketPool.filter(p =>
        (posFilter === 'ALL' || p.position === posFilter) &&
        (p.price <= maxPrice) &&
        (minOvr === 0 || (p.isScouted && p.ovr >= minOvr)) // FIX #49
    );

    // Agents libres (joueurs sans club à 0€)
    const freeAgents = this.freeAgentPool || [];
    const allPlayers = [...filtered, ...freeAgents.filter(p =>
        (posFilter === 'ALL' || p.position === posFilter) && p.ovr >= minOvr
    )];

    const posColors = {
        'GB': { bg: 'from-amber-400 to-amber-600', text: 'text-amber-400' },
        'DEF': { bg: 'from-blue-500 to-blue-700', text: 'text-blue-400' },
        'MIL': { bg: 'from-emerald-500 to-emerald-700', text: 'text-emerald-400' },
        'ATT': { bg: 'from-rose-500 to-rose-700', text: 'text-rose-400' }
    };

    allPlayers.forEach(p => {
        const c = posColors[p.position] || posColors['MIL'];
        const displayOvr = p.isScouted ? p.ovr : '?';
        const displayStat = (s) => p.isScouted ? s : '?';
        const scoutBtn = !p.isScouted
            ? `<button onclick="app.scoutPlayerAction('${p.id}')" class="w-full bg-slate-700 hover:bg-slate-600 py-1.5 mb-1 rounded-lg font-bold text-white text-[10px] uppercase transition-colors">Superviser (10K€)</button>`
            : '';
        const isFree = p.isFreeAgent;
        const repBlock = (p.ovr >= 85 && this.reputation < 50)
            ? `<div class="text-[9px] text-red-400 text-center mb-1">⚠️ Réputation insuffisante (${this.reputation}/100)</div>`
            : '';
        const contractBadge = p.contract
            ? `<span class="text-[9px] text-slate-500">📋 ${p.contract.expiresIn}j</span>`
            : '';

        html += `
        <div class="relative bg-gradient-to-br ${c.bg} rounded-2xl p-[2px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            ${isFree ? `<div class="absolute top-2 right-2 z-10 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">LIBRE</div>` : ''}
            <div class="h-full w-full bg-ui-900/90 rounded-xl p-3 flex flex-col justify-between backdrop-blur-md">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex flex-col items-center">
                        <span class="font-teko text-3xl font-black text-white leading-none">${displayOvr}</span>
                        <span class="text-[10px] font-bold ${c.text} uppercase">${p.position}</span>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 overflow-hidden shadow-inner">${playerFaceSVG(p)}</div>
                </div>
                <div class="text-center border-b border-white/10 pb-1 mb-2">
                    <h4 class="font-bold text-white text-xs truncate uppercase">${p.name}</h4>
                    <p class="text-[9px] text-slate-500 mt-0.5">${p.fromClub || 'Agent libre'} | ${formatMoney(p.wage || 0)}/m ${contractBadge}</p>
                </div>
                <div class="grid grid-cols-2 gap-x-3 text-[9px] uppercase font-bold text-slate-400 mb-3">
                    <div class="flex justify-between"><span>VIT</span><span class="text-white">${displayStat(p.stats?.pace)}</span></div>
                    <div class="flex justify-between"><span>PAS</span><span class="text-white">${displayStat(p.stats?.passing)}</span></div>
                    <div class="flex justify-between"><span>FIN</span><span class="text-white">${displayStat(p.stats?.finishing)}</span></div>
                    <div class="flex justify-between"><span>TAC</span><span class="text-white">${displayStat(p.stats?.tackling)}</span></div>
                    <div class="flex justify-between"><span>VIS</span><span class="text-white">${displayStat(p.stats?.vision)}</span></div>
                    <div class="flex justify-between"><span>PLA</span><span class="text-white">${displayStat(p.stats?.positioning)}</span></div>
                </div>
                ${repBlock}
                <div class="mt-auto">
                    ${scoutBtn}
                    <button onclick="app.buyPlayer('${p.id}')" class="w-full btn-primary py-1.5 rounded-lg font-bold text-white text-[10px] uppercase flex justify-between px-3 items-center">
                        <span>${isFree ? 'Recruter (gratuit)' : 'Acheter'}</span>
                        <span>${isFree ? 'Libre' : formatMoney(p.price)}</span>
                    </button>
                </div>
            </div>
        </div>`;
    });

    if (allPlayers.length === 0) {
        html += `<div class="col-span-full text-center py-12 text-slate-500">
            <p class="text-sm">Aucun joueur correspondant aux filtres.</p>
        </div>`;
    }

    grid.innerHTML = html;
}

applyMarketFilters() {
    const pos = document.getElementById('filter-pos')?.value || 'ALL';
    const maxP = parseInt(document.getElementById('filter-price')?.value || '999999999');
    const minO = parseInt(document.getElementById('filter-ovr')?.value || '0');
    this.renderMarketFiltered(pos, maxP, minO);
}

generateFreeAgents() {
    // FIX #7b : on garde les agents libres "réels" (contrat expiré, coupé par l'IA — ils n'ont
    // pas le flag isFreeAgent) et on ne remplace que les agents libres génériques précédents.
    const realReleasedPlayers = (this.freeAgentPool || []).filter(p => !p.isFreeAgent);
    this.freeAgentPool = [...realReleasedPlayers];
    const regions = ['francophone', 'arab', 'anglophone'];
    const positions = ['GB', 'DEF', 'MIL', 'ATT'];
    for (let i = 0; i < 8; i++) {
        const p = Generator.randomPlayer(
            positions[Math.floor(Math.random() * 4)],
            regions[Math.floor(Math.random() * 3)],
            62, 80
        );
        p.isFreeAgent = true;
        p.price = 0;
        p.fromClub = 'Agent libre';
        p.isScouted = true;
        this.freeAgentPool.push(p);
    }
}

// =============================================
// 💾 SAUVEGARDER LA PARTIE
    // 💾 SAUVEGARDER LA PARTIE
    // FIX #12 : version allégée de cafData — on ne stocke que les NOMS des clubs (+ leurs
    // stats CAF), pas leurs effectifs complets. Avant, chaque club qualifié voyait son squad
    // entier dupliqué dans cafData EN PLUS de globalData, gonflant la sauvegarde de ~700 Ko.
    lightenClubRef(c) {
        return c ? { name: c.name } : null;
    }
    lightenCafMatch(m) {
        if (!m) return null;
        return {
            home: this.lightenClubRef(m.home), away: this.lightenClubRef(m.away),
            hG: m.hG, aG: m.aG, hG2: m.hG2, aG2: m.aG2,
            winner: this.lightenClubRef(m.winner), penalties: m.penalties || false,
            penaltyScore: m.penaltyScore || null // FIX #100
        };
    }
    lightenCafData() {
        if (!this.cafData) return null;
        const d = this.cafData;
        return {
            phase: d.phase,
            userGroup: d.userGroup,
            userEliminated: d.userEliminated || null,
            unlockMatchday: d.unlockMatchday,
            winner: d.winner || null,
            // FIX #105 : cafGF/cafGA ajoutés — ils n'étaient pas sauvegardés, si bien que le
            // départage au goal-average (FIX #14) était perdu à CHAQUE rechargement et les
            // groupes retombaient sur un tri aux seuls points.
            groups: (d.groups || []).map(g => g.map(c => ({
                name: c.name, cafPoints: c.cafPoints || 0, cafW: c.cafW || 0, cafD: c.cafD || 0,
                cafL: c.cafL || 0, cafGF: c.cafGF || 0, cafGA: c.cafGA || 0
            }))),
            quarterFinals: (d.quarterFinals || []).map(qf => this.lightenCafMatch(qf)),
            semiFinals: (d.semiFinals || []).map(sf => this.lightenCafMatch(sf)),
            final: this.lightenCafMatch(d.final)
        };
    }

    saveGame() {
    try {
        // Sauvegarde allégée des matchs pour éviter les références circulaires
        // FIX #11a : quarterIndex ajouté (manquait — les résultats de quarts de finale
        // étaient perdus au rechargement, processCAFKnockoutStats recevait un index undefined)
        const lightFixtures = this.fixtures.map(f => ({
            homeName: f.home.name,
            awayName: f.away.name,
            leagueId: f.leagueId || null,
            type: f.type || 'LEAGUE',
            groupId: f.groupId !== undefined ? f.groupId : null,
            quarterIndex: f.quarterIndex !== undefined ? f.quarterIndex : null,
            semiIndex: f.semiIndex !== undefined ? f.semiIndex : null,
            matchday: f.matchday,
            played: f.played
        }));

        const saveData = {
            globalData: this.globalData,
            userLeagueId: this.userLeagueId,
            userClubName: this.userClubName,
            budget: this.budget,
            matchday: this.matchday,
            userStaff: this.userStaff,
            marketPool: this.marketPool,
            freeAgentPool: this.freeAgentPool || [], // FIX #11b
            messages: this.messages,
            userTactics: this.userTactics,
            setPieces: this.setPieces || null,   // rôles : penalty, coup franc, corner, capitaine
            fixtures: lightFixtures,
            reputation: this.reputation,
            academy: this.academy,
            academyLevel: this.academyLevel || 1, // Sauvegarde du niveau d'infrastructure
            loansOut: this.loansOut || [], // LOT 8 (le joueur lui-même vit dans globalData)
            loansIn: this.loansIn || [], // LOT 10
            history: this.history || [], // LOT 12
            seasonAwards: this.seasonAwards || null, // LOT 13
            xgCalib: this.xgCalib || null,           // LOT 15 : calibrage du xG géométrique
            retiredPlayers: this.retiredPlayers || [], // LOT 12
            monthlyRevenue: this.monthlyRevenue,
            monthlyExpenses: this.monthlyExpenses,
            cafData: this.lightenCafData(), // FIX #12 : version allégée (pas de squads dupliqués)
            cafSlots: this.cafSlots || null, // FIX #11c
            currentSeason: this.currentSeason || 1, // FIX #11d
            speechUsedThisMonth: !!this.speechUsedThisMonth // FIX #11e
        };

        const json = JSON.stringify(saveData);
        localStorage.setItem('AECM_Save', json);
        console.log("Jeu sauvegardé ! Taille :", (json.length / 1024).toFixed(1) + " KB");
    } catch(e) {
        console.error("Sauvegarde échouée :", e);
        this.showNotification("⚠️ Mémoire pleine ! Impossible de sauvegarder.", "error"); // FIX #97
    }
}

    // 📂 CHARGER LA PARTIE
    loadGame() {
    const savedData = localStorage.getItem('AECM_Save');
    if (!savedData) return false;

    try {
        const data = JSON.parse(savedData);
        
        // Restauration des variables simples
        this.globalData = data.globalData;
        this.userLeagueId = data.userLeagueId;
        this.userClubName = data.userClubName;
        this.budget = data.budget;
        this.matchday = data.matchday;
        this.userStaff = data.userStaff || [];
        this.marketPool = data.marketPool || [];
        this.freeAgentPool = data.freeAgentPool || []; // FIX #11b
        this.messages = data.messages || [];
        // Les anciennes sauvegardes n'ont ni consignes ni meneur : on complète
        // avec les valeurs par défaut au lieu d'écraser.
        this.userTactics = Object.assign({}, this.userTactics, data.userTactics || {});
        this.setPieces = Object.assign(
            { penalty: null, freekick: null, corner: null, captain: null, playmaker: null },
            data.setPieces || {});
        this.reputation = data.reputation || 30;
        this.academy = data.academy || [];
        this.academyLevel = data.academyLevel || 1; // Chargement du niveau
        this.loansOut = data.loansOut || []; // LOT 8
        this.loansIn = data.loansIn || []; // LOT 10
        this.history = data.history || []; // LOT 12
        this.seasonAwards = data.seasonAwards || null; // LOT 13
        this.xgCalib = data.xgCalib || { q: 0.25, n: 0 }; // LOT 15
        this.retiredPlayers = data.retiredPlayers || []; // LOT 12
        this.monthlyRevenue = data.monthlyRevenue || 0;
        this.monthlyExpenses = data.monthlyExpenses || 0;
        this.cafSlots = data.cafSlots || null; // FIX #11c
        this.currentSeason = data.currentSeason || 1; // FIX #11d
        this.speechUsedThisMonth = !!data.speechUsedThisMonth; // FIX #11e

        // Reconnection de l'équipe du joueur
        const league = this.globalData[this.userLeagueId];
        const myClub = league.standings.find(c => c.name === this.userClubName);
        this.userSquad = myClub.squad;

        // FIX #12 (suite) : réhydratation de cafData — la version sauvegardée ne contient que
        // des noms de clubs (pour ne pas dupliquer les effectifs). On retrouve les VRAIS objets
        // clubs dans globalData (avec leur squad) et on leur recolle leurs stats CAF dessus.
        const findRealClub = (name) => {
            if (!name) return null;
            for (const l of Object.values(this.globalData)) {
                const c = l.standings.find(t => t.name === name);
                if (c) return c;
            }
            return null;
        };
        const rehydrateClubRef = (ref) => ref ? findRealClub(ref.name) : null;
        const rehydrateMatch = (m) => {
            if (!m) return null;
            return {
                home: rehydrateClubRef(m.home),
                away: rehydrateClubRef(m.away),
                hG: m.hG, aG: m.aG, hG2: m.hG2, aG2: m.aG2,
                winner: rehydrateClubRef(m.winner),
                penalties: m.penalties || false,
                penaltyScore: m.penaltyScore || null // FIX #100
            };
        };

        if (data.cafData) {
            const d = data.cafData;
            this.cafData = {
                phase: d.phase,
                userGroup: d.userGroup,
                userEliminated: d.userEliminated || null,
                unlockMatchday: d.unlockMatchday,
                winner: d.winner || null,
                groups: (d.groups || []).map(g => g.map(lc => {
                    const real = findRealClub(lc.name);
                    if (real) {
                        real.cafPoints = lc.cafPoints || 0;
                        real.cafW = lc.cafW || 0;
                        real.cafD = lc.cafD || 0;
                        real.cafL = lc.cafL || 0;
                        real.cafGF = lc.cafGF || 0; // FIX #105
                        real.cafGA = lc.cafGA || 0; // FIX #105
                        return real;
                    }
                    return lc; // fallback si le club n'existe plus (sécurité)
                })),
                quarterFinals: (d.quarterFinals || []).map(rehydrateMatch),
                semiFinals: (d.semiFinals || []).map(rehydrateMatch),
                final: rehydrateMatch(d.final)
            };
        } else {
            this.cafData = null;
        }

        // Reconstruction intelligente des matchs (Fixtures)
        // FIX #11a : quarterIndex restauré (manquait avant — cassait le suivi des quarts CAF)
        this.fixtures = (data.fixtures || []).map(f => {
            let home, away;

            // Cas 1 : Match de championnat classique
            if (f.type === 'LEAGUE' && f.leagueId) {
                const lg = this.globalData[f.leagueId];
                home = lg.standings.find(t => t.name === f.homeName);
                away = lg.standings.find(t => t.name === f.awayName);
            } 
            // Cas 2 : Match de poule CAF
            else if (f.type === 'CAF_GROUP' && this.cafData && this.cafData.groups) {
                const group = this.cafData.groups[f.groupId];
                if (group) {
                    home = group.find(t => t.name === f.homeName);
                    away = group.find(t => t.name === f.awayName);
                }
            }

            // Cas 3 : Sécurité / Phases finales CAF
            // Si l'équipe n'est pas trouvée (ex: finale), on cherche dans toutes les ligues
            if (!home || !away) {
                Object.values(this.globalData).forEach(l => {
                    if (!home) home = l.standings.find(t => t.name === f.homeName);
                    if (!away) away = l.standings.find(t => t.name === f.awayName);
                });
            }

            return { 
                home, 
                away, 
                leagueId: f.leagueId, 
                type: f.type, 
                groupId: f.groupId,
                quarterIndex: f.quarterIndex,
                semiIndex: f.semiIndex,
                matchday: f.matchday, 
                played: f.played 
            };
        // FIX #13 : on retire silencieusement les fixtures dont les clubs n'ont pas pu être
        // retrouvés (ex: ancienne sauvegarde incompatible), au lieu de garder des home/away undefined
        }).filter(f => f.home && f.away);

        return true;
    } catch (e) {
        console.error("Erreur de chargement :", e);
        return false;
    }
}

    // 🗑️ SUPPRIMER LA SAUVEGARDE
    deleteSave() {
        // FIX #97 : confirm() natif remplacé par la modale maison (asynchrone -> callback)
        this.showConfirm(
            "🚨 Attention !\n\nVous allez perdre toute votre progression.\nVoulez-vous vraiment recommencer à zéro ?",
            () => {
                localStorage.removeItem('AECM_Save');
                window.location.reload(); // Recharge la page web pour réinitialiser le jeu
            },
            { okLabel: 'Tout effacer', danger: true }
        );
    }

// FIX #92 : le budget des clubs IA venait d'une formule inventée (force² × 500) sans
// aucun lien avec le modèle économique du jeu. On le dérive maintenant des MÊMES sources
// de revenus que le club de l'utilisateur (billetterie recalibrée au lot 4, droits TV,
// sponsors), pondérées par le poids économique réel du championnat.
// Enveloppe de transfert = ~30 % du chiffre d'affaires annuel, ce qui est déjà généreux
// pour un club africain.
//
// FIX #101 : cette méthode ne donne plus que l'ALLOCATION ANNUELLE. Auparavant elle était
// appelée à chaque arbitrage, si bien qu'un club IA retrouvait son plein budget après
// chaque achat et pouvait dépenser sans fin. Le solde courant vit maintenant dans
// `club.budget` (persisté avec globalData), il se vide à l'achat, se remplit à la vente,
// et est recrédité en début de saison.
    getAIClubAnnualBudget(club) {
        const force = club.force || 65;
        this.buildClubLeagueIndex(); // FIX #101 : garantit que le coefficient de championnat s'applique
        const leagueId = this._clubLeagueIndex[club.name] || null;
        const tier = LEAGUE_TIER[leagueId] ?? 0.8;

        // Même formule d'affluence que pour le club utilisateur (FIX #40), sur 19 matchs à domicile
        const attendance = Math.min(25000, 2000 + Math.max(0, force - 40) * 150);
        const ticketing = attendance * 7 * 19;
        const tvRights = 80000 * 38;                       // même barème que le club utilisateur
        const sponsors = Math.max(0, force - 50) * 60000;  // notoriété du club

        const annualRevenue = (ticketing + tvRights + sponsors) * tier;
        return Math.round(annualRevenue * 0.30);
    }

    // FIX #106 : seuls les contrats de VOTRE effectif étaient décrémentés. Ceux des clubs IA
    // ne bougeaient jamais : leurs joueurs restaient sous contrat indéfiniment, aucun n'arrivait
    // jamais en fin de contrat, et l'effectif IA ne se renouvelait que par le marché. Vous étiez
    // donc le seul club du continent à perdre des joueurs libres.
    // À l'expiration, le club IA reconduit dans la plupart des cas (il n'a pas de raison de
    // laisser filer un cadre) ; sinon le joueur part et rejoint le vivier d'agents libres.
    processAIContracts() {
        if (!this.freeAgentPool) this.freeAgentPool = [];
        const MIN_AI_SQUAD = 16;

        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                if (team.isUser) return;
                for (let i = team.squad.length - 1; i >= 0; i--) {
                    const p = team.squad[i];
                    if (!p.contract) { p.contract = { duration: 2, expiresIn: 38 + Math.floor(Math.random() * 38) }; continue; }
                    p.contract.expiresIn--;
                    if (p.contract.expiresIn > 0) continue;

                    // Effectif trop court, ou joueur important : le club prolonge
                    const isKeyPlayer = p.ovr >= (team.force || 65) - 2;
                    if (team.squad.length <= MIN_AI_SQUAD || isKeyPlayer || Math.random() < 0.6) {
                        p.contract = { duration: 2, expiresIn: 76 };
                        continue;
                    }

                    // Sinon il part libre
                    team.squad.splice(i, 1);
                    p.contract = null;
                    p.fromClub = team.name;
                    this.freeAgentPool.push(p);
                }
            });
        });

        this.replenishAISquads(); // FIX #109
        this.pruneFreeAgentPool(); // FIX #107
    }

    // FIX #109 : conséquence directe de #106 — une fois les contrats IA rendus périssables,
    // les effectifs des clubs IA ne faisaient plus que fondre (rien ne les reconstituait, le
    // marché seul ne suffit pas) et convergeaient tous vers le plancher de 16. Les clubs IA
    // recrutent maintenant dans le vivier d'agents libres, qui cesse du même coup d'être un
    // cul-de-sac : les joueurs libérés par un club retrouvent un club.
    replenishAISquads(target = 18) {
        if (!Array.isArray(this.freeAgentPool) || this.freeAgentPool.length === 0) return;

        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                if (team.isUser || team.squad.length >= target) return;
                if (Math.random() > 0.25) return; // le recrutement prend du temps

                // Le club cherche d'abord à combler le poste qui lui manque le plus
                const countAt = (pos) => team.squad.filter(p => p.position === pos).length;
                const needed = ['GB', 'DEF', 'MIL', 'ATT'].sort((a, b) => countAt(a) - countAt(b))[0];

                let idx = this.freeAgentPool.findIndex(p => p.position === needed);
                if (idx === -1) idx = 0;

                const [signed] = this.freeAgentPool.splice(idx, 1);
                if (!signed) return;
                signed.contract = { duration: 2, expiresIn: 76 };
                signed.fromClub = team.name;
                signed.energy = 100;
                team.squad.push(signed);
            });
        });
    }

    // FIX #107 : le vivier d'agents libres ne faisait que grossir. Les joueurs coupés par l'IA
    // s'y accumulaient d'une saison à l'autre sans jamais vieillir, prendre leur retraite ni être
    // purgés — la sauvegarde gonflait et le marché finissait peuplé de joueurs fantômes.
    // On le borne aux 60 meilleurs, en gardant les plus jeunes à qualité égale.
    pruneFreeAgentPool(max = 60) {
        if (!Array.isArray(this.freeAgentPool)) { this.freeAgentPool = []; return; }
        this.freeAgentPool = this.freeAgentPool
            .filter(p => p && (p.age || 0) < 37 && !p.isRetired)
            .sort((a, b) => (b.ovr - a.ovr) || (a.age - b.age))
            .slice(0, max);
    }

    // FIX #107 : les agents libres ne vieillissaient pas non plus (le vieillissement de fin de
    // saison ne parcourt que les effectifs des clubs). Ils restaient éternellement au même âge
    // et au même niveau.
    ageFreeAgents() {
        if (!Array.isArray(this.freeAgentPool)) return;
        this.freeAgentPool.forEach(p => {
            p.age = (p.age || 24) + 1;
            if (p.age >= 31) p.ovr = Math.max(40, p.ovr - 1);   // déclin après 30 ans
            else if (p.ovr < (p.pot || p.ovr)) p.ovr += 1;      // progression sinon
            p.energy = 100;
            p.injuryDays = 0; p.suspensionDays = 0;
            p.yellowCards = 0; p.redCards = 0;
            p.goals = 0; p.assists = 0; p.cafGoals = 0; p.cafAssists = 0;
        });
        this.pruneFreeAgentPool();
    }

    // FIX #101 : table nom de club -> identifiant de championnat, construite une seule fois.
    // Sans elle, getAIClubAnnualBudget retombait sur le coefficient par défaut et tous les
    // championnats se valaient économiquement.
    buildClubLeagueIndex(force = false) {
        if (this._clubLeagueIndex && !force) return this._clubLeagueIndex;
        this._clubLeagueIndex = {};
        Object.entries(this.globalData).forEach(([lid, l]) =>
            l.standings.forEach(c => { this._clubLeagueIndex[c.name] = lid; }));
        return this._clubLeagueIndex;
    }

    // FIX #101 : solde de transfert courant d'un club IA. Initialisé à la volée pour rester
    // compatible avec les sauvegardes antérieures (où `budget` n'existe pas sur les clubs IA).
    getAIClubBudget(club) {
        if (!club) return 0;
        if (typeof club.budget !== 'number' || !isFinite(club.budget)) {
            club.budget = this.getAIClubAnnualBudget(club);
        }
        return club.budget;
    }

    // FIX #101 : mouvement sur le solde d'un club IA (négatif à l'achat, positif à la vente).
    // Le solde ne descend jamais sous zéro et est plafonné à 3 années d'allocation pour
    // éviter qu'un club vendeur n'accumule indéfiniment.
    adjustAIClubBudget(club, delta) {
        if (!club) return;
        const current = this.getAIClubBudget(club);
        const cap = this.getAIClubAnnualBudget(club) * 3;
        club.budget = Math.max(0, Math.min(cap, Math.round(current + delta)));
    }

    // FIX #101 : recrédite chaque club IA de son allocation annuelle en début de saison
    // (les recettes de la saison écoulée), dans la limite du plafond.
    creditAIClubBudgets() {
        Object.entries(this.globalData).forEach(([lid, league]) => {
            league.standings.forEach(club => {
                if (club.isUser) return;
                this.buildClubLeagueIndex()[club.name] = lid;
                this.adjustAIClubBudget(club, this.getAIClubAnnualBudget(club));
            });
        });
    }

// --- GESTION DU STAFF ---
    updateStaffUI() {
        // FIX #93 : #staff-budget-display n'était jamais mis à jour (affichait "0 M€" en dur)
        const budgetEl = document.getElementById('staff-budget-display');
        if (budgetEl) budgetEl.innerText = formatMoney(this.budget);

        const container = document.getElementById('staff-grid');
        if (!container) return;

        container.innerHTML = STAFF_TYPES.map(type => {
            const isHired = this.userStaff.includes(type.id);
            return `
                <div class="panel-glass rounded-xl p-5 border border-white/5 flex flex-col justify-between">
                    <div>
                        <h4 class="font-teko text-xl text-white uppercase">${type.name}</h4>
                        <p class="text-xs text-slate-400 mb-4">${type.effect}</p>
                    </div>
                    <div class="pt-4 border-t border-white/5">
                        <p class="text-white text-xs mb-3">Salaire: ${formatMoney(type.salary)}</p>
                        ${isHired ? 
                            `<button onclick="app.fireStaff('${type.id}')" class="w-full py-2 bg-red-500/20 text-red-500 rounded-lg text-xs font-bold">Licencier</button>` : 
                            `<button onclick="app.hireStaff('${type.id}')" class="w-full py-2 bg-brand-500 text-white rounded-lg text-xs font-bold">Recruter (${formatMoney(type.cost)})</button>`
                        }
                    </div>
                </div>`;
        }).join('');
    }

    hireStaff(typeId) {
        const type = STAFF_TYPES.find(t => t.id === typeId);
        if (this.budget >= type.cost) {
            this.budget -= type.cost;
            this.userStaff.push(typeId);
            this.updateStaffUI();
            document.getElementById('header-budget').innerText = formatMoney(this.budget);
            this.showNotification(`Staff recruté : ${type.name}`);
            this.saveGame();
        } 
        else {
            this.showNotification("Budget insuffisant !", "error");
        }
    }

    fireStaff(typeId) {
        this.userStaff = this.userStaff.filter(id => id !== typeId);
        this.updateStaffUI();
        this.showNotification("Membre du staff licencié.");
        this.saveGame(); // FIX #38
    }
    showTeamSquad(teamName, leagueId) {
    const leagueData = this.globalData[leagueId];
    const team = leagueData.standings.find(t => t.name === teamName);
    if (!team) return;
    // LOT 10 : contexte de la fiche consultée (un nom de club peut contenir une
    // apostrophe, on ne le fait pas transiter par un attribut onclick)
    this._modalTeamCtx = { name: team.name, leagueId };

    const posOrder = { 'GB': 1, 'DEF': 2, 'MIL': 3, 'ATT': 4 };
    const sorted = [...team.squad].sort((a, b) => (posOrder[a.position] || 5) - (posOrder[b.position] || 5));

    const posColors = {
        'GB': 'text-amber-400 bg-amber-500/10',
        'DEF': 'text-blue-400 bg-blue-500/10',
        'MIL': 'text-emerald-400 bg-emerald-500/10',
        'ATT': 'text-rose-400 bg-rose-500/10'
    };

    const rows = sorted.map(p => {
        const pc = posColors[p.position] || 'text-slate-400 bg-slate-500/10';
        const potColor = p.pot >= 88 ? 'text-yellow-400' : p.pot >= 82 ? 'text-emerald-400' : 'text-slate-400';
        const injBadge = p.injuryDays > 0 ? `<span class="text-red-400 text-[9px]">🏥${p.injuryDays}j</span>` : '';
        return `
            <div class="flex items-center justify-between p-2 rounded-lg bg-ui-800/50 border border-white/5 hover:bg-white/5 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-full bg-ui-900 border border-white/10 overflow-hidden shrink-0">${playerFaceSVG(p)}</div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase ${pc} w-10 text-center shrink-0">${p.position}</span>
                    <div>
                        <p class="text-sm font-bold text-white leading-none">${p.name} ${injBadge}</p>
                        <p class="text-[9px] text-slate-400 mt-0.5">${p.age} ans</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 text-right shrink-0">
                    <div>
                        <div class="font-teko text-xl text-white leading-none">${p.ovr}</div>
                        <div class="text-[9px] ${potColor}">POT ${p.pot}</div>
                    </div>
                    ${team.isUser ? '' : `<div class="flex flex-col gap-1">
                        <button onclick="app.askBuy('${p.id}')" class="px-2 py-1 text-[9px] font-bold uppercase rounded bg-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-white transition-colors whitespace-nowrap">💰 Acheter</button>
                        <button onclick="app.askLoan('${p.id}')" class="px-2 py-1 text-[9px] font-bold uppercase rounded bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors whitespace-nowrap">🤝 Prêt</button>
                    </div>`}
                </div>
            </div>`;
    }).join('');

    // Créer la modale
    let modal = document.getElementById('team-squad-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'team-squad-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="document.getElementById('team-squad-modal').classList.add('hidden')"></div>
            <div class="relative panel-glass rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col z-10 border border-white/10">
                <div class="flex items-center justify-between p-5 border-b border-white/5">
                    <h3 id="modal-team-name" class="font-teko text-2xl text-white uppercase"></h3>
                    <div class="flex items-center gap-3">
                        <span id="modal-team-force" class="text-xs text-slate-400"></span>
                        <button onclick="document.getElementById('team-squad-modal').classList.add('hidden')" class="text-slate-400 hover:text-white transition-colors text-xl">✕</button>
                    </div>
                </div>
                <div id="modal-squad-list" class="overflow-y-auto p-4 flex flex-col gap-2"></div>
            </div>`;
        document.body.appendChild(modal);
    }

    modal.classList.remove('hidden');
    document.getElementById('modal-team-name').textContent = team.name;
    document.getElementById('modal-team-force').textContent = `Force: ${team.force} • ${team.squad.length} joueurs`;
    document.getElementById('modal-squad-list').innerHTML = rows;
}
}

const app = new GameManager();
