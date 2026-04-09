// --- UTILS ---
const formatMoney = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + ' M€';
    if (num >= 1000) return (num / 1000).toFixed(0) + ' K€';
    return num + ' €';
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
    francophone: { first: ['Seydou', 'Amad', 'Franck', 'Eric', 'Moussa', 'Salif', 'Yaya', 'Kolo', 'Didier', 'Sadio', 'Cheikhou', 'Idrissa', 'Kalidou', 'Ismaïla'], last: ['Kéita', 'Touré', 'Kouassi', 'Bamba', 'Koné', 'Cissé', 'Traoré', 'Diallo', 'Diabaté', 'Camara', 'Mane', 'Sarr', 'Gueye', 'Koulibaly'] },
    arab: { first: ['Youssef', 'Ali', 'Mohamed', 'Hassan', 'Ibrahim', 'Mahmoud', 'Tarek', 'Hakim', 'Brahim', 'Sofiane', 'Riyad', 'Aïssa'], last: ['El Amrani', 'Benali', 'Mansour', 'Saidi', 'Haddad', 'Ziyech', 'Salah', 'Mahrez', 'Bounou', 'Hakimi', 'Ounahi', 'Amrabat'] },
    anglophone: { first: ['John', 'Peter', 'Samuel', 'Sunday', 'Vincent', 'Percy', 'Themba', 'Ronwen', 'Teboho', 'Khuliso'], last: ['Ndidi', 'Balogun', 'Zwane', 'Mokoena', 'Dlamini', 'Tau', 'Williams', 'Modiba', 'Mudau', 'Osimhen', 'Iwobi', 'Ekong'] }
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
const PLAYER_AVATAR_SVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full opacity-90 drop-shadow-lg"><path d="M50 15C38.95 15 30 23.95 30 35C30 46.05 38.95 55 50 55C61.05 55 70 46.05 70 35C70 23.95 61.05 15 50 15ZM23.5 65C15.49 65 9 71.49 9 79.5V95H91V79.5C91 71.49 84.51 65 76.5 65H23.5Z" fill="currentColor"/></svg>`;

class Generator {
    static randomName(regionId = 'francophone') {
        const pool = REGIONAL_NAMES[regionId] || REGIONAL_NAMES.francophone;
        return pool.first[Math.floor(Math.random() * pool.first.length)][0] + '. ' + pool.last[Math.floor(Math.random() * pool.last.length)];
    }
    
    static getPlayerValue(ovr) {
        if(ovr >= 90) return 45000000;
        if(ovr >= 85) return 25000000;
        if(ovr >= 80) return 12000000;
        if(ovr >= 75) return 5000000;
        if(ovr >= 70) return 1500000;
        return 500000;
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

        let price = this.getPlayerValue(ovr);

        // --- 3. RETOUR DE L'OBJET COMPLET ---
        return { 
            id: Math.random().toString(36).substr(2, 9), 
            name: this.randomName(regionId), 
            position: pos, 
            ovr: ovr,
            pot: pot,                 // NOUVEAU: Potentiel maximum du joueur
            age: age,                 // NOUVEAU: Âge du joueur
            stats: stats, 
            energy: 100,
            morale: 80,               // Le moral commence à 80% (Heureux)
            price: price,
            wage: Math.floor(price / 200),    // Salaire mensuel (~1% de sa valeur)
            isScouted: false,                 // Pour le brouillard de guerre (Scouting)
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            injuryDays: 0,        
            suspensionDays: 0,
            contract: {
                duration: Math.floor(Math.random() * 3) + 1,
                expiresIn: Math.floor(Math.random() * 30) + 8
            }
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

                let price = this.getPlayerValue(ovr);

                return { 
                    id: Math.random().toString(36).substr(2, 9), 
                    name: p.name, 
                    position: basePos, 
                    exactPosition: p.pos,
                    age: p.age || 24,
                    pot: p.pot || p.ovr + 5,
                    ovr: ovr, 
                    stats: stats,           // On injecte le nouvel objet 'stats'
                    energy: 100,
                    morale: 80,             // NOUVEAU: Moral
                    wage: Math.floor(price / 100), // NOUVEAU: Salaire
                    isScouted: true,        // NOUVEAU: Joueur connu
                    price: price,           // Calculé avec getPlayerValue
                    goals: 0,
                    assists: 0,
                    yellowCards: 0,
                    redCards: 0,
                    injuryDays: 0,
                    suspensionDays: 0,
                    contract: {
                        duration: Math.floor(Math.random() * 3) + 1,
                        expiresIn: Math.floor(Math.random() * 30) + 8
                    }
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
        
        this.userLeagueId = null;
        this.userClubName = null;
        this.userSquad = null;
        this.userStaff = [];
        this.userTactics = { formation: '4-4-2', mentality: 'balanced', style: 'possession' };
        
        this.liveMatch = null;
        this.budget = 15000000; 
        this.marketPool = [];
        this.swapSelectedId = null;
        this.reputation = 30;
        this.academy = [];
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
        // Si le joueur met un blessé ou suspendu dans ses 11, la force globale s'effondre
        myClub.force = Math.round(this.userSquad.slice(0, 11).reduce((acc, p) => acc + (p.injuryDays > 0 || p.suspensionDays > 0 ? p.ovr * 0.3 : p.ovr), 0) / 11);
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
        document.getElementById('header-matchday').innerText = this.matchday + 1;
        document.getElementById('header-budget').innerText = formatMoney(this.budget);
        document.getElementById('market-budget').innerText = formatMoney(this.budget);
        // À ajouter à la fin de updateHeader()
const unread = (this.messages || []).filter(m => !m.read).length;
const badge = document.getElementById('notification-badge');
if (badge) {
    badge.innerText = unread;
    badge.classList.toggle('hidden', unread === 0);
}
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
            // Alert if player is injured or suspended in the starting 11
            let alertClass = (player && (player.injuryDays > 0 || player.suspensionDays > 0)) ? 'bg-red-600 animate-pulse' : 'bg-ui-900/80';
            
            layer.innerHTML += `
                <div class="absolute z-20 flex flex-col items-center justify-center transition-all duration-700 -translate-x-1/2 -translate-y-1/2" style="left: ${pos[0]*2}%; top: ${pos[1]}%;">
                    <div class="text-brand-500 w-5 h-5 sm:w-7 sm:h-7">${JERSEY_SVG}</div>
                    <span class="text-[8px] sm:text-[9px] font-bold text-white ${alertClass} px-1 sm:px-1.5 rounded -mt-1 shadow border border-white/10 truncate max-w-[50px] sm:max-w-[60px] text-center">${pName}</span>
                </div>
            `;
        });
    }

    renderTacticsLists() {
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

            // Icônes de statut
            let statusIcon = '';
            if (p.injuryDays > 0) statusIcon = `<span class="bg-red-600 text-white text-[8px] px-1 rounded ml-1" title="Blessé pour ${p.injuryDays} matchs">🏥</span>`;
            else if (p.suspensionDays > 0) statusIcon = `<span class="bg-red-600 text-white text-[8px] px-1 rounded ml-1" title="Suspendu pour ${p.suspensionDays} matchs">🟥</span>`;

            return `
                <div onclick="app.selectForSwap('${p.id}')" class="player-list-item flex items-center justify-between p-2 rounded-lg border border-white/5 bg-ui-800/50 cursor-pointer ${selClass}">
                    <div class="flex items-center gap-3 w-1/2">
                        <div class="w-6 h-6 text-slate-500 bg-ui-900 rounded border border-white/5 flex items-center justify-center shrink-0">${PLAYER_AVATAR_SVG || ''}</div>
                        <div class="truncate flex items-center">
                            <div class="truncate">
                                <h5 class="text-xs font-bold text-white truncate">${p.name}</h5>
                                <span class="text-[9px] font-bold px-1 py-0.5 rounded uppercase mt-0.5 inline-block ${posBg}">${p.position}</span>
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
    
    // 6 joueurs réels pris dans les squads des autres clubs
    const shuffled = otherClubs.sort(() => Math.random() - 0.5);
    shuffled.slice(0, 6).forEach(club => {
        const bench = club.squad.slice(11); // Remplaçants disponibles
        if(bench.length > 0) {
            const p = bench[Math.floor(Math.random() * bench.length)];
            p.fromClub = club.name;
            this.marketPool.push(p);
        }
    });
   }
   generateIncomingOffers() {
    if(!this.messages) this.messages = [];
    const mySquad = this.userSquad;
    const otherClubs = Object.values(this.globalData)
        .flatMap(l => l.standings)
        .filter(c => !c.isUser);

    // 1 à 2 offres par journée max
    const numOffers = Math.random() < 0.4 ? 2 : Math.random() < 0.7 ? 1 : 0;
    
    for(let i = 0; i < numOffers; i++) {
        // Cible un joueur de ton squad (pas le gardien titulaire, pas les OVR trop bas)
        const targets = mySquad.slice(1).filter(p => p.ovr >= 70);
        if (targets.length === 0) continue;
        const target = targets[Math.floor(Math.random() * targets.length)];

        // Budget estimé du club IA selon sa force : force² × 500 €
        // Ex: force 70 → ~2.45 M€ de budget max offre | force 85 → ~3.6 M€
        const eligibleBuyers = otherClubs.filter(c => {
            const estimatedBudget = Math.pow(c.force || 65, 2) * 500;
            const canAfford = estimatedBudget >= target.price * 0.8;
            // Le club cherche à se renforcer : sa force doit être inférieure à l'OVR de la cible
            const needsPlayer = (c.force || 65) < target.ovr + 5;
            return canAfford && needsPlayer;
        });
        if (eligibleBuyers.length === 0) continue;

        const buyer = eligibleBuyers[Math.floor(Math.random() * eligibleBuyers.length)];

        // Offre proportionnelle à la capacité du buyer : entre 85% et 120% de la valeur
        const buyerBudget = Math.pow(buyer.force || 65, 2) * 500;
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
                        
                        // Le club IA recrute le joueur
                        newPlayer.isScouted = true;
                        newPlayer.fromClub = team.name; // Historique
                        team.squad.push(newPlayer);
                        
                        // Retirer le joueur du marché pour qu'il ne soit plus dispo pour toi !
                        this.marketPool.splice(targetIndex, 1);
                        transferCount++;
                        
                        // On garde en mémoire le plus gros transfert pour l'annoncer au joueur
                        if (!notableTransfer || newPlayer.ovr > notableTransfer.ovr) {
                            notableTransfer = { player: newPlayer, club: team.name };
                        }
                        
                        // Gestion de la taille de l'effectif : le joueur coupé part en agent libre
                        if (team.squad.length > 25) {
                            team.squad = team.squad.filter(p => p.id !== weakestLink.id);
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

    scoutPlayers() {
        if(this.budget < 500000) {
            alert("Fonds insuffisants pour envoyer un recruteur.");
            return;
        }
        this.budget -= 500000;
        
        const randRegion = ['francophone', 'arab', 'anglophone'][Math.floor(Math.random()*3)];
        const pos = ['DEF', 'MIL', 'ATT'][Math.floor(Math.random()*3)];
        this.marketPool.unshift(Generator.randomPlayer(pos, randRegion, 75, 88));
        this.marketPool.unshift(Generator.randomPlayer('MIL', randRegion, 72, 85));
        
        this.updateHeader();
        this.renderMarket();
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
            alert("Fonds insuffisants pour ce transfert.");
            return;
        }

        if (!isFreeAgent) {
            this.budget -= player.price;
            this.marketPool.splice(playerIndex, 1);
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
            alert("Fonds insuffisants pour payer le kiné (50 K€ requis).");
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
        this.generateFreeAgents();
        this.renderMarketFiltered();
    }
scoutPlayerAction(id) {
        if (this.budget < 10000) {
            alert("Fonds insuffisants pour superviser ce joueur (10 K€).");
            return;
        }
        this.budget -= 10000;
        const player = this.marketPool.find(p => p.id === id);
        if (player) player.isScouted = true;
        this.updateHeader();
        this.renderMarket();
    }
    acceptOffer(offerId) {
        const offer = this.messages.find(m => m.id === offerId);
        if(!offer) return;
        
        // 1. Sécurité : on empêche la vente si l'effectif tombe en dessous de 14 joueurs
        if (this.userSquad.length <= 14) {
            if(this.showNotification) this.showNotification("Impossible de vendre : effectif minimum de 14 joueurs.", "error");
            else alert("Impossible de vendre : effectif minimum de 14 joueurs.");
            return;
        }
        
        const playerIdx = this.userSquad.findIndex(p => p.id === offer.playerId);
        if(playerIdx === -1) return;

        // 2. On effectue la vente (ajout de l'argent et suppression du joueur)
        this.budget += offer.amount;
        this.userSquad.splice(playerIdx, 1);
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
    if (this.userSquad.length <= 14) {
        this.showNotification("Impossible : effectif minimum de 14 joueurs.", "error");
        return;
    }
    const price = player.price || Generator.getPlayerValue(player.ovr);
    if (!confirm(`Vendre ${player.name} pour ${formatMoney(price)} ?`)) return;

    this.budget += price;
    this.userSquad = this.userSquad.filter(p => p.id !== playerId);

    // Synchroniser globalData
    const league = this.globalData[this.userLeagueId];
    const myClub = league.standings.find(c => c.name === this.userClubName);
    myClub.squad = this.userSquad;

    document.getElementById('header-budget').innerText = formatMoney(this.budget);
    this.showNotification(`💰 ${player.name} vendu pour ${formatMoney(price)} !`);
    this.renderSquad();
    this.saveGame();
}

    startSimulationSequence() {
    // Nettoyer les fixtures corrompues (home ou away null)
    this.fixtures = this.fixtures.filter(f => f.home && f.away);

    // 1. Vérifier si la saison est complètement terminée
    const relevantFixtures = this.fixtures.filter(f =>
        f.home?.isUser || f.away?.isUser ||
        (f.type === 'LEAGUE' && f.leagueId === this.userLeagueId)
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
        if (userMatchInfo.type && userMatchInfo.type.startsWith('CAF')) {
            const commentaryDiv = document.getElementById('live-commentary');
            if (commentaryDiv) {
                commentaryDiv.innerHTML = '<div class="text-yellow-500 font-bold mb-2">🏆 SOIRÉE AFRICAINE</div>';
            }
        }
        this.runLiveMatch(userMatchInfo.home, userMatchInfo.away, otherMatches);
    }
}
simulateAIBypassMatchday(otherMatches) {
    otherMatches.forEach(match => {
        if (!match.home || !match.away) { match.played = true; return; }

        let hG = Math.floor(Math.random() * 4);
        let aG = Math.floor(Math.random() * 4);

        if (match.type === 'LEAGUE') {
            this.processMatchStats(match.home, match.away, hG, aG);
        } else if (match.type === 'CAF_GROUP') {
            if (typeof this.processCAFGroupStats === 'function') {
                this.processCAFGroupStats(match.home, match.away, hG, aG, match.groupId);
            }
        } else if (match.type === 'CAF_QUARTER' && this.cafData) {
            const qf = this.cafData.quarterFinals && this.cafData.quarterFinals[match.quarterIndex];
            if (qf && !qf.winner) {
                const total = (match.home.force || 70) + (match.away.force || 70);
                qf.winner = Math.random() * total < (match.home.force || 70) ? match.home : match.away;
            }
        }
        match.played = true;
    });

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
    } else {
        this.showNotification("📅 Journée simulée automatiquement.");
    }

    // Vérifier fin de saison
    const relevantFixtures = this.fixtures.filter(f =>
        f.home?.isUser || f.away?.isUser ||
        (f.type === 'LEAGUE' && f.leagueId === this.userLeagueId)
    );
    const maxMatchday = relevantFixtures.length > 0
        ? Math.max(...relevantFixtures.map(f => f.matchday))
        : Math.max(...this.fixtures.map(f => f.matchday));

    if (this.matchday > maxMatchday) {
        let finalRank = this.globalData[this.userLeagueId].standings.findIndex(c => c.isUser) + 1;
        let prizeMoney = Math.max(1000000, 15000000 - ((finalRank - 1) * 800000));
        this.budget += prizeMoney;
        this.updateHeader();
        setTimeout(() => {
            const msg = `🏆 FIN DE LA SAISON !\n\nVotre club termine à la ${finalRank}e place.\nPrime de championnat : +${formatMoney(prizeMoney)} !\n\n▶ Voulez-vous démarrer la saison suivante ?`;
            if (confirm(msg)) this.startNextSeason();
        }, 500);
    }

    this.saveGame();
}

    runLiveMatch(home, away, otherMatches) {
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
        
        this.initPitchTokens();
        
        // Initialisation de la mémoire du match avec les joueurs disponibles sur le terrain
        this.liveMatch = {
            home: home,
            away: away,
            otherMatches: otherMatches,
            minute: 0,
            homeScore: 0,
            awayScore: 0,
            // On copie les 11 premiers pour les titulaires
            homeStarters: [...home.squad.slice(0, 11)],
            awayStarters: [...away.squad.slice(0, 11)],
            // NOUVEAU : On récupère les joueurs du banc (du 12ème au 18ème)
            homeBench: [...home.squad.slice(11, 18)], 
            awayBench: [...away.squad.slice(11, 18)],
            // NOUVEAU : Compteur de remplacements
            subsMade: { home: 0, away: 0 },
            penaltyGiven: false,
            interval: null
        };
        
        this.logCommentary(`L'arbitre siffle le coup d'envoi. C'est parti !`, "text-brand-400 border-brand-500/20");
        this.animatePitch('center');

        this.liveMatch.interval = setInterval(() => { this.tickLiveMatch(); }, 800); 
    }

    initPitchTokens() {
        const layer = document.getElementById('match-tokens-layer');
        layer.innerHTML = '<div id="anim-ball" class="match-ball absolute w-3 h-3 bg-white rounded-full z-30" style="left:50%; top:50%;"></div>';
        
        for(let i=0; i<11; i++) {
            layer.innerHTML += `<div id="ht-${i}" class="player-token absolute z-20 text-brand-500 w-4 h-4 sm:w-5 sm:h-5">${JERSEY_SVG}</div>`;
            layer.innerHTML += `<div id="at-${i}" class="player-token absolute z-20 text-slate-400 w-4 h-4 sm:w-5 sm:h-5">${JERSEY_SVG}</div>`;
        }
    }

    animatePitch(state) {
    if(!this.liveMatch) return;
    const ball = document.getElementById('anim-ball');
    
    const hForm = this.liveMatch.home.isUser ? FORMATIONS_MAP[this.userTactics.formation] : FORMATIONS_MAP['4-4-2'];
    const aForm = this.liveMatch.away.isUser ? FORMATIONS_MAP[this.userTactics.formation] : FORMATIONS_MAP['4-4-2'];

    // 1. DÉFINITION DES OFFSETS DE BLOC (Le mouvement collectif)
    let xOffsetH = 0, xOffsetA = 0, bX = 50, bY = 50;

    // On augmente les valeurs pour que le bloc équipe se déplace vraiment
    if(state === 'home_attack') { xOffsetH = 25; xOffsetA = 20; bX = 82; bY = 35 + Math.random()*30; }
    if(state === 'away_attack') { xOffsetH = -20; xOffsetA = -25; bX = 18; bY = 35 + Math.random()*30; }
    if(state === 'midfield')    { xOffsetH = 10; xOffsetA = -10; bX = 45 + Math.random()*10; bY = 30 + Math.random()*40; }
    if(state === 'home_shot')   { xOffsetH = 35; xOffsetA = 25; bX = 96; bY = 50; }
    if(state === 'away_shot')   { xOffsetH = -25; xOffsetA = -35; bX = 4; bY = 50; }

    // 2. BOUCLE SUR LES 11 JOUEURS
    for(let i=0; i<11; i++) {
        // --- LA MAGIE EST ICI : L'AMPLITUDE INDIVIDUELLE ---
        // Au lieu de +/- 1%, on passe à une "zone de liberté" de +/- 6%
        // Ça simule le fait qu'un joueur cherche le marquage ou l'espace
        let jx = (Math.random() * 12 - 6); 
        let jy = (Math.random() * 14 - 7);

        // Home Team (ht)
        let hX = hForm[i][0] + xOffsetH + jx;
        let hY = hForm[i][1] + jy;
        
        const hDot = document.getElementById(`ht-${i}`);
        if(hDot) {
            hDot.style.left = `${Math.min(97, Math.max(3, hX))}%`;
            hDot.style.top = `${Math.min(95, Math.max(5, hY))}%`;
            // Fluidité FM : Transition légèrement plus longue que le tick pour un effet "glissé"
            hDot.style.transition = "all 1.5s ease-in-out"; 
        }

        // Away Team (at)
        // On inverse le X pour l'adversaire (100 - x)
        let aX = (100 - aForm[i][0]) + xOffsetA + jx;
        let aY = aForm[i][1] + jy;
        
        const aDot = document.getElementById(`at-${i}`);
        if(aDot) {
            aDot.style.left = `${Math.min(97, Math.max(3, aX))}%`;
            aDot.style.top = `${Math.min(95, Math.max(5, aY))}%`;
            aDot.style.transition = "all 1.5s ease-in-out";
        }
    }

    // 3. ANIMATION DE LA BALLE
    if(ball) {
        ball.style.left = `${bX}%`;
        ball.style.top = `${bY}%`;
        ball.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"; // Effet de balle qui accélère
    }
}

    showHighlightAlert() {
        const alert = document.getElementById('highlight-alert');
        alert.classList.remove('opacity-0');
        setTimeout(() => alert.classList.add('opacity-0'), 1500);
    }

    // Fonction utilitaire pour calculer la stat réelle (Fatigue + Moral)
    calculateEffectiveStat(player, statName) {
        let base = player.stats?.[statName] || player.ovr || 50;
        let energyMod = 0.6 + (player.energy / 250); // Un joueur à 0% garde 60% de sa force
        let moraleMod = 0.9 + ((player.morale || 80) / 800);
        return base * energyMod * moraleMod;
    }

    tickLiveMatch() {
        if (!this.liveMatch || this.liveMatch.minute >= 90) return;

        this.liveMatch.minute++;
        document.getElementById('live-time').innerText = this.liveMatch.minute + "'";

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
            [...this.liveMatch.homeStarters, ...this.liveMatch.awayStarters].forEach(p => {
                let drain = p.position === 'MIL' ? 2.5 : 1.8;
                p.energy = Math.max(0, Math.round((p.energy || 100) - drain));
            });
        }

        // Remplacements IA
        if ([60, 70, 80].includes(this.liveMatch.minute)) {
            this.handleAICoaching();
        }

        // PENALTY
        if (!this.liveMatch.penaltyGiven && this.liveMatch.minute > 15 && this.liveMatch.minute < 85) {
            let hForceEvt = this.liveMatch.home.force || 60;
            let aForceEvt = this.liveMatch.away.force || 60;
            let hPressure = hForceEvt / (hForceEvt + aForceEvt);
            let penChance = 0.008; 
            if (Math.random() < penChance) {
                const isEvtHome = Math.random() < hPressure;
                const teamName = isEvtHome ? this.liveMatch.home.name : this.liveMatch.away.name;
                this.liveMatch.penaltyGiven = true;
                this.logCommentary(`🚨 PENALTY sifflé pour ${teamName} !`, "text-red-400 font-bold");
                setTimeout(() => { if (this.liveMatch) this.executeShot(isEvtHome, true); }, 800);
            }
        }
        
        // CORNER
        if (Math.random() < 0.09 && this.liveMatch.minute > 5) {
            let hForceEvt2 = this.liveMatch.home.force || 60;
            let aForceEvt2 = this.liveMatch.away.force || 60;
            const isEvtHome2 = Math.random() < (hForceEvt2 / (hForceEvt2 + aForceEvt2));
            const teamName2 = isEvtHome2 ? this.liveMatch.home.name : this.liveMatch.away.name;
            this.logCommentary(`🚩 Corner pour ${teamName2}...`, "text-slate-400 italic");
            if (Math.random() < 0.18) setTimeout(() => { if (this.liveMatch) this.executeShot(isEvtHome2); }, 800);
        }
        
        // COUP FRANC
        if (Math.random() < 0.045 && this.liveMatch.minute > 10 && this.liveMatch.minute < 88) {
            let hForceEvt3 = this.liveMatch.home.force || 60;
            let aForceEvt3 = this.liveMatch.away.force || 60;
            const isEvtHome3 = Math.random() < (hForceEvt3 / (hForceEvt3 + aForceEvt3));
            const teamName3 = isEvtHome3 ? this.liveMatch.home.name : this.liveMatch.away.name;
            this.logCommentary(`🎯 Coup franc dangereux pour ${teamName3}.`, "text-slate-400 italic");
            if (Math.random() < 0.14) setTimeout(() => { if (this.liveMatch) this.executeShot(isEvtHome3); }, 800);
        }

        // CARTONS JAUNES ET 2E JAUNE
        if (Math.random() < 0.015 && this.liveMatch.minute > 5) {
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
        if (Math.random() < 0.001 && this.liveMatch.minute > 20) {
            let team = Math.random() < 0.5 ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
            if (team.length > 0) {
                let player = team[Math.floor(Math.random() * team.length)];
                player.redCards++;
                team.splice(team.indexOf(player), 1); // L'équipe finit à 10
                this.logCommentary(`🟥 CARTON ROUGE DIRECT ! Faute grossière de ${player.name} !`, "text-red-500 font-bold");
            }
        }

        // 🚑 NOUVEAU SYSTÈME DE BLESSURE (CORRIGÉ)
        if (Math.random() < 0.005 && this.liveMatch.minute > 10) {
            let isHomeTeam = Math.random() < 0.5;
            let team = isHomeTeam ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
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
                        this.logCommentary(`🔄 Changement IA : ${sub.name} remplace ${player.name} sorti sur blessure.`, "text-blue-400 italic");
                    } else {
                        // S'il n'y a plus personne sur le banc de l'IA, le joueur sort définitivement
                        team.splice(team.indexOf(player), 1);
                        this.logCommentary(`🏥 Coup dur pour l'IA : ${player.name} sort sur civière et l'équipe n'a plus de remplaçant !`, "text-red-500 font-bold");
                    }
                }
            }
        }

        // ACTION DE BUT / POSSESSION AU CARRÉ
        if (Math.random() < 0.16) {
            let hForce = (this.liveMatch.home.force || 60);
            let aForce = (this.liveMatch.away.force || 60);

            if (this.liveMatch.home.isUser) hForce *= (this.userTactics.mentality === 'offensive' ? 1.2 : 0.85);
            if (this.liveMatch.away.isUser) aForce *= (this.userTactics.mentality === 'offensive' ? 1.2 : 0.85);

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
                    if (this.liveMatch && this.liveMatch.minute < 90) {
                        this.executeShot(isHomeAttack); 
                    }
                }, 800);
            } else {
                this.logCommentary(`🛡️ La défense de ${isHomeAttack ? this.liveMatch.away.name : this.liveMatch.home.name} repousse le danger.`, "text-slate-500 text-[10px]");
            }
        } else {
            if (this.liveMatch.minute % 2 === 0) this.animatePitch('midfield');
        }

        // MI-TEMPS
        if (this.liveMatch.minute === 45) {
            this.logCommentary("⏸️ Mi-temps. Les équipes rentrent aux vestiaires.", "text-slate-500 italic text-center mt-2");
            this.animatePitch('center');
        }

        // FIN DU MATCH
        if (this.liveMatch.minute >= 90) {
            clearInterval(this.liveMatch.interval);
            document.getElementById('live-time').innerText = "FIN";
            this.logCommentary("🏁 Coup de sifflet final !", "text-brand-500 font-bold text-center mt-4");
            document.getElementById('btn-end-match').classList.remove('hidden');
        }
    }

    executeShot(isHome, isPenalty = false) {
        if (!this.liveMatch) return;
        this.animatePitch(isHome ? 'home_shot' : 'away_shot');

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

        let defenders = defStarters.filter(p => p.position === 'DEF' || p.position === 'MIL');
        let defender = defenders.length > 0 ? defenders[Math.floor(Math.random() * defenders.length)] : null;
        let gk = defStarters.find(p => p.position === 'GB') || defStarters[0];

        if (!striker) return;

        const userIsAttacking = (isHome && this.liveMatch.home.isUser) || (!isHome && this.liveMatch.away.isUser);
        const userIsDefending = (isHome && this.liveMatch.away.isUser) || (!isHome && this.liveMatch.home.isUser);

        // ==========================================
        // 🚀 MOTEUR xG RÉVISÉ 🚀
        // ==========================================
        
        let baseXG = isPenalty ? 0.78 : (0.02 + (Math.random() * 0.40)); 
        
        if (userIsAttacking && this.userTactics.mentality === 'offensive' && !isPenalty) baseXG += 0.03;
        if (userIsDefending && this.userTactics.mentality === 'defensive' && !isPenalty) baseXG -= 0.03;

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
                assister.assists = (assister.assists || 0) + 1;
                
                const assistComments = [
                    `⚽ BUT ! ${assister.name} sert ${striker.name} qui conclut en beauté ! (xG: ${displayXG})`,
                    `⚽ BUT ! Quelle passe de ${assister.name} ! ${striker.name} ne pouvait pas rater ! (xG: ${displayXG})`,
                    `⚽ BUT ! Superbe centre de ${assister.name} pour ${striker.name} ! (xG: ${displayXG})`
                ];
                this.logCommentary(assistComments[Math.floor(Math.random() * assistComments.length)], "text-emerald-400 font-bold text-base");
            } else if (isPenalty) {
                this.logCommentary(`⚽ BUT SUR PENALTY ! ${striker.name} transforme avec sang-froid ! (xG: ${displayXG})`, "text-emerald-400 font-bold text-base");
            } else {
                let goalTxt = finalXG < 0.15 ? 
                    `⚽ BUT EXCEPTIONNEL ! Frappe venue d'ailleurs de ${striker.name} !` : 
                    `⚽ BUT ! ${striker.name} place parfaitement son tir !`;
                    
                this.logCommentary(`${goalTxt} (xG: ${displayXG})`, "text-emerald-400 font-bold text-base");
            }
            setTimeout(() => this.animatePitch('center'), 600);
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
            setTimeout(() => this.animatePitch('midfield'), 600);
        }
    }

    handleAICoaching() {
        let isHomeUser = this.liveMatch.home.isUser;
        let aiStarters = isHomeUser ? this.liveMatch.awayStarters : this.liveMatch.homeStarters;
        let aiBench = isHomeUser ? this.liveMatch.awayBench : this.liveMatch.homeBench;
        let aiSubs = isHomeUser ? this.liveMatch.subsMade.away : this.liveMatch.subsMade.home;

        if (aiSubs < 5 && aiBench.length > 0) {
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
        if (!this.liveMatch || this.liveMatch.minute >= 90) return;
        
        const isHome = this.liveMatch.home.isUser;
        const starters = isHome ? this.liveMatch.homeStarters : this.liveMatch.awayStarters;
        const bench = isHome ? this.liveMatch.homeBench : this.liveMatch.awayBench;
        const subsMade = isHome ? this.liveMatch.subsMade.home : this.liveMatch.subsMade.away;

        if (subsMade >= 5) {
            alert("Vous avez déjà effectué vos 5 changements autorisés !");
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
                    <span class="bg-brand-500/20 text-brand-400 px-2 py-1 rounded text-xs font-bold">${5 - subsMade} restants</span>
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
        if(this.liveMatch && this.liveMatch.minute < 90) {
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

            // Incrémentation du compteur
            if (isHome) this.liveMatch.subsMade.home++;
            else this.liveMatch.subsMade.away++;

            // Commentaire du match
            this.logCommentary(`🔄 CHANGEMENT TACTIQUE : ${pIn.name} entre à la place de ${pOut.name}.`, "text-blue-400 font-bold border-blue-500/20 text-sm mt-2 mb-2");
        }

        // On ferme la fenêtre, ce qui relance le match automatiquement
        this.cancelSub(); 
    }

    logCommentary(text, cssClasses) {
        const div = document.createElement('div');
        div.className = `pb-2 border-b border-white/5 ${cssClasses} animate-[fadeIn_0.3s_ease-out]`;
        div.innerHTML = `<span class="font-bold opacity-50 w-6 inline-block">${this.liveMatch.minute}'</span> ${text}`;
        const container = document.getElementById('live-commentary');
        container.prepend(div);
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
        if(this.liveMatch) this.animatePitch('center'); 
    }

    finishLiveMatch() {
        // 1. Réduire les jours de blessures et suspensions pour TOUS LES JOUEURS avant le prochain match
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                team.squad.forEach(p => {
                    if (p.injuryDays > 0) p.injuryDays--;
                    if (p.suspensionDays > 0) p.suspensionDays--;
                });
            });
        });

        // 2. Assigner les résultats du joueur
        let userFixture = this.fixtures.find(f => f.matchday === this.matchday && !f.played && f.home.name === this.liveMatch.home.name);
        
        if (userFixture && userFixture.type && userFixture.type.startsWith('CAF')) {
            if (userFixture.type === 'CAF_GROUP') {
                this.processCAFGroupStats(this.liveMatch.home, this.liveMatch.away, this.liveMatch.homeScore, this.liveMatch.awayScore, userFixture.groupId);
            }
        } else {
            this.processMatchStats(this.liveMatch.home, this.liveMatch.away, this.liveMatch.homeScore, this.liveMatch.awayScore);
        }
        this.assignMatchEvents(this.liveMatch.home, this.liveMatch.homeScore);
        this.assignMatchEvents(this.liveMatch.away, this.liveMatch.awayScore);
        
        // --- NOUVEAU SYSTÈME ÉCONOMIQUE (Modèle FM) ---
        let userTeam = this.liveMatch.home.isUser ? this.liveMatch.home : (this.liveMatch.away.isUser ? this.liveMatch.away : null);
        
        if (userTeam) {
            let clubOvr = userTeam.force || 65; 
            let isHome = this.liveMatch.home.isUser;
            let userWon = (isHome && this.liveMatch.homeScore > this.liveMatch.awayScore) || (!isHome && this.liveMatch.awayScore > this.liveMatch.homeScore);
            let userDraw = this.liveMatch.homeScore === this.liveMatch.awayScore;

            let matchIncome = 0;
            let tvRights = 250000; // Droits TV fixes (250 K€ par match)
            matchIncome += tvRights;

            // Billetterie : Uniquement à domicile ! La formule rend l'affluence proportionnelle au niveau de l'équipe
            let ticketing = 0;
            if (isHome) {
                // Ex: OVR 60 = 200 K€ | OVR 75 = ~612 K€ | OVR 85 = ~1 M€
                ticketing = Math.floor(Math.pow(Math.max(1, clubOvr - 40), 2) * 500);
                matchIncome += ticketing;
            }

            // Primes de match
            let performanceBonus = 0;
            if (userWon) performanceBonus = 400000;
            else if (userDraw) performanceBonus = 150000;
            
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

            // CORRECTION : Vérification pour les matchs de la CAF
            if (match.type && match.type.startsWith('CAF')) {
                if (match.type === 'CAF_GROUP') {
                    this.processCAFGroupStats(match.home, match.away, hG, aG, match.groupId);
                }
            } else {
                // Pour les matchs de championnat classiques
                this.processMatchStats(match.home, match.away, hG, aG);
            }
            
            this.assignMatchEvents(match.home, hG);
            this.assignMatchEvents(match.away, aG);
            this.assignDisciplineEvents(match.home);
            this.assignDisciplineEvents(match.away);
        });
        // --- DÉDUCTION AUTOMATIQUE DES SALAIRES ---
        const totalWages = this.userSquad.reduce((s, p) => s + (p.wage || 0), 0);
        const staffCost = this.userStaff.reduce((s, id) => {
            const t = STAFF_TYPES.find(x => x.id === id);
            return s + (t ? t.salary : 0);
        }, 0);
        const matchdayWageCost = Math.round((totalWages + staffCost) / 4);
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
            if (index < 11) { // Titulaires
                p.energy = Math.max(30, p.energy - (Math.floor(Math.random() * 11) + 10));
                // Gain de moral si victoire, perte si défaite/nul
                if (wonMatch) p.morale = Math.min(100, p.morale + 5);
                else p.morale = Math.max(0, p.morale - 5);
            } else { // Remplaçants
                p.energy = Math.min(100, p.energy + (Math.floor(Math.random() * 11) + 15));
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

        // --- 4b. GESTION FINANCIÈRE (Masse Salariale chaque mois = 4 matchs) ---
        if (this.matchday > 0 && this.matchday % 4 === 0) {
            let totalWages = this.userSquad.reduce((sum, p) => sum + (p.wage || Math.floor(p.price / 200)), 0);
            let staffWages = this.userStaff.reduce((sum, id) => {
                const type = STAFF_TYPES.find(t => t.id === id);
                return sum + (type ? type.salary : 0);
            }, 0);
            let totalMonth = totalWages + staffWages;
            this.budget -= totalMonth;
            this.monthlyExpenses = totalMonth;

            if (this.budget < 0) {
                this.userSquad.forEach(p => p.morale = Math.max(0, p.morale - 20));
                setTimeout(() => alert(`🚨 ALERTE FINANCIÈRE : Club dans le rouge de ${formatMoney(Math.abs(this.budget))} !\nJoueurs: ${formatMoney(totalWages)} + Staff: ${formatMoney(staffWages)}\nVendez des joueurs !`), 1500);
            } else {
                setTimeout(() => alert(`💰 Fin du mois.\nSalaires joueurs: ${formatMoney(totalWages)}\nSalaires staff: ${formatMoney(staffWages)}\nTotal déduit: ${formatMoney(totalMonth)}`), 1500);
            }
        }

        // Marquer TOUS les fixtures de la journée qui vient d'être jouée comme played
        this.fixtures.filter(f => f.matchday === this.matchday).forEach(f => f.played = true);

        this.matchday++;

        // --- GESTION DES CONTRATS ---
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
                    text: `📋 ${p.name} (OVR ${p.ovr}) arrive en fin de contrat dans 8 matchdays. Prolongez-le ou il partira libre !`
                });
            }
            if (p.contract.expiresIn <= 0) expiredPlayers.push(p.id);
        });
        expiredPlayers.forEach(pid => {
            const p = this.userSquad.find(pl => pl.id === pid);
            if (p) {
                this.userSquad = this.userSquad.filter(pl => pl.id !== pid);
                if (!this.freeAgentPool) this.freeAgentPool = [];
                p.contract = null;
                this.freeAgentPool.unshift(p);
                this.messages.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'info', read: false,
                    text: `🚪 ${p.name} a quitté le club — contrat expiré (départ libre).`
                });
            }
        });

        // --- MORAL VESTIAIRE : messages contextuels ---
        const myClub = this.getMyClub();
        const recentForm = myClub.form.slice(0, 3);
        const losses = recentForm.filter(f => f === 'L').length;
        const avgMorale = this.userSquad.length > 0
            ? Math.round(this.userSquad.reduce((s, p) => s + (p.morale || 80), 0) / this.userSquad.length)
            : 80;
        if (losses >= 3 && Math.random() < 0.5) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'morale', read: false,
                text: `😤 3 défaites consécutives — les joueurs doutent (moral moyen: ${avgMorale}%). Faites un discours motivant !`
            });
        }
        const unhappyPlayer = this.userSquad.find(p => (p.morale || 80) < 25);
        if (unhappyPlayer && Math.random() < 0.4) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'morale', read: false,
                text: `😞 ${unhappyPlayer.name} est très mécontent (moral: ${unhappyPlayer.morale}%). Il pourrait demander un transfert !`
            });
        }
        const benchWarmer = this.userSquad.slice(11).find(p => (p.energy || 100) >= 90 && (p.morale || 80) < 50);
        if (benchWarmer && Math.random() < 0.3) {
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'morale', read: false,
                text: `🪑 ${benchWarmer.name} ronge son frein sur le banc. Il veut jouer davantage.`
            });
        }

        this.generateIncomingOffers();
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
        }

        this.updateHeader();
        this.refreshAllViews();
        this.switchView('dashboard');
        
        // ✅ LE NOUVEAU CODE DYNAMIQUE À COLLER À LA PLACE :
        const relevantFixtures = this.fixtures.filter(f =>
            f.home.isUser || f.away.isUser ||
            (f.type === 'LEAGUE' && f.leagueId === this.userLeagueId)
        );
        const maxMatchday = relevantFixtures.length > 0
            ? Math.max(...relevantFixtures.map(f => f.matchday))
            : Math.max(...this.fixtures.map(f => f.matchday));

        if (this.matchday > maxMatchday) {
            let finalRank = this.globalData[this.userLeagueId].standings.findIndex(c => c.isUser) + 1;
            let prizeMoney = Math.max(1000000, 15000000 - ((finalRank - 1) * 800000));
            this.budget += prizeMoney;
            this.updateHeader();
            setTimeout(() => {
                const msg = `🏆 FIN DE LA SAISON !\n\nVotre club termine à la ${finalRank}e place.\nPrime de championnat : +${formatMoney(prizeMoney)} !\n\n▶ Voulez-vous démarrer la saison suivante ?`;
                if (confirm(msg)) {
                    this.startNextSeason();
                }
            }, 500);
        } else {
            // (fixtures déjà marqués joués plus haut)
        }
        this.saveGame();
    }

    startNextSeason() {
         this.currentSeason = (this.currentSeason || 1) + 1;
        // 1. Vieillissement des joueurs (+1 an) + progression/régression OVR
        Object.values(this.globalData).forEach(league => {
            league.standings.forEach(team => {
                team.squad.forEach(p => {
                    
                    // --- PATCH POUR LES ANCIENNES SAUVEGARDES ---
                    if (p.age === undefined || isNaN(p.age)) {
                        p.age = Math.floor(Math.random() * (32 - 17 + 1)) + 17;
                    }

                    p.age += 1;
                    
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
                    if (p.age >= 35 && Math.random() < 0.30) {
                        p.isRetired = true;
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
                });
                
                // Retirer définitivement les retraités de l'effectif
                team.squad = team.squad.filter(p => !p.isRetired);

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
            this.academy.forEach(p => {
                if (p.age === undefined || isNaN(p.age)) p.age = 15;
                p.age += 1;
                p.energy = 100;
                p.injuryDays = 0;
                p.yellowCards = 0;
                p.redCards = 0;
                
                // Progression plus rapide que les pros
                if (p.age < 21 && p.ovr < (p.pot || 85)) {
                    const gain = Math.floor(Math.random() * 3) + 1;
                    p.ovr = Math.min((p.pot || 85), p.ovr + gain);
                } else if (p.age < 24 && p.ovr < (p.pot || 85)) {
                    const gain = Math.floor(Math.random() * 2) + 1;
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

    assignMatchEvents(team, goalsCount) {
        if (!team || !team.squad || goalsCount <= 0) return;
        const starters = team.squad.slice(0, 11); 

        for (let i = 0; i < goalsCount; i++) {
            let scorer = this.pickPlayerByProbability(starters, { 'ATT': 55, 'MIL': 30, 'DEF': 13, 'GB': 2 });
            if (scorer) scorer.goals = (scorer.goals || 0) + 1;

            if (Math.random() < 0.8) {
                let assister = this.pickPlayerByProbability(starters, { 'MIL': 50, 'ATT': 30, 'DEF': 18, 'GB': 2 });
                if (assister && (!scorer || assister.id !== scorer.id)) {
                    assister.assists = (assister.assists || 0) + 1;
                }
            }
        }
    }
    
    assignDisciplineEvents(team) {
        team.squad.slice(0, 11).forEach(p => {
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
        if (posEl) posEl.innerText = myRank + (myRank === 1 ? 'er' : 'ème');
        
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
                club.form.slice(-3).forEach(f => {
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
                ? Math.round(this.userSquad.reduce((s, p) => s + (p.morale || 80), 0) / this.userSquad.length) 
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
                ? Math.round(this.userSquad.reduce((s, p) => s + (p.morale || 80), 0) / this.userSquad.length) 
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
                            <span>${t.name}</span>
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
                allPlayers.push({...p, teamName: team.name});
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

            // Sécurité pour l'avatar SVG
            const avatarSvg = typeof PLAYER_AVATAR_SVG !== 'undefined' ? PLAYER_AVATAR_SVG : `<svg viewBox="0 0 24 24" class="w-full h-full fill-current opacity-50"><path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"/></svg>`;

            grid.innerHTML += `
                <div class="relative bg-gradient-to-br ${c.bg} rounded-2xl p-[2px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all group cursor-pointer">
                    ${statusBadge}
                    <div class="h-full w-full bg-ui-900/90 rounded-xl p-3 flex flex-col justify-between backdrop-blur-md">
                        <div class="absolute -right-2 -top-2 text-7xl opacity-[0.03] font-teko italic font-black text-white pointer-events-none">${p.ovr}</div>
                        
                        <div class="flex justify-between items-start mb-2 relative z-10">
                            <div class="flex flex-col items-center">
                                <span class="font-teko text-3xl font-black text-white leading-none drop-shadow-md">${p.ovr}</span>
                                <span class="text-[10px] font-bold ${c.text} uppercase tracking-wider">${p.position}</span>
                            </div>
                            <div class="w-12 h-12 text-slate-500 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 overflow-hidden flex items-end justify-center shadow-inner pt-1">
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
                                <span>Moral: <span class="${p.morale < 50 ? 'text-red-400' : 'text-blue-400'}">${p.morale || 80}%</span></span>
                            </div>
                            <div class="h-1 w-full bg-ui-900 rounded-full overflow-hidden mb-1.5"><div class="h-full ${energyColor}" style="width: ${p.energy}%"></div></div>
                            <button onclick="app.healPlayer('${p.id}')" ${p.energy === 100 && p.injuryDays === 0 ? 'disabled' : ''} class="w-full py-1 text-[9px] font-bold uppercase rounded transition-colors ${(p.energy < 100 || p.injuryDays > 0) ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-ui-900 text-slate-600'}">
    ${(p.energy < 100 || p.injuryDays > 0) ? 'Kiné (50 K€)' : 'Prêt'}
</button>
${(p.contract && p.contract.expiresIn <= 10)
    ? `<button onclick="app.renewContract('${p.id}')" class="w-full mt-1 py-1 text-[9px] font-bold uppercase rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white transition-colors">📋 Renouveler (${p.contract.expiresIn}j)</button>`
    : ''}
<button onclick="event.stopPropagation(); app.sellPlayer('${p.id}')" class="w-full mt-1 py-1 text-[9px] font-bold uppercase rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
    💸 Vendre (${formatMoney(p.price || Generator.getPlayerValue(p.ovr))})
</button>
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
    ['dashboard', 'standings', 'squad', 'tactics', 'market', 'match', 'staff', 'academy', 'caf'].forEach(id => {
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
    
    if(viewId === 'tactics') this.renderTacticsPitch();
    if (viewId === 'staff') this.updateStaffUI();
if (viewId === 'academy') this.renderAcademy();
    if (viewId === 'caf') this.renderCAF();
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
    const msg = `📋 Renouvellement de contrat\n\n${player.name} (OVR ${player.ovr})\nSalaire actuel: ${formatMoney(player.wage)}/mois\nNouveau salaire demandé: ${formatMoney(newWage)}/mois (+${formatMoney(raise)})\nDurée: 2 saisons\n\nAccepter ?`;
    if (confirm(msg)) {
        player.wage = newWage;
        player.contract = { duration: 2, expiresIn: 76 };
        this.messages = this.messages.filter(m => !(m.playerId === playerId && m.type === 'contract_alert'));
        this.showNotification(`✅ Contrat de ${player.name} renouvelé (2 saisons) !`);
        this.saveGame();
        this.renderSquad();
        this.updateHeader();
    }
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
        return `
        <div class="panel-glass rounded-xl p-4 mb-2 border ${m.read ? 'border-white/5' : 'border-brand-500/30'}">
            <p class="text-white text-sm ${m.read ? 'opacity-60' : 'font-bold'}">${m.text}</p>
            ${isOffer ? `
            <div class="flex gap-2 mt-3">
                <button onclick="app.acceptOffer('${m.id}')" class="btn-primary px-3 py-1 rounded-lg text-xs font-bold text-white">Accepter</button>
                <button onclick="app.rejectOffer('${m.id}')" class="btn-secondary px-3 py-1 rounded-lg text-xs font-bold">Refuser</button>
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
        const firstNames = ['Amadou', 'Koffi', 'Yaya', 'Didier', 'Cheick', 'Moussa', 'Salif', 'Hakim', 'Brahim', 'Tarik'];
        const lastNames = ['Touré', 'Koné', 'Diaby', 'Ziyech', 'Hakimi', 'Bamba', 'Keita', 'Cissé', 'Traoré', 'Gouiri'];

        for(let i = 0; i < numPlayers; i++) {
            const baseOvr = 40 + (this.academyLevel * 3) + Math.floor(Math.random() * 10);
            const potBonus = Math.floor(Math.random() * 12) + (this.academyLevel * 4);
            let pot = Math.min(95, baseOvr + potBonus + 10);
            const pos = ['GB', 'DEF', 'MIL', 'ATT'][Math.floor(Math.random() * 4)];
            
            newYouths.push({
                id: 'y_' + Math.random().toString(36).substr(2, 9),
                name: firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)],
                age: 15 + Math.floor(Math.random() * 3),
                position: pos,
                ovr: baseOvr,
                pot: pot,
                energy: 100,
                morale: 100,
                wage: 500
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
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-bold text-white text-sm">${p.name}</h4>
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

            // Stats par défaut si absentes
            if (!player.stats) {
                player.stats = { pace: player.ovr - 5, passing: player.ovr - 5, finishing: player.ovr - 5, tackling: player.ovr - 5, vision: player.ovr - 5, positioning: player.ovr - 5 };
            }

            // Contrat par défaut
            if (!player.contract) {
                player.contract = { duration: 1, expiresIn: 38 };
            }

            // Champs manquants
            player.energy = player.energy || 100;
            player.morale = player.morale || 80;
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


// =============================================
// ÉTAPE 5 — CAF CHAMPIONS LEAGUE
// =============================================
initCAF(userQualified = false) {
    // 1 champion par ligue (10 clubs) + les 6 meilleurs 2es (wild cards) = 16 clubs → 4 groupes de 4
    const champions = [];
    const runners = [];

    Object.values(this.globalData).forEach(league => {
        const sorted = [...league.standings].sort((a, b) =>
            (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga)));
        if (sorted[0]) champions.push({ name: sorted[0].name, force: sorted[0].force, leagueName: league.name, squad: sorted[0].squad || [], isUser: sorted[0].isUser || false, _ref: sorted[0] });
        if (sorted[1]) runners.push({ name: sorted[1].name, force: sorted[1].force, leagueName: league.name, squad: sorted[1].squad || [], isUser: sorted[1].isUser || false, _ref: sorted[1] });
    });

    // Les 6 meilleures wild cards triées par force
    const wildCards = runners.sort((a, b) => b.force - a.force).slice(0, 6);
    const qualifiedClubs = [...champions, ...wildCards]; // 10 + 6 = 16 clubs

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

    // 1. Vérifier s'il reste des matchs de poule à jouer
    const groupMatchesLeft = this.fixtures.filter(f => f.type === 'CAF_GROUP' && !f.played).length;
    if (groupMatchesLeft > 0) {
        this.showNotification(`⏳ Il reste ${groupMatchesLeft} matchs de groupe à jouer dans le calendrier !`, 'error');
        return;
    }

    // 2. Les 2 premiers de chaque groupe → 8 clubs pour les quarts
    // Tirage : 1er Groupe A vs 2e Groupe B, 1er Groupe B vs 2e Groupe A, etc.
    const qualifiers = [];
    this.cafData.groups.forEach(g => {
        const sorted = [...g].sort((a, b) => (b.cafPoints || 0) - (a.cafPoints || 0));
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
    } else {
        this.showNotification('❌ Élimination en phase de groupes CAF.');
    }
    this.saveGame();
    this.renderCAF();
}

simulateCAFSemiFinals() {
    if (!this.cafData || this.cafData.phase !== 'quarts') return;

    const quarterMatchesLeft = this.fixtures.filter(f => f.type === 'CAF_QUARTER' && !f.played).length;
    if (quarterMatchesLeft > 0) {
        this.showNotification(`⏳ Il reste ${quarterMatchesLeft} matchs de quarts à jouer !`, 'error');
        return;
    }

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
        this.userSquad.slice(0, 11).forEach(p => p.energy = Math.max(30, (p.energy || 100) - 18));
        this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `🌍 Qualifié en Demi-finale CAF ! Titulaires fatigués (-18). +2M€` });
        this.showNotification('🏆 Qualifié pour les demi-finales CAF ! +2M€');
    } else {
        this.showNotification('❌ Élimination en Quarts de finale CAF.');
    }
    this.saveGame();
    this.renderCAF();
}

simulateCAFFinal() {
    if (!this.cafData || this.cafData.phase !== 'semis') return;
    
    const semiMatchesLeft = this.fixtures.filter(f => f.type === 'CAF_SEMI' && !f.played).length;
    if (semiMatchesLeft > 0) {
        this.showNotification(`⏳ Il reste ${semiMatchesLeft} matchs de demi-finale à jouer dans le calendrier !`, 'error');
        return;
    }

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
        this.userSquad.slice(0, 11).forEach(p => p.energy = Math.max(25, (p.energy || 100) - 22));
        this.messages.unshift({ id: Math.random().toString(36).substr(2, 9), type: 'info', read: false, text: `🌍 FINALE CAF ! Titulaires épuisés (-22). +3M€` });
        this.showNotification('🏆 Votre club est en FINALE CAF ! +3M€');
    }
    this.saveGame();
    this.renderCAF();
}

simulateCAFWinner() {
    if (!this.cafData || this.cafData.phase !== 'finale' || !this.cafData.final) return;
    
    const finalMatchLeft = this.fixtures.filter(f => f.type === 'CAF_FINAL' && !f.played).length;
    if (finalMatchLeft > 0) {
        this.showNotification(`⏳ La finale doit être jouée via le calendrier principal !`, 'error');
        return;
    }

    // Le match a été joué, tu peux déterminer le vainqueur basé sur ton propre système ou en regardant les résultats.
    // Pour l'exemple, on le déclare terminé.
    const winner = this.cafData.final.home; // À adapter selon le score réel
    this.cafData.winner = winner.name;
    this.cafData.phase = 'terminé';

    if (winner.name === this.userClubName) {
        this.budget += 5000000;
        this.reputation = Math.min(100, this.reputation + 15);
        setTimeout(() => alert(`🏆🌍 CHAMPION D'AFRIQUE ! ${this.userClubName} remporte la CAF !\n\nPrime : +5M€`), 500);
    } else {
        setTimeout(() => alert(`🏆 La CAF est remportée par ${winner.name} !`), 500);
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
                ${phase === 'groupes' ? `<button onclick="app.simulateCAFGroupMatches()" class="caf-btn-action">&#10003; Valider groupes &amp; tirage quarts</button>` : ''}
                ${phase === 'quarts'  ? `<button onclick="app.simulateCAFSemiFinals()"  class="caf-btn-action">&#10003; Valider quarts &amp; tirage demis</button>` : ''}
                ${phase === 'semis'   ? `<button onclick="app.simulateCAFFinal()"       class="caf-btn-action">&#10003; Valider demis &amp; créer finale</button>` : ''}
                ${phase === 'finale'  ? `<button onclick="app.simulateCAFWinner()"      class="caf-btn-action">&#127942; Décerner le trophée</button>` : ''}
                <span class="caf-hint">&#128161; Jouez vos matchs depuis l'écran Accueil</span>
            </div>
        </div>
        ${!isUserInCAF ? `<div style="position:relative;margin-top:14px;padding:10px 14px;border-radius:10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2)">
            <span style="font-size:11px;color:#fca5a5">&#9888; Votre club n'est pas qualifié cette saison — terminez <strong>Top 2</strong> de votre championnat pour participer.</span>
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
        const sorted = [...g].sort((a, b) => (b.cafPoints||0) - (a.cafPoints||0));
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
            html += `
            <div class="caf-match-block">
                <div class="caf-match-label">Quart ${i+1}</div>
                <div class="caf-match-clubs">
                    <div class="caf-club-chip ${isUserHome ? 'is-user' : ''}">
                        <div class="caf-club-crest">${qf.home.name.substring(0,3).toUpperCase()}</div>
                        <span class="caf-club-chip-name">${qf.home.name}</span>
                    </div>
                    <div class="caf-score-block">
                        <span class="caf-score-main pending">vs</span>
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
            const score2 = played ? `${sf.hG2||'?'} — ${sf.aG2||'?'}` : null;
            const tab = played && sf.penalties ? `<span style="font-size:9px;color:#fbbf24;font-weight:700;text-transform:uppercase">TAB</span>` : '';
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
    this.userSquad.forEach(p => p.morale = Math.min(100, (p.morale || 80) + 15));
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
    let html = '';
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
        (!p.isScouted || p.ovr >= minOvr)
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
                    <div class="w-12 h-12 text-slate-500 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 flex items-end justify-center shadow-inner pt-1">${PLAYER_AVATAR_SVG}</div>
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
    this.freeAgentPool = [];
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
    saveGame() {
    try {
        // Sauvegarde allégée des matchs pour éviter les références circulaires
        const lightFixtures = this.fixtures.map(f => ({
            homeName: f.home.name,
            awayName: f.away.name,
            leagueId: f.leagueId || null,
            type: f.type || 'LEAGUE',
            groupId: f.groupId !== undefined ? f.groupId : null,
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
            messages: this.messages,
            userTactics: this.userTactics,
            fixtures: lightFixtures,
            reputation: this.reputation,
            academy: this.academy,
            academyLevel: this.academyLevel || 1, // Sauvegarde du niveau d'infrastructure
            monthlyRevenue: this.monthlyRevenue,
            monthlyExpenses: this.monthlyExpenses,
            cafData: this.cafData
        };

        const json = JSON.stringify(saveData);
        localStorage.setItem('AECM_Save', json);
        console.log("Jeu sauvegardé ! Taille :", (json.length / 1024).toFixed(1) + " KB");
    } catch(e) {
        console.error("Sauvegarde échouée :", e);
        alert("⚠️ Mémoire pleine ! Impossible de sauvegarder.");
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
        this.messages = data.messages || [];
        this.userTactics = data.userTactics || this.userTactics;
        this.reputation = data.reputation || 30;
        this.academy = data.academy || [];
        this.academyLevel = data.academyLevel || 1; // Chargement du niveau
        this.monthlyRevenue = data.monthlyRevenue || 0;
        this.monthlyExpenses = data.monthlyExpenses || 0;
        this.cafData = data.cafData || null;

        // Reconnection de l'équipe du joueur
        const league = this.globalData[this.userLeagueId];
        const myClub = league.standings.find(c => c.name === this.userClubName);
        this.userSquad = myClub.squad;

        // Reconstruction intelligente des matchs (Fixtures)
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
                semiIndex: f.semiIndex,
                matchday: f.matchday, 
                played: f.played 
            };
        });

        return true;
    } catch (e) {
        console.error("Erreur de chargement :", e);
        return false;
    }
}

    // 🗑️ SUPPRIMER LA SAUVEGARDE
    deleteSave() {
        if (confirm("🚨 Attention ! Vous allez perdre toute votre progression. Voulez-vous vraiment recommencer à zéro ?")) {
            localStorage.removeItem('AECM_Save');
            window.location.reload(); // Recharge la page web pour réinitialiser le jeu
        }
    }

// --- GESTION DU STAFF ---
    updateStaffUI() {
        const container = document.getElementById('staff-grid'); // Vérifiez que cet ID existe dans votre HTML
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
    }
}

const app = new GameManager();
