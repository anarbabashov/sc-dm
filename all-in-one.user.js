// ==UserScript==
// @name         SoundCloud DM Sender - All in One
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Send DMs to SoundCloud followers - just type start() in console!
// @author       You
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  console.log(
    "%c[SC-DM] Script loaded! Type: start() to begin",
    "color: #10b981; font-weight: bold; font-size: 14px;"
  );

  // ========== CONFIGURATION ==========
  const CONFIG = {
    MESSAGE: `Hey {nickname}, the new Tonica is out!
If you are reading this, it means you appreciate true sound and real music made by
someone who, just like you, cannot live a day without it.

This is the Eighth episode - a truly special number that symbolizes infinity. Maybe
it is because of the long journey I have been on this past year, and through music,
I want to share that experience with you.

During our time together, we will travel across stunning places on our beautiful
planet. The journey blends House, Progressive, Deep, and Breaks - everything we love
for a great time and a lifted mood. It will make you dance, smile, and maybe even
think about something beyond the material world.

Be kind to yourself and to others, and the world will respond with love.
Your, Andy Gart!

https://soundcloud.com/andygart/tonica-8`,

    MAX_PER_RUN: 10,
    TYPING_DELAY_MIN: 15,
    TYPING_DELAY_MAX: 35,
    DELAY_BEFORE_NEXT: 10000, // 30 seconds
  };

  // ========== FOLLOWERS DATA - EMBEDDED ==========
  const FOLLOWERS = [
    {
      nickname: "NataLi",
      url: "/user-21172505",
      fullUrl: "https://soundcloud.com/user-21172505",
    },
    {
      nickname: "Her Infinite Power S.S",
      url: "/herinfinitepowerss",
      fullUrl: "https://soundcloud.com/herinfinitepowerss",
    },
    {
      nickname: "Chéfpts",
      url: "/bruce-willys",
      fullUrl: "https://soundcloud.com/bruce-willys",
    },
    {
      nickname: "Csá Mito",
      url: "/cs-mito",
      fullUrl: "https://soundcloud.com/cs-mito",
    },
    {
      nickname: "ddha qabra",
      url: "/user-543549758",
      fullUrl: "https://soundcloud.com/user-543549758",
    },
    {
      nickname: "Agnus Music",
      url: "/agnus-music-513077019",
      fullUrl: "https://soundcloud.com/agnus-music-513077019",
    },
    {
      nickname: "matt dovey",
      url: "/user-159275069-198193848",
      fullUrl: "https://soundcloud.com/user-159275069-198193848",
    },
    {
      nickname: "ThisBoYZ (sadaii & F-Lo)",
      url: "/jeremycouder",
      fullUrl: "https://soundcloud.com/jeremycouder",
    },
    {
      nickname: "DJ Micah Straight",
      url: "/dj-micah-straight",
      fullUrl: "https://soundcloud.com/dj-micah-straight",
    },
    {
      nickname: "Bluesoggz",
      url: "/bluesoggz",
      fullUrl: "https://soundcloud.com/bluesoggz",
    },
    {
      nickname: "Rafael Saez",
      url: "/wavesproject",
      fullUrl: "https://soundcloud.com/wavesproject",
    },
    {
      nickname: "Vlady",
      url: "/vladislav-vaytusyonok",
      fullUrl: "https://soundcloud.com/vladislav-vaytusyonok",
    },
    {
      nickname: "Melihh",
      url: "/chillhouse35",
      fullUrl: "https://soundcloud.com/chillhouse35",
    },
    {
      nickname: "JasonE",
      url: "/jas-785570564",
      fullUrl: "https://soundcloud.com/jas-785570564",
    },
    {
      nickname: "Msuthus Touch",
      url: "/user-729857850",
      fullUrl: "https://soundcloud.com/user-729857850",
    },
    {
      nickname: "ROY L",
      url: "/roylofficial",
      fullUrl: "https://soundcloud.com/roylofficial",
    },
    {
      nickname: "Alejandro Tron",
      url: "/alejandro-tron",
      fullUrl: "https://soundcloud.com/alejandro-tron",
    },
    {
      nickname: "ACID ONLY [FREE REPOST]",
      url: "/acidonly",
      fullUrl: "https://soundcloud.com/acidonly",
    },
    {
      nickname: "Liban",
      url: "/liban-646652752",
      fullUrl: "https://soundcloud.com/liban-646652752",
    },
    {
      nickname: "Demonic",
      url: "/thatdemonicone",
      fullUrl: "https://soundcloud.com/thatdemonicone",
    },
    {
      nickname: "BCEMusic",
      url: "/user-494650070",
      fullUrl: "https://soundcloud.com/user-494650070",
    },
    {
      nickname: "Hadi",
      url: "/user-931480334",
      fullUrl: "https://soundcloud.com/user-931480334",
    },
    {
      nickname: "JARR Head",
      url: "/jarrheadmusic",
      fullUrl: "https://soundcloud.com/jarrheadmusic",
    },
    {
      nickname: "HT Blue",
      url: "/kami-blue",
      fullUrl: "https://soundcloud.com/kami-blue",
    },
    {
      nickname: "Noctua Deep",
      url: "/noctua-deep",
      fullUrl: "https://soundcloud.com/noctua-deep",
    },
    {
      nickname: "DIAGA",
      url: "/dj-magd",
      fullUrl: "https://soundcloud.com/dj-magd",
    },
    {
      nickname: "Snowhite",
      url: "/snowhite_trance",
      fullUrl: "https://soundcloud.com/snowhite_trance",
    },
    {
      nickname: "Jorge Vallejos",
      url: "/user-279096975",
      fullUrl: "https://soundcloud.com/user-279096975",
    },
    {
      nickname: "Kristi D. Buckley",
      url: "/olorunbunmiadejumo",
      fullUrl: "https://soundcloud.com/olorunbunmiadejumo",
    },
    {
      nickname: "Dani Brayen",
      url: "/dani-brayen-519211847",
      fullUrl: "https://soundcloud.com/dani-brayen-519211847",
    },
    {
      nickname: "SayaOtska",
      url: "/ipdx3uaq89om",
      fullUrl: "https://soundcloud.com/ipdx3uaq89om",
    },
    {
      nickname: "Nefpta",
      url: "/nefptaly",
      fullUrl: "https://soundcloud.com/nefptaly",
    },
    {
      nickname: "Kunga",
      url: "/ginarings23",
      fullUrl: "https://soundcloud.com/ginarings23",
    },
    {
      nickname: "NAO TAMURA",
      url: "/naotamura",
      fullUrl: "https://soundcloud.com/naotamura",
    },
    {
      nickname: "rudemorphing",
      url: "/rudemorphing",
      fullUrl: "https://soundcloud.com/rudemorphing",
    },
    {
      nickname: "TOBEY~BAXTER ♎ [TobiasBecker]",
      url: "/tobias-becker-661580936",
      fullUrl: "https://soundcloud.com/tobias-becker-661580936",
    },
    {
      nickname: "izaqueNQL23",
      url: "/nascimentoqueirozlimaizaque",
      fullUrl: "https://soundcloud.com/nascimentoqueirozlimaizaque",
    },
    {
      nickname: "MosyaTheProducer",
      url: "/mosya-the-producer",
      fullUrl: "https://soundcloud.com/mosya-the-producer",
    },
    {
      nickname: "DJ QueMale",
      url: "/dj_quemale",
      fullUrl: "https://soundcloud.com/dj_quemale",
    },
    {
      nickname: "De Nardi",
      url: "/denardimusic",
      fullUrl: "https://soundcloud.com/denardimusic",
    },
    {
      nickname: "MURDER-KIID💧",
      url: "/murder-kiid",
      fullUrl: "https://soundcloud.com/murder-kiid",
    },
    {
      nickname: "DJ Hutchy",
      url: "/hutchydj",
      fullUrl: "https://soundcloud.com/hutchydj",
    },
    {
      nickname: "Leopard Print Music",
      url: "/leopardprintmusic",
      fullUrl: "https://soundcloud.com/leopardprintmusic",
    },
    {
      nickname: "Artur Sargsyan",
      url: "/artu-saegis-sargsya",
      fullUrl: "https://soundcloud.com/artu-saegis-sargsya",
    },
    {
      nickname: "Sebastian-L(ZBASZ)",
      url: "/user-497161432",
      fullUrl: "https://soundcloud.com/user-497161432",
    },
    {
      nickname: "formappl",
      url: "/user-106195884",
      fullUrl: "https://soundcloud.com/user-106195884",
    },
    {
      nickname: "Philrodriguez855",
      url: "/philrodriguez855",
      fullUrl: "https://soundcloud.com/philrodriguez855",
    },
    {
      nickname: "SiS Sound",
      url: "/sis-sound",
      fullUrl: "https://soundcloud.com/sis-sound",
    },
    {
      nickname: "Julez",
      url: "/julialender2605",
      fullUrl: "https://soundcloud.com/julialender2605",
    },
    {
      nickname: "MEMETiC",
      url: "/metta-attem",
      fullUrl: "https://soundcloud.com/metta-attem",
    },
    {
      nickname: "Beatbird Artists & Talents Support",
      url: "/beatbird-com",
      fullUrl: "https://soundcloud.com/beatbird-com",
    },
    {
      nickname: "Dahl",
      url: "/niklas-dahl-369675494",
      fullUrl: "https://soundcloud.com/niklas-dahl-369675494",
    },
    {
      nickname: "Nicky J  Cook",
      url: "/user-35702242-577111132",
      fullUrl: "https://soundcloud.com/user-35702242-577111132",
    },
    {
      nickname: "明石鳴 / Nari Akashi",
      url: "/afxfbuqs0v3y",
      fullUrl: "https://soundcloud.com/afxfbuqs0v3y",
    },
    {
      nickname: "Sebastian Cueto",
      url: "/sebastian-cueto-740207149",
      fullUrl: "https://soundcloud.com/sebastian-cueto-740207149",
    },
    {
      nickname: "Mostafa Said",
      url: "/mostafa-said-4",
      fullUrl: "https://soundcloud.com/mostafa-said-4",
    },
    {
      nickname: "CHA🔥",
      url: "/melina-franco-995447249",
      fullUrl: "https://soundcloud.com/melina-franco-995447249",
    },
    {
      nickname: "Adriasola Dj",
      url: "/adriasola-dj",
      fullUrl: "https://soundcloud.com/adriasola-dj",
    },
    {
      nickname: "DarKness",
      url: "/darkness-82",
      fullUrl: "https://soundcloud.com/darkness-82",
    },
    {
      nickname: "Kook Ellington",
      url: "/kookellington",
      fullUrl: "https://soundcloud.com/kookellington",
    },
    {
      nickname: "Fallout - GroundZero",
      url: "/fallout-28564927",
      fullUrl: "https://soundcloud.com/fallout-28564927",
    },
    {
      nickname: "Tosch Bärt",
      url: "/tosch-b-rt",
      fullUrl: "https://soundcloud.com/tosch-b-rt",
    },
    {
      nickname: "Beatbird Music",
      url: "/beatbird-music",
      fullUrl: "https://soundcloud.com/beatbird-music",
    },
    {
      nickname: "Amy Cassidy",
      url: "/amy-cassidy-454663827",
      fullUrl: "https://soundcloud.com/amy-cassidy-454663827",
    },
    {
      nickname: "DAVID SAEZ",
      url: "/davidsaezmusic",
      fullUrl: "https://soundcloud.com/davidsaezmusic",
    },
    {
      nickname: "AnADDICTinRECOVERY",
      url: "/fraserthewardens",
      fullUrl: "https://soundcloud.com/fraserthewardens",
    },
    {
      nickname: "TECHNO PEACE",
      url: "/technopeace",
      fullUrl: "https://soundcloud.com/technopeace",
    },
    {
      nickname: "WHEN WE PLAY",
      url: "/houseforum",
      fullUrl: "https://soundcloud.com/houseforum",
    },
    {
      nickname: "kastropodux",
      url: "/kastropodux",
      fullUrl: "https://soundcloud.com/kastropodux",
    },
    {
      nickname: "Antelo",
      url: "/user-799884293-590121363",
      fullUrl: "https://soundcloud.com/user-799884293-590121363",
    },
    {
      nickname: "Pepe Norman",
      url: "/pepenorman",
      fullUrl: "https://soundcloud.com/pepenorman",
    },
    {
      nickname: "Real Rave",
      url: "/realravesets",
      fullUrl: "https://soundcloud.com/realravesets",
    },
    {
      nickname: "Techno ist Liebe",
      url: "/techno-ist-liebe",
      fullUrl: "https://soundcloud.com/techno-ist-liebe",
    },
    {
      nickname: "Dj Snake",
      url: "/user-725512659",
      fullUrl: "https://soundcloud.com/user-725512659",
    },
    {
      nickname: "TOM ROOTS",
      url: "/tomroots1981",
      fullUrl: "https://soundcloud.com/tomroots1981",
    },
    {
      nickname: "Timeless Moments (HH)",
      url: "/ashkan-farhadi-674340246",
      fullUrl: "https://soundcloud.com/ashkan-farhadi-674340246",
    },
    {
      nickname: "Okami",
      url: "/samuraiokami",
      fullUrl: "https://soundcloud.com/samuraiokami",
    },
    {
      nickname: "LiuBoml",
      url: "/liu-boml",
      fullUrl: "https://soundcloud.com/liu-boml",
    },
    {
      nickname: "Toni Nvvrro",
      url: "/toni-navarro",
      fullUrl: "https://soundcloud.com/toni-navarro",
    },
    {
      nickname: "trumpineru",
      url: "/trumpineru",
      fullUrl: "https://soundcloud.com/trumpineru",
    },
    {
      nickname: "Ctrl4",
      url: "/ctrl4",
      fullUrl: "https://soundcloud.com/ctrl4",
    },
    {
      nickname: "Frans Beelaard",
      url: "/user-936947521",
      fullUrl: "https://soundcloud.com/user-936947521",
    },
    {
      nickname: "HardBassTV",
      url: "/hardbasstv",
      fullUrl: "https://soundcloud.com/hardbasstv",
    },
    {
      nickname: "Yabisa",
      url: "/yabisa",
      fullUrl: "https://soundcloud.com/yabisa",
    },
    {
      nickname: "ZiG",
      url: "/zigband",
      fullUrl: "https://soundcloud.com/zigband",
    },
    {
      nickname: "Alex Stoica",
      url: "/alexandru-stoica-665232741",
      fullUrl: "https://soundcloud.com/alexandru-stoica-665232741",
    },
    {
      nickname: "FrenzCook",
      url: "/user-94734029",
      fullUrl: "https://soundcloud.com/user-94734029",
    },
    {
      nickname: "Man Gone Warless 2",
      url: "/mangonewarless2",
      fullUrl: "https://soundcloud.com/mangonewarless2",
    },
    {
      nickname: "NinjaHZA",
      url: "/ninjahza",
      fullUrl: "https://soundcloud.com/ninjahza",
    },
    {
      nickname: "Soelaas",
      url: "/soelaas",
      fullUrl: "https://soundcloud.com/soelaas",
    },
    {
      nickname: "Moreno Deejay",
      url: "/morenodeejay",
      fullUrl: "https://soundcloud.com/morenodeejay",
    },
    {
      nickname: "TASTY AF",
      url: "/beatsbytasty",
      fullUrl: "https://soundcloud.com/beatsbytasty",
    },
    {
      nickname: "AZUR",
      url: "/user-725000369",
      fullUrl: "https://soundcloud.com/user-725000369",
    },
    {
      nickname: "SidneyBee",
      url: "/kashtanchik_zoo",
      fullUrl: "https://soundcloud.com/kashtanchik_zoo",
    },
    {
      nickname: "Ronic",
      url: "/ronald-berger-179165122",
      fullUrl: "https://soundcloud.com/ronald-berger-179165122",
    },
    {
      nickname: "eMöschns",
      url: "/the-emoeschns",
      fullUrl: "https://soundcloud.com/the-emoeschns",
    },
    {
      nickname: "D-Vox / Daniela Rhodes",
      url: "/dvoxdj",
      fullUrl: "https://soundcloud.com/dvoxdj",
    },
    {
      nickname: "Dj Cantona",
      url: "/tomasz-konopacki",
      fullUrl: "https://soundcloud.com/tomasz-konopacki",
    },
    {
      nickname: "émilie",
      url: "/emilie-lombard-5460635",
      fullUrl: "https://soundcloud.com/emilie-lombard-5460635",
    },
    {
      nickname: "Turbinens Sounds",
      url: "/turbinenssounds",
      fullUrl: "https://soundcloud.com/turbinenssounds",
    },
    {
      nickname: "Jade Rivers",
      url: "/jade-rivers-892263539",
      fullUrl: "https://soundcloud.com/jade-rivers-892263539",
    },
    {
      nickname: "Georgie",
      url: "/user-661467804-659171084",
      fullUrl: "https://soundcloud.com/user-661467804-659171084",
    },
    {
      nickname: "DJGL🎧D",
      url: "/dj-glad-755861599",
      fullUrl: "https://soundcloud.com/dj-glad-755861599",
    },
    {
      nickname: "Hugo Miguel Official",
      url: "/hugo-miguel-santos",
      fullUrl: "https://soundcloud.com/hugo-miguel-santos",
    },
    {
      nickname: "Eric GEORGESCO Productions",
      url: "/eric-georgesco",
      fullUrl: "https://soundcloud.com/eric-georgesco",
    },
    {
      nickname: "Ortello",
      url: "/ortellomusic",
      fullUrl: "https://soundcloud.com/ortellomusic",
    },
    {
      nickname: "LLOKKO RECORDINGS",
      url: "/llokko-recordings",
      fullUrl: "https://soundcloud.com/llokko-recordings",
    },
    {
      nickname: "DaveSM",
      url: "/dave-stevens-meredith",
      fullUrl: "https://soundcloud.com/dave-stevens-meredith",
    },
    {
      nickname: "GMar",
      url: "/gmar178384951",
      fullUrl: "https://soundcloud.com/gmar178384951",
    },
    {
      nickname: "Mullio",
      url: "/dylan-mullinueax",
      fullUrl: "https://soundcloud.com/dylan-mullinueax",
    },
    {
      nickname: "Fre",
      url: "/fremusic3",
      fullUrl: "https://soundcloud.com/fremusic3",
    },
    {
      nickname: "Push Continue",
      url: "/pushcontinuemusic",
      fullUrl: "https://soundcloud.com/pushcontinuemusic",
    },
    {
      nickname: "Danny Roots",
      url: "/dannyroots20",
      fullUrl: "https://soundcloud.com/dannyroots20",
    },
    {
      nickname: "Pete Reese",
      url: "/user-662273219",
      fullUrl: "https://soundcloud.com/user-662273219",
    },
    {
      nickname: "shaun stinner",
      url: "/shaun-stinner",
      fullUrl: "https://soundcloud.com/shaun-stinner",
    },
    {
      nickname: "Life Music",
      url: "/life-music-movement",
      fullUrl: "https://soundcloud.com/life-music-movement",
    },
    {
      nickname: "L.R.V.K.",
      url: "/lio-rivak",
      fullUrl: "https://soundcloud.com/lio-rivak",
    },
    {
      nickname: "DJ Rosi (Marcus Rosenberger)",
      url: "/dj-rosi-767833951",
      fullUrl: "https://soundcloud.com/dj-rosi-767833951",
    },
    {
      nickname: "Mr. Triple Zero",
      url: "/zero-0-0-0",
      fullUrl: "https://soundcloud.com/zero-0-0-0",
    },
    {
      nickname: "Organic House/Melodic Deep House",
      url: "/chaskitan",
      fullUrl: "https://soundcloud.com/chaskitan",
    },
    {
      nickname: "TripTunez Music",
      url: "/rob-delegge",
      fullUrl: "https://soundcloud.com/rob-delegge",
    },
    {
      nickname: "Paradox",
      url: "/user-880078188",
      fullUrl: "https://soundcloud.com/user-880078188",
    },
    {
      nickname: "Kokoschinski Coarl",
      url: "/coarlboiy",
      fullUrl: "https://soundcloud.com/coarlboiy",
    },
    {
      nickname: "Lou Ianello",
      url: "/lian-ello",
      fullUrl: "https://soundcloud.com/lian-ello",
    },
    {
      nickname: "Magu MNO",
      url: "/mnomagu",
      fullUrl: "https://soundcloud.com/mnomagu",
    },
    {
      nickname: "66 DJ HONEY PUFF",
      url: "/user-675751767",
      fullUrl: "https://soundcloud.com/user-675751767",
    },
    {
      nickname: "$uper Acid $un$hine",
      url: "/drugsickhero",
      fullUrl: "https://soundcloud.com/drugsickhero",
    },
    {
      nickname: "Nicky Ringwood",
      url: "/nicky-ringwood",
      fullUrl: "https://soundcloud.com/nicky-ringwood",
    },
    {
      nickname: "R∑BOOT",
      url: "/rebootdj74",
      fullUrl: "https://soundcloud.com/rebootdj74",
    },
    {
      nickname: "David J Pond",
      url: "/digitpond",
      fullUrl: "https://soundcloud.com/digitpond",
    },
    {
      nickname: "MRTZ",
      url: "/mrtz-929495763",
      fullUrl: "https://soundcloud.com/mrtz-929495763",
    },
    {
      nickname: "LUXAM (AR)",
      url: "/sport-luchito",
      fullUrl: "https://soundcloud.com/sport-luchito",
    },
    {
      nickname: "Bridge",
      url: "/bridgepl",
      fullUrl: "https://soundcloud.com/bridgepl",
    },
    {
      nickname: "RAVΞPOSITIVΞ",
      url: "/ravepositive",
      fullUrl: "https://soundcloud.com/ravepositive",
    },
    {
      nickname: "DEEJAY OXİD",
      url: "/okan-basmanoglu",
      fullUrl: "https://soundcloud.com/okan-basmanoglu",
    },
    {
      nickname: "Project Butterfly",
      url: "/producerflymusic",
      fullUrl: "https://soundcloud.com/producerflymusic",
    },
    {
      nickname: "DJ Dani Kaos",
      url: "/dani-kaos",
      fullUrl: "https://soundcloud.com/dani-kaos",
    },
    {
      nickname: "DJ Bierfahrer",
      url: "/dj_bierfahrer",
      fullUrl: "https://soundcloud.com/dj_bierfahrer",
    },
    {
      nickname: "Techno-Hub.de",
      url: "/techno-hub-de",
      fullUrl: "https://soundcloud.com/techno-hub-de",
    },
    {
      nickname: "GothLit",
      url: "/gothlit",
      fullUrl: "https://soundcloud.com/gothlit",
    },
    {
      nickname: "Lindstedt",
      url: "/matlind",
      fullUrl: "https://soundcloud.com/matlind",
    },
    {
      nickname: "NiTsi",
      url: "/user-6617728",
      fullUrl: "https://soundcloud.com/user-6617728",
    },
    {
      nickname: "Stevie Reid",
      url: "/stevee-reid",
      fullUrl: "https://soundcloud.com/stevee-reid",
    },
    {
      nickname: "Nicolas Orsiani",
      url: "/nico-orsiani",
      fullUrl: "https://soundcloud.com/nico-orsiani",
    },
    {
      nickname: "CHIMI LD",
      url: "/dj-chimi",
      fullUrl: "https://soundcloud.com/dj-chimi",
    },
    {
      nickname: "A.I. TECHWRITER",
      url: "/user-techwriter",
      fullUrl: "https://soundcloud.com/user-techwriter",
    },
    {
      nickname: "flow",
      url: "/ville-inkinen-950581112",
      fullUrl: "https://soundcloud.com/ville-inkinen-950581112",
    },
    {
      nickname: "DJ B.O.B.",
      url: "/robert-smocek",
      fullUrl: "https://soundcloud.com/robert-smocek",
    },
    {
      nickname: "NumberOne",
      url: "/xplayx01",
      fullUrl: "https://soundcloud.com/xplayx01",
    },
    {
      nickname: "Bryan Higgins",
      url: "/bryan-higgins-179272003",
      fullUrl: "https://soundcloud.com/bryan-higgins-179272003",
    },
    {
      nickname: "Hans Ostrom",
      url: "/user-860809208",
      fullUrl: "https://soundcloud.com/user-860809208",
    },
    {
      nickname: "King Boogie",
      url: "/king-boogie-official",
      fullUrl: "https://soundcloud.com/king-boogie-official",
    },
    {
      nickname: "Star Seeds Report",
      url: "/star-seeds-report",
      fullUrl: "https://soundcloud.com/star-seeds-report",
    },
    {
      nickname: "knebo",
      url: "/knebo",
      fullUrl: "https://soundcloud.com/knebo",
    },
    {
      nickname: "Mar Ai",
      url: "/bluesky-298901446",
      fullUrl: "https://soundcloud.com/bluesky-298901446",
    },
    {
      nickname: "Chekarino",
      url: "/romeo-saviczkij",
      fullUrl: "https://soundcloud.com/romeo-saviczkij",
    },
    {
      nickname: "TECHNO LEIPZIG",
      url: "/freetechnoleipzig",
      fullUrl: "https://soundcloud.com/freetechnoleipzig",
    },
    {
      nickname: "Beatbird Radio",
      url: "/beat-bird",
      fullUrl: "https://soundcloud.com/beat-bird",
    },
    {
      nickname: "4RK",
      url: "/4rkcrew",
      fullUrl: "https://soundcloud.com/4rkcrew",
    },
    {
      nickname: "NaMe-O",
      url: "/zsanna",
      fullUrl: "https://soundcloud.com/zsanna",
    },
    {
      nickname: "ALI",
      url: "/alitarekamer",
      fullUrl: "https://soundcloud.com/alitarekamer",
    },
    {
      nickname: "SCHUDY Jean",
      url: "/schudy-jean-jacques",
      fullUrl: "https://soundcloud.com/schudy-jean-jacques",
    },
    {
      nickname: "VinylminD",
      url: "/matt-jacobs-324411785",
      fullUrl: "https://soundcloud.com/matt-jacobs-324411785",
    },
    {
      nickname: "moQon",
      url: "/moqon",
      fullUrl: "https://soundcloud.com/moqon",
    },
    {
      nickname: "Thomas Marko",
      url: "/thomas-marko",
      fullUrl: "https://soundcloud.com/thomas-marko",
    },
    {
      nickname: "Jordan Mclaughlin",
      url: "/jordan-mclaughlin-339292575",
      fullUrl: "https://soundcloud.com/jordan-mclaughlin-339292575",
    },
    {
      nickname: "Dj SiN/NeR",
      url: "/sin-b-8520834",
      fullUrl: "https://soundcloud.com/sin-b-8520834",
    },
    {
      nickname: "Spoedsky",
      url: "/spoedsky",
      fullUrl: "https://soundcloud.com/spoedsky",
    },
    {
      nickname: "GuaTec",
      url: "/guatec",
      fullUrl: "https://soundcloud.com/guatec",
    },
    {
      nickname: "Honey",
      url: "/honeygotmelike",
      fullUrl: "https://soundcloud.com/honeygotmelike",
    },
    {
      nickname: "EVER_T",
      url: "/ever_t",
      fullUrl: "https://soundcloud.com/ever_t",
    },
    {
      nickname: "Rose DeSlovenia",
      url: "/rob-slobe",
      fullUrl: "https://soundcloud.com/rob-slobe",
    },
    {
      nickname: "triple6",
      url: "/dbrn84",
      fullUrl: "https://soundcloud.com/dbrn84",
    },
    {
      nickname: "SiKo",
      url: "/siko",
      fullUrl: "https://soundcloud.com/siko",
    },
    {
      nickname: "Tabrissel",
      url: "/tabrissel",
      fullUrl: "https://soundcloud.com/tabrissel",
    },
    {
      nickname: "PM (Cyprus)",
      url: "/pmcyprus",
      fullUrl: "https://soundcloud.com/pmcyprus",
    },
    {
      nickname: "grasshopper recordings",
      url: "/glenn-derham",
      fullUrl: "https://soundcloud.com/glenn-derham",
    },
    {
      nickname: "Lyrical Warzone",
      url: "/lyricalwarzone",
      fullUrl: "https://soundcloud.com/lyricalwarzone",
    },
    {
      nickname: "曾建勳",
      url: "/nlfppyzpyn1c",
      fullUrl: "https://soundcloud.com/nlfppyzpyn1c",
    },
    {
      nickname: "ScottDaRoc",
      url: "/scottdaroc",
      fullUrl: "https://soundcloud.com/scottdaroc",
    },
    {
      nickname: "DIVINE",
      url: "/thedivinedivine",
      fullUrl: "https://soundcloud.com/thedivinedivine",
    },
    {
      nickname: "Witan.ssxiii",
      url: "/witanxiii",
      fullUrl: "https://soundcloud.com/witanxiii",
    },
    {
      nickname: "ㄖҜҜㄖ / D.O.C.",
      url: "/okko-music",
      fullUrl: "https://soundcloud.com/okko-music",
    },
    {
      nickname: "HELL_0",
      url: "/booboo-fux",
      fullUrl: "https://soundcloud.com/booboo-fux",
    },
    {
      nickname: "Moon Cappuccino",
      url: "/mooncappuccino",
      fullUrl: "https://soundcloud.com/mooncappuccino",
    },
    {
      nickname: "Rizzy M",
      url: "/maui-reyez",
      fullUrl: "https://soundcloud.com/maui-reyez",
    },
    {
      nickname: "Somebody's Dad",
      url: "/kfrailey",
      fullUrl: "https://soundcloud.com/kfrailey",
    },
    {
      nickname: "JSC Beats",
      url: "/jscbeats1",
      fullUrl: "https://soundcloud.com/jscbeats1",
    },
    {
      nickname: "T3KNA",
      url: "/steviesteak",
      fullUrl: "https://soundcloud.com/steviesteak",
    },
    {
      nickname: "IHYSpider",
      url: "/ihyspider",
      fullUrl: "https://soundcloud.com/ihyspider",
    },
    {
      nickname: "RZIST",
      url: "/paul-rolfe-739861123",
      fullUrl: "https://soundcloud.com/paul-rolfe-739861123",
    },
    {
      nickname: "Edm",
      url: "/russian-edm-music",
      fullUrl: "https://soundcloud.com/russian-edm-music",
    },
    {
      nickname: "Ed Filipe",
      url: "/edfilipe",
      fullUrl: "https://soundcloud.com/edfilipe",
    },
    {
      nickname: "Luiz Gustavo",
      url: "/user-32121715-190444785",
      fullUrl: "https://soundcloud.com/user-32121715-190444785",
    },
    {
      nickname: "Billie",
      url: "/ting-199676461",
      fullUrl: "https://soundcloud.com/ting-199676461",
    },
    {
      nickname: "The R Industry",
      url: "/the-r-industry",
      fullUrl: "https://soundcloud.com/the-r-industry",
    },
    {
      nickname: "Dj Plancha",
      url: "/djplancha",
      fullUrl: "https://soundcloud.com/djplancha",
    },
    {
      nickname: "Guaén",
      url: "/sbongokuhle-thabo",
      fullUrl: "https://soundcloud.com/sbongokuhle-thabo",
    },
    {
      nickname: "Koozy",
      url: "/kozynorby",
      fullUrl: "https://soundcloud.com/kozynorby",
    },
    {
      nickname: "vag bax",
      url: "/vagelis-groove",
      fullUrl: "https://soundcloud.com/vagelis-groove",
    },
    {
      nickname: "コライ・アタ (Koray Ata)",
      url: "/ata-onturkler",
      fullUrl: "https://soundcloud.com/ata-onturkler",
    },
    {
      nickname: "Arksint",
      url: "/arksint",
      fullUrl: "https://soundcloud.com/arksint",
    },
    {
      nickname: "LightofLion",
      url: "/lightoflion-junnuhuhtinen",
      fullUrl: "https://soundcloud.com/lightoflion-junnuhuhtinen",
    },
    {
      nickname: "ÆRIUSĐ",
      url: "/ariusd99",
      fullUrl: "https://soundcloud.com/ariusd99",
    },
    {
      nickname: "Franky Higher",
      url: "/francesco-soddu-238077360",
      fullUrl: "https://soundcloud.com/francesco-soddu-238077360",
    },
    {
      nickname: "Maalin",
      url: "/user-25002526",
      fullUrl: "https://soundcloud.com/user-25002526",
    },
    {
      nickname: "Kaelle Électro",
      url: "/lylou734",
      fullUrl: "https://soundcloud.com/lylou734",
    },
    {
      nickname: "𝖈𝖑𝖚𝖇𝕊ℙ𝔸𝔻𝔼 ֆȶօʀɨɛֆ",
      url: "/the-fnord",
      fullUrl: "https://soundcloud.com/the-fnord",
    },
    {
      nickname: "cloudyou",
      url: "/clawouldyou",
      fullUrl: "https://soundcloud.com/clawouldyou",
    },
    {
      nickname: "DaSHaLC",
      url: "/dashalc",
      fullUrl: "https://soundcloud.com/dashalc",
    },
    {
      nickname: "MAROLO",
      url: "/angelo-massaro-770125895",
      fullUrl: "https://soundcloud.com/angelo-massaro-770125895",
    },
    {
      nickname: "Nicolas Rabovich",
      url: "/nicolasrabovich",
      fullUrl: "https://soundcloud.com/nicolasrabovich",
    },
    {
      nickname: "Surspace",
      url: "/sur_space",
      fullUrl: "https://soundcloud.com/sur_space",
    },
    {
      nickname: "MontVernon",
      url: "/montvernon",
      fullUrl: "https://soundcloud.com/montvernon",
    },
    {
      nickname: "DR:EW",
      url: "/drew_ofc_music",
      fullUrl: "https://soundcloud.com/drew_ofc_music",
    },
    {
      nickname: "Ariya Mila",
      url: "/ariyamila",
      fullUrl: "https://soundcloud.com/ariyamila",
    },
    {
      nickname: "SubRize",
      url: "/subrizedubs",
      fullUrl: "https://soundcloud.com/subrizedubs",
    },
    {
      nickname: "ORZCO",
      url: "/santiago-orozco-parra",
      fullUrl: "https://soundcloud.com/santiago-orozco-parra",
    },
    {
      nickname: "Fer Mora",
      url: "/fermora23",
      fullUrl: "https://soundcloud.com/fermora23",
    },
    {
      nickname: "Pollo Brujo",
      url: "/akapollobrujo",
      fullUrl: "https://soundcloud.com/akapollobrujo",
    },
    {
      nickname: "masone",
      url: "/the-shrew",
      fullUrl: "https://soundcloud.com/the-shrew",
    },
    {
      nickname: "DIE PROPHETEN",
      url: "/diepropheten",
      fullUrl: "https://soundcloud.com/diepropheten",
    },
    {
      nickname: "IoSonoZs",
      url: "/horv-th-zsolt-2",
      fullUrl: "https://soundcloud.com/horv-th-zsolt-2",
    },
    {
      nickname: "A1XD0K",
      url: "/user-705657977",
      fullUrl: "https://soundcloud.com/user-705657977",
    },
    {
      nickname: "Cyber Oracle",
      url: "/cyber_oracle11",
      fullUrl: "https://soundcloud.com/cyber_oracle11",
    },
    {
      nickname: "Sakrafyce",
      url: "/jordan-786770585",
      fullUrl: "https://soundcloud.com/jordan-786770585",
    },
    {
      nickname: "TOUCH FANCY",
      url: "/deejayandreluiz",
      fullUrl: "https://soundcloud.com/deejayandreluiz",
    },
    {
      nickname: "Meghann.M",
      url: "/meghann8787",
      fullUrl: "https://soundcloud.com/meghann8787",
    },
    {
      nickname: "obz.",
      url: "/craigobrien1979",
      fullUrl: "https://soundcloud.com/craigobrien1979",
    },
    {
      nickname: "Char Rayne",
      url: "/char_rayne",
      fullUrl: "https://soundcloud.com/char_rayne",
    },
    {
      nickname: "Thiago Férrer 🎧",
      url: "/thiago-de-souza-32629676",
      fullUrl: "https://soundcloud.com/thiago-de-souza-32629676",
    },
    {
      nickname: "@palab'™",
      url: "/user-531763094",
      fullUrl: "https://soundcloud.com/user-531763094",
    },
    {
      nickname: "Exzenya",
      url: "/exzenya",
      fullUrl: "https://soundcloud.com/exzenya",
    },
    {
      nickname: "S K SPLASH",
      url: "/splashmoblnf",
      fullUrl: "https://soundcloud.com/splashmoblnf",
    },
    {
      nickname: "Thomas Fabian",
      url: "/thomas-fabian-1",
      fullUrl: "https://soundcloud.com/thomas-fabian-1",
    },
    {
      nickname: "Lena Play",
      url: "/user-465255748",
      fullUrl: "https://soundcloud.com/user-465255748",
    },
    {
      nickname: "Robert Hajnal",
      url: "/robert-hajnal-186818437",
      fullUrl: "https://soundcloud.com/robert-hajnal-186818437",
    },
    {
      nickname: "Ramsés Ramírez",
      url: "/rams-s-ram-rez-1",
      fullUrl: "https://soundcloud.com/rams-s-ram-rez-1",
    },
    {
      nickname: "Guy Johnson",
      url: "/guy-johnson-dj",
      fullUrl: "https://soundcloud.com/guy-johnson-dj",
    },
    {
      nickname: "Forever House Records FHR",
      url: "/foreverhouserecords",
      fullUrl: "https://soundcloud.com/foreverhouserecords",
    },
    {
      nickname: "DJ Lil Bit",
      url: "/tamir-ballard-259213306",
      fullUrl: "https://soundcloud.com/tamir-ballard-259213306",
    },
    {
      nickname: "M3UEC",
      url: "/m3uec",
      fullUrl: "https://soundcloud.com/m3uec",
    },
    {
      nickname: "SubOrbital",
      url: "/suborbitalmusic",
      fullUrl: "https://soundcloud.com/suborbitalmusic",
    },
    {
      nickname: "Iris Titze",
      url: "/user-633002964",
      fullUrl: "https://soundcloud.com/user-633002964",
    },
    {
      nickname: "Eduard.",
      url: "/user-767124609",
      fullUrl: "https://soundcloud.com/user-767124609",
    },
    {
      nickname: "Absynthetix",
      url: "/absynthetix",
      fullUrl: "https://soundcloud.com/absynthetix",
    },
    {
      nickname: "CITY LAKE",
      url: "/citylakemusic",
      fullUrl: "https://soundcloud.com/citylakemusic",
    },
    {
      nickname: "Shane McCrum - Trance and 90s Old Skool House",
      url: "/shane-mccrum",
      fullUrl: "https://soundcloud.com/shane-mccrum",
    },
    {
      nickname: "MENTAL TELEPATHY",
      url: "/mentaltelepathy24",
      fullUrl: "https://soundcloud.com/mentaltelepathy24",
    },
    {
      nickname: "Rama(AR)",
      url: "/ramiro-britez-816728324",
      fullUrl: "https://soundcloud.com/ramiro-britez-816728324",
    },
    {
      nickname: "HouseFabrik",
      url: "/hausfabrik",
      fullUrl: "https://soundcloud.com/hausfabrik",
    },
    {
      nickname: "vullkan",
      url: "/vullkan",
      fullUrl: "https://soundcloud.com/vullkan",
    },
    {
      nickname: "Coralblue",
      url: "/stephen-clack-400110551",
      fullUrl: "https://soundcloud.com/stephen-clack-400110551",
    },
    {
      nickname: "DJ Alyssa / $241 reasons",
      url: "/user-871036392",
      fullUrl: "https://soundcloud.com/user-871036392",
    },
    {
      nickname: "ALIEN PROBE",
      url: "/alienproberecordings",
      fullUrl: "https://soundcloud.com/alienproberecordings",
    },
    {
      nickname: "Haniel Cat",
      url: "/user-249932467",
      fullUrl: "https://soundcloud.com/user-249932467",
    },
    {
      nickname: "PDBob",
      url: "/pdbob",
      fullUrl: "https://soundcloud.com/pdbob",
    },
    {
      nickname: "RACH MAC",
      url: "/rachael-mcmillan",
      fullUrl: "https://soundcloud.com/rachael-mcmillan",
    },
    {
      nickname: "Bobby Pl4y",
      url: "/elpulpoloco",
      fullUrl: "https://soundcloud.com/elpulpoloco",
    },
    {
      nickname: "Amplimood",
      url: "/amplimood",
      fullUrl: "https://soundcloud.com/amplimood",
    },
    {
      nickname: "𝕿𝖗𝖆𝖈𝖊𝖊🎧",
      url: "/tracie-13508088",
      fullUrl: "https://soundcloud.com/tracie-13508088",
    },
    {
      nickname: "White Flamingo",
      url: "/whiteflamingomusic",
      fullUrl: "https://soundcloud.com/whiteflamingomusic",
    },
    {
      nickname: "Graeme Challinor",
      url: "/graychall",
      fullUrl: "https://soundcloud.com/graychall",
    },
    {
      nickname: "Steev’N",
      url: "/steeven-meynet",
      fullUrl: "https://soundcloud.com/steeven-meynet",
    },
    {
      nickname: "DJ Frank",
      url: "/frank-stevens-646241643",
      fullUrl: "https://soundcloud.com/frank-stevens-646241643",
    },
    {
      nickname: "The Mo",
      url: "/mofaramawysound",
      fullUrl: "https://soundcloud.com/mofaramawysound",
    },
    {
      nickname: "CONCHESSA BEATS",
      url: "/patrick-sommerlund",
      fullUrl: "https://soundcloud.com/patrick-sommerlund",
    },
    {
      nickname: "🦄🦓🐴🆉🆉🅁🄾🅇🐞🪲🦋",
      url: "/zzrox",
      fullUrl: "https://soundcloud.com/zzrox",
    },
    {
      nickname: "tantrikas.com",
      url: "/tantrikas-713395063",
      fullUrl: "https://soundcloud.com/tantrikas-713395063",
    },
    {
      nickname: "Lucky Angel",
      url: "/fortunato-colucci-angelo",
      fullUrl: "https://soundcloud.com/fortunato-colucci-angelo",
    },
    {
      nickname: "DeepPrince",
      url: "/deepprince-1",
      fullUrl: "https://soundcloud.com/deepprince-1",
    },
    {
      nickname: "William Blake",
      url: "/rats616",
      fullUrl: "https://soundcloud.com/rats616",
    },
    {
      nickname: "dany blitz",
      url: "/user-853504139-576137412",
      fullUrl: "https://soundcloud.com/user-853504139-576137412",
    },
    {
      nickname: "Steve OmR",
      url: "/user-205741413",
      fullUrl: "https://soundcloud.com/user-205741413",
    },
    {
      nickname: "RAVE+",
      url: "/rave-plus",
      fullUrl: "https://soundcloud.com/rave-plus",
    },
    {
      nickname: "xoPa",
      url: "/david-peon",
      fullUrl: "https://soundcloud.com/david-peon",
    },
    {
      nickname: "Kultur Lab",
      url: "/starnoise_sn",
      fullUrl: "https://soundcloud.com/starnoise_sn",
    },
    {
      nickname: "Rob Mitshi",
      url: "/rob-mitshi",
      fullUrl: "https://soundcloud.com/rob-mitshi",
    },
    {
      nickname: "Vardath",
      url: "/vardath",
      fullUrl: "https://soundcloud.com/vardath",
    },
    {
      nickname: "MAXV",
      url: "/max-veritas",
      fullUrl: "https://soundcloud.com/max-veritas",
    },
    {
      nickname: "RythmMixx",
      url: "/rythmmixx",
      fullUrl: "https://soundcloud.com/rythmmixx",
    },
    {
      nickname: "𝕾𝖔𝖏𝖚𝖊 𝕾𝖙𝖗𝖆𝖉𝖆𝖈",
      url: "/sojuestradac",
      fullUrl: "https://soundcloud.com/sojuestradac",
    },
    {
      nickname: "Mark7",
      url: "/mark7",
      fullUrl: "https://soundcloud.com/mark7",
    },
    {
      nickname: "『Light World Media』",
      url: "/lightworldofficial",
      fullUrl: "https://soundcloud.com/lightworldofficial",
    },
    {
      nickname: "AV Soundworks",
      url: "/tavmc-est1993",
      fullUrl: "https://soundcloud.com/tavmc-est1993",
    },
    {
      nickname: "Ana Soares",
      url: "/ana-soares-32753697",
      fullUrl: "https://soundcloud.com/ana-soares-32753697",
    },
    {
      nickname: "betokras",
      url: "/betokraas-1",
      fullUrl: "https://soundcloud.com/betokraas-1",
    },
    {
      nickname: "jan",
      url: "/jansell",
      fullUrl: "https://soundcloud.com/jansell",
    },
    {
      nickname: "6AWOL",
      url: "/6awol",
      fullUrl: "https://soundcloud.com/6awol",
    },
    {
      nickname: "DJ Hulk",
      url: "/holger-kampffmeyer2",
      fullUrl: "https://soundcloud.com/holger-kampffmeyer2",
    },
    {
      nickname: "bluedragon",
      url: "/bluedragon",
      fullUrl: "https://soundcloud.com/bluedragon",
    },
    {
      nickname: "Voxdei",
      url: "/voxdeiofficial",
      fullUrl: "https://soundcloud.com/voxdeiofficial",
    },
    {
      nickname: "Hawthorn Grill",
      url: "/hawthorn-grill",
      fullUrl: "https://soundcloud.com/hawthorn-grill",
    },
    {
      nickname: "Mooshdoom",
      url: "/mark-bezerk",
      fullUrl: "https://soundcloud.com/mark-bezerk",
    },
    {
      nickname: "colo ralpha",
      url: "/user511231044",
      fullUrl: "https://soundcloud.com/user511231044",
    },
    {
      nickname: "Ⓜarco.Ⓡ",
      url: "/marco-russo-92",
      fullUrl: "https://soundcloud.com/marco-russo-92",
    },
    {
      nickname: "SwitchVp",
      url: "/user737456018",
      fullUrl: "https://soundcloud.com/user737456018",
    },
    {
      nickname: "caroline",
      url: "/caroline-599152968",
      fullUrl: "https://soundcloud.com/caroline-599152968",
    },
    {
      nickname: "VΞXØN",
      url: "/vishva-fernando",
      fullUrl: "https://soundcloud.com/vishva-fernando",
    },
    {
      nickname: "Nelxucho",
      url: "/nelxucho",
      fullUrl: "https://soundcloud.com/nelxucho",
    },
    {
      nickname: "OnlyNine",
      url: "/user-877846507",
      fullUrl: "https://soundcloud.com/user-877846507",
    },
    {
      nickname: "Skullboicarti 💀",
      url: "/user-78022278",
      fullUrl: "https://soundcloud.com/user-78022278",
    },
    {
      nickname: "Fabrizio Catalano",
      url: "/djfachufc",
      fullUrl: "https://soundcloud.com/djfachufc",
    },
    {
      nickname: "neuromission",
      url: "/neuromiss",
      fullUrl: "https://soundcloud.com/neuromiss",
    },
    {
      nickname: "Zaroff",
      url: "/guyotc",
      fullUrl: "https://soundcloud.com/guyotc",
    },
    {
      nickname: "ØCTØBER",
      url: "/octoberthirty1st",
      fullUrl: "https://soundcloud.com/octoberthirty1st",
    },
    {
      nickname: "O^N",
      url: "/onno979",
      fullUrl: "https://soundcloud.com/onno979",
    },
    {
      nickname: "Ivan De Marco",
      url: "/ivan-de-marco",
      fullUrl: "https://soundcloud.com/ivan-de-marco",
    },
    {
      nickname: "CUMØ",
      url: "/ste-cumo",
      fullUrl: "https://soundcloud.com/ste-cumo",
    },
    {
      nickname: "Andrew LeTo",
      url: "/andrewleto",
      fullUrl: "https://soundcloud.com/andrewleto",
    },
    {
      nickname: "Tokyo_Night",
      url: "/tokyo_nights-393977532",
      fullUrl: "https://soundcloud.com/tokyo_nights-393977532",
    },
    {
      nickname: "ThiagoRPD",
      url: "/thiagorpd",
      fullUrl: "https://soundcloud.com/thiagorpd",
    },
    {
      nickname: "cotter13",
      url: "/cotter13",
      fullUrl: "https://soundcloud.com/cotter13",
    },
    {
      nickname: "NelsonAM",
      url: "/nelson-a-m",
      fullUrl: "https://soundcloud.com/nelson-a-m",
    },
    {
      nickname: "rodders888",
      url: "/rodders888",
      fullUrl: "https://soundcloud.com/rodders888",
    },
    {
      nickname: "y4m4m07o",
      url: "/matinee0404",
      fullUrl: "https://soundcloud.com/matinee0404",
    },
    {
      nickname: "Unity",
      url: "/baixoaki-downloads",
      fullUrl: "https://soundcloud.com/baixoaki-downloads",
    },
    {
      nickname: "GYG $killz",
      url: "/joe-anthony-475304134",
      fullUrl: "https://soundcloud.com/joe-anthony-475304134",
    },
    {
      nickname: "KimmyT",
      url: "/user-467953287",
      fullUrl: "https://soundcloud.com/user-467953287",
    },
    {
      nickname: "Geschwätz GmbH",
      url: "/geschwaetz-gmbh",
      fullUrl: "https://soundcloud.com/geschwaetz-gmbh",
    },
    {
      nickname: "Tommy Stewart",
      url: "/tommy-stewart",
      fullUrl: "https://soundcloud.com/tommy-stewart",
    },
    {
      nickname: "Astral Taxi",
      url: "/astral-taxi",
      fullUrl: "https://soundcloud.com/astral-taxi",
    },
    {
      nickname: "Sama Doragon",
      url: "/sama-doragon",
      fullUrl: "https://soundcloud.com/sama-doragon",
    },
    {
      nickname: "HILFIGER",
      url: "/djhilfiger",
      fullUrl: "https://soundcloud.com/djhilfiger",
    },
    {
      nickname: "Martin Slidel",
      url: "/martin-slidel",
      fullUrl: "https://soundcloud.com/martin-slidel",
    },
    {
      nickname: "C A R V A L",
      url: "/carval_argentina",
      fullUrl: "https://soundcloud.com/carval_argentina",
    },
    {
      nickname: "ChrisNavarro",
      url: "/ch-navarro",
      fullUrl: "https://soundcloud.com/ch-navarro",
    },
    {
      nickname: "Anna Sophia",
      url: "/anna-sophia-681746322",
      fullUrl: "https://soundcloud.com/anna-sophia-681746322",
    },
    {
      nickname: "Mr Jerky Jerk",
      url: "/mrjerkyjerkt",
      fullUrl: "https://soundcloud.com/mrjerkyjerkt",
    },
    {
      nickname: "Latina",
      url: "/nashgull-mdq-3873737",
      fullUrl: "https://soundcloud.com/nashgull-mdq-3873737",
    },
    {
      nickname: "Dj Popcman Beat'King Musik",
      url: "/djpopcman",
      fullUrl: "https://soundcloud.com/djpopcman",
    },
    {
      nickname: "Welbo",
      url: "/markwelb",
      fullUrl: "https://soundcloud.com/markwelb",
    },
    {
      nickname: "Chef Kid",
      url: "/richard-blacksmith-512555052",
      fullUrl: "https://soundcloud.com/richard-blacksmith-512555052",
    },
    {
      nickname: "pizsy",
      url: "/pizsy",
      fullUrl: "https://soundcloud.com/pizsy",
    },
    {
      nickname: "Gary Randman",
      url: "/gary-randman",
      fullUrl: "https://soundcloud.com/gary-randman",
    },
    {
      nickname: "Tay_Ropical",
      url: "/tayropical",
      fullUrl: "https://soundcloud.com/tayropical",
    },
    {
      nickname: "LOUPBLON",
      url: "/jean-lou-keller-605500378",
      fullUrl: "https://soundcloud.com/jean-lou-keller-605500378",
    },
    {
      nickname: "Abisola A",
      url: "/bisola-web",
      fullUrl: "https://soundcloud.com/bisola-web",
    },
    {
      nickname: "Daddy Bear",
      url: "/user-750749852-375329676",
      fullUrl: "https://soundcloud.com/user-750749852-375329676",
    },
    {
      nickname: "andrew x",
      url: "/andrew-x-ams",
      fullUrl: "https://soundcloud.com/andrew-x-ams",
    },
    {
      nickname: "Zaheer👾",
      url: "/user-19281586",
      fullUrl: "https://soundcloud.com/user-19281586",
    },
    {
      nickname: "Krahe",
      url: "/user-811178387",
      fullUrl: "https://soundcloud.com/user-811178387",
    },
    {
      nickname: "disko_je",
      url: "/diskoje",
      fullUrl: "https://soundcloud.com/diskoje",
    },
    {
      nickname: "efinnan",
      url: "/elliott-finnan",
      fullUrl: "https://soundcloud.com/elliott-finnan",
    },
    {
      nickname: "JahganSounds",
      url: "/jahganolivier",
      fullUrl: "https://soundcloud.com/jahganolivier",
    },
    {
      nickname: "Mariel885",
      url: "/mariel885",
      fullUrl: "https://soundcloud.com/mariel885",
    },
    {
      nickname: "Spirit Project",
      url: "/spiritproject",
      fullUrl: "https://soundcloud.com/spiritproject",
    },
    {
      nickname: "D:tekt",
      url: "/d-tekt",
      fullUrl: "https://soundcloud.com/d-tekt",
    },
    {
      nickname: "eum.",
      url: "/musss1",
      fullUrl: "https://soundcloud.com/musss1",
    },
    {
      nickname: "NASHGULL_MDQ",
      url: "/nashgull_mdq",
      fullUrl: "https://soundcloud.com/nashgull_mdq",
    },
    {
      nickname: "DJ WATANABE",
      url: "/lauchang-watanabe",
      fullUrl: "https://soundcloud.com/lauchang-watanabe",
    },
    {
      nickname: "nicocardemil",
      url: "/nicolas-cardemil",
      fullUrl: "https://soundcloud.com/nicolas-cardemil",
    },
    {
      nickname: "Troy Feltz",
      url: "/troyfeltz",
      fullUrl: "https://soundcloud.com/troyfeltz",
    },
    {
      nickname: "Fer Ciccive",
      url: "/ferciccive",
      fullUrl: "https://soundcloud.com/ferciccive",
    },
    {
      nickname: "Dj Carl Walken",
      url: "/user-824997481",
      fullUrl: "https://soundcloud.com/user-824997481",
    },
    {
      nickname: "BajoElCielo",
      url: "/bajoelcielo",
      fullUrl: "https://soundcloud.com/bajoelcielo",
    },
    {
      nickname: "Mimì (Mimixs)",
      url: "/mim-sewielam",
      fullUrl: "https://soundcloud.com/mim-sewielam",
    },
    {
      nickname: "Dj Black Camel",
      url: "/user-150722033",
      fullUrl: "https://soundcloud.com/user-150722033",
    },
    {
      nickname: "DJ Nellyofficial",
      url: "/nellyofficial2020",
      fullUrl: "https://soundcloud.com/nellyofficial2020",
    },
    {
      nickname: "TYREE SUMMERS",
      url: "/trn912",
      fullUrl: "https://soundcloud.com/trn912",
    },
    {
      nickname: "Trace 💃User 517020851",
      url: "/user-517020851",
      fullUrl: "https://soundcloud.com/user-517020851",
    },
    {
      nickname: "Mr Dee Gee",
      url: "/dennis-gusta-563334392",
      fullUrl: "https://soundcloud.com/dennis-gusta-563334392",
    },
    {
      nickname: "Purple Frequencies",
      url: "/purple-frequencies",
      fullUrl: "https://soundcloud.com/purple-frequencies",
    },
    {
      nickname: "Kristo Senia",
      url: "/kristo_senia",
      fullUrl: "https://soundcloud.com/kristo_senia",
    },
    {
      nickname: "116 FACTORY",
      url: "/kommand-jey",
      fullUrl: "https://soundcloud.com/kommand-jey",
    },
    {
      nickname: "Seba Cuevas",
      url: "/sebacuevasdj",
      fullUrl: "https://soundcloud.com/sebacuevasdj",
    },
    {
      nickname: "Jungle Tings Audio",
      url: "/jungle-tings-audio",
      fullUrl: "https://soundcloud.com/jungle-tings-audio",
    },
    {
      nickname: "It's Charlie",
      url: "/its-charlie-with-an-ie",
      fullUrl: "https://soundcloud.com/its-charlie-with-an-ie",
    },
    {
      nickname: "Acid Virtual",
      url: "/diego-alejandro-260805164",
      fullUrl: "https://soundcloud.com/diego-alejandro-260805164",
    },
    {
      nickname: "R-C4D",
      url: "/user-985522233",
      fullUrl: "https://soundcloud.com/user-985522233",
    },
    {
      nickname: "Watt World of House",
      url: "/9akvr3pfx2kv",
      fullUrl: "https://soundcloud.com/9akvr3pfx2kv",
    },
    {
      nickname: "FMontedj",
      url: "/fmontedj",
      fullUrl: "https://soundcloud.com/fmontedj",
    },
    {
      nickname: "houseofJay-Kay",
      url: "/houseofjaykay",
      fullUrl: "https://soundcloud.com/houseofjaykay",
    },
    {
      nickname: "ADAMARK",
      url: "/adamark-official",
      fullUrl: "https://soundcloud.com/adamark-official",
    },
    {
      nickname: "J Malice",
      url: "/joey-rogers-245943309",
      fullUrl: "https://soundcloud.com/joey-rogers-245943309",
    },
    {
      nickname: "No Sin in Eden",
      url: "/nosinineden",
      fullUrl: "https://soundcloud.com/nosinineden",
    },
    {
      nickname: "Vedran",
      url: "/vedran-janjic-205130757",
      fullUrl: "https://soundcloud.com/vedran-janjic-205130757",
    },
    {
      nickname: "DJ Marko Berbakov",
      url: "/berbakovm",
      fullUrl: "https://soundcloud.com/berbakovm",
    },
    {
      nickname: "sugarstealer",
      url: "/sugarstealer",
      fullUrl: "https://soundcloud.com/sugarstealer",
    },
    {
      nickname: "Analogue Assault",
      url: "/martydaly1992",
      fullUrl: "https://soundcloud.com/martydaly1992",
    },
    {
      nickname: "Los Hubibis",
      url: "/los-hubibis",
      fullUrl: "https://soundcloud.com/los-hubibis",
    },
    {
      nickname: "&ORphine - Cinematic Mashups",
      url: "/and-ormusic",
      fullUrl: "https://soundcloud.com/and-ormusic",
    },
    {
      nickname: "topal",
      url: "/user-889767611",
      fullUrl: "https://soundcloud.com/user-889767611",
    },
    {
      nickname: "Lorena",
      url: "/user-104633258",
      fullUrl: "https://soundcloud.com/user-104633258",
    },
    {
      nickname: "DJMoll",
      url: "/user-728211692",
      fullUrl: "https://soundcloud.com/user-728211692",
    },
    {
      nickname: "Jacob.",
      url: "/jacob-sekulski-68612861",
      fullUrl: "https://soundcloud.com/jacob-sekulski-68612861",
    },
    {
      nickname: "MiMeHOFF",
      url: "/mikael-hoff-741359450",
      fullUrl: "https://soundcloud.com/mikael-hoff-741359450",
    },
    {
      nickname: "s.k.y.n.e.t",
      url: "/s-k-y-n-e-t_productions",
      fullUrl: "https://soundcloud.com/s-k-y-n-e-t_productions",
    },
    {
      nickname: "Rise: To",
      url: "/rise2",
      fullUrl: "https://soundcloud.com/rise2",
    },
    {
      nickname: "Wild Moon",
      url: "/wildmoonmusic-997347814",
      fullUrl: "https://soundcloud.com/wildmoonmusic-997347814",
    },
    {
      nickname: "DJ-Pope The Pope of Sound",
      url: "/sound_pope",
      fullUrl: "https://soundcloud.com/sound_pope",
    },
    {
      nickname: "Christian Woodyatt",
      url: "/christianwoodyatt",
      fullUrl: "https://soundcloud.com/christianwoodyatt",
    },
    {
      nickname: "ALDI BE COOL",
      url: "/aldibecool",
      fullUrl: "https://soundcloud.com/aldibecool",
    },
    {
      nickname: "Azur-a",
      url: "/pickled-sheep",
      fullUrl: "https://soundcloud.com/pickled-sheep",
    },
    {
      nickname: "Coconuts",
      url: "/corinne-lauseille",
      fullUrl: "https://soundcloud.com/corinne-lauseille",
    },
    {
      nickname: "MTHER",
      url: "/emily-hall-611893962",
      fullUrl: "https://soundcloud.com/emily-hall-611893962",
    },
    {
      nickname: "KAI FLAME",
      url: "/user-929475071",
      fullUrl: "https://soundcloud.com/user-929475071",
    },
    {
      nickname: "Craig Mars",
      url: "/craigmarsdj",
      fullUrl: "https://soundcloud.com/craigmarsdj",
    },
    {
      nickname: "DJ Bilseye",
      url: "/matthias-bil-504427006",
      fullUrl: "https://soundcloud.com/matthias-bil-504427006",
    },
    {
      nickname: "Locóo,Sanh",
      url: "/locoosanhyeah",
      fullUrl: "https://soundcloud.com/locoosanhyeah",
    },
    {
      nickname: "Indie Elephant",
      url: "/indie_elephant",
      fullUrl: "https://soundcloud.com/indie_elephant",
    },
    {
      nickname: "Oscar Chivite Miralles",
      url: "/oscar-chivite-miralles",
      fullUrl: "https://soundcloud.com/oscar-chivite-miralles",
    },
    {
      nickname: "Eric V",
      url: "/ericvmusic",
      fullUrl: "https://soundcloud.com/ericvmusic",
    },
    {
      nickname: "EROS (US)",
      url: "/eroscielo",
      fullUrl: "https://soundcloud.com/eroscielo",
    },
    {
      nickname: "Bear Walsh",
      url: "/bearwalsh",
      fullUrl: "https://soundcloud.com/bearwalsh",
    },
    {
      nickname: "PED",
      url: "/user-715491256",
      fullUrl: "https://soundcloud.com/user-715491256",
    },
    {
      nickname: "ALKIE",
      url: "/alkie-482753018",
      fullUrl: "https://soundcloud.com/alkie-482753018",
    },
    {
      nickname: "rudehumour",
      url: "/rudehumour",
      fullUrl: "https://soundcloud.com/rudehumour",
    },
    {
      nickname: "MarMys (aka djmarkee)(BE)",
      url: "/djmarkee-1",
      fullUrl: "https://soundcloud.com/djmarkee-1",
    },
    {
      nickname: "STUDIO TTL",
      url: "/studiottl",
      fullUrl: "https://soundcloud.com/studiottl",
    },
    {
      nickname: "ACKWRLD",
      url: "/ackwrld333",
      fullUrl: "https://soundcloud.com/ackwrld333",
    },
    {
      nickname: "Dr Groove Dj",
      url: "/dr_groove_dj",
      fullUrl: "https://soundcloud.com/dr_groove_dj",
    },
    {
      nickname: "Paul De Mac",
      url: "/user-923018514",
      fullUrl: "https://soundcloud.com/user-923018514",
    },
    {
      nickname: "PacolmoSound",
      url: "/pacolmosound",
      fullUrl: "https://soundcloud.com/pacolmosound",
    },
    {
      nickname: "Lv82",
      url: "/user-805815519",
      fullUrl: "https://soundcloud.com/user-805815519",
    },
    {
      nickname: "VICENTE MIQUEL",
      url: "/vicente-miquel",
      fullUrl: "https://soundcloud.com/vicente-miquel",
    },
    {
      nickname: "Fuerteventura Deep Sound",
      url: "/fuerteventura_deep_sound",
      fullUrl: "https://soundcloud.com/fuerteventura_deep_sound",
    },
    {
      nickname: "Rordzee",
      url: "/rordzee-220496559",
      fullUrl: "https://soundcloud.com/rordzee-220496559",
    },
    {
      nickname: "DiscoVibes_Collective",
      url: "/discovibes_collective",
      fullUrl: "https://soundcloud.com/discovibes_collective",
    },
    {
      nickname: "Bare Jensen",
      url: "/thomas-jensen-617634535",
      fullUrl: "https://soundcloud.com/thomas-jensen-617634535",
    },
    {
      nickname: "Thousand",
      url: "/user-775541543",
      fullUrl: "https://soundcloud.com/user-775541543",
    },
    {
      nickname: "Danni Markez",
      url: "/danimarkez",
      fullUrl: "https://soundcloud.com/danimarkez",
    },
    {
      nickname: "Wavous Davus",
      url: "/wavous-davus",
      fullUrl: "https://soundcloud.com/wavous-davus",
    },
    {
      nickname: "Oddler music Official",
      url: "/joao-daniel-ferreira-60683103",
      fullUrl: "https://soundcloud.com/joao-daniel-ferreira-60683103",
    },
    {
      nickname: "Esbri Dj",
      url: "/esbri-dj",
      fullUrl: "https://soundcloud.com/esbri-dj",
    },
    {
      nickname: "GONE DARK",
      url: "/user-982031049",
      fullUrl: "https://soundcloud.com/user-982031049",
    },
    {
      nickname: "Sonny_Moroney",
      url: "/adammoroney1985",
      fullUrl: "https://soundcloud.com/adammoroney1985",
    },
    {
      nickname: "Fuji.musik",
      url: "/fujimusik",
      fullUrl: "https://soundcloud.com/fujimusik",
    },
    {
      nickname: "Samuel D",
      url: "/samuel-drewer",
      fullUrl: "https://soundcloud.com/samuel-drewer",
    },
    {
      nickname: "dubbledrop",
      url: "/dubbledropbk",
      fullUrl: "https://soundcloud.com/dubbledropbk",
    },
    {
      nickname: "JaaQ_TwiizT",
      url: "/jaaq_twiizt",
      fullUrl: "https://soundcloud.com/jaaq_twiizt",
    },
    {
      nickname: "Erberon",
      url: "/erberon",
      fullUrl: "https://soundcloud.com/erberon",
    },
    {
      nickname: "Enienoh B",
      url: "/enienoh-brown-257585177",
      fullUrl: "https://soundcloud.com/enienoh-brown-257585177",
    },
    {
      nickname: "Lekkermon alter ego @officiallekker",
      url: "/official_lekker",
      fullUrl: "https://soundcloud.com/official_lekker",
    },
    {
      nickname: "Roberto Vicari",
      url: "/roredj",
      fullUrl: "https://soundcloud.com/roredj",
    },
    {
      nickname: "MATIAS HERLEIN",
      url: "/herleinmath",
      fullUrl: "https://soundcloud.com/herleinmath",
    },
    {
      nickname: "Tanazza",
      url: "/tanass-staikow",
      fullUrl: "https://soundcloud.com/tanass-staikow",
    },
    {
      nickname: "🌎 Matt  Zen Music🌎",
      url: "/m-c-w",
      fullUrl: "https://soundcloud.com/m-c-w",
    },
    {
      nickname: "The Ancient Kid",
      url: "/the-ancient-kid",
      fullUrl: "https://soundcloud.com/the-ancient-kid",
    },
    {
      nickname: "Rob-Myco 808",
      url: "/user-293471016",
      fullUrl: "https://soundcloud.com/user-293471016",
    },
    {
      nickname: "Løwnik",
      url: "/djlownik",
      fullUrl: "https://soundcloud.com/djlownik",
    },
    {
      nickname: "M.R. Arocho",
      url: "/manuel-rey-arocho",
      fullUrl: "https://soundcloud.com/manuel-rey-arocho",
    },
    {
      nickname: "TRebelCleftLip",
      url: "/twyla-spinelli",
      fullUrl: "https://soundcloud.com/twyla-spinelli",
    },
    {
      nickname: "TheDarsh1",
      url: "/thedarsh1",
      fullUrl: "https://soundcloud.com/thedarsh1",
    },
    {
      nickname: "2 domino",
      url: "/user-372582304",
      fullUrl: "https://soundcloud.com/user-372582304",
    },
    {
      nickname: "Jim Naposhto",
      url: "/jim-naposhto",
      fullUrl: "https://soundcloud.com/jim-naposhto",
    },
    {
      nickname: "ChordinationStation",
      url: "/chordinationstation",
      fullUrl: "https://soundcloud.com/chordinationstation",
    },
    {
      nickname: "PSYLLY",
      url: "/dnewsom222",
      fullUrl: "https://soundcloud.com/dnewsom222",
    },
    {
      nickname: "djpsycho",
      url: "/d-musser",
      fullUrl: "https://soundcloud.com/d-musser",
    },
    {
      nickname: "omar_contreras",
      url: "/omar_contreras",
      fullUrl: "https://soundcloud.com/omar_contreras",
    },
    {
      nickname: "Max Desai",
      url: "/maxdesai",
      fullUrl: "https://soundcloud.com/maxdesai",
    },
    {
      nickname: "Jonatgo",
      url: "/jonatgo",
      fullUrl: "https://soundcloud.com/jonatgo",
    },
    {
      nickname: "Detrivore",
      url: "/detrivore",
      fullUrl: "https://soundcloud.com/detrivore",
    },
    {
      nickname: "LoloHaole",
      url: "/daniel-lee-149",
      fullUrl: "https://soundcloud.com/daniel-lee-149",
    },
    {
      nickname: "Serket_Circuit",
      url: "/carasays",
      fullUrl: "https://soundcloud.com/carasays",
    },
    {
      nickname: "KANOPI",
      url: "/kurt-thywissen",
      fullUrl: "https://soundcloud.com/kurt-thywissen",
    },
    {
      nickname: "PAVLOVA",
      url: "/paupavlova",
      fullUrl: "https://soundcloud.com/paupavlova",
    },
    {
      nickname: "Cristina",
      url: "/deloreana",
      fullUrl: "https://soundcloud.com/deloreana",
    },
    {
      nickname: "Karton",
      url: "/orl-karton",
      fullUrl: "https://soundcloud.com/orl-karton",
    },
    {
      nickname: "DJ Jo Mineault",
      url: "/djjomineault",
      fullUrl: "https://soundcloud.com/djjomineault",
    },
    {
      nickname: "LitRev",
      url: "/litreview",
      fullUrl: "https://soundcloud.com/litreview",
    },
    {
      nickname: "na_nook",
      url: "/na_nook",
      fullUrl: "https://soundcloud.com/na_nook",
    },
    {
      nickname: "Harry Duran [djhd]",
      url: "/djhd",
      fullUrl: "https://soundcloud.com/djhd",
    },
    {
      nickname: "Luis Masi",
      url: "/luismasi",
      fullUrl: "https://soundcloud.com/luismasi",
    },
    {
      nickname: "Fuera del Redil",
      url: "/fueradelredil",
      fullUrl: "https://soundcloud.com/fueradelredil",
    },
    {
      nickname: "Ross128",
      url: "/oss128",
      fullUrl: "https://soundcloud.com/oss128",
    },
    {
      nickname: "Balázs Földing",
      url: "/balazs-foelding-310307751",
      fullUrl: "https://soundcloud.com/balazs-foelding-310307751",
    },
    {
      nickname: "R.D.",
      url: "/ru_diem",
      fullUrl: "https://soundcloud.com/ru_diem",
    },
    {
      nickname: "Zen Zero",
      url: "/zenzeromusic",
      fullUrl: "https://soundcloud.com/zenzeromusic",
    },
    {
      nickname: "Zendo Stereo",
      url: "/zendostereo",
      fullUrl: "https://soundcloud.com/zendostereo",
    },
    {
      nickname: "ho11ymo11y",
      url: "/ho11ymo11y",
      fullUrl: "https://soundcloud.com/ho11ymo11y",
    },
    {
      nickname: "Dennis Balzhäuser",
      url: "/dennis-balzhaeuser",
      fullUrl: "https://soundcloud.com/dennis-balzhaeuser",
    },
    {
      nickname: "Dugi",
      url: "/99-not-out",
      fullUrl: "https://soundcloud.com/99-not-out",
    },
    {
      nickname: "Racy Cake",
      url: "/tracy-cake",
      fullUrl: "https://soundcloud.com/tracy-cake",
    },
    {
      nickname: "Blossom Circle",
      url: "/blossomcirclelab",
      fullUrl: "https://soundcloud.com/blossomcirclelab",
    },
    {
      nickname: "basteq",
      url: "/basteq",
      fullUrl: "https://soundcloud.com/basteq",
    },
    {
      nickname: "missnvegas",
      url: "/missy-s",
      fullUrl: "https://soundcloud.com/missy-s",
    },
    {
      nickname: "RYTHMC",
      url: "/rythmcbeats",
      fullUrl: "https://soundcloud.com/rythmcbeats",
    },
    {
      nickname: "Space Sax",
      url: "/spacesax",
      fullUrl: "https://soundcloud.com/spacesax",
    },
    {
      nickname: "Lost Journeys",
      url: "/lost-journeys",
      fullUrl: "https://soundcloud.com/lost-journeys",
    },
    {
      nickname: "Cris Olson",
      url: "/cris-olson",
      fullUrl: "https://soundcloud.com/cris-olson",
    },
    {
      nickname: "MtveriFM Radio",
      url: "/mtverifm",
      fullUrl: "https://soundcloud.com/mtverifm",
    },
    {
      nickname: "Tommes / Mr.Pot&Acid",
      url: "/pot-2",
      fullUrl: "https://soundcloud.com/pot-2",
    },
    {
      nickname: "Ludmila Navarro",
      url: "/ludmila-navarro-656976229",
      fullUrl: "https://soundcloud.com/ludmila-navarro-656976229",
    },
    {
      nickname: "exp(ix)=cos(x)+i.sen(x)",
      url: "/kevinedck",
      fullUrl: "https://soundcloud.com/kevinedck",
    },
    {
      nickname: "BackstoryDisco",
      url: "/backstorydisco",
      fullUrl: "https://soundcloud.com/backstorydisco",
    },
    {
      nickname: "Ste Emmerson",
      url: "/user-76406027",
      fullUrl: "https://soundcloud.com/user-76406027",
    },
    {
      nickname: "Martin Mariani",
      url: "/martin-mariani",
      fullUrl: "https://soundcloud.com/martin-mariani",
    },
    {
      nickname: "DANKO SKYSTÖNE",
      url: "/dankoskystone",
      fullUrl: "https://soundcloud.com/dankoskystone",
    },
    {
      nickname: "Hugo Vallejo",
      url: "/hugovallejo",
      fullUrl: "https://soundcloud.com/hugovallejo",
    },
    {
      nickname: "Tony Brydon",
      url: "/lloyd23",
      fullUrl: "https://soundcloud.com/lloyd23",
    },
    {
      nickname: "spohr",
      url: "/jared-spohr-283498465",
      fullUrl: "https://soundcloud.com/jared-spohr-283498465",
    },
    {
      nickname: "Yarco",
      url: "/yarco-barraza",
      fullUrl: "https://soundcloud.com/yarco-barraza",
    },
    {
      nickname: "Byzantian",
      url: "/alexwand-756091927",
      fullUrl: "https://soundcloud.com/alexwand-756091927",
    },
    {
      nickname: "Six70",
      url: "/j-m-477177354",
      fullUrl: "https://soundcloud.com/j-m-477177354",
    },
    {
      nickname: "Alex",
      url: "/alexandros755131917",
      fullUrl: "https://soundcloud.com/alexandros755131917",
    },
    {
      nickname: "Dj wiccan",
      url: "/ryan-townsend-5",
      fullUrl: "https://soundcloud.com/ryan-townsend-5",
    },
    {
      nickname: "MOATAZ",
      url: "/moataz-1",
      fullUrl: "https://soundcloud.com/moataz-1",
    },
    {
      nickname: "Ben Gleiwitz",
      url: "/ben-gleiwitz",
      fullUrl: "https://soundcloud.com/ben-gleiwitz",
    },
    {
      nickname: "Joaquin",
      url: "/joaquin",
      fullUrl: "https://soundcloud.com/joaquin",
    },
    {
      nickname: "deansy",
      url: "/deansy",
      fullUrl: "https://soundcloud.com/deansy",
    },
    {
      nickname: "ACID AJ MUSIC",
      url: "/acid-aj",
      fullUrl: "https://soundcloud.com/acid-aj",
    },
    {
      nickname: "Buweloboy",
      url: "/goiyfo",
      fullUrl: "https://soundcloud.com/goiyfo",
    },
    {
      nickname: "Diego de Alba",
      url: "/diegodealba",
      fullUrl: "https://soundcloud.com/diegodealba",
    },
    {
      nickname: "Diamond Collection",
      url: "/thediamondcollection",
      fullUrl: "https://soundcloud.com/thediamondcollection",
    },
    {
      nickname: "DJ Fonk E.T.",
      url: "/glenn-tucker3",
      fullUrl: "https://soundcloud.com/glenn-tucker3",
    },
    {
      nickname: "fictionalive ⭕️ UNITY",
      url: "/fictionalive",
      fullUrl: "https://soundcloud.com/fictionalive",
    },
    {
      nickname: "The Todfather",
      url: "/thetodfather",
      fullUrl: "https://soundcloud.com/thetodfather",
    },
    {
      nickname: "DJ Teoma",
      url: "/djteoma",
      fullUrl: "https://soundcloud.com/djteoma",
    },
    {
      nickname: "Nordheiim",
      url: "/nordheiim",
      fullUrl: "https://soundcloud.com/nordheiim",
    },
    {
      nickname: "Geeps",
      url: "/geepgeeps",
      fullUrl: "https://soundcloud.com/geepgeeps",
    },
    {
      nickname: "BurnerMike",
      url: "/burnermike",
      fullUrl: "https://soundcloud.com/burnermike",
    },
    {
      nickname: "Vibes by Tory",
      url: "/vibesbytory",
      fullUrl: "https://soundcloud.com/vibesbytory",
    },
    {
      nickname: "SuperTrippyHippie",
      url: "/supertrippyhippie",
      fullUrl: "https://soundcloud.com/supertrippyhippie",
    },
    {
      nickname: "jaissooo",
      url: "/jaissoo-1233jaissoo",
      fullUrl: "https://soundcloud.com/jaissoo-1233jaissoo",
    },
    {
      nickname: "Perrrovska",
      url: "/milica-perovski",
      fullUrl: "https://soundcloud.com/milica-perovski",
    },
    {
      nickname: "Ben Gingras: SoFloVoodoo",
      url: "/soflovoodoo",
      fullUrl: "https://soundcloud.com/soflovoodoo",
    },
    {
      nickname: "Future Jackson",
      url: "/future_jackson",
      fullUrl: "https://soundcloud.com/future_jackson",
    },
    {
      nickname: "Sasha Sol",
      url: "/sashasol",
      fullUrl: "https://soundcloud.com/sashasol",
    },
    {
      nickname: "Vee",
      url: "/ifyouseevee",
      fullUrl: "https://soundcloud.com/ifyouseevee",
    },
    {
      nickname: "SaLtN",
      url: "/saltn25",
      fullUrl: "https://soundcloud.com/saltn25",
    },
    {
      nickname: "BrianSD",
      url: "/briansd",
      fullUrl: "https://soundcloud.com/briansd",
    },
    {
      nickname: "Aaron Marc",
      url: "/aaron-marc-159677884",
      fullUrl: "https://soundcloud.com/aaron-marc-159677884",
    },
    {
      nickname: "RaStaFaRiSkY",
      url: "/user-446563258",
      fullUrl: "https://soundcloud.com/user-446563258",
    },
    {
      nickname: "Desert Raven",
      url: "/desertravenmusic",
      fullUrl: "https://soundcloud.com/desertravenmusic",
    },
    {
      nickname: "Porcsik",
      url: "/porcsik",
      fullUrl: "https://soundcloud.com/porcsik",
    },
    {
      nickname: "Alex Zinn (SpinnZinn)",
      url: "/spinnzinn",
      fullUrl: "https://soundcloud.com/spinnzinn",
    },
    {
      nickname: "preet2d2",
      url: "/preet2d2",
      fullUrl: "https://soundcloud.com/preet2d2",
    },
    {
      nickname: "SUBQUiRE",
      url: "/subquire",
      fullUrl: "https://soundcloud.com/subquire",
    },
    {
      nickname: "Jonah Gabriel",
      url: "/dj-jonah-gabriel",
      fullUrl: "https://soundcloud.com/dj-jonah-gabriel",
    },
    {
      nickname: "Serhii",
      url: "/serhii777",
      fullUrl: "https://soundcloud.com/serhii777",
    },
    {
      nickname: "generalspecific",
      url: "/general_specific",
      fullUrl: "https://soundcloud.com/general_specific",
    },
    {
      nickname: "Theo Woland",
      url: "/theowoland",
      fullUrl: "https://soundcloud.com/theowoland",
    },
    {
      nickname: "DJ LEX GREEN",
      url: "/lexgreen",
      fullUrl: "https://soundcloud.com/lexgreen",
    },
    {
      nickname: "BASSITEK",
      url: "/bassitek",
      fullUrl: "https://soundcloud.com/bassitek",
    },
    {
      nickname: "Dom Disko",
      url: "/domdisko",
      fullUrl: "https://soundcloud.com/domdisko",
    },
    {
      nickname: "MUSIC POWER",
      url: "/mmmusicpow",
      fullUrl: "https://soundcloud.com/mmmusicpow",
    },
    {
      nickname: "GOVIRAL PROMOTIONS",
      url: "/356f2fhabl",
      fullUrl: "https://soundcloud.com/356f2fhabl",
    },
    {
      nickname: "IronHertz447",
      url: "/techspec22",
      fullUrl: "https://soundcloud.com/techspec22",
    },
    {
      nickname: "Tropicxx",
      url: "/user-837248880-702314233",
      fullUrl: "https://soundcloud.com/user-837248880-702314233",
    },
    {
      nickname: "Karlooss",
      url: "/karlooss",
      fullUrl: "https://soundcloud.com/karlooss",
    },
    {
      nickname: "sun Zoltan",
      url: "/dry162002",
      fullUrl: "https://soundcloud.com/dry162002",
    },
    {
      nickname: "RedzaJason",
      url: "/r3za-93-1",
      fullUrl: "https://soundcloud.com/r3za-93-1",
    },
    {
      nickname: "mrfussy",
      url: "/joshua-benton-clark",
      fullUrl: "https://soundcloud.com/joshua-benton-clark",
    },
    {
      nickname: "rouge",
      url: "/sounds-of-the-szn",
      fullUrl: "https://soundcloud.com/sounds-of-the-szn",
    },
    {
      nickname: "DARRYL (CH)",
      url: "/darryl_wav",
      fullUrl: "https://soundcloud.com/darryl_wav",
    },
    {
      nickname: "El Nashar",
      url: "/eslam-el-nashar",
      fullUrl: "https://soundcloud.com/eslam-el-nashar",
    },
    {
      nickname: ".Gordon.",
      url: "/gordula",
      fullUrl: "https://soundcloud.com/gordula",
    },
    {
      nickname: "DJ DIROX",
      url: "/dj-drew-blvck",
      fullUrl: "https://soundcloud.com/dj-drew-blvck",
    },
    {
      nickname: "Jayy Wizer",
      url: "/jayy-wizer",
      fullUrl: "https://soundcloud.com/jayy-wizer",
    },
    {
      nickname: "slopezpb_",
      url: "/ebasopez",
      fullUrl: "https://soundcloud.com/ebasopez",
    },
    {
      nickname: "Pía Moyáno",
      url: "/maria-pia-bustos-moyano",
      fullUrl: "https://soundcloud.com/maria-pia-bustos-moyano",
    },
    {
      nickname: "Stargatt93",
      url: "/user-462891466",
      fullUrl: "https://soundcloud.com/user-462891466",
    },
    {
      nickname: "DJ JAMZ",
      url: "/djjvmz",
      fullUrl: "https://soundcloud.com/djjvmz",
    },
    {
      nickname: "MKEY76♡",
      url: "/mk7676",
      fullUrl: "https://soundcloud.com/mk7676",
    },
    {
      nickname: "Organized Vinyl Group",
      url: "/organizedvinylgroup",
      fullUrl: "https://soundcloud.com/organizedvinylgroup",
    },
    {
      nickname: "MICHAL PUROL",
      url: "/michal-purol",
      fullUrl: "https://soundcloud.com/michal-purol",
    },
    {
      nickname: "DROMON",
      url: "/user-829046295-399275981",
      fullUrl: "https://soundcloud.com/user-829046295-399275981",
    },
    {
      nickname: "D",
      url: "/tony-472511747",
      fullUrl: "https://soundcloud.com/tony-472511747",
    },
    {
      nickname: "Jeremy cantante🫶🏻",
      url: "/jeremy-lamantia-154329005",
      fullUrl: "https://soundcloud.com/jeremy-lamantia-154329005",
    },
    {
      nickname: "Moonshine Sounds",
      url: "/user-986899232",
      fullUrl: "https://soundcloud.com/user-986899232",
    },
    {
      nickname: "NIKITIN NIKANOR",
      url: "/nikanor_nikitin",
      fullUrl: "https://soundcloud.com/nikanor_nikitin",
    },
    {
      nickname: "X_FolterPüppi_X",
      url: "/jen_kurzi",
      fullUrl: "https://soundcloud.com/jen_kurzi",
    },
    {
      nickname: "Carla Mcleod",
      url: "/carla-mcleod-124989238",
      fullUrl: "https://soundcloud.com/carla-mcleod-124989238",
    },
    {
      nickname: "Will Tanous",
      url: "/will-tanous-716090969",
      fullUrl: "https://soundcloud.com/will-tanous-716090969",
    },
    {
      nickname: "STEEZY",
      url: "/anschoering-riderz",
      fullUrl: "https://soundcloud.com/anschoering-riderz",
    },
    {
      nickname: "Jay Ulrich",
      url: "/jay_kay",
      fullUrl: "https://soundcloud.com/jay_kay",
    },
    {
      nickname: "DFR",
      url: "/dfr_dj",
      fullUrl: "https://soundcloud.com/dfr_dj",
    },
    {
      nickname: "ROBUZZ",
      url: "/robuzz_fr",
      fullUrl: "https://soundcloud.com/robuzz_fr",
    },
    {
      nickname: "Pedrocas",
      url: "/pedro72",
      fullUrl: "https://soundcloud.com/pedro72",
    },
    {
      nickname: "Vénusine Cosmica",
      url: "/user-362208656",
      fullUrl: "https://soundcloud.com/user-362208656",
    },
    {
      nickname: "Nick Vanderauwera",
      url: "/nick-vanderauwera-39058240",
      fullUrl: "https://soundcloud.com/nick-vanderauwera-39058240",
    },
    {
      nickname: "Arfur X",
      url: "/arfuruk",
      fullUrl: "https://soundcloud.com/arfuruk",
    },
    {
      nickname: "DJ Gina B",
      url: "/ginab1302",
      fullUrl: "https://soundcloud.com/ginab1302",
    },
    {
      nickname: "Bobby Jernstedt",
      url: "/bobby-jernstedt",
      fullUrl: "https://soundcloud.com/bobby-jernstedt",
    },
    {
      nickname: "𝓐𝓴𝓪𝔂𝓪",
      url: "/kaja-staszewska",
      fullUrl: "https://soundcloud.com/kaja-staszewska",
    },
    {
      nickname: "Butchy Dutchy",
      url: "/butchydutchy-hf",
      fullUrl: "https://soundcloud.com/butchydutchy-hf",
    },
    {
      nickname: "S'KAHRZ",
      url: "/skahrzmusic",
      fullUrl: "https://soundcloud.com/skahrzmusic",
    },
    {
      nickname: "TZOOTZ",
      url: "/tzootz-peralta",
      fullUrl: "https://soundcloud.com/tzootz-peralta",
    },
    {
      nickname: "TyCullen*",
      url: "/tyler-cullen2",
      fullUrl: "https://soundcloud.com/tyler-cullen2",
    },
    {
      nickname: "6ercan",
      url: "/6ercan",
      fullUrl: "https://soundcloud.com/6ercan",
    },
    {
      nickname: "Tamir",
      url: "/tamir-chinbat",
      fullUrl: "https://soundcloud.com/tamir-chinbat",
    },
    {
      nickname: "The Dank House of Chill Hades",
      url: "/aiden-van-dyk-652641163",
      fullUrl: "https://soundcloud.com/aiden-van-dyk-652641163",
    },
    {
      nickname: "Favz",
      url: "/favamusic",
      fullUrl: "https://soundcloud.com/favamusic",
    },
    {
      nickname: "PortuBeats",
      url: "/manuelbruno",
      fullUrl: "https://soundcloud.com/manuelbruno",
    },
    {
      nickname: "Fronkaaay",
      url: "/fronkaaay",
      fullUrl: "https://soundcloud.com/fronkaaay",
    },
    {
      nickname: "Szilárd Gyene",
      url: "/szilard-gyene",
      fullUrl: "https://soundcloud.com/szilard-gyene",
    },
    {
      nickname: "Leon",
      url: "/levani32",
      fullUrl: "https://soundcloud.com/levani32",
    },
    {
      nickname: "Phazer The Amazer",
      url: "/phazer_the_amazer",
      fullUrl: "https://soundcloud.com/phazer_the_amazer",
    },
    {
      nickname: "H E M P",
      url: "/user-557732714",
      fullUrl: "https://soundcloud.com/user-557732714",
    },
    {
      nickname: "NATHAN HALFON",
      url: "/user-489474423",
      fullUrl: "https://soundcloud.com/user-489474423",
    },
    {
      nickname: "Mary jana",
      url: "/ikkyhouse",
      fullUrl: "https://soundcloud.com/ikkyhouse",
    },
    {
      nickname: "Musa Çolak",
      url: "/musa-colak",
      fullUrl: "https://soundcloud.com/musa-colak",
    },
    {
      nickname: "Geoffrey Me",
      url: "/geoffrey-meade",
      fullUrl: "https://soundcloud.com/geoffrey-meade",
    },
    {
      nickname: "Jayrob one",
      url: "/robin-d-bber",
      fullUrl: "https://soundcloud.com/robin-d-bber",
    },
    {
      nickname: "GANZA❣️FM",
      url: "/ganza_fm",
      fullUrl: "https://soundcloud.com/ganza_fm",
    },
    {
      nickname: "Duncan F",
      url: "/officialduncanf",
      fullUrl: "https://soundcloud.com/officialduncanf",
    },
    {
      nickname: "LAKISS (BR)",
      url: "/felipelakiss",
      fullUrl: "https://soundcloud.com/felipelakiss",
    },
    {
      nickname: "Kobe On The Radio",
      url: "/kobepittsburgh",
      fullUrl: "https://soundcloud.com/kobepittsburgh",
    },
    {
      nickname: "Dusk To Dawn Lu Ka (Luke Wood Morgan 摩陸)",
      url: "/dusktodawn-morgan",
      fullUrl: "https://soundcloud.com/dusktodawn-morgan",
    },
    {
      nickname: "SamSonic",
      url: "/sam-pederson",
      fullUrl: "https://soundcloud.com/sam-pederson",
    },
    {
      nickname: "Sound Level Music",
      url: "/soundlevelmusic",
      fullUrl: "https://soundcloud.com/soundlevelmusic",
    },
    {
      nickname: "Hm7246501",
      url: "/hm7246501",
      fullUrl: "https://soundcloud.com/hm7246501",
    },
    {
      nickname: "skelly_man",
      url: "/skellymanbeats",
      fullUrl: "https://soundcloud.com/skellymanbeats",
    },
    {
      nickname: "hendy1996",
      url: "/hendy-7",
      fullUrl: "https://soundcloud.com/hendy-7",
    },
    {
      nickname: "Vladimir Palchikov",
      url: "/vladimir-palchikov-125774710",
      fullUrl: "https://soundcloud.com/vladimir-palchikov-125774710",
    },
    {
      nickname: "30na_snick",
      url: "/sina-gh-810864158",
      fullUrl: "https://soundcloud.com/sina-gh-810864158",
    },
    {
      nickname: "steve B24",
      url: "/panier-steve",
      fullUrl: "https://soundcloud.com/panier-steve",
    },
    {
      nickname: "RIZEEY",
      url: "/rizeey",
      fullUrl: "https://soundcloud.com/rizeey",
    },
    {
      nickname: "Gabriel Fiori",
      url: "/user-612449016",
      fullUrl: "https://soundcloud.com/user-612449016",
    },
    {
      nickname: "CandyFlipॐ",
      url: "/chrieesi",
      fullUrl: "https://soundcloud.com/chrieesi",
    },
    {
      nickname: "julz",
      url: "/julie-skec",
      fullUrl: "https://soundcloud.com/julie-skec",
    },
    {
      nickname: "Scarmix",
      url: "/dj-scarmix",
      fullUrl: "https://soundcloud.com/dj-scarmix",
    },
    {
      nickname: "ROCHEY FELLA🥷❤️ WD40 DOES THE JOB🔥🤠🥇",
      url: "/dildo_swaggins-no_child_support",
      fullUrl: "https://soundcloud.com/dildo_swaggins-no_child_support",
    },
    {
      nickname: "Pablo",
      url: "/pablloo",
      fullUrl: "https://soundcloud.com/pablloo",
    },
    {
      nickname: "Sandra Marry",
      url: "/sandra-marry-226912132",
      fullUrl: "https://soundcloud.com/sandra-marry-226912132",
    },
    {
      nickname: "Max Brown",
      url: "/maxbrowwn",
      fullUrl: "https://soundcloud.com/maxbrowwn",
    },
    {
      nickname: "Tontechniker",
      url: "/user-475140093",
      fullUrl: "https://soundcloud.com/user-475140093",
    },
    {
      nickname: "Aeroic",
      url: "/aeroicc",
      fullUrl: "https://soundcloud.com/aeroicc",
    },
    {
      nickname: "Victor Phoenix",
      url: "/user-287176502",
      fullUrl: "https://soundcloud.com/user-287176502",
    },
    {
      nickname: "OldTecH",
      url: "/michael-sp",
      fullUrl: "https://soundcloud.com/michael-sp",
    },
    {
      nickname: "spamed",
      url: "/spamed",
      fullUrl: "https://soundcloud.com/spamed",
    },
    {
      nickname: "flow.ting",
      url: "/bigdondappah",
      fullUrl: "https://soundcloud.com/bigdondappah",
    },
    {
      nickname: "Addict(BR)",
      url: "/addict_br",
      fullUrl: "https://soundcloud.com/addict_br",
    },
    {
      nickname: "Ricardo Alves",
      url: "/ricardo-alves-361536190",
      fullUrl: "https://soundcloud.com/ricardo-alves-361536190",
    },
    {
      nickname: "Stoyan Totin",
      url: "/stoyantotin",
      fullUrl: "https://soundcloud.com/stoyantotin",
    },
    {
      nickname: "Melody Blasich",
      url: "/melody-blasich",
      fullUrl: "https://soundcloud.com/melody-blasich",
    },
    {
      nickname: "Adam Wójcikowski",
      url: "/adam-w-jcikowski",
      fullUrl: "https://soundcloud.com/adam-w-jcikowski",
    },
    {
      nickname: "𝔹𝕃𝕌𝔼 ℍ𝕆𝕆𝔻𝔼𝔻",
      url: "/bluehooded",
      fullUrl: "https://soundcloud.com/bluehooded",
    },
    {
      nickname: "Gallus",
      url: "/djgallus",
      fullUrl: "https://soundcloud.com/djgallus",
    },
    {
      nickname: "TreeLife",
      url: "/cardila666",
      fullUrl: "https://soundcloud.com/cardila666",
    },
    {
      nickname: "Supertimpe",
      url: "/supertimpe",
      fullUrl: "https://soundcloud.com/supertimpe",
    },
    {
      nickname: "Mulli",
      url: "/michaelmulligan",
      fullUrl: "https://soundcloud.com/michaelmulligan",
    },
    {
      nickname: "TDNB",
      url: "/tom-bates-7",
      fullUrl: "https://soundcloud.com/tom-bates-7",
    },
    {
      nickname: "Claudia de Vazquez",
      url: "/claudia-de-vazquez",
      fullUrl: "https://soundcloud.com/claudia-de-vazquez",
    },
    {
      nickname: "ATOM",
      url: "/raphael-catillon",
      fullUrl: "https://soundcloud.com/raphael-catillon",
    },
    {
      nickname: "Prince",
      url: "/djprince_art",
      fullUrl: "https://soundcloud.com/djprince_art",
    },
    {
      nickname: "tomasitooficial__",
      url: "/tomas-lizaga",
      fullUrl: "https://soundcloud.com/tomas-lizaga",
    },
    {
      nickname: "🔀 ¤๋ࣩࣩࣩࣩࣩࣩࣩࣩࣩࣩࣩࣩࣩࣧࣧࣧࣧࣧࣧࣧࣧࣧࣧࣧ͜͡𓂀",
      url: "/hipunk",
      fullUrl: "https://soundcloud.com/hipunk",
    },
    {
      nickname: "Jay P",
      url: "/user-183985703",
      fullUrl: "https://soundcloud.com/user-183985703",
    },
    {
      nickname: "Monsieur Lagrange",
      url: "/monsieur-lagrange",
      fullUrl: "https://soundcloud.com/monsieur-lagrange",
    },
    {
      nickname: "Alen Palamar",
      url: "/a-punk",
      fullUrl: "https://soundcloud.com/a-punk",
    },
    {
      nickname: "Aplanos",
      url: "/maxbdm",
      fullUrl: "https://soundcloud.com/maxbdm",
    },
    {
      nickname: "M!K£",
      url: "/user-934107487",
      fullUrl: "https://soundcloud.com/user-934107487",
    },
    {
      nickname: "Ace/Axr",
      url: "/acewolf512",
      fullUrl: "https://soundcloud.com/acewolf512",
    },
    {
      nickname: "okay__kayo",
      url: "/okaykayo-okko",
      fullUrl: "https://soundcloud.com/okaykayo-okko",
    },
    {
      nickname: "Alexander Christie",
      url: "/alex-christie-6",
      fullUrl: "https://soundcloud.com/alex-christie-6",
    },
    {
      nickname: "Maciek Sadek",
      url: "/maciek-sadowski-1",
      fullUrl: "https://soundcloud.com/maciek-sadowski-1",
    },
    {
      nickname: "Ami Džaferbegović",
      url: "/ami-d-aferbegovi",
      fullUrl: "https://soundcloud.com/ami-d-aferbegovi",
    },
    {
      nickname: "jose pez",
      url: "/user-428790903",
      fullUrl: "https://soundcloud.com/user-428790903",
    },
    {
      nickname: "Anx.iD",
      url: "/anx_id",
      fullUrl: "https://soundcloud.com/anx_id",
    },
    {
      nickname: "ON/-/CET",
      url: "/boyd-glindemann",
      fullUrl: "https://soundcloud.com/boyd-glindemann",
    },
    {
      nickname: "DMS",
      url: "/dmsdj07",
      fullUrl: "https://soundcloud.com/dmsdj07",
    },
    {
      nickname: "InfecTech 🇬🇧",
      url: "/infectech",
      fullUrl: "https://soundcloud.com/infectech",
    },
    {
      nickname: "KevBeat.",
      url: "/kevin-mosima",
      fullUrl: "https://soundcloud.com/kevin-mosima",
    },
    {
      nickname: "Doram",
      url: "/w5rf1ws6toq7",
      fullUrl: "https://soundcloud.com/w5rf1ws6toq7",
    },
    {
      nickname: "TisBASS",
      url: "/tiffany-cornilles-839163434",
      fullUrl: "https://soundcloud.com/tiffany-cornilles-839163434",
    },
    {
      nickname: "zxeu",
      url: "/zxeu",
      fullUrl: "https://soundcloud.com/zxeu",
    },
    {
      nickname: "LUNAFHY",
      url: "/lunafhy",
      fullUrl: "https://soundcloud.com/lunafhy",
    },
    {
      nickname: "Oswald Aloon",
      url: "/oswaldaloon",
      fullUrl: "https://soundcloud.com/oswaldaloon",
    },
    {
      nickname: "Sheena❤️‍🔥",
      url: "/user-783816487",
      fullUrl: "https://soundcloud.com/user-783816487",
    },
    {
      nickname: "Marshall🖤",
      url: "/user-777397338-973809195",
      fullUrl: "https://soundcloud.com/user-777397338-973809195",
    },
    {
      nickname: "Big ISoLaToR BeHinD ART",
      url: "/bigisolator",
      fullUrl: "https://soundcloud.com/bigisolator",
    },
    {
      nickname: "DanScrew",
      url: "/danscrew",
      fullUrl: "https://soundcloud.com/danscrew",
    },
    {
      nickname: "meisam ghaemi",
      url: "/meisam-ghaemi",
      fullUrl: "https://soundcloud.com/meisam-ghaemi",
    },
    {
      nickname: "FREDSTA  DJ 😉🦼",
      url: "/frederik-starklint",
      fullUrl: "https://soundcloud.com/frederik-starklint",
    },
    {
      nickname: "noideahowtoparty AKA Christoph",
      url: "/noideahowtoparty",
      fullUrl: "https://soundcloud.com/noideahowtoparty",
    },
    {
      nickname: "sim",
      url: "/simmysim",
      fullUrl: "https://soundcloud.com/simmysim",
    },
    {
      nickname: "OKBE",
      url: "/take-okbe",
      fullUrl: "https://soundcloud.com/take-okbe",
    },
    {
      nickname: "Major Rager",
      url: "/majorrager_official",
      fullUrl: "https://soundcloud.com/majorrager_official",
    },
    {
      nickname: "Léo",
      url: "/leco_aiff",
      fullUrl: "https://soundcloud.com/leco_aiff",
    },
    {
      nickname: "GutterGizmo",
      url: "/guttergizmo-55026161",
      fullUrl: "https://soundcloud.com/guttergizmo-55026161",
    },
    {
      nickname: "Kai walker",
      url: "/kai-walker-819253269",
      fullUrl: "https://soundcloud.com/kai-walker-819253269",
    },
    {
      nickname: "Misterio",
      url: "/misterio42",
      fullUrl: "https://soundcloud.com/misterio42",
    },
    {
      nickname: "Kamno",
      url: "/camilo-barbosa-456531200",
      fullUrl: "https://soundcloud.com/camilo-barbosa-456531200",
    },
    {
      nickname: "HERRI",
      url: "/h-e-r-r-i",
      fullUrl: "https://soundcloud.com/h-e-r-r-i",
    },
    {
      nickname: "DJ Leon Christian",
      url: "/leonchristian",
      fullUrl: "https://soundcloud.com/leonchristian",
    },
    {
      nickname: "SHADOW.FUNK",
      url: "/oeoe-bdbdnd",
      fullUrl: "https://soundcloud.com/oeoe-bdbdnd",
    },
    {
      nickname: "Agus Pluto",
      url: "/agus-pluto",
      fullUrl: "https://soundcloud.com/agus-pluto",
    },
    {
      nickname: "SAMTEXXX",
      url: "/user-227988044",
      fullUrl: "https://soundcloud.com/user-227988044",
    },
    {
      nickname: "Amogh Adahallikar",
      url: "/amogh-adahallikar",
      fullUrl: "https://soundcloud.com/amogh-adahallikar",
    },
    {
      nickname: "OUTERBODY Labs/ Not A DJ.",
      url: "/notadjtv",
      fullUrl: "https://soundcloud.com/notadjtv",
    },
    {
      nickname: "BUFF BEAR",
      url: "/syakir1995",
      fullUrl: "https://soundcloud.com/syakir1995",
    },
    {
      nickname: "🤙DUR🕯️DIX👈",
      url: "/bertrand-collet-484160009",
      fullUrl: "https://soundcloud.com/bertrand-collet-484160009",
    },
    {
      nickname: "den•i•zen (Denizen)",
      url: "/greg-axe-1",
      fullUrl: "https://soundcloud.com/greg-axe-1",
    },
    {
      nickname: "kirbykronz",
      url: "/kirbykronz",
      fullUrl: "https://soundcloud.com/kirbykronz",
    },
    {
      nickname: "K I K I",
      url: "/niceonekiki",
      fullUrl: "https://soundcloud.com/niceonekiki",
    },
    {
      nickname: "XODAN RMX",
      url: "/xodanrmx",
      fullUrl: "https://soundcloud.com/xodanrmx",
    },
    {
      nickname: "Alan Vegotsky",
      url: "/alan-vegotsky",
      fullUrl: "https://soundcloud.com/alan-vegotsky",
    },
    {
      nickname: "DJ_Steezy_",
      url: "/user-804571326",
      fullUrl: "https://soundcloud.com/user-804571326",
    },
    {
      nickname: "WAINY",
      url: "/michael-wain-979168425",
      fullUrl: "https://soundcloud.com/michael-wain-979168425",
    },
    {
      nickname: "trackfx",
      url: "/user-381614661",
      fullUrl: "https://soundcloud.com/user-381614661",
    },
    {
      nickname: "MellowPoly",
      url: "/mellowpoly",
      fullUrl: "https://soundcloud.com/mellowpoly",
    },
    {
      nickname: "john se",
      url: "/john-se",
      fullUrl: "https://soundcloud.com/john-se",
    },
    {
      nickname: "Lloque Yupanqui",
      url: "/masters25",
      fullUrl: "https://soundcloud.com/masters25",
    },
    {
      nickname: "TØNE_",
      url: "/set_the-tone",
      fullUrl: "https://soundcloud.com/set_the-tone",
    },
    {
      nickname: "Jay Galligan",
      url: "/jay-galligan",
      fullUrl: "https://soundcloud.com/jay-galligan",
    },
    {
      nickname: "Naikiria38",
      url: "/naikiria38",
      fullUrl: "https://soundcloud.com/naikiria38",
    },
    {
      nickname: "pappy papstar",
      url: "/pappy-star",
      fullUrl: "https://soundcloud.com/pappy-star",
    },
    {
      nickname: "cmd line",
      url: "/user-107910757",
      fullUrl: "https://soundcloud.com/user-107910757",
    },
    {
      nickname: "Marina Semren",
      url: "/marinasemren",
      fullUrl: "https://soundcloud.com/marinasemren",
    },
    {
      nickname: "CRISTALINE EUPHORIC",
      url: "/jirina-prokopova",
      fullUrl: "https://soundcloud.com/jirina-prokopova",
    },
    {
      nickname: "DUBNOISE",
      url: "/dubnoise-sessions",
      fullUrl: "https://soundcloud.com/dubnoise-sessions",
    },
    {
      nickname: "WHOITIZZZ",
      url: "/whoitizzz",
      fullUrl: "https://soundcloud.com/whoitizzz",
    },
    {
      nickname: "jessica weber",
      url: "/jessicaolivier739",
      fullUrl: "https://soundcloud.com/jessicaolivier739",
    },
    {
      nickname: "Inge K",
      url: "/inge-tdk",
      fullUrl: "https://soundcloud.com/inge-tdk",
    },
    {
      nickname: "dashage",
      url: "/dashage555",
      fullUrl: "https://soundcloud.com/dashage555",
    },
    {
      nickname: "Árpád Hogli",
      url: "/rp-d-hogli",
      fullUrl: "https://soundcloud.com/rp-d-hogli",
    },
    {
      nickname: "Heather Beers",
      url: "/heather-beers",
      fullUrl: "https://soundcloud.com/heather-beers",
    },
    {
      nickname: "iLLi",
      url: "/almousilli",
      fullUrl: "https://soundcloud.com/almousilli",
    },
    {
      nickname: "Jean-Phil music",
      url: "/1201020",
      fullUrl: "https://soundcloud.com/1201020",
    },
    {
      nickname: "DJ Diego MONROE",
      url: "/diego-pereira-798848643",
      fullUrl: "https://soundcloud.com/diego-pereira-798848643",
    },
    {
      nickname: "TᴗT",
      url: "/nikkivalor",
      fullUrl: "https://soundcloud.com/nikkivalor",
    },
    {
      nickname: "SOUNDNESS",
      url: "/soundness-600554205",
      fullUrl: "https://soundcloud.com/soundness-600554205",
    },
    {
      nickname: "jarkko räsänen",
      url: "/ich_komme",
      fullUrl: "https://soundcloud.com/ich_komme",
    },
    {
      nickname: "elmattheo",
      url: "/matthieuu1",
      fullUrl: "https://soundcloud.com/matthieuu1",
    },
    {
      nickname: "FINESSE",
      url: "/listenfinesse",
      fullUrl: "https://soundcloud.com/listenfinesse",
    },
    {
      nickname: "Microlabelsp Records",
      url: "/user-426290296",
      fullUrl: "https://soundcloud.com/user-426290296",
    },
    {
      nickname: "AUDIO K9",
      url: "/audiok9",
      fullUrl: "https://soundcloud.com/audiok9",
    },
    {
      nickname: "M-Ray",
      url: "/m-ray",
      fullUrl: "https://soundcloud.com/m-ray",
    },
    {
      nickname: "scottie",
      url: "/nicolas-scott-725947631",
      fullUrl: "https://soundcloud.com/nicolas-scott-725947631",
    },
    {
      nickname: "aroseh",
      url: "/ameliahernandez",
      fullUrl: "https://soundcloud.com/ameliahernandez",
    },
    {
      nickname: "benc1",
      url: "/benc1",
      fullUrl: "https://soundcloud.com/benc1",
    },
    {
      nickname: "D-stiny",
      url: "/d-stiny",
      fullUrl: "https://soundcloud.com/d-stiny",
    },
    {
      nickname: "Jessé C. Lima Diaz",
      url: "/jess-c-de-lima-diaz",
      fullUrl: "https://soundcloud.com/jess-c-de-lima-diaz",
    },
    {
      nickname: "Synk",
      url: "/synchronick",
      fullUrl: "https://soundcloud.com/synchronick",
    },
    {
      nickname: "Godo.",
      url: "/godo",
      fullUrl: "https://soundcloud.com/godo",
    },
    {
      nickname: "PEPPIN",
      url: "/dj_peppin",
      fullUrl: "https://soundcloud.com/dj_peppin",
    },
    {
      nickname: "Xxx Xxxx",
      url: "/xxx-xxxx-577141932",
      fullUrl: "https://soundcloud.com/xxx-xxxx-577141932",
    },
    {
      nickname: "Simone P",
      url: "/simone-pollera",
      fullUrl: "https://soundcloud.com/simone-pollera",
    },
    {
      nickname: "Pauline🩷XCX🩷🔥🙌🔥🩷",
      url: "/user-390669813",
      fullUrl: "https://soundcloud.com/user-390669813",
    },
    {
      nickname: "Oosterbosch.pdjbreur54",
      url: "/oosterbosch-pdjbreur54",
      fullUrl: "https://soundcloud.com/oosterbosch-pdjbreur54",
    },
    {
      nickname: "NvdM",
      url: "/djnvdm",
      fullUrl: "https://soundcloud.com/djnvdm",
    },
    {
      nickname: "JBG",
      url: "/user-297821507",
      fullUrl: "https://soundcloud.com/user-297821507",
    },
    {
      nickname: "DJPaulyPaul_DanceRadioUK.com",
      url: "/djpaulypaul_official",
      fullUrl: "https://soundcloud.com/djpaulypaul_official",
    },
    {
      nickname: "Alexand80",
      url: "/alexand80",
      fullUrl: "https://soundcloud.com/alexand80",
    },
    {
      nickname: "Lorena Gonzalez",
      url: "/lorena-gonzalez-662837440",
      fullUrl: "https://soundcloud.com/lorena-gonzalez-662837440",
    },
    {
      nickname: "Evitativo",
      url: "/evitativo",
      fullUrl: "https://soundcloud.com/evitativo",
    },
    {
      nickname: "Altfel",
      url: "/yunchesa",
      fullUrl: "https://soundcloud.com/yunchesa",
    },
    {
      nickname: "Vítor Miranda",
      url: "/vitor_miranda",
      fullUrl: "https://soundcloud.com/vitor_miranda",
    },
    {
      nickname: "Fixtaman (Dj/Artist)",
      url: "/fixtaman",
      fullUrl: "https://soundcloud.com/fixtaman",
    },
    {
      nickname: "DJ SEEG",
      url: "/dj-seeg",
      fullUrl: "https://soundcloud.com/dj-seeg",
    },
    {
      nickname: "Blade Ebbs",
      url: "/blade-ebbs",
      fullUrl: "https://soundcloud.com/blade-ebbs",
    },
    {
      nickname: "Alex_Farley",
      url: "/house-addict-93",
      fullUrl: "https://soundcloud.com/house-addict-93",
    },
    {
      nickname: "Andréa Velázquez",
      url: "/andreavelazquez",
      fullUrl: "https://soundcloud.com/andreavelazquez",
    },
    {
      nickname: "Adriâna Campanhol",
      url: "/adriana-campanhol",
      fullUrl: "https://soundcloud.com/adriana-campanhol",
    },
    {
      nickname: "Mario",
      url: "/mariosegovia",
      fullUrl: "https://soundcloud.com/mariosegovia",
    },
    {
      nickname: "Strasser in the mix",
      url: "/trasserinthemix",
      fullUrl: "https://soundcloud.com/trasserinthemix",
    },
    {
      nickname: "Electronic sounds anonymous",
      url: "/tobe-10",
      fullUrl: "https://soundcloud.com/tobe-10",
    },
    {
      nickname: "𝐇𝐀𝐘𝐖𝐀𝐑𝐃",
      url: "/haywardm",
      fullUrl: "https://soundcloud.com/haywardm",
    },
    {
      nickname: "souldefunk",
      url: "/souldefunk",
      fullUrl: "https://soundcloud.com/souldefunk",
    },
    {
      nickname: "Nucana",
      url: "/roygerhard",
      fullUrl: "https://soundcloud.com/roygerhard",
    },
    {
      nickname: "Lucky Breaks",
      url: "/lucky-breaks",
      fullUrl: "https://soundcloud.com/lucky-breaks",
    },
    {
      nickname: "Nil pinex",
      url: "/noel-fundanj",
      fullUrl: "https://soundcloud.com/noel-fundanj",
    },
    {
      nickname: "Ricky Herbert",
      url: "/ricky-herbert",
      fullUrl: "https://soundcloud.com/ricky-herbert",
    },
    {
      nickname: "Matty See",
      url: "/dj-emc",
      fullUrl: "https://soundcloud.com/dj-emc",
    },
    {
      nickname: "cindy-leigh-bailey",
      url: "/cindybailey",
      fullUrl: "https://soundcloud.com/cindybailey",
    },
    {
      nickname: "Lyss0922",
      url: "/alyssa-alaniz",
      fullUrl: "https://soundcloud.com/alyssa-alaniz",
    },
    {
      nickname: "Samanthawilson07777",
      url: "/samanthawilson07777",
      fullUrl: "https://soundcloud.com/samanthawilson07777",
    },
    {
      nickname: "CBelt72",
      url: "/cbelt72",
      fullUrl: "https://soundcloud.com/cbelt72",
    },
    {
      nickname: "Craig N'i",
      url: "/craigni",
      fullUrl: "https://soundcloud.com/craigni",
    },
    {
      nickname: "Anilton Carneiro",
      url: "/anilton-carneiro",
      fullUrl: "https://soundcloud.com/anilton-carneiro",
    },
    {
      nickname: "DJ_SW3AT",
      url: "/justin-sweat-491179396",
      fullUrl: "https://soundcloud.com/justin-sweat-491179396",
    },
    {
      nickname: "M87",
      url: "/m87-514579569",
      fullUrl: "https://soundcloud.com/m87-514579569",
    },
    {
      nickname: "xkmusik",
      url: "/xkmusik",
      fullUrl: "https://soundcloud.com/xkmusik",
    },
    {
      nickname: "Anthony Scott",
      url: "/anthony-scott-932328535",
      fullUrl: "https://soundcloud.com/anthony-scott-932328535",
    },
    {
      nickname: "Deepforvip",
      url: "/user-933392670",
      fullUrl: "https://soundcloud.com/user-933392670",
    },
    {
      nickname: "Dashmeet Singh 3",
      url: "/dashmeet-singh-3",
      fullUrl: "https://soundcloud.com/dashmeet-singh-3",
    },
    {
      nickname: "No Snidj",
      url: "/sniedj",
      fullUrl: "https://soundcloud.com/sniedj",
    },
    {
      nickname: "djBobara",
      url: "/djbobara",
      fullUrl: "https://soundcloud.com/djbobara",
    },
    {
      nickname: "Setou & Senyo",
      url: "/setouandsenyo",
      fullUrl: "https://soundcloud.com/setouandsenyo",
    },
    {
      nickname: "Marcelo Checchia LA VOZ",
      url: "/marcelo-checchia",
      fullUrl: "https://soundcloud.com/marcelo-checchia",
    },
    {
      nickname: "ynkieboy",
      url: "/ykcampos",
      fullUrl: "https://soundcloud.com/ykcampos",
    },
    {
      nickname: "Splash",
      url: "/djsplash55",
      fullUrl: "https://soundcloud.com/djsplash55",
    },
    {
      nickname: "t121",
      url: "/t121",
      fullUrl: "https://soundcloud.com/t121",
    },
    {
      nickname: "ItsDomoAgain",
      url: "/itsdomoagain",
      fullUrl: "https://soundcloud.com/itsdomoagain",
    },
    {
      nickname: "Mr. Overlord  Production",
      url: "/mr-overlord-652433272",
      fullUrl: "https://soundcloud.com/mr-overlord-652433272",
    },
    {
      nickname: "SCHRODER",
      url: "/philip-schroeder-schroder",
      fullUrl: "https://soundcloud.com/philip-schroeder-schroder",
    },
    {
      nickname: "DJ Kenzie Clarke",
      url: "/dj-kenzie-clarke",
      fullUrl: "https://soundcloud.com/dj-kenzie-clarke",
    },
    {
      nickname: "DiscoDave",
      url: "/discodavecr",
      fullUrl: "https://soundcloud.com/discodavecr",
    },
    {
      nickname: "NillyBoomer",
      url: "/nillyboomer",
      fullUrl: "https://soundcloud.com/nillyboomer",
    },
    {
      nickname: "S41L0R",
      url: "/s41l0r",
      fullUrl: "https://soundcloud.com/s41l0r",
    },
    {
      nickname: "PAUL JUNGLE A.K.A OWEN",
      url: "/owensk-paul-jungle",
      fullUrl: "https://soundcloud.com/owensk-paul-jungle",
    },
    {
      nickname: "Riadi Putra",
      url: "/riadi-putra-986332976",
      fullUrl: "https://soundcloud.com/riadi-putra-986332976",
    },
    {
      nickname: "DGRAVE",
      url: "/dgravebr",
      fullUrl: "https://soundcloud.com/dgravebr",
    },
    {
      nickname: "ShadowOfTheLaw",
      url: "/shadowofthelaw",
      fullUrl: "https://soundcloud.com/shadowofthelaw",
    },
    {
      nickname: "stillpourinnmud(@praisenunu)",
      url: "/nunu-234687889",
      fullUrl: "https://soundcloud.com/nunu-234687889",
    },
    {
      nickname: "Mant_",
      url: "/connor-mant",
      fullUrl: "https://soundcloud.com/connor-mant",
    },
    {
      nickname: "&FABIAN",
      url: "/joseph-alvarez-7",
      fullUrl: "https://soundcloud.com/joseph-alvarez-7",
    },
    {
      nickname: "Chris Klanger",
      url: "/chrisklanger",
      fullUrl: "https://soundcloud.com/chrisklanger",
    },
    {
      nickname: "deejay redouane dadi",
      url: "/redouane-boukri-995520370",
      fullUrl: "https://soundcloud.com/redouane-boukri-995520370",
    },
    {
      nickname: "Iavarone",
      url: "/iavarone",
      fullUrl: "https://soundcloud.com/iavarone",
    },
    {
      nickname: "RAWME",
      url: "/rawmi",
      fullUrl: "https://soundcloud.com/rawmi",
    },
    {
      nickname: "Old Mad Fish",
      url: "/user-293336033-839694493",
      fullUrl: "https://soundcloud.com/user-293336033-839694493",
    },
    {
      nickname: "Victory Vibes",
      url: "/user-472299294",
      fullUrl: "https://soundcloud.com/user-472299294",
    },
    {
      nickname: "Si Lo",
      url: "/si-670749227",
      fullUrl: "https://soundcloud.com/si-670749227",
    },
    {
      nickname: "Ruben Majuelo",
      url: "/rubenmajuelo",
      fullUrl: "https://soundcloud.com/rubenmajuelo",
    },
    {
      nickname: "SANSI",
      url: "/sansi-3",
      fullUrl: "https://soundcloud.com/sansi-3",
    },
    {
      nickname: "Dj Butcher",
      url: "/samherring21",
      fullUrl: "https://soundcloud.com/samherring21",
    },
    {
      nickname: "reihane",
      url: "/oloba-lafia",
      fullUrl: "https://soundcloud.com/oloba-lafia",
    },
    {
      nickname: "Marcelo Santiago",
      url: "/djmarcelosantiago",
      fullUrl: "https://soundcloud.com/djmarcelosantiago",
    },
    {
      nickname: "John Catte",
      url: "/john-catte",
      fullUrl: "https://soundcloud.com/john-catte",
    },
    {
      nickname: "Lil Gleek 💦",
      url: "/james-wynn-451483019",
      fullUrl: "https://soundcloud.com/james-wynn-451483019",
    },
    {
      nickname: "GOGANBass",
      url: "/goganbass",
      fullUrl: "https://soundcloud.com/goganbass",
    },
    {
      nickname: "ProdbyKingL.K",
      url: "/kyan-gomez-smith",
      fullUrl: "https://soundcloud.com/kyan-gomez-smith",
    },
    {
      nickname: "Vic Wick",
      url: "/vic-407469874",
      fullUrl: "https://soundcloud.com/vic-407469874",
    },
    {
      nickname: "DON BRUNO",
      url: "/don_bruno",
      fullUrl: "https://soundcloud.com/don_bruno",
    },
    {
      nickname: "brickbabytay",
      url: "/mrbeef-jerkey",
      fullUrl: "https://soundcloud.com/mrbeef-jerkey",
    },
    {
      nickname: "Ballarina die echte :-)",
      url: "/sabrina-hammes",
      fullUrl: "https://soundcloud.com/sabrina-hammes",
    },
    {
      nickname: "Sok P",
      url: "/sok-p",
      fullUrl: "https://soundcloud.com/sok-p",
    },
    {
      nickname: "Balaish",
      url: "/or-balaish",
      fullUrl: "https://soundcloud.com/or-balaish",
    },
    {
      nickname: "QU2S3",
      url: "/geques-harris-278348175",
      fullUrl: "https://soundcloud.com/geques-harris-278348175",
    },
    {
      nickname: "$ch0nI€",
      url: "/sch0nl",
      fullUrl: "https://soundcloud.com/sch0nl",
    },
    {
      nickname: "Dream$cape 💫",
      url: "/user-513482940",
      fullUrl: "https://soundcloud.com/user-513482940",
    },
    {
      nickname: "Mikey Quest",
      url: "/mikey-quest",
      fullUrl: "https://soundcloud.com/mikey-quest",
    },
    {
      nickname: "Wick $hotta Glo",
      url: "/rsllg-moe",
      fullUrl: "https://soundcloud.com/rsllg-moe",
    },
    {
      nickname: "Riko Mixco",
      url: "/rikomixco",
      fullUrl: "https://soundcloud.com/rikomixco",
    },
    {
      nickname: "Party Owl",
      url: "/thepartyowl",
      fullUrl: "https://soundcloud.com/thepartyowl",
    },
    {
      nickname: "The Bloody Chaos",
      url: "/the-bloody-chaos",
      fullUrl: "https://soundcloud.com/the-bloody-chaos",
    },
    {
      nickname: "EM",
      url: "/yezhovmisha",
      fullUrl: "https://soundcloud.com/yezhovmisha",
    },
    {
      nickname: "Lively Beats",
      url: "/l1vely",
      fullUrl: "https://soundcloud.com/l1vely",
    },
    {
      nickname: "Dj.Wilson.Serrari",
      url: "/deejay-wilson-serrari",
      fullUrl: "https://soundcloud.com/deejay-wilson-serrari",
    },
    {
      nickname: "Bri Gerrard",
      url: "/bri-gerrarddj",
      fullUrl: "https://soundcloud.com/bri-gerrarddj",
    },
    {
      nickname: "Day-V",
      url: "/dayv-dnb",
      fullUrl: "https://soundcloud.com/dayv-dnb",
    },
    {
      nickname: "DJ BIZZLE",
      url: "/djbizzle40",
      fullUrl: "https://soundcloud.com/djbizzle40",
    },
    {
      nickname: "CRU OF TU",
      url: "/cru-of-tu",
      fullUrl: "https://soundcloud.com/cru-of-tu",
    },
    {
      nickname: "Reviival Collective",
      url: "/reviivalcollective",
      fullUrl: "https://soundcloud.com/reviivalcollective",
    },
    {
      nickname: "Rob Fed 1",
      url: "/rob-fed-1",
      fullUrl: "https://soundcloud.com/rob-fed-1",
    },
    {
      nickname: "Uggly Bob (DJm)",
      url: "/uggly-bob",
      fullUrl: "https://soundcloud.com/uggly-bob",
    },
    {
      nickname: "Moneeymikeizm",
      url: "/moneeymikeizm-nyc",
      fullUrl: "https://soundcloud.com/moneeymikeizm-nyc",
    },
    {
      nickname: "LUUCEO",
      url: "/luciyo90",
      fullUrl: "https://soundcloud.com/luciyo90",
    },
    {
      nickname: "KalBass",
      url: "/roms-dutdut-adk",
      fullUrl: "https://soundcloud.com/roms-dutdut-adk",
    },
    {
      nickname: "DJ Baby Yoda",
      url: "/dj_baby_yoda",
      fullUrl: "https://soundcloud.com/dj_baby_yoda",
    },
    {
      nickname: "M7DR4GØX",
      url: "/m7dr4gox-13",
      fullUrl: "https://soundcloud.com/m7dr4gox-13",
    },
    {
      nickname: "Fabrique Sound",
      url: "/fabriquesound",
      fullUrl: "https://soundcloud.com/fabriquesound",
    },
    {
      nickname: "Novaxx",
      url: "/novaxx_music9892",
      fullUrl: "https://soundcloud.com/novaxx_music9892",
    },
    {
      nickname: "DJ Nickie",
      url: "/nicole-ann-newsom",
      fullUrl: "https://soundcloud.com/nicole-ann-newsom",
    },
    {
      nickname: "UTCA",
      url: "/official_utca",
      fullUrl: "https://soundcloud.com/official_utca",
    },
    {
      nickname: "OSF42",
      url: "/osf42",
      fullUrl: "https://soundcloud.com/osf42",
    },
    {
      nickname: "Intellectual Rebel",
      url: "/intellectualrebelmusic",
      fullUrl: "https://soundcloud.com/intellectualrebelmusic",
    },
    {
      nickname: "WilLow Nada/ Dj Will co Bass",
      url: "/willow-nada",
      fullUrl: "https://soundcloud.com/willow-nada",
    },
    {
      nickname: "03ost",
      url: "/r1hckkern7za",
      fullUrl: "https://soundcloud.com/r1hckkern7za",
    },
    {
      nickname: "DEFX",
      url: "/defx-bass",
      fullUrl: "https://soundcloud.com/defx-bass",
    },
    {
      nickname: "DJ BigFatBiceps",
      url: "/r4quel",
      fullUrl: "https://soundcloud.com/r4quel",
    },
    {
      nickname: "ShiZaru Zoe",
      url: "/shizaruzoe",
      fullUrl: "https://soundcloud.com/shizaruzoe",
    },
    {
      nickname: "dustmusic",
      url: "/dustmusicofficial",
      fullUrl: "https://soundcloud.com/dustmusicofficial",
    },
    {
      nickname: "Александр Солтис",
      url: "/ohwxib967vvf",
      fullUrl: "https://soundcloud.com/ohwxib967vvf",
    },
    {
      nickname: "MasterWave",
      url: "/w-v",
      fullUrl: "https://soundcloud.com/w-v",
    },
    {
      nickname: "Clara Mchall",
      url: "/clara-mchall",
      fullUrl: "https://soundcloud.com/clara-mchall",
    },
    {
      nickname: "Olivia Emma",
      url: "/olivia-emma-312831072",
      fullUrl: "https://soundcloud.com/olivia-emma-312831072",
    },
    {
      nickname: "ENDEAD (AR)",
      url: "/endead-ar",
      fullUrl: "https://soundcloud.com/endead-ar",
    },
    {
      nickname: "Netto Amorim",
      url: "/nettoo-amorim",
      fullUrl: "https://soundcloud.com/nettoo-amorim",
    },
    {
      nickname: "Tyson Reid",
      url: "/tysonsounds",
      fullUrl: "https://soundcloud.com/tysonsounds",
    },
    {
      nickname: "manu",
      url: "/emannnuele",
      fullUrl: "https://soundcloud.com/emannnuele",
    },
    {
      nickname: "DJ Drake Michaels",
      url: "/djdrakemichaels",
      fullUrl: "https://soundcloud.com/djdrakemichaels",
    },
    {
      nickname: "DJ Bammy",
      url: "/dj-bammy-621033720",
      fullUrl: "https://soundcloud.com/dj-bammy-621033720",
    },
    {
      nickname: "bête imaginaire",
      url: "/user-242883418",
      fullUrl: "https://soundcloud.com/user-242883418",
    },
    {
      nickname: "borisbonbon",
      url: "/boris-steiner-543067832",
      fullUrl: "https://soundcloud.com/boris-steiner-543067832",
    },
    {
      nickname: "Gaj3ra",
      url: "/gaj3ra",
      fullUrl: "https://soundcloud.com/gaj3ra",
    },
    {
      nickname: "Boleta's Grill",
      url: "/boletasgrill",
      fullUrl: "https://soundcloud.com/boletasgrill",
    },
    {
      nickname: "Black Tourmaline",
      url: "/bl4ck_tourmaline",
      fullUrl: "https://soundcloud.com/bl4ck_tourmaline",
    },
    {
      nickname: "RinTin",
      url: "/djrintin",
      fullUrl: "https://soundcloud.com/djrintin",
    },
    {
      nickname: "Szeg81",
      url: "/szeg81",
      fullUrl: "https://soundcloud.com/szeg81",
    },
    {
      nickname: "Radiation",
      url: "/radiation-xxm",
      fullUrl: "https://soundcloud.com/radiation-xxm",
    },
    {
      nickname: "Milind Music",
      url: "/adrinalinebymarmak",
      fullUrl: "https://soundcloud.com/adrinalinebymarmak",
    },
    {
      nickname: "MICK",
      url: "/mattia-michelotti",
      fullUrl: "https://soundcloud.com/mattia-michelotti",
    },
    {
      nickname: "Marc>>R",
      url: "/marc_r_31",
      fullUrl: "https://soundcloud.com/marc_r_31",
    },
    {
      nickname: "qwetwe",
      url: "/qwetwe",
      fullUrl: "https://soundcloud.com/qwetwe",
    },
    {
      nickname: "DeX",
      url: "/onestopdjshop",
      fullUrl: "https://soundcloud.com/onestopdjshop",
    },
    {
      nickname: "RON ZI",
      url: "/ron-zi",
      fullUrl: "https://soundcloud.com/ron-zi",
    },
    {
      nickname: "Schwarzwaldmieze",
      url: "/schwarzwaldmieze",
      fullUrl: "https://soundcloud.com/schwarzwaldmieze",
    },
    {
      nickname: "DJ Fafü",
      url: "/faf-4",
      fullUrl: "https://soundcloud.com/faf-4",
    },
    {
      nickname: "Marcantonio",
      url: "/emme-gaglione",
      fullUrl: "https://soundcloud.com/emme-gaglione",
    },
    {
      nickname: "Kip Kendall",
      url: "/kip_kendall",
      fullUrl: "https://soundcloud.com/kip_kendall",
    },
    {
      nickname: "tylmanovski",
      url: "/tylmanovski",
      fullUrl: "https://soundcloud.com/tylmanovski",
    },
    {
      nickname: "Merry Lidon",
      url: "/merry-lidon",
      fullUrl: "https://soundcloud.com/merry-lidon",
    },
    {
      nickname: "K3zzab3lle H10dgh",
      url: "/little-kezabelle-emma",
      fullUrl: "https://soundcloud.com/little-kezabelle-emma",
    },
    {
      nickname: "VITORINO",
      url: "/vitorino-music",
      fullUrl: "https://soundcloud.com/vitorino-music",
    },
    {
      nickname: "KARL NEWMAN",
      url: "/karl-newman-3",
      fullUrl: "https://soundcloud.com/karl-newman-3",
    },
    {
      nickname: "Wallbach",
      url: "/wallbach",
      fullUrl: "https://soundcloud.com/wallbach",
    },
    {
      nickname: "party dj pieter",
      url: "/pieterborremans1",
      fullUrl: "https://soundcloud.com/pieterborremans1",
    },
    {
      nickname: "𝕯𝕵 𝕿𝖜𝖎𝖑𝖎𝖌𝖍𝖙",
      url: "/twilight_20",
      fullUrl: "https://soundcloud.com/twilight_20",
    },
    {
      nickname: "Hoax",
      url: "/amine-galleb",
      fullUrl: "https://soundcloud.com/amine-galleb",
    },
    {
      nickname: "DJ Green Satyr",
      url: "/thegreensatyr",
      fullUrl: "https://soundcloud.com/thegreensatyr",
    },
    {
      nickname: "DJ Nelly",
      url: "/nellydjthedjnelly",
      fullUrl: "https://soundcloud.com/nellydjthedjnelly",
    },
    {
      nickname: "Gargoyles",
      url: "/liluolufemi",
      fullUrl: "https://soundcloud.com/liluolufemi",
    },
    {
      nickname: "KODAD",
      url: "/kodad777",
      fullUrl: "https://soundcloud.com/kodad777",
    },
    {
      nickname: "dj j-traxx",
      url: "/dj-mimi-62",
      fullUrl: "https://soundcloud.com/dj-mimi-62",
    },
    {
      nickname: "JULIO MASSEI",
      url: "/juliomassei",
      fullUrl: "https://soundcloud.com/juliomassei",
    },
    {
      nickname: "LIVING ON THE EDGE OF DANCE . . .",
      url: "/wat-denk-je-zelf",
      fullUrl: "https://soundcloud.com/wat-denk-je-zelf",
    },
    {
      nickname: "Aidan Harrison - Squashflik - FML USA",
      url: "/squashflik",
      fullUrl: "https://soundcloud.com/squashflik",
    },
    {
      nickname: "Mr. Jackpots",
      url: "/mrjackpots2024",
      fullUrl: "https://soundcloud.com/mrjackpots2024",
    },
    {
      nickname: "DJ MORENO",
      url: "/djmorenony",
      fullUrl: "https://soundcloud.com/djmorenony",
    },
    {
      nickname: "Los Santos Records",
      url: "/djapostolorecords",
      fullUrl: "https://soundcloud.com/djapostolorecords",
    },
    {
      nickname: "Josi",
      url: "/jose-ignacio-sabater-sirvent-1",
      fullUrl: "https://soundcloud.com/jose-ignacio-sabater-sirvent-1",
    },
    {
      nickname: "DeanoLFC92",
      url: "/deanolfc92",
      fullUrl: "https://soundcloud.com/deanolfc92",
    },
    {
      nickname: "Dj MGR ( MACHINGUNRICHIE )",
      url: "/machinegunrichie-286852224",
      fullUrl: "https://soundcloud.com/machinegunrichie-286852224",
    },
    {
      nickname: "Dani Ripoll",
      url: "/daniripollmusic",
      fullUrl: "https://soundcloud.com/daniripollmusic",
    },
    {
      nickname: "Israel Ragunton",
      url: "/israel-ragunton",
      fullUrl: "https://soundcloud.com/israel-ragunton",
    },
    {
      nickname: "Makæ Dj",
      url: "/djmakae",
      fullUrl: "https://soundcloud.com/djmakae",
    },
    {
      nickname: "Carletto Di Masi",
      url: "/carletto-di-masi",
      fullUrl: "https://soundcloud.com/carletto-di-masi",
    },
    {
      nickname: "NILL │ N-hype",
      url: "/nillmt",
      fullUrl: "https://soundcloud.com/nillmt",
    },
    {
      nickname: "Minima_leo",
      url: "/leonardo-soto-315841275",
      fullUrl: "https://soundcloud.com/leonardo-soto-315841275",
    },
    {
      nickname: "C.LYYA",
      url: "/clyya",
      fullUrl: "https://soundcloud.com/clyya",
    },
    {
      nickname: "Lil Demon",
      url: "/salvador-bautista-727813",
      fullUrl: "https://soundcloud.com/salvador-bautista-727813",
    },
    {
      nickname: "Rotimi (CA)",
      url: "/rotimi-ajasa",
      fullUrl: "https://soundcloud.com/rotimi-ajasa",
    },
    {
      nickname: "Weiz The Curator",
      url: "/user975929097",
      fullUrl: "https://soundcloud.com/user975929097",
    },
    {
      nickname: "Francesco Bigagli",
      url: "/francescobigagli-official",
      fullUrl: "https://soundcloud.com/francescobigagli-official",
    },
    {
      nickname: "X41",
      url: "/dj-x41",
      fullUrl: "https://soundcloud.com/dj-x41",
    },
    {
      nickname: "Jaxon Ludick",
      url: "/jaxon-ludick",
      fullUrl: "https://soundcloud.com/jaxon-ludick",
    },
    {
      nickname: "Yuma Uma",
      url: "/yumauma",
      fullUrl: "https://soundcloud.com/yumauma",
    },
    {
      nickname: "Din Viesel",
      url: "/din-viesel",
      fullUrl: "https://soundcloud.com/din-viesel",
    },
    {
      nickname: "Laura_Mariee",
      url: "/laura_mariee",
      fullUrl: "https://soundcloud.com/laura_mariee",
    },
    {
      nickname: "Orion",
      url: "/orion-834537036",
      fullUrl: "https://soundcloud.com/orion-834537036",
    },
    {
      nickname: "James_scott",
      url: "/james_scott-744769287",
      fullUrl: "https://soundcloud.com/james_scott-744769287",
    },
    {
      nickname: "reumen",
      url: "/djdinnerparty",
      fullUrl: "https://soundcloud.com/djdinnerparty",
    },
    {
      nickname: "€MPT¥",
      url: "/emptythefirst",
      fullUrl: "https://soundcloud.com/emptythefirst",
    },
    {
      nickname: "Echowave int 🎶 🌎",
      url: "/cresafe",
      fullUrl: "https://soundcloud.com/cresafe",
    },
    {
      nickname: "Fareda Fery",
      url: "/fareda-morsi-819029282",
      fullUrl: "https://soundcloud.com/fareda-morsi-819029282",
    },
    {
      nickname: "KensukeDJ",
      url: "/kensukedj",
      fullUrl: "https://soundcloud.com/kensukedj",
    },
    {
      nickname: "VALENTINA GALANTUCCI",
      url: "/valentina-galantucci-551085867",
      fullUrl: "https://soundcloud.com/valentina-galantucci-551085867",
    },
    {
      nickname: "MARRA (BR)",
      url: "/marramusicc",
      fullUrl: "https://soundcloud.com/marramusicc",
    },
    {
      nickname: "Vic PiToTe",
      url: "/waitforitvic",
      fullUrl: "https://soundcloud.com/waitforitvic",
    },
    {
      nickname: "Eftos",
      url: "/eftos2b",
      fullUrl: "https://soundcloud.com/eftos2b",
    },
    {
      nickname: "Dawn Lee",
      url: "/missd-dj",
      fullUrl: "https://soundcloud.com/missd-dj",
    },
    {
      nickname: "Sonic",
      url: "/thesonic-1",
      fullUrl: "https://soundcloud.com/thesonic-1",
    },
    {
      nickname: "Marvin",
      url: "/yaper-clicc",
      fullUrl: "https://soundcloud.com/yaper-clicc",
    },
    {
      nickname: "Rossoneri79",
      url: "/user-671694016",
      fullUrl: "https://soundcloud.com/user-671694016",
    },
    {
      nickname: "Rowano BooStars",
      url: "/vovo-ninten",
      fullUrl: "https://soundcloud.com/vovo-ninten",
    },
    {
      nickname: "Jay V Flyy",
      url: "/jayvflyy",
      fullUrl: "https://soundcloud.com/jayvflyy",
    },
    {
      nickname: "fredfunk",
      url: "/fredfunk",
      fullUrl: "https://soundcloud.com/fredfunk",
    },
    {
      nickname: "J. Skitz/XZyqwuin",
      url: "/jskitz616",
      fullUrl: "https://soundcloud.com/jskitz616",
    },
    {
      nickname: "Juanjo Sendra",
      url: "/juanjosendra",
      fullUrl: "https://soundcloud.com/juanjosendra",
    },
    {
      nickname: "terrorsuusje",
      url: "/susan-pilage",
      fullUrl: "https://soundcloud.com/susan-pilage",
    },
    {
      nickname: "TeefBeats",
      url: "/user-94377500",
      fullUrl: "https://soundcloud.com/user-94377500",
    },
    {
      nickname: "ILLUMANIAC",
      url: "/illumaniac",
      fullUrl: "https://soundcloud.com/illumaniac",
    },
    {
      nickname: "Uriasul Mic",
      url: "/uriasul-mic",
      fullUrl: "https://soundcloud.com/uriasul-mic",
    },
    {
      nickname: "Hivoo Malo",
      url: "/hivoomalo",
      fullUrl: "https://soundcloud.com/hivoomalo",
    },
    {
      nickname: "Deep Charles",
      url: "/deepcharles",
      fullUrl: "https://soundcloud.com/deepcharles",
    },
    {
      nickname: "chÜey",
      url: "/chuey-2",
      fullUrl: "https://soundcloud.com/chuey-2",
    },
    {
      nickname: "Jesse Jaze",
      url: "/jazehiphop",
      fullUrl: "https://soundcloud.com/jazehiphop",
    },
    {
      nickname: "Marek Klangmann",
      url: "/mighty-marc",
      fullUrl: "https://soundcloud.com/mighty-marc",
    },
    {
      nickname: "esarneri",
      url: "/esarneri",
      fullUrl: "https://soundcloud.com/esarneri",
    },
    {
      nickname: "Loui Grandson",
      url: "/louigrandson",
      fullUrl: "https://soundcloud.com/louigrandson",
    },
    {
      nickname: "Azat Shakurov",
      url: "/azat-shakurov-401392077",
      fullUrl: "https://soundcloud.com/azat-shakurov-401392077",
    },
    {
      nickname: "SANTIAGO CORTÉS (oficial)",
      url: "/santiago-cortes-670163015",
      fullUrl: "https://soundcloud.com/santiago-cortes-670163015",
    },
    {
      nickname: "Robert_Gfx_Artwork🌟🔥",
      url: "/omodolaphor-ameerah",
      fullUrl: "https://soundcloud.com/omodolaphor-ameerah",
    },
    {
      nickname: "AFT3RS",
      url: "/aft3rs",
      fullUrl: "https://soundcloud.com/aft3rs",
    },
    {
      nickname: "Jaydreamer",
      url: "/jason-garton-453281625",
      fullUrl: "https://soundcloud.com/jason-garton-453281625",
    },
    {
      nickname: "Paul Tavares",
      url: "/djpaultavares",
      fullUrl: "https://soundcloud.com/djpaultavares",
    },
    {
      nickname: "Virginie U",
      url: "/virginie-schmitt-534412880",
      fullUrl: "https://soundcloud.com/virginie-schmitt-534412880",
    },
    {
      nickname: "Techno_Gvcci",
      url: "/techno_gvcci",
      fullUrl: "https://soundcloud.com/techno_gvcci",
    },
    {
      nickname: "DJ Stevenn Jay",
      url: "/djstevennjay",
      fullUrl: "https://soundcloud.com/djstevennjay",
    },
    {
      nickname: "archi❤️❤️❤️",
      url: "/v-b-2",
      fullUrl: "https://soundcloud.com/v-b-2",
    },
    {
      nickname: "Charlie Red",
      url: "/charlieredj",
      fullUrl: "https://soundcloud.com/charlieredj",
    },
    {
      nickname: "Pablo Kuzmanic",
      url: "/pablo-kuzmanic",
      fullUrl: "https://soundcloud.com/pablo-kuzmanic",
    },
    {
      nickname: "Andres Marquez",
      url: "/andresmarquezcol",
      fullUrl: "https://soundcloud.com/andresmarquezcol",
    },
    {
      nickname: "Check @danny-waters-official",
      url: "/djdanny",
      fullUrl: "https://soundcloud.com/djdanny",
    },
    {
      nickname: "NeverNotLuke",
      url: "/nevernotluke",
      fullUrl: "https://soundcloud.com/nevernotluke",
    },
    {
      nickname: "Dennis B",
      url: "/dennis-broemmert",
      fullUrl: "https://soundcloud.com/dennis-broemmert",
    },
    {
      nickname: "Taha",
      url: "/nikolay-nikolov-506936322",
      fullUrl: "https://soundcloud.com/nikolay-nikolov-506936322",
    },
    {
      nickname: "Diskeylavisz",
      url: "/diskeylavisz",
      fullUrl: "https://soundcloud.com/diskeylavisz",
    },
    {
      nickname: "Ben Holland (DJ-UK)",
      url: "/benhollanddjuk",
      fullUrl: "https://soundcloud.com/benhollanddjuk",
    },
    {
      nickname: "Jesustin",
      url: "/jesus-bara-casas",
      fullUrl: "https://soundcloud.com/jesus-bara-casas",
    },
    {
      nickname: "_reynassant_",
      url: "/reynassant",
      fullUrl: "https://soundcloud.com/reynassant",
    },
    {
      nickname: "Gravitate",
      url: "/gravitate-k",
      fullUrl: "https://soundcloud.com/gravitate-k",
    },
    {
      nickname: "Astorian Waldorf",
      url: "/astorian-waldorf",
      fullUrl: "https://soundcloud.com/astorian-waldorf",
    },
    {
      nickname: "Thönis",
      url: "/thonisdj",
      fullUrl: "https://soundcloud.com/thonisdj",
    },
    {
      nickname: "Mike Rullo",
      url: "/emme-digital",
      fullUrl: "https://soundcloud.com/emme-digital",
    },
    {
      nickname: "DjZ - Dj Juan Zuniga",
      url: "/juan-gabriel-61",
      fullUrl: "https://soundcloud.com/juan-gabriel-61",
    },
    {
      nickname: "Andy Paterson",
      url: "/andrew-paterson-8",
      fullUrl: "https://soundcloud.com/andrew-paterson-8",
    },
    {
      nickname: "Dj Mac-Miller",
      url: "/djmac-miller1993",
      fullUrl: "https://soundcloud.com/djmac-miller1993",
    },
    {
      nickname: "Chris-J",
      url: "/chrisjdj",
      fullUrl: "https://soundcloud.com/chrisjdj",
    },
    {
      nickname: "Perseas the Gray",
      url: "/grayperseas",
      fullUrl: "https://soundcloud.com/grayperseas",
    },
    {
      nickname: "Yael FT",
      url: "/yael_ft",
      fullUrl: "https://soundcloud.com/yael_ft",
    },
    {
      nickname: "TITOSKⅡ",
      url: "/titoskiidj",
      fullUrl: "https://soundcloud.com/titoskiidj",
    },
    {
      nickname: "The Arkitekt",
      url: "/amarthearkitekt",
      fullUrl: "https://soundcloud.com/amarthearkitekt",
    },
    {
      nickname: "TonyRounG",
      url: "/user-678453102",
      fullUrl: "https://soundcloud.com/user-678453102",
    },
    {
      nickname: "David Vanderhouwen (DJ V12)",
      url: "/user-154331487",
      fullUrl: "https://soundcloud.com/user-154331487",
    },
    {
      nickname: "DJ IO",
      url: "/ilyessoueslati",
      fullUrl: "https://soundcloud.com/ilyessoueslati",
    },
    {
      nickname: "Skallawag",
      url: "/djskallawag",
      fullUrl: "https://soundcloud.com/djskallawag",
    },
    {
      nickname: "O",
      url: "/zodozdazerty",
      fullUrl: "https://soundcloud.com/zodozdazerty",
    },
    {
      nickname: "Thetani",
      url: "/thetanimusic",
      fullUrl: "https://soundcloud.com/thetanimusic",
    },
    {
      nickname: "IBAÑEZZ",
      url: "/adrianibanez",
      fullUrl: "https://soundcloud.com/adrianibanez",
    },
    {
      nickname: "Paul Doc (Docs)",
      url: "/paul-doc-798820097",
      fullUrl: "https://soundcloud.com/paul-doc-798820097",
    },
    {
      nickname: "A.A",
      url: "/a-a-893897031",
      fullUrl: "https://soundcloud.com/a-a-893897031",
    },
    {
      nickname: "Freidrich$",
      url: "/user-381742774",
      fullUrl: "https://soundcloud.com/user-381742774",
    },
    {
      nickname: "The ORIGINAL LOCKNESS MONSTAH",
      url: "/user-948978316lockness",
      fullUrl: "https://soundcloud.com/user-948978316lockness",
    },
    {
      nickname: "BADBWOYRiiCHH😈 ( @BadbwoyRiiCHH)",
      url: "/user-996636533",
      fullUrl: "https://soundcloud.com/user-996636533",
    },
    {
      nickname: "Mystics Of Sound",
      url: "/dj-siddharthpsyd",
      fullUrl: "https://soundcloud.com/dj-siddharthpsyd",
    },
    {
      nickname: "LinseeOfficiel",
      url: "/user-333739323",
      fullUrl: "https://soundcloud.com/user-333739323",
    },
    {
      nickname: "OMEGA-ONE",
      url: "/user-299618361",
      fullUrl: "https://soundcloud.com/user-299618361",
    },
    {
      nickname: "CarlitoSwagg SGE",
      url: "/c-s-331346855",
      fullUrl: "https://soundcloud.com/c-s-331346855",
    },
    {
      nickname: "KRY5TOF",
      url: "/kry5tof",
      fullUrl: "https://soundcloud.com/kry5tof",
    },
    {
      nickname: "Evilways/krustybones",
      url: "/drew-lemoine-peterson",
      fullUrl: "https://soundcloud.com/drew-lemoine-peterson",
    },
    {
      nickname: "Dobitz",
      url: "/dobitz1",
      fullUrl: "https://soundcloud.com/dobitz1",
    },
    {
      nickname: "CrazyEsje Uptempo Hardcore",
      url: "/esje-besje",
      fullUrl: "https://soundcloud.com/esje-besje",
    },
    {
      nickname: "Slice'Em Beatz",
      url: "/slice-em-beatz",
      fullUrl: "https://soundcloud.com/slice-em-beatz",
    },
    {
      nickname: "PatBo LogiKQuartZ",
      url: "/user-603736046",
      fullUrl: "https://soundcloud.com/user-603736046",
    },
    {
      nickname: "tekknotizzze",
      url: "/tekknotizzze",
      fullUrl: "https://soundcloud.com/tekknotizzze",
    },
    {
      nickname: "Wurschdi",
      url: "/wurschdi",
      fullUrl: "https://soundcloud.com/wurschdi",
    },
    {
      nickname: "Eddy Royce",
      url: "/eddyroyce",
      fullUrl: "https://soundcloud.com/eddyroyce",
    },
    {
      nickname: "mario viktor",
      url: "/djmarioviktor",
      fullUrl: "https://soundcloud.com/djmarioviktor",
    },
    {
      nickname: "tuigpiraat",
      url: "/elevateyourears",
      fullUrl: "https://soundcloud.com/elevateyourears",
    },
    {
      nickname: "MiMi",
      url: "/anna-lorde",
      fullUrl: "https://soundcloud.com/anna-lorde",
    },
    {
      nickname: "Mark Røven",
      url: "/markroven",
      fullUrl: "https://soundcloud.com/markroven",
    },
    {
      nickname: "Mike Donna",
      url: "/mike-donna",
      fullUrl: "https://soundcloud.com/mike-donna",
    },
    {
      nickname: "Niek Vuylsteke",
      url: "/niek-vuylsteke",
      fullUrl: "https://soundcloud.com/niek-vuylsteke",
    },
    {
      nickname: "XEPONAI",
      url: "/xepon-z",
      fullUrl: "https://soundcloud.com/xepon-z",
    },
    {
      nickname: "SVL",
      url: "/user-208078195",
      fullUrl: "https://soundcloud.com/user-208078195",
    },
    {
      nickname: "sebastianpotschka",
      url: "/sebastianpotschka",
      fullUrl: "https://soundcloud.com/sebastianpotschka",
    },
    {
      nickname: "SHANEØ",
      url: "/shane-o-gorman-67910179",
      fullUrl: "https://soundcloud.com/shane-o-gorman-67910179",
    },
    {
      nickname: "PhanU",
      url: "/ruckedmusic",
      fullUrl: "https://soundcloud.com/ruckedmusic",
    },
    {
      nickname: "REGINA",
      url: "/realmofregina",
      fullUrl: "https://soundcloud.com/realmofregina",
    },
    {
      nickname: "D.Neezi",
      url: "/dneezi",
      fullUrl: "https://soundcloud.com/dneezi",
    },
    {
      nickname: "Voltage Beats aKa Mycelium-PsylocibZ",
      url: "/mycelium-psylocibz",
      fullUrl: "https://soundcloud.com/mycelium-psylocibz",
    },
    {
      nickname: "Pure Staarness / Miss D'Aimee",
      url: "/superstaarlet",
      fullUrl: "https://soundcloud.com/superstaarlet",
    },
    {
      nickname: "ROCHEY_SCHOOL_LAPTOP.USER9911223",
      url: "/rochey_k1093",
      fullUrl: "https://soundcloud.com/rochey_k1093",
    },
    {
      nickname: "BvRN",
      url: "/burnmix",
      fullUrl: "https://soundcloud.com/burnmix",
    },
    {
      nickname: "Provan LyFire",
      url: "/provan-lyfire",
      fullUrl: "https://soundcloud.com/provan-lyfire",
    },
    {
      nickname: "psych0naut",
      url: "/psych0_naut",
      fullUrl: "https://soundcloud.com/psych0_naut",
    },
    {
      nickname: "TessaYessa",
      url: "/tessayessa",
      fullUrl: "https://soundcloud.com/tessayessa",
    },
    {
      nickname: "StarShadow",
      url: "/tarhadow",
      fullUrl: "https://soundcloud.com/tarhadow",
    },
    {
      nickname: "S.A eine Art von Kunst <3",
      url: "/einertvonunst3",
      fullUrl: "https://soundcloud.com/einertvonunst3",
    },
    {
      nickname: "Jewellistic",
      url: "/jewellistic-551055594",
      fullUrl: "https://soundcloud.com/jewellistic-551055594",
    },
    {
      nickname: "bollekejohan",
      url: "/bollekejohan",
      fullUrl: "https://soundcloud.com/bollekejohan",
    },
    {
      nickname: "JLeBz",
      url: "/jlebz",
      fullUrl: "https://soundcloud.com/jlebz",
    },
    {
      nickname: "Carlos Cleto FM",
      url: "/arlosleto",
      fullUrl: "https://soundcloud.com/arlosleto",
    },
    {
      nickname: "Stevie Delmar",
      url: "/stevie-delmar",
      fullUrl: "https://soundcloud.com/stevie-delmar",
    },
    {
      nickname: "ABDELLE_OFC",
      url: "/abdelle_ofc",
      fullUrl: "https://soundcloud.com/abdelle_ofc",
    },
    {
      nickname: "trusouthboy™",
      url: "/trusouthboy",
      fullUrl: "https://soundcloud.com/trusouthboy",
    },
    {
      nickname: "Brav0",
      url: "/brav0music",
      fullUrl: "https://soundcloud.com/brav0music",
    },
    {
      nickname: "Fire Beam",
      url: "/fire-beam-828879295",
      fullUrl: "https://soundcloud.com/fire-beam-828879295",
    },
    {
      nickname: "Brad Harrington 1",
      url: "/bradharri",
      fullUrl: "https://soundcloud.com/bradharri",
    },
    {
      nickname: "Infrasonic Productions",
      url: "/infrasonic_productions",
      fullUrl: "https://soundcloud.com/infrasonic_productions",
    },
    {
      nickname: "1 OF ONE",
      url: "/111ofone",
      fullUrl: "https://soundcloud.com/111ofone",
    },
    {
      nickname: "TricPaT",
      url: "/tricpat",
      fullUrl: "https://soundcloud.com/tricpat",
    },
    {
      nickname: "THC23",
      url: "/thc23",
      fullUrl: "https://soundcloud.com/thc23",
    },
    {
      nickname: "tashnat",
      url: "/tashnat",
      fullUrl: "https://soundcloud.com/tashnat",
    },
    {
      nickname: "Craniusz",
      url: "/craniusz",
      fullUrl: "https://soundcloud.com/craniusz",
    },
    {
      nickname: "Bob Tool",
      url: "/bobtool",
      fullUrl: "https://soundcloud.com/bobtool",
    },
    {
      nickname: "User 927010028",
      url: "/user-927010028",
      fullUrl: "https://soundcloud.com/user-927010028",
    },
    {
      nickname: "Amuses",
      url: "/massimiliano-perez",
      fullUrl: "https://soundcloud.com/massimiliano-perez",
    },
    {
      nickname: "firstman86",
      url: "/firstman86",
      fullUrl: "https://soundcloud.com/firstman86",
    },
    {
      nickname: "🏴‍☠️mikro 🏴‍☠️",
      url: "/mircko-any-given-sunday",
      fullUrl: "https://soundcloud.com/mircko-any-given-sunday",
    },
    {
      nickname: "Andre Boyd",
      url: "/andre-boyd",
      fullUrl: "https://soundcloud.com/andre-boyd",
    },
    {
      nickname: "KÆL",
      url: "/kaeldeejay",
      fullUrl: "https://soundcloud.com/kaeldeejay",
    },
    {
      nickname: "viinceman",
      url: "/viinceman",
      fullUrl: "https://soundcloud.com/viinceman",
    },
    {
      nickname: "Alessandro Conti",
      url: "/aleconti",
      fullUrl: "https://soundcloud.com/aleconti",
    },
    {
      nickname: "swagnermusic",
      url: "/swagnermusic",
      fullUrl: "https://soundcloud.com/swagnermusic",
    },
    {
      nickname: "Drazan Dominikovic",
      url: "/drazan-dominikovic",
      fullUrl: "https://soundcloud.com/drazan-dominikovic",
    },
    {
      nickname: "MaHaNiTa 🌗🌟🌓",
      url: "/mahanita",
      fullUrl: "https://soundcloud.com/mahanita",
    },
    {
      nickname: "schn_u",
      url: "/schn_u",
      fullUrl: "https://soundcloud.com/schn_u",
    },
    {
      nickname: "Pliner",
      url: "/kiril-pliner",
      fullUrl: "https://soundcloud.com/kiril-pliner",
    },
    {
      nickname: "Shareef Hashem",
      url: "/shareef-hashem",
      fullUrl: "https://soundcloud.com/shareef-hashem",
    },
    {
      nickname: "Abel Ton Goofy TP",
      url: "/thadeus-punkt",
      fullUrl: "https://soundcloud.com/thadeus-punkt",
    },
    {
      nickname: "Nebula Du",
      url: "/dususesi023",
      fullUrl: "https://soundcloud.com/dususesi023",
    },
    {
      nickname: "Michael",
      url: "/michael-612977386",
      fullUrl: "https://soundcloud.com/michael-612977386",
    },
    {
      nickname: "Another Freak (ARG)",
      url: "/anotherfreakarg",
      fullUrl: "https://soundcloud.com/anotherfreakarg",
    },
    {
      nickname: "Just Jade",
      url: "/user-123596380",
      fullUrl: "https://soundcloud.com/user-123596380",
    },
    {
      nickname: "DJ M.A.T",
      url: "/medmat29",
      fullUrl: "https://soundcloud.com/medmat29",
    },
    {
      nickname: "CHESS NOT CHECKERZ INC.",
      url: "/philip-boss-443729830",
      fullUrl: "https://soundcloud.com/philip-boss-443729830",
    },
    {
      nickname: "Kali Mist",
      url: "/neuro2012",
      fullUrl: "https://soundcloud.com/neuro2012",
    },
    {
      nickname: "Dennis",
      url: "/dennis-onischke",
      fullUrl: "https://soundcloud.com/dennis-onischke",
    },
    {
      nickname: "moshehadeh",
      url: "/moshehadeh",
      fullUrl: "https://soundcloud.com/moshehadeh",
    },
    {
      nickname: "Lizard Duken",
      url: "/lizard_duken",
      fullUrl: "https://soundcloud.com/lizard_duken",
    },
    {
      nickname: "Dj Dizam",
      url: "/djdizam",
      fullUrl: "https://soundcloud.com/djdizam",
    },
    {
      nickname: "DJ John Don",
      url: "/john-devakman",
      fullUrl: "https://soundcloud.com/john-devakman",
    },
    {
      nickname: "Kevin Legere",
      url: "/kevin-legere",
      fullUrl: "https://soundcloud.com/kevin-legere",
    },
    {
      nickname: "J.k🔥❤😎",
      url: "/user-804582116",
      fullUrl: "https://soundcloud.com/user-804582116",
    },
    {
      nickname: "Slandry gatse",
      url: "/slandry-gatse03",
      fullUrl: "https://soundcloud.com/slandry-gatse03",
    },
    {
      nickname: "TAWSO",
      url: "/user-114662022-696492877",
      fullUrl: "https://soundcloud.com/user-114662022-696492877",
    },
    {
      nickname: "Dannixnl",
      url: "/dannix",
      fullUrl: "https://soundcloud.com/dannix",
    },
    {
      nickname: "TCo120",
      url: "/tco120",
      fullUrl: "https://soundcloud.com/tco120",
    },
    {
      nickname: "DJ Queen JRK",
      url: "/djqueenjrk",
      fullUrl: "https://soundcloud.com/djqueenjrk",
    },
    {
      nickname: "Moeez Rahim",
      url: "/moeez-rahim",
      fullUrl: "https://soundcloud.com/moeez-rahim",
    },
    {
      nickname: "IniZio",
      url: "/user-725621973",
      fullUrl: "https://soundcloud.com/user-725621973",
    },
    {
      nickname: "this is rody",
      url: "/marlyn-york",
      fullUrl: "https://soundcloud.com/marlyn-york",
    },
    {
      nickname: "J-Swiss",
      url: "/jsmithli",
      fullUrl: "https://soundcloud.com/jsmithli",
    },
    {
      nickname: "Paul",
      url: "/user-187935220",
      fullUrl: "https://soundcloud.com/user-187935220",
    },
    {
      nickname: "𝓔𝓜𝓜𝓐",
      url: "/emma8894",
      fullUrl: "https://soundcloud.com/emma8894",
    },
    {
      nickname: "KriticalMind",
      url: "/kriticalmind",
      fullUrl: "https://soundcloud.com/kriticalmind",
    },
    {
      nickname: "Møønz",
      url: "/tom-moens-3",
      fullUrl: "https://soundcloud.com/tom-moens-3",
    },
    {
      nickname: "Ayo'STe!Zz",
      url: "/ayoste-zz",
      fullUrl: "https://soundcloud.com/ayoste-zz",
    },
    {
      nickname: "LEXDEEZ",
      url: "/lexdeez",
      fullUrl: "https://soundcloud.com/lexdeez",
    },
    {
      nickname: "Elgado",
      url: "/musicbyelgado",
      fullUrl: "https://soundcloud.com/musicbyelgado",
    },
    {
      nickname: "Foxina Binderová",
      url: "/foxina-fra-kov",
      fullUrl: "https://soundcloud.com/foxina-fra-kov",
    },
    {
      nickname: "WildBoyz Official Music",
      url: "/wildboyz-85434688",
      fullUrl: "https://soundcloud.com/wildboyz-85434688",
    },
    {
      nickname: "X@V i",
      url: "/xavier-gruson",
      fullUrl: "https://soundcloud.com/xavier-gruson",
    },
    {
      nickname: "MC Mic-Eee",
      url: "/mc-mikey-912110293",
      fullUrl: "https://soundcloud.com/mc-mikey-912110293",
    },
    {
      nickname: "Themamasun",
      url: "/themamasun",
      fullUrl: "https://soundcloud.com/themamasun",
    },
    {
      nickname: "Albert du Soul",
      url: "/albert-du-soul",
      fullUrl: "https://soundcloud.com/albert-du-soul",
    },
    {
      nickname: "SKIM",
      url: "/yony-skun-martell",
      fullUrl: "https://soundcloud.com/yony-skun-martell",
    },
    {
      nickname: "Ed Terry",
      url: "/edterrymusic",
      fullUrl: "https://soundcloud.com/edterrymusic",
    },
    {
      nickname: "Felipe De Vicente",
      url: "/felipedevicente",
      fullUrl: "https://soundcloud.com/felipedevicente",
    },
    {
      nickname: "househead jason",
      url: "/househead-jason",
      fullUrl: "https://soundcloud.com/househead-jason",
    },
    {
      nickname: "JustDrewish",
      url: "/justdrewish",
      fullUrl: "https://soundcloud.com/justdrewish",
    },
    {
      nickname: "Mr. StarZ official",
      url: "/mrstarzofficial",
      fullUrl: "https://soundcloud.com/mrstarzofficial",
    },
    {
      nickname: "Anita",
      url: "/anita-barati",
      fullUrl: "https://soundcloud.com/anita-barati",
    },
    {
      nickname: "Netcius Systems",
      url: "/dnetcius",
      fullUrl: "https://soundcloud.com/dnetcius",
    },
    {
      nickname: "Saeraa",
      url: "/sarah-mcguire-5",
      fullUrl: "https://soundcloud.com/sarah-mcguire-5",
    },
    {
      nickname: "Chryptic",
      url: "/chris-carey-29",
      fullUrl: "https://soundcloud.com/chris-carey-29",
    },
    {
      nickname: "Ritzy",
      url: "/darealritz",
      fullUrl: "https://soundcloud.com/darealritz",
    },
    {
      nickname: "The Groove Boy",
      url: "/jonathangr",
      fullUrl: "https://soundcloud.com/jonathangr",
    },
    {
      nickname: "Monstr Drop",
      url: "/monstrdrop",
      fullUrl: "https://soundcloud.com/monstrdrop",
    },
    {
      nickname: "Chief Drewbie",
      url: "/andrew-ford-30",
      fullUrl: "https://soundcloud.com/andrew-ford-30",
    },
    {
      nickname: "Dj-Dacha 91",
      url: "/daliborstojkovic-1",
      fullUrl: "https://soundcloud.com/daliborstojkovic-1",
    },
    {
      nickname: "DJ GTO/Dj Mr Green",
      url: "/leijoalex",
      fullUrl: "https://soundcloud.com/leijoalex",
    },
    {
      nickname: "hansTIED",
      url: "/handtied",
      fullUrl: "https://soundcloud.com/handtied",
    },
    {
      nickname: "Aine Wolberg",
      url: "/aine-wolberg",
      fullUrl: "https://soundcloud.com/aine-wolberg",
    },
    {
      nickname: "AatiMaatiO",
      url: "/aatimaatio",
      fullUrl: "https://soundcloud.com/aatimaatio",
    },
    {
      nickname: "MANYNAMES - KEYFRAME - SEHU",
      url: "/keyframe_entertainment",
      fullUrl: "https://soundcloud.com/keyframe_entertainment",
    },
    {
      nickname: "TrAnScEnD",
      url: "/paolo-poydras",
      fullUrl: "https://soundcloud.com/paolo-poydras",
    },
    {
      nickname: "Benday",
      url: "/bendayy",
      fullUrl: "https://soundcloud.com/bendayy",
    },
    {
      nickname: "Nick Ang",
      url: "/dj-nick-ang",
      fullUrl: "https://soundcloud.com/dj-nick-ang",
    },
    {
      nickname: "UmpikujaK",
      url: "/umpikuja",
      fullUrl: "https://soundcloud.com/umpikuja",
    },
    {
      nickname: "Leunam reluhcs",
      url: "/leunamreluhcs",
      fullUrl: "https://soundcloud.com/leunamreluhcs",
    },
    {
      nickname: "Brahman",
      url: "/user964726185",
      fullUrl: "https://soundcloud.com/user964726185",
    },
    {
      nickname: "ERTM Medias",
      url: "/ertmedias",
      fullUrl: "https://soundcloud.com/ertmedias",
    },
    {
      nickname: "C RAD",
      url: "/cradmusica",
      fullUrl: "https://soundcloud.com/cradmusica",
    },
    {
      nickname: "Marcel P85",
      url: "/marcel-pasch-55484713",
      fullUrl: "https://soundcloud.com/marcel-pasch-55484713",
    },
    {
      nickname: "Zé Eduardo Braga",
      url: "/z-braga",
      fullUrl: "https://soundcloud.com/z-braga",
    },
    {
      nickname: "Lancé",
      url: "/lanceoffical",
      fullUrl: "https://soundcloud.com/lanceoffical",
    },
    {
      nickname: "Mr_Bilaite 🇲🇿",
      url: "/mr-bilaite1",
      fullUrl: "https://soundcloud.com/mr-bilaite1",
    },
    {
      nickname: "jabazera",
      url: "/jabazera",
      fullUrl: "https://soundcloud.com/jabazera",
    },
    {
      nickname: "?eNigma",
      url: "/user-641313535",
      fullUrl: "https://soundcloud.com/user-641313535",
    },
    {
      nickname: "Dave Baker Tasty productions",
      url: "/dave-baker-4",
      fullUrl: "https://soundcloud.com/dave-baker-4",
    },
    {
      nickname: "Evolution",
      url: "/agents-of-evolution",
      fullUrl: "https://soundcloud.com/agents-of-evolution",
    },
    {
      nickname: "Fatjon Krasniqi",
      url: "/fatjon-krasniqi-617997748",
      fullUrl: "https://soundcloud.com/fatjon-krasniqi-617997748",
    },
    {
      nickname: "Aali Rehman",
      url: "/aalirehman",
      fullUrl: "https://soundcloud.com/aalirehman",
    },
    {
      nickname: "MT BONNELL",
      url: "/mtbonnell",
      fullUrl: "https://soundcloud.com/mtbonnell",
    },
    {
      nickname: "Nik Ryu",
      url: "/nicolas-rioux-3",
      fullUrl: "https://soundcloud.com/nicolas-rioux-3",
    },
    {
      nickname: "KIND CAT",
      url: "/mr_kind_cat",
      fullUrl: "https://soundcloud.com/mr_kind_cat",
    },
    {
      nickname: "Andoneous DJ - #Dubpop, #house, #metal, #EDM, #POP",
      url: "/andoneous-dj",
      fullUrl: "https://soundcloud.com/andoneous-dj",
    },
    {
      nickname: "DJ Bose",
      url: "/djbose_au",
      fullUrl: "https://soundcloud.com/djbose_au",
    },
    {
      nickname: "Techno Tom",
      url: "/thomasfriel",
      fullUrl: "https://soundcloud.com/thomasfriel",
    },
    {
      nickname: "djTariman / Jaba Tarimanashvili",
      url: "/tariman",
      fullUrl: "https://soundcloud.com/tariman",
    },
    {
      nickname: "Shrugs",
      url: "/shrugs_music",
      fullUrl: "https://soundcloud.com/shrugs_music",
    },
    {
      nickname: "SPECS",
      url: "/specsofficial",
      fullUrl: "https://soundcloud.com/specsofficial",
    },
    {
      nickname: "KO·i·TUS",
      url: "/ko-i-tus",
      fullUrl: "https://soundcloud.com/ko-i-tus",
    },
    {
      nickname: "CHOULIS",
      url: "/gkklo",
      fullUrl: "https://soundcloud.com/gkklo",
    },
    {
      nickname: "Candyce L. CART",
      url: "/candyce-l-cart",
      fullUrl: "https://soundcloud.com/candyce-l-cart",
    },
    {
      nickname: "DJ Di-Fano",
      url: "/fano79",
      fullUrl: "https://soundcloud.com/fano79",
    },
    {
      nickname: "COCO G DJ",
      url: "/user-702980445-150388829",
      fullUrl: "https://soundcloud.com/user-702980445-150388829",
    },
    {
      nickname: "Ty 🩵",
      url: "/user-238374454",
      fullUrl: "https://soundcloud.com/user-238374454",
    },
    {
      nickname: "DjChef T /Tony Evora 🙏🏾💚🦋",
      url: "/djcheft",
      fullUrl: "https://soundcloud.com/djcheft",
    },
    {
      nickname: "Kais Saab",
      url: "/kais-saab-1",
      fullUrl: "https://soundcloud.com/kais-saab-1",
    },
    {
      nickname: "undr.sn",
      url: "/undrsn",
      fullUrl: "https://soundcloud.com/undrsn",
    },
    {
      nickname: "Inertia",
      url: "/inertia-ofc",
      fullUrl: "https://soundcloud.com/inertia-ofc",
    },
    {
      nickname: "Shaun Robinson",
      url: "/shaun-robinson-125350495",
      fullUrl: "https://soundcloud.com/shaun-robinson-125350495",
    },
    {
      nickname: "noursameh",
      url: "/nour-bolly",
      fullUrl: "https://soundcloud.com/nour-bolly",
    },
    {
      nickname: "Solarius 🔆",
      url: "/solariusdj",
      fullUrl: "https://soundcloud.com/solariusdj",
    },
    {
      nickname: "BSquare Music",
      url: "/bsquare_music",
      fullUrl: "https://soundcloud.com/bsquare_music",
    },
    {
      nickname: "MaxiHortaDJ",
      url: "/maxihortadj",
      fullUrl: "https://soundcloud.com/maxihortadj",
    },
    {
      nickname: "Random Selected",
      url: "/random-selected",
      fullUrl: "https://soundcloud.com/random-selected",
    },
    {
      nickname: "RHiNO",
      url: "/rhinoaudio",
      fullUrl: "https://soundcloud.com/rhinoaudio",
    },
    {
      nickname: "*Fabes*",
      url: "/fabes84",
      fullUrl: "https://soundcloud.com/fabes84",
    },
    {
      nickname: "kerryx2",
      url: "/kerryx2",
      fullUrl: "https://soundcloud.com/kerryx2",
    },
    {
      nickname: "BUMKA",
      url: "/bumkadj",
      fullUrl: "https://soundcloud.com/bumkadj",
    },
    {
      nickname: "likewter",
      url: "/likewter",
      fullUrl: "https://soundcloud.com/likewter",
    },
    {
      nickname: "Breaka B",
      url: "/breakab89",
      fullUrl: "https://soundcloud.com/breakab89",
    },
    {
      nickname: "Luna Rosa Records",
      url: "/lunarosarecords",
      fullUrl: "https://soundcloud.com/lunarosarecords",
    },
    {
      nickname: "Steven Tolbert",
      url: "/user1824904",
      fullUrl: "https://soundcloud.com/user1824904",
    },
    {
      nickname: "Fred Ferreira",
      url: "/djfredferreira",
      fullUrl: "https://soundcloud.com/djfredferreira",
    },
    {
      nickname: "Henk John Zach",
      url: "/user-438829667",
      fullUrl: "https://soundcloud.com/user-438829667",
    },
    {
      nickname: "Do Ro 1",
      url: "/do-ro",
      fullUrl: "https://soundcloud.com/do-ro",
    },
    {
      nickname: "D_MONTANA",
      url: "/d_montana",
      fullUrl: "https://soundcloud.com/d_montana",
    },
    {
      nickname: "redvoid",
      url: "/redvoid",
      fullUrl: "https://soundcloud.com/redvoid",
    },
    {
      nickname: "Andreas Harnisch",
      url: "/andreas-harnisch",
      fullUrl: "https://soundcloud.com/andreas-harnisch",
    },
    {
      nickname: "Adam Khepri",
      url: "/adamkhepri",
      fullUrl: "https://soundcloud.com/adamkhepri",
    },
    {
      nickname: "Equalizor",
      url: "/equalizor",
      fullUrl: "https://soundcloud.com/equalizor",
    },
    {
      nickname: "tURB10",
      url: "/turb10",
      fullUrl: "https://soundcloud.com/turb10",
    },
    {
      nickname: "Blacktob_Music",
      url: "/blacktob_music",
      fullUrl: "https://soundcloud.com/blacktob_music",
    },
    {
      nickname: "Oz Man",
      url: "/oz_man",
      fullUrl: "https://soundcloud.com/oz_man",
    },
    {
      nickname: "Asteroidnos",
      url: "/asteroidnos",
      fullUrl: "https://soundcloud.com/asteroidnos",
    },
    {
      nickname: "Filipe Lopes",
      url: "/filipe-lopes-944577639",
      fullUrl: "https://soundcloud.com/filipe-lopes-944577639",
    },
    {
      nickname: "overflow_kingkilla",
      url: "/james-573930165",
      fullUrl: "https://soundcloud.com/james-573930165",
    },
    {
      nickname: "Hey....",
      url: "/user5530607",
      fullUrl: "https://soundcloud.com/user5530607",
    },
    {
      nickname: "Dark_Natinus",
      url: "/nathan-barberis",
      fullUrl: "https://soundcloud.com/nathan-barberis",
    },
    {
      nickname: "Jean-Michel Bar",
      url: "/jean-michel-bar",
      fullUrl: "https://soundcloud.com/jean-michel-bar",
    },
    {
      nickname: "Ciccio",
      url: "/francesco-castagna-3",
      fullUrl: "https://soundcloud.com/francesco-castagna-3",
    },
    {
      nickname: "Piotr Wruk (Czarny)",
      url: "/piotr-wruk-czarny",
      fullUrl: "https://soundcloud.com/piotr-wruk-czarny",
    },
    {
      nickname: "Prignitzer Klangkeller",
      url: "/yungzeltplatz",
      fullUrl: "https://soundcloud.com/yungzeltplatz",
    },
    {
      nickname: "SRAMVOLT",
      url: "/sramvolt",
      fullUrl: "https://soundcloud.com/sramvolt",
    },
    {
      nickname: "ikicksg",
      url: "/user-759408676",
      fullUrl: "https://soundcloud.com/user-759408676",
    },
    {
      nickname: "Nvermorre",
      url: "/nvermorre",
      fullUrl: "https://soundcloud.com/nvermorre",
    },
    {
      nickname: "𝕯𝖓𝖅",
      url: "/dnz_alps",
      fullUrl: "https://soundcloud.com/dnz_alps",
    },
    {
      nickname: "jdkxjxjxn",
      url: "/lyrical_llsp",
      fullUrl: "https://soundcloud.com/lyrical_llsp",
    },
    {
      nickname: "BettyBeat",
      url: "/bettybeat-1",
      fullUrl: "https://soundcloud.com/bettybeat-1",
    },
    {
      nickname: "Darksynth",
      url: "/eftos71",
      fullUrl: "https://soundcloud.com/eftos71",
    },
    {
      nickname: "Graxxa Records",
      url: "/graxxarecords",
      fullUrl: "https://soundcloud.com/graxxarecords",
    },
    {
      nickname: "KALASH23",
      url: "/ernitek",
      fullUrl: "https://soundcloud.com/ernitek",
    },
    {
      nickname: "STES8410",
      url: "/stes8410",
      fullUrl: "https://soundcloud.com/stes8410",
    },
    {
      nickname: "heliumdream",
      url: "/heliumdream",
      fullUrl: "https://soundcloud.com/heliumdream",
    },
    {
      nickname: "Panthera By B & J",
      url: "/userpanthera",
      fullUrl: "https://soundcloud.com/userpanthera",
    },
    {
      nickname: "Lebowski",
      url: "/der-hirsch-1",
      fullUrl: "https://soundcloud.com/der-hirsch-1",
    },
    {
      nickname: "Adam B",
      url: "/adam-bedingfield",
      fullUrl: "https://soundcloud.com/adam-bedingfield",
    },
    {
      nickname: "Goth europe",
      url: "/eftos9c",
      fullUrl: "https://soundcloud.com/eftos9c",
    },
    {
      nickname: "tony-rangers",
      url: "/tony-rangers",
      fullUrl: "https://soundcloud.com/tony-rangers",
    },
    {
      nickname: "CRïFER",
      url: "/crifer",
      fullUrl: "https://soundcloud.com/crifer",
    },
    {
      nickname: "AvdE",
      url: "/avdeofficial",
      fullUrl: "https://soundcloud.com/avdeofficial",
    },
    {
      nickname: "Novatraxx",
      url: "/stadspraat",
      fullUrl: "https://soundcloud.com/stadspraat",
    },
    {
      nickname: "Basskangel Dj’ Txi Skn db( ( ( V ) ) ) Fatimao🫡⭐️🃏",
      url: "/user-578208013-565754170",
      fullUrl: "https://soundcloud.com/user-578208013-565754170",
    },
    {
      nickname: "ANIUM",
      url: "/netanel-zonenshein-37188094",
      fullUrl: "https://soundcloud.com/netanel-zonenshein-37188094",
    },
    {
      nickname: "Helmi H Junior",
      url: "/helmi_h_junior",
      fullUrl: "https://soundcloud.com/helmi_h_junior",
    },
    {
      nickname: "Beat Sound",
      url: "/pablo-yolotlic-arguello-gonzalez",
      fullUrl: "https://soundcloud.com/pablo-yolotlic-arguello-gonzalez",
    },
    {
      nickname: "DJ Magalz",
      url: "/djmagalz",
      fullUrl: "https://soundcloud.com/djmagalz",
    },
    {
      nickname: "Olli&Paul Rubbeldiekatz",
      url: "/ronny-oldenburg-466832760",
      fullUrl: "https://soundcloud.com/ronny-oldenburg-466832760",
    },
    {
      nickname: "Azeteck",
      url: "/user-365290214",
      fullUrl: "https://soundcloud.com/user-365290214",
    },
    {
      nickname: "2cme ✪",
      url: "/toseeme",
      fullUrl: "https://soundcloud.com/toseeme",
    },
    {
      nickname: "DoXa",
      url: "/domenikomdoxa",
      fullUrl: "https://soundcloud.com/domenikomdoxa",
    },
    {
      nickname: "DAVID L M",
      url: "/dj-david-lm-dlm",
      fullUrl: "https://soundcloud.com/dj-david-lm-dlm",
    },
    {
      nickname: "Olaf Svend",
      url: "/olaf-svend",
      fullUrl: "https://soundcloud.com/olaf-svend",
    },
    {
      nickname: "ndrix",
      url: "/ndrix",
      fullUrl: "https://soundcloud.com/ndrix",
    },
    {
      nickname: "BigPit",
      url: "/arpit-shukla-8",
      fullUrl: "https://soundcloud.com/arpit-shukla-8",
    },
    {
      nickname: "Claudia Gawel",
      url: "/claudia-gawel-857275701",
      fullUrl: "https://soundcloud.com/claudia-gawel-857275701",
    },
    {
      nickname: "Sneakin Tokes",
      url: "/ted-bixby",
      fullUrl: "https://soundcloud.com/ted-bixby",
    },
    {
      nickname: "RSNNT",
      url: "/juan-manuel-valencia-22434673",
      fullUrl: "https://soundcloud.com/juan-manuel-valencia-22434673",
    },
    {
      nickname: "Lowkey Asan",
      url: "/user-789349100",
      fullUrl: "https://soundcloud.com/user-789349100",
    },
    {
      nickname: "DN8_Official",
      url: "/user-477515957",
      fullUrl: "https://soundcloud.com/user-477515957",
    },
    {
      nickname: "BiGG’ ENDO (Døugh-$tradamu$)",
      url: "/yahwehs-servant",
      fullUrl: "https://soundcloud.com/yahwehs-servant",
    },
    {
      nickname: "NKŁS",
      url: "/nkls_music",
      fullUrl: "https://soundcloud.com/nkls_music",
    },
    {
      nickname: "Claudio Rodríguez",
      url: "/claudioklr",
      fullUrl: "https://soundcloud.com/claudioklr",
    },
    {
      nickname: "Diego R Figueroa",
      url: "/diego-r-figueroa",
      fullUrl: "https://soundcloud.com/diego-r-figueroa",
    },
    {
      nickname: "Lily Meant",
      url: "/lilly-meant",
      fullUrl: "https://soundcloud.com/lilly-meant",
    },
    {
      nickname: "AC Madame",
      url: "/ac_madame",
      fullUrl: "https://soundcloud.com/ac_madame",
    },
    {
      nickname: "MUKE",
      url: "/mukedj",
      fullUrl: "https://soundcloud.com/mukedj",
    },
    {
      nickname: "lashajangvela",
      url: "/jangveladzelasha9",
      fullUrl: "https://soundcloud.com/jangveladzelasha9",
    },
    {
      nickname: "NISHAZ MK",
      url: "/nishaj-yousuf-32575176",
      fullUrl: "https://soundcloud.com/nishaj-yousuf-32575176",
    },
    {
      nickname: "DKTech",
      url: "/dinoktech",
      fullUrl: "https://soundcloud.com/dinoktech",
    },
    {
      nickname: "nempath",
      url: "/thapmen",
      fullUrl: "https://soundcloud.com/thapmen",
    },
    {
      nickname: "WNDR.FUL",
      url: "/user-588151004",
      fullUrl: "https://soundcloud.com/user-588151004",
    },
    {
      nickname: "Pietjes Weekly",
      url: "/pietjesweekly",
      fullUrl: "https://soundcloud.com/pietjesweekly",
    },
    {
      nickname: "grooVE harD",
      url: "/devlovestechno",
      fullUrl: "https://soundcloud.com/devlovestechno",
    },
    {
      nickname: "dekoi",
      url: "/dekoi_sounds",
      fullUrl: "https://soundcloud.com/dekoi_sounds",
    },
    {
      nickname: "Nido-X",
      url: "/nido-x-64868934",
      fullUrl: "https://soundcloud.com/nido-x-64868934",
    },
    {
      nickname: "Eank",
      url: "/eankimbrell",
      fullUrl: "https://soundcloud.com/eankimbrell",
    },
    {
      nickname: "Zbra",
      url: "/mrzee4zbra",
      fullUrl: "https://soundcloud.com/mrzee4zbra",
    },
    {
      nickname: "1819houseoftraks",
      url: "/1819houseoftraks",
      fullUrl: "https://soundcloud.com/1819houseoftraks",
    },
    {
      nickname: "NazT",
      url: "/travis-brown-568481201",
      fullUrl: "https://soundcloud.com/travis-brown-568481201",
    },
    {
      nickname: "JustAFriend",
      url: "/robert-bailey-jr-2",
      fullUrl: "https://soundcloud.com/robert-bailey-jr-2",
    },
    {
      nickname: "R.O.S",
      url: "/r-shadafny",
      fullUrl: "https://soundcloud.com/r-shadafny",
    },
    {
      nickname: "Laine und Mr.Sh",
      url: "/phobiotik",
      fullUrl: "https://soundcloud.com/phobiotik",
    },
    {
      nickname: "Mr.Beaton",
      url: "/kolton-beaton",
      fullUrl: "https://soundcloud.com/kolton-beaton",
    },
    {
      nickname: "Blacksilver",
      url: "/user-753181836",
      fullUrl: "https://soundcloud.com/user-753181836",
    },
    {
      nickname: "Jostein Rødskar",
      url: "/jostein-rodskar",
      fullUrl: "https://soundcloud.com/jostein-rodskar",
    },
    {
      nickname: "Pengwen",
      url: "/dj-pengwen",
      fullUrl: "https://soundcloud.com/dj-pengwen",
    },
    {
      nickname: "dj karl nawak",
      url: "/dj-karl-nawak",
      fullUrl: "https://soundcloud.com/dj-karl-nawak",
    },
    {
      nickname: "Buckhead Blackouts",
      url: "/buckheadblackouts",
      fullUrl: "https://soundcloud.com/buckheadblackouts",
    },
    {
      nickname: "rimmla(e)r / T.S.A. (Tristar-TRS-Network)",
      url: "/rimmler-t-s-a-tristar",
      fullUrl: "https://soundcloud.com/rimmler-t-s-a-tristar",
    },
    {
      nickname: "chi_yin_ji",
      url: "/chi_yin_ji",
      fullUrl: "https://soundcloud.com/chi_yin_ji",
    },
    {
      nickname: "Katie Golding",
      url: "/katiegolding112",
      fullUrl: "https://soundcloud.com/katiegolding112",
    },
    {
      nickname: "master baiter",
      url: "/kay2way76",
      fullUrl: "https://soundcloud.com/kay2way76",
    },
    {
      nickname: "boomboomrecordings",
      url: "/boomboomrecordings",
      fullUrl: "https://soundcloud.com/boomboomrecordings",
    },
    {
      nickname: "LAKENYA",
      url: "/lakenya-welten",
      fullUrl: "https://soundcloud.com/lakenya-welten",
    },
    {
      nickname: "felix hause",
      url: "/felix-hause",
      fullUrl: "https://soundcloud.com/felix-hause",
    },
    {
      nickname: "Nicholas Galea",
      url: "/nicholas_galea",
      fullUrl: "https://soundcloud.com/nicholas_galea",
    },
    {
      nickname: "julian trompete",
      url: "/julian-trompete",
      fullUrl: "https://soundcloud.com/julian-trompete",
    },
    {
      nickname: "GR.avi.TY",
      url: "/zero_gravity_stateofmind",
      fullUrl: "https://soundcloud.com/zero_gravity_stateofmind",
    },
    {
      nickname: "Swiss Army Wife DJ",
      url: "/rika_dj",
      fullUrl: "https://soundcloud.com/rika_dj",
    },
    {
      nickname: "J&C",
      url: "/user-4919753",
      fullUrl: "https://soundcloud.com/user-4919753",
    },
    {
      nickname: "SteezyCeezy",
      url: "/steezyceezy",
      fullUrl: "https://soundcloud.com/steezyceezy",
    },
    {
      nickname: "Dj Taz E.T",
      url: "/taz-e-tek",
      fullUrl: "https://soundcloud.com/taz-e-tek",
    },
    {
      nickname: "Jesssssss",
      url: "/travisgulardo",
      fullUrl: "https://soundcloud.com/travisgulardo",
    },
    {
      nickname: "NATE MADRID",
      url: "/natemadrid",
      fullUrl: "https://soundcloud.com/natemadrid",
    },
    {
      nickname: "Tomas Veit",
      url: "/tomas-veit",
      fullUrl: "https://soundcloud.com/tomas-veit",
    },
    {
      nickname: "Tirvo",
      url: "/tirvo",
      fullUrl: "https://soundcloud.com/tirvo",
    },
    {
      nickname: "MSTE",
      url: "/mste",
      fullUrl: "https://soundcloud.com/mste",
    },
    {
      nickname: "scarecrow | touwieee³²",
      url: "/touwieee",
      fullUrl: "https://soundcloud.com/touwieee",
    },
    {
      nickname: "Calypso",
      url: "/calypso_la",
      fullUrl: "https://soundcloud.com/calypso_la",
    },
    {
      nickname: "Danlys8",
      url: "/daniel-lyseight",
      fullUrl: "https://soundcloud.com/daniel-lyseight",
    },
    {
      nickname: "fonfre",
      url: "/fonfre8",
      fullUrl: "https://soundcloud.com/fonfre8",
    },
    {
      nickname: "GAÜT",
      url: "/got-got",
      fullUrl: "https://soundcloud.com/got-got",
    },
    {
      nickname: "BAMBOO",
      url: "/chrys-debo",
      fullUrl: "https://soundcloud.com/chrys-debo",
    },
    {
      nickname: "Ricardo Ortíz",
      url: "/ricardo-ortiz-835326732",
      fullUrl: "https://soundcloud.com/ricardo-ortiz-835326732",
    },
    {
      nickname: "SMACKYJACK AKA DANTRAN",
      url: "/chelleindustries",
      fullUrl: "https://soundcloud.com/chelleindustries",
    },
    {
      nickname: "Josh Hanin",
      url: "/josh-hanin",
      fullUrl: "https://soundcloud.com/josh-hanin",
    },
    {
      nickname: "Don Padre(ΔΩΝ παΔρ∑)",
      url: "/ro-bi-8",
      fullUrl: "https://soundcloud.com/ro-bi-8",
    },
    {
      nickname: "SystemEX",
      url: "/systemex-752105854",
      fullUrl: "https://soundcloud.com/systemex-752105854",
    },
    {
      nickname: "Janine Schmidt",
      url: "/janine-schmidt-715519064",
      fullUrl: "https://soundcloud.com/janine-schmidt-715519064",
    },
    {
      nickname: "Diggy’s",
      url: "/user-480378542-424436307",
      fullUrl: "https://soundcloud.com/user-480378542-424436307",
    },
    {
      nickname: "Natascha_aus_k",
      url: "/natascha-von-dellingshausen",
      fullUrl: "https://soundcloud.com/natascha-von-dellingshausen",
    },
    {
      nickname: "Asenssi",
      url: "/asenssi",
      fullUrl: "https://soundcloud.com/asenssi",
    },
    {
      nickname: "Yannick Lizar",
      url: "/yannick-baudonnait",
      fullUrl: "https://soundcloud.com/yannick-baudonnait",
    },
    {
      nickname: "A.Ti",
      url: "/alexivanovati",
      fullUrl: "https://soundcloud.com/alexivanovati",
    },
    {
      nickname: "🖤xRyS🖤",
      url: "/creepers03",
      fullUrl: "https://soundcloud.com/creepers03",
    },
    {
      nickname: "GOOM🍄",
      url: "/tgums",
      fullUrl: "https://soundcloud.com/tgums",
    },
    {
      nickname: "Disctance Records",
      url: "/disctancerecords",
      fullUrl: "https://soundcloud.com/disctancerecords",
    },
    {
      nickname: "Darina Soreva",
      url: "/user-697013041",
      fullUrl: "https://soundcloud.com/user-697013041",
    },
    {
      nickname: "LOR",
      url: "/lorre1",
      fullUrl: "https://soundcloud.com/lorre1",
    },
    {
      nickname: "Christiano Bernardi",
      url: "/christiano-bernardi",
      fullUrl: "https://soundcloud.com/christiano-bernardi",
    },
    {
      nickname: "sandra mase",
      url: "/masejames225",
      fullUrl: "https://soundcloud.com/masejames225",
    },
    {
      nickname: "FIL",
      url: "/fil-ouzito",
      fullUrl: "https://soundcloud.com/fil-ouzito",
    },
    {
      nickname: "AARON MADZ",
      url: "/aaron-madz",
      fullUrl: "https://soundcloud.com/aaron-madz",
    },
    {
      nickname: "SadBoy Hades",
      url: "/sadboy_hades",
      fullUrl: "https://soundcloud.com/sadboy_hades",
    },
    {
      nickname: "EDi⏻MA",
      url: "/edi-mas-592408950",
      fullUrl: "https://soundcloud.com/edi-mas-592408950",
    },
    {
      nickname: "philosophy.beat",
      url: "/tjm-5",
      fullUrl: "https://soundcloud.com/tjm-5",
    },
    {
      nickname: "CHEINZ",
      url: "/chuchainz8",
      fullUrl: "https://soundcloud.com/chuchainz8",
    },
    {
      nickname: "🎵 🎶 SPENNO 🎶 🎵",
      url: "/spenno89",
      fullUrl: "https://soundcloud.com/spenno89",
    },
    {
      nickname: "ONSO LOVE PANACEA",
      url: "/lgdyao-petron",
      fullUrl: "https://soundcloud.com/lgdyao-petron",
    },
    {
      nickname: "Sherry",
      url: "/paulsherry52",
      fullUrl: "https://soundcloud.com/paulsherry52",
    },
    {
      nickname: "Gordonn Bulloch",
      url: "/gordon-bulloch",
      fullUrl: "https://soundcloud.com/gordon-bulloch",
    },
    {
      nickname: "Meliz Yucedal",
      url: "/melienmusic",
      fullUrl: "https://soundcloud.com/melienmusic",
    },
    {
      nickname: "GARE",
      url: "/gare_gare",
      fullUrl: "https://soundcloud.com/gare_gare",
    },
    {
      nickname: "Dj Aamir Rock Islamabad",
      url: "/aamir-sohail-193508306",
      fullUrl: "https://soundcloud.com/aamir-sohail-193508306",
    },
    {
      nickname: "HOCINE-D",
      url: "/hocin-allstar",
      fullUrl: "https://soundcloud.com/hocin-allstar",
    },
    {
      nickname: "Kieran O' Brien - K96",
      url: "/kieran96",
      fullUrl: "https://soundcloud.com/kieran96",
    },
    {
      nickname: "Livvy ❤️",
      url: "/olivia-richardson-568990932",
      fullUrl: "https://soundcloud.com/olivia-richardson-568990932",
    },
    {
      nickname: "Stas Fortis",
      url: "/stasfortis",
      fullUrl: "https://soundcloud.com/stasfortis",
    },
    {
      nickname: "TommyTommy",
      url: "/tommytommy79",
      fullUrl: "https://soundcloud.com/tommytommy79",
    },
    {
      nickname: "JOJO",
      url: "/josef-schubert-1",
      fullUrl: "https://soundcloud.com/josef-schubert-1",
    },
    {
      nickname: "KENNA®️",
      url: "/jamestgm30",
      fullUrl: "https://soundcloud.com/jamestgm30",
    },
    {
      nickname: "Fodokrüll",
      url: "/fodokrull",
      fullUrl: "https://soundcloud.com/fodokrull",
    },
    {
      nickname: "Dj Fly Agaric",
      url: "/xwojtasx",
      fullUrl: "https://soundcloud.com/xwojtasx",
    },
    {
      nickname: "MagmaLooper",
      url: "/howard-tanner-413445636",
      fullUrl: "https://soundcloud.com/howard-tanner-413445636",
    },
    {
      nickname: "Jubayer Ahmed",
      url: "/jubayer-ahmedjbt",
      fullUrl: "https://soundcloud.com/jubayer-ahmedjbt",
    },
    {
      nickname: "Løvn",
      url: "/lov-n-liv",
      fullUrl: "https://soundcloud.com/lov-n-liv",
    },
    {
      nickname: "M-C",
      url: "/cyril-rocher-839049369",
      fullUrl: "https://soundcloud.com/cyril-rocher-839049369",
    },
    {
      nickname: "carly_2013",
      url: "/carly_2013",
      fullUrl: "https://soundcloud.com/carly_2013",
    },
    {
      nickname: "Sophie. t",
      url: "/sophie-tucker-550966785",
      fullUrl: "https://soundcloud.com/sophie-tucker-550966785",
    },
    {
      nickname: "breathe daniel",
      url: "/breathe-daniel",
      fullUrl: "https://soundcloud.com/breathe-daniel",
    },
    {
      nickname: "Kyle Hughes🐒",
      url: "/kylehughezz",
      fullUrl: "https://soundcloud.com/kylehughezz",
    },
    {
      nickname: "Luaraalves2",
      url: "/luara-alves-1",
      fullUrl: "https://soundcloud.com/luara-alves-1",
    },
    {
      nickname: "DerFunkmann I PRVK//R",
      url: "/derfunkmann",
      fullUrl: "https://soundcloud.com/derfunkmann",
    },
    {
      nickname: "John Holmes",
      url: "/john-holmes-403960802",
      fullUrl: "https://soundcloud.com/john-holmes-403960802",
    },
    {
      nickname: "WULLIE LECKIE",
      url: "/wulllie",
      fullUrl: "https://soundcloud.com/wulllie",
    },
    {
      nickname: "Felix Mendoza",
      url: "/530468027",
      fullUrl: "https://soundcloud.com/530468027",
    },
    {
      nickname: "Rozen",
      url: "/rozenmusica",
      fullUrl: "https://soundcloud.com/rozenmusica",
    },
    {
      nickname: "Mel5579",
      url: "/mel5579",
      fullUrl: "https://soundcloud.com/mel5579",
    },
    {
      nickname: "francisco javier Acera",
      url: "/francisco-javier-acera",
      fullUrl: "https://soundcloud.com/francisco-javier-acera",
    },
    {
      nickname: "Petchidj",
      url: "/djpetch1",
      fullUrl: "https://soundcloud.com/djpetch1",
    },
    {
      nickname: "metsa nima",
      url: "/metsanima",
      fullUrl: "https://soundcloud.com/metsanima",
    },
    {
      nickname: "Nėittør",
      url: "/pedro-neito-254111374",
      fullUrl: "https://soundcloud.com/pedro-neito-254111374",
    },
    {
      nickname: "fenguel",
      url: "/fenguel",
      fullUrl: "https://soundcloud.com/fenguel",
    },
    {
      nickname: "Faceless",
      url: "/music-faceless",
      fullUrl: "https://soundcloud.com/music-faceless",
    },
    {
      nickname: "XLORD",
      url: "/xlordmusic",
      fullUrl: "https://soundcloud.com/xlordmusic",
    },
    {
      nickname: "Mizz_London",
      url: "/mizz_london",
      fullUrl: "https://soundcloud.com/mizz_london",
    },
    {
      nickname: "Alex Saguez",
      url: "/alex-saguez",
      fullUrl: "https://soundcloud.com/alex-saguez",
    },
    {
      nickname: "Dave Smith",
      url: "/dave-smith-dave",
      fullUrl: "https://soundcloud.com/dave-smith-dave",
    },
    {
      nickname: "snowt1ger",
      url: "/davidsauter",
      fullUrl: "https://soundcloud.com/davidsauter",
    },
    {
      nickname: "play🎵boy1",
      url: "/user-869559600",
      fullUrl: "https://soundcloud.com/user-869559600",
    },
    {
      nickname: "nevermind",
      url: "/nevermindnevermind",
      fullUrl: "https://soundcloud.com/nevermindnevermind",
    },
    {
      nickname: "Jekyll & Hyde",
      url: "/jekyll_and_hyde_uk",
      fullUrl: "https://soundcloud.com/jekyll_and_hyde_uk",
    },
    {
      nickname: "ero",
      url: "/deepho-2",
      fullUrl: "https://soundcloud.com/deepho-2",
    },
    {
      nickname: "JoBro 1",
      url: "/thejobros",
      fullUrl: "https://soundcloud.com/thejobros",
    },
    {
      nickname: "Anton Bee",
      url: "/antonbnyc",
      fullUrl: "https://soundcloud.com/antonbnyc",
    },
    {
      nickname: "Edna Cara",
      url: "/edna-cara",
      fullUrl: "https://soundcloud.com/edna-cara",
    },
    {
      nickname: "Happy Energie",
      url: "/happyenergie",
      fullUrl: "https://soundcloud.com/happyenergie",
    },
    {
      nickname: "Quantum Harmonics",
      url: "/quantumharmonics",
      fullUrl: "https://soundcloud.com/quantumharmonics",
    },
    {
      nickname: "Jaypieezar",
      url: "/jaypieezarmusic",
      fullUrl: "https://soundcloud.com/jaypieezarmusic",
    },
    {
      nickname: "Muetzerich",
      url: "/user-778015082-224609944",
      fullUrl: "https://soundcloud.com/user-778015082-224609944",
    },
    {
      nickname: "ST.PHILLIP",
      url: "/stphillip",
      fullUrl: "https://soundcloud.com/stphillip",
    },
    {
      nickname: "P-FITZ",
      url: "/pfitz-1",
      fullUrl: "https://soundcloud.com/pfitz-1",
    },
    {
      nickname: "Kill'Tone",
      url: "/killtone420",
      fullUrl: "https://soundcloud.com/killtone420",
    },
    {
      nickname: "SILKSMOOTH",
      url: "/silksmooth-videira",
      fullUrl: "https://soundcloud.com/silksmooth-videira",
    },
    {
      nickname: "radiophobos",
      url: "/radiophobos",
      fullUrl: "https://soundcloud.com/radiophobos",
    },
    {
      nickname: "Atomik ShadowKitten",
      url: "/atomik-shadowkitten",
      fullUrl: "https://soundcloud.com/atomik-shadowkitten",
    },
    {
      nickname: "CalvinMackCandy",
      url: "/killluminat",
      fullUrl: "https://soundcloud.com/killluminat",
    },
    {
      nickname: "mdman",
      url: "/mdmandj",
      fullUrl: "https://soundcloud.com/mdmandj",
    },
    {
      nickname: "Sándor Bak",
      url: "/s-ndor-bak",
      fullUrl: "https://soundcloud.com/s-ndor-bak",
    },
    {
      nickname: "lucas BSMTK",
      url: "/lucas56300",
      fullUrl: "https://soundcloud.com/lucas56300",
    },
    {
      nickname: "Chris Barquero",
      url: "/chrisbarquero",
      fullUrl: "https://soundcloud.com/chrisbarquero",
    },
    {
      nickname: "Juri Jura",
      url: "/jurijura",
      fullUrl: "https://soundcloud.com/jurijura",
    },
    {
      nickname: "XAMORA",
      url: "/janette-zamora-1",
      fullUrl: "https://soundcloud.com/janette-zamora-1",
    },
    {
      nickname: "D-GY",
      url: "/user-549791049",
      fullUrl: "https://soundcloud.com/user-549791049",
    },
    {
      nickname: "NOCAP (fka Don Cap)",
      url: "/nocapsound",
      fullUrl: "https://soundcloud.com/nocapsound",
    },
    {
      nickname: "waktab",
      url: "/waktab",
      fullUrl: "https://soundcloud.com/waktab",
    },
    {
      nickname: "Lady",
      url: "/user-234038185-124605053",
      fullUrl: "https://soundcloud.com/user-234038185-124605053",
    },
    {
      nickname: "Just Techno",
      url: "/just-techno34",
      fullUrl: "https://soundcloud.com/just-techno34",
    },
    {
      nickname: "Ken Dreas",
      url: "/ken-dreas",
      fullUrl: "https://soundcloud.com/ken-dreas",
    },
    {
      nickname: "Modular system",
      url: "/sked-1",
      fullUrl: "https://soundcloud.com/sked-1",
    },
    {
      nickname: "Jd Ley",
      url: "/jd-ley",
      fullUrl: "https://soundcloud.com/jd-ley",
    },
    {
      nickname: "PARADOX",
      url: "/paradox4499",
      fullUrl: "https://soundcloud.com/paradox4499",
    },
    {
      nickname: "Martin James",
      url: "/martin-james-427470337",
      fullUrl: "https://soundcloud.com/martin-james-427470337",
    },
    {
      nickname: "IAS",
      url: "/yasmim-rodrigues-2",
      fullUrl: "https://soundcloud.com/yasmim-rodrigues-2",
    },
    {
      nickname: "Sölacè",
      url: "/scott-jones-561888830",
      fullUrl: "https://soundcloud.com/scott-jones-561888830",
    },
    {
      nickname: "Dj PARRUX",
      url: "/dj-parrux",
      fullUrl: "https://soundcloud.com/dj-parrux",
    },
    {
      nickname: "Solo Tee",
      url: "/simon-thomas-89",
      fullUrl: "https://soundcloud.com/simon-thomas-89",
    },
    {
      nickname: "Medizinmann",
      url: "/user-613231749",
      fullUrl: "https://soundcloud.com/user-613231749",
    },
    {
      nickname: "Hisfirefunkk_dj",
      url: "/hisfirefunkkdj",
      fullUrl: "https://soundcloud.com/hisfirefunkkdj",
    },
    {
      nickname: "orion23",
      url: "/orion23",
      fullUrl: "https://soundcloud.com/orion23",
    },
    {
      nickname: "Extetek",
      url: "/extetek",
      fullUrl: "https://soundcloud.com/extetek",
    },
    {
      nickname: "Matthew Vertino",
      url: "/matthewvertino",
      fullUrl: "https://soundcloud.com/matthewvertino",
    },
    {
      nickname: "ismok",
      url: "/ismok",
      fullUrl: "https://soundcloud.com/ismok",
    },
    {
      nickname: "Miss Technoo",
      url: "/stephanie-dufrenne",
      fullUrl: "https://soundcloud.com/stephanie-dufrenne",
    },
    {
      nickname: "LautOderAus®",
      url: "/lautoderaus",
      fullUrl: "https://soundcloud.com/lautoderaus",
    },
    {
      nickname: "Nicolas B",
      url: "/nicolasb77",
      fullUrl: "https://soundcloud.com/nicolasb77",
    },
    {
      nickname: "Floow (DE)",
      url: "/floowuk",
      fullUrl: "https://soundcloud.com/floowuk",
    },
    {
      nickname: "Carlos YangYang",
      url: "/carlos-yangyang",
      fullUrl: "https://soundcloud.com/carlos-yangyang",
    },
    {
      nickname: "DanceWithMe",
      url: "/nowdanzewithme",
      fullUrl: "https://soundcloud.com/nowdanzewithme",
    },
    {
      nickname: "La Gitane",
      url: "/lagitane",
      fullUrl: "https://soundcloud.com/lagitane",
    },
    {
      nickname: "Saulle",
      url: "/nicolo-s-867923754",
      fullUrl: "https://soundcloud.com/nicolo-s-867923754",
    },
    {
      nickname: "mischmaus (he/him)",
      url: "/mischmaus",
      fullUrl: "https://soundcloud.com/mischmaus",
    },
    {
      nickname: "Citrus Blue 🔵",
      url: "/ryan-keeling-266476903",
      fullUrl: "https://soundcloud.com/ryan-keeling-266476903",
    },
    {
      nickname: "Bagaberto",
      url: "/dj-baggiccio",
      fullUrl: "https://soundcloud.com/dj-baggiccio",
    },
    {
      nickname: "DamaGathaBLueS🎶",
      url: "/gathablues",
      fullUrl: "https://soundcloud.com/gathablues",
    },
    {
      nickname: "Marcell",
      url: "/marcell-manssakz",
      fullUrl: "https://soundcloud.com/marcell-manssakz",
    },
    {
      nickname: "Gregboi",
      url: "/gregboi313",
      fullUrl: "https://soundcloud.com/gregboi313",
    },
    {
      nickname: "CABRERA",
      url: "/sergicj7",
      fullUrl: "https://soundcloud.com/sergicj7",
    },
    {
      nickname: "JUST DAKICHHX",
      url: "/dani-andreev-299832960",
      fullUrl: "https://soundcloud.com/dani-andreev-299832960",
    },
    {
      nickname: "ELIONFLOY",
      url: "/dany-booy",
      fullUrl: "https://soundcloud.com/dany-booy",
    },
    {
      nickname: "Dj Lindsey Ward",
      url: "/djlindseyward",
      fullUrl: "https://soundcloud.com/djlindseyward",
    },
    {
      nickname: "RPD",
      url: "/rpd1996",
      fullUrl: "https://soundcloud.com/rpd1996",
    },
    {
      nickname: "Shishkaveli",
      url: "/qvor-shishkow",
      fullUrl: "https://soundcloud.com/qvor-shishkow",
    },
    {
      nickname: "erin page",
      url: "/erinpagemusic",
      fullUrl: "https://soundcloud.com/erinpagemusic",
    },
    {
      nickname: "T DIZZLE",
      url: "/djtonydizzle",
      fullUrl: "https://soundcloud.com/djtonydizzle",
    },
    {
      nickname: "Skanda Subramanya",
      url: "/skanda-subramanya",
      fullUrl: "https://soundcloud.com/skanda-subramanya",
    },
    {
      nickname: "Grilloz",
      url: "/raffaelegrillo683",
      fullUrl: "https://soundcloud.com/raffaelegrillo683",
    },
    {
      nickname: "roko",
      url: "/rokodj",
      fullUrl: "https://soundcloud.com/rokodj",
    },
    {
      nickname: "Dave Henke",
      url: "/davehenke",
      fullUrl: "https://soundcloud.com/davehenke",
    },
    {
      nickname: "Ravid Pillard",
      url: "/user8553726-ravid",
      fullUrl: "https://soundcloud.com/user8553726-ravid",
    },
    {
      nickname: "Gepetto de Bornivax",
      url: "/gepetto-de-bornivax",
      fullUrl: "https://soundcloud.com/gepetto-de-bornivax",
    },
    {
      nickname: "DJ DESTRUCTION",
      url: "/djdestructionuk",
      fullUrl: "https://soundcloud.com/djdestructionuk",
    },
    {
      nickname: "Francesca🖤",
      url: "/francescajbennetts",
      fullUrl: "https://soundcloud.com/francescajbennetts",
    },
    {
      nickname: "@Mozza",
      url: "/arronmorrison",
      fullUrl: "https://soundcloud.com/arronmorrison",
    },
    {
      nickname: "PHANIE",
      url: "/stefania-sevilla",
      fullUrl: "https://soundcloud.com/stefania-sevilla",
    },
    {
      nickname: "spcemom",
      url: "/valeria-valencia-589951143",
      fullUrl: "https://soundcloud.com/valeria-valencia-589951143",
    },
    {
      nickname: "TXNK",
      url: "/txnkmix",
      fullUrl: "https://soundcloud.com/txnkmix",
    },
    {
      nickname: "Terenti G",
      url: "/terenti-g",
      fullUrl: "https://soundcloud.com/terenti-g",
    },
    {
      nickname: "Mark Blagden",
      url: "/mark-blagden",
      fullUrl: "https://soundcloud.com/mark-blagden",
    },
    {
      nickname: "Daniosso",
      url: "/daniosso",
      fullUrl: "https://soundcloud.com/daniosso",
    },
    {
      nickname: "Jenna Hardcore Raver",
      url: "/user-108232454-883616566",
      fullUrl: "https://soundcloud.com/user-108232454-883616566",
    },
    {
      nickname: "Nathan Taylor",
      url: "/nathan-taylor-664113893",
      fullUrl: "https://soundcloud.com/nathan-taylor-664113893",
    },
    {
      nickname: "D.lapaityte ✅",
      url: "/dovile-780192326",
      fullUrl: "https://soundcloud.com/dovile-780192326",
    },
    {
      nickname: "Andressa Torinelli",
      url: "/andressa-torinelli",
      fullUrl: "https://soundcloud.com/andressa-torinelli",
    },
    {
      nickname: "Húneed",
      url: "/huneed",
      fullUrl: "https://soundcloud.com/huneed",
    },
    {
      nickname: "MKav",
      url: "/mkavmusic",
      fullUrl: "https://soundcloud.com/mkavmusic",
    },
    {
      nickname: "MAGO DI",
      url: "/mago-di-diogo-aratanha",
      fullUrl: "https://soundcloud.com/mago-di-diogo-aratanha",
    },
    {
      nickname: "andrii kovb",
      url: "/andrii-kovb",
      fullUrl: "https://soundcloud.com/andrii-kovb",
    },
    {
      nickname: "LH x",
      url: "/lorna-smith-12",
      fullUrl: "https://soundcloud.com/lorna-smith-12",
    },
    {
      nickname: "nineteen79",
      url: "/nineteen79nz",
      fullUrl: "https://soundcloud.com/nineteen79nz",
    },
    {
      nickname: "Synth opera",
      url: "/eftoslovelybooks",
      fullUrl: "https://soundcloud.com/eftoslovelybooks",
    },
    {
      nickname: "Rami’s Jam",
      url: "/rami-chamseddine",
      fullUrl: "https://soundcloud.com/rami-chamseddine",
    },
    {
      nickname: "Folaoide",
      url: "/folaoide",
      fullUrl: "https://soundcloud.com/folaoide",
    },
    {
      nickname: "kush_d_choons",
      url: "/kush-d-1",
      fullUrl: "https://soundcloud.com/kush-d-1",
    },
    {
      nickname: "Jack",
      url: "/user-59701598",
      fullUrl: "https://soundcloud.com/user-59701598",
    },
    {
      nickname: "Rafael Renault",
      url: "/rafael-renault",
      fullUrl: "https://soundcloud.com/rafael-renault",
    },
    {
      nickname: "Ash Hughes",
      url: "/ash_hughes",
      fullUrl: "https://soundcloud.com/ash_hughes",
    },
    {
      nickname: "Tasha_🖤",
      url: "/natasha-ralph",
      fullUrl: "https://soundcloud.com/natasha-ralph",
    },
    {
      nickname: "BAKAGAINFORTRANCE",
      url: "/angelobak74",
      fullUrl: "https://soundcloud.com/angelobak74",
    },
    {
      nickname: "DeeJ-ARMAVandross🍒",
      url: "/juliane-fd-arma-leriche",
      fullUrl: "https://soundcloud.com/juliane-fd-arma-leriche",
    },
    {
      nickname: "Julz",
      url: "/user-815012603",
      fullUrl: "https://soundcloud.com/user-815012603",
    },
    {
      nickname: "Jamie Gibson 13",
      url: "/jamie-gibson-18",
      fullUrl: "https://soundcloud.com/jamie-gibson-18",
    },
    {
      nickname: "Freak-When-See",
      url: "/rec-luse",
      fullUrl: "https://soundcloud.com/rec-luse",
    },
    {
      nickname: "Mama p",
      url: "/mama-p-363014430",
      fullUrl: "https://soundcloud.com/mama-p-363014430",
    },
    {
      nickname: "DJ-MORTY",
      url: "/djmorty94",
      fullUrl: "https://soundcloud.com/djmorty94",
    },
    {
      nickname: "DJ MONTY",
      url: "/thedjmonty",
      fullUrl: "https://soundcloud.com/thedjmonty",
    },
    {
      nickname: "#IAMHARDSTYLE#",
      url: "/terry-darby-180229401",
      fullUrl: "https://soundcloud.com/terry-darby-180229401",
    },
    {
      nickname: "James Will",
      url: "/jameswillmusic",
      fullUrl: "https://soundcloud.com/jameswillmusic",
    },
    {
      nickname: "Fran_Dunne",
      url: "/fran_dunne",
      fullUrl: "https://soundcloud.com/fran_dunne",
    },
    {
      nickname: "Jenny AdReNaLiN",
      url: "/adrenalin-3",
      fullUrl: "https://soundcloud.com/adrenalin-3",
    },
    {
      nickname: "Johnny_guevara_23",
      url: "/user-17180547",
      fullUrl: "https://soundcloud.com/user-17180547",
    },
    {
      nickname: "DN3",
      url: "/robert-nelson-844320313",
      fullUrl: "https://soundcloud.com/robert-nelson-844320313",
    },
    {
      nickname: "Donna Delta",
      url: "/donna-marrie-jenkins",
      fullUrl: "https://soundcloud.com/donna-marrie-jenkins",
    },
    {
      nickname: "LE-DAMØN",
      url: "/le-damon-975102369",
      fullUrl: "https://soundcloud.com/le-damon-975102369",
    },
    {
      nickname: "AndyDougall",
      url: "/djandydougall",
      fullUrl: "https://soundcloud.com/djandydougall",
    },
    {
      nickname: "MS84",
      url: "/e-bass84",
      fullUrl: "https://soundcloud.com/e-bass84",
    },
    {
      nickname: "Kirsty McKendry",
      url: "/user-266863031",
      fullUrl: "https://soundcloud.com/user-266863031",
    },
    {
      nickname: "NSEVØ",
      url: "/nathan-1994",
      fullUrl: "https://soundcloud.com/nathan-1994",
    },
    {
      nickname: "dj frankie/  loving life ♥️",
      url: "/jayfrankie1234",
      fullUrl: "https://soundcloud.com/jayfrankie1234",
    },
    {
      nickname: "Bruno Kennedy",
      url: "/bruno-kennedy-2",
      fullUrl: "https://soundcloud.com/bruno-kennedy-2",
    },
    {
      nickname: "Benjii",
      url: "/benjiofficial2014",
      fullUrl: "https://soundcloud.com/benjiofficial2014",
    },
    {
      nickname: "Chrisy McGregør☠️™️🙅🏼‍♂️🏴󠁧󠁢󠁳󠁣󠁴󠁿⭐️⭐️⭐️⭐️⭐️🔴⚪️🔵🇬🇧",
      url: "/chrisy-mcgregor",
      fullUrl: "https://soundcloud.com/chrisy-mcgregor",
    },
    {
      nickname: "Gerald Hackspill",
      url: "/geraldhackspill",
      fullUrl: "https://soundcloud.com/geraldhackspill",
    },
    {
      nickname: "Danielo_Vegas/DjSilver_official",
      url: "/harrisandfordmegamix",
      fullUrl: "https://soundcloud.com/harrisandfordmegamix",
    },
    {
      nickname: "Frank DJ Champ Gismondi",
      url: "/frank-gismondi",
      fullUrl: "https://soundcloud.com/frank-gismondi",
    },
    {
      nickname: "XTK",
      url: "/oscar-flores-558662478",
      fullUrl: "https://soundcloud.com/oscar-flores-558662478",
    },
    {
      nickname: "Kowalltekk",
      url: "/martin-kowallek-786465104",
      fullUrl: "https://soundcloud.com/martin-kowallek-786465104",
    },
    {
      nickname: "Daioos",
      url: "/meshach-dirosh",
      fullUrl: "https://soundcloud.com/meshach-dirosh",
    },
    {
      nickname: "Joaquin Ignacio Quintúl",
      url: "/joaquin-ignacio-carrasco-quintul",
      fullUrl: "https://soundcloud.com/joaquin-ignacio-carrasco-quintul",
    },
    {
      nickname: "Fell dj A.K.A tranc dj",
      url: "/xuko_85",
      fullUrl: "https://soundcloud.com/xuko_85",
    },
    {
      nickname: "Dispas",
      url: "/dispas",
      fullUrl: "https://soundcloud.com/dispas",
    },
    {
      nickname: "scottie",
      url: "/raequwon-scott",
      fullUrl: "https://soundcloud.com/raequwon-scott",
    },
    {
      nickname: "L'kayne",
      url: "/lkayne",
      fullUrl: "https://soundcloud.com/lkayne",
    },
    {
      nickname: "DJ Allegro",
      url: "/dannybatten",
      fullUrl: "https://soundcloud.com/dannybatten",
    },
    {
      nickname: "Disco fuka",
      url: "/user-58858953",
      fullUrl: "https://soundcloud.com/user-58858953",
    },
    {
      nickname: "Bastian Oyarzún",
      url: "/bastian-nama",
      fullUrl: "https://soundcloud.com/bastian-nama",
    },
    {
      nickname: "NIEMALSSCHLAF",
      url: "/niemalsschlaf-techno",
      fullUrl: "https://soundcloud.com/niemalsschlaf-techno",
    },
    {
      nickname: "909 UK",
      url: "/barry-paul-walsh",
      fullUrl: "https://soundcloud.com/barry-paul-walsh",
    },
    {
      nickname: "Syd Hndrx",
      url: "/sydhndrx",
      fullUrl: "https://soundcloud.com/sydhndrx",
    },
    {
      nickname: "BOUNC",
      url: "/bouncmusic",
      fullUrl: "https://soundcloud.com/bouncmusic",
    },
    {
      nickname: "HalfBad",
      url: "/halfbad_wav",
      fullUrl: "https://soundcloud.com/halfbad_wav",
    },
    {
      nickname: "LEOSILVA",
      url: "/ls-2110",
      fullUrl: "https://soundcloud.com/ls-2110",
    },
    {
      nickname: "Pretty-Bambii",
      url: "/nora-hotbambina",
      fullUrl: "https://soundcloud.com/nora-hotbambina",
    },
    {
      nickname: "PHOSTECH",
      url: "/phostechmusic",
      fullUrl: "https://soundcloud.com/phostechmusic",
    },
    {
      nickname: "DJ Tyler Osborne",
      url: "/djtylerosborne",
      fullUrl: "https://soundcloud.com/djtylerosborne",
    },
    {
      nickname: "Ryanhughes1790",
      url: "/r-hugh90",
      fullUrl: "https://soundcloud.com/r-hugh90",
    },
    {
      nickname: "TECHence Hill a.k.a. Fresh Limoncello",
      url: "/dome_nico040",
      fullUrl: "https://soundcloud.com/dome_nico040",
    },
    {
      nickname: "Mr Monks",
      url: "/tom-m-3",
      fullUrl: "https://soundcloud.com/tom-m-3",
    },
    {
      nickname: "AnxLib",
      url: "/no_n_yes",
      fullUrl: "https://soundcloud.com/no_n_yes",
    },
    {
      nickname: "Luciano Piras",
      url: "/luciano-piras",
      fullUrl: "https://soundcloud.com/luciano-piras",
    },
    {
      nickname: "lizaka",
      url: "/lizakka",
      fullUrl: "https://soundcloud.com/lizakka",
    },
    {
      nickname: "DJ LUCKY(OFFICIAL)",
      url: "/broadhurstste",
      fullUrl: "https://soundcloud.com/broadhurstste",
    },
    {
      nickname: "𝕶𝖎𝖒𝖇𝖊𝖗𝖑𝖞✨",
      url: "/user1980483",
      fullUrl: "https://soundcloud.com/user1980483",
    },
    {
      nickname: "Dj Benny Hill",
      url: "/djbennyjaminn",
      fullUrl: "https://soundcloud.com/djbennyjaminn",
    },
    {
      nickname: "Tommy. gunn44 Bond",
      url: "/tommy-bond-112302231",
      fullUrl: "https://soundcloud.com/tommy-bond-112302231",
    },
    {
      nickname: "DJ Neighbor",
      url: "/neighborthedj",
      fullUrl: "https://soundcloud.com/neighborthedj",
    },
    {
      nickname: "Jaçinto",
      url: "/dj_jacinto",
      fullUrl: "https://soundcloud.com/dj_jacinto",
    },
    {
      nickname: "Manu(ela)😎",
      url: "/user-720054828",
      fullUrl: "https://soundcloud.com/user-720054828",
    },
    {
      nickname: "Mike Griffiths",
      url: "/mike-griffiths-138603260",
      fullUrl: "https://soundcloud.com/mike-griffiths-138603260",
    },
    {
      nickname: "IN THE DARK",
      url: "/inthedarksound",
      fullUrl: "https://soundcloud.com/inthedarksound",
    },
    {
      nickname: "Janet Feranmi",
      url: "/janet-feranmi-66987384",
      fullUrl: "https://soundcloud.com/janet-feranmi-66987384",
    },
    {
      nickname: "DV8",
      url: "/user-993916183",
      fullUrl: "https://soundcloud.com/user-993916183",
    },
    {
      nickname: "Alex Morris",
      url: "/alex-morris-840959154",
      fullUrl: "https://soundcloud.com/alex-morris-840959154",
    },
    {
      nickname: "Alan Higgo",
      url: "/user-45960023",
      fullUrl: "https://soundcloud.com/user-45960023",
    },
    {
      nickname: "BassBrotherhood✪",
      url: "/bassbrotherhood",
      fullUrl: "https://soundcloud.com/bassbrotherhood",
    },
    {
      nickname: "DerKRoXx (Derekmtwilcox)",
      url: "/derkroxxmusic",
      fullUrl: "https://soundcloud.com/derkroxxmusic",
    },
    {
      nickname: "JHAKK",
      url: "/jake-walsh-243620372",
      fullUrl: "https://soundcloud.com/jake-walsh-243620372",
    },
    {
      nickname: "Williams Clifford",
      url: "/williams-clifford-808002666",
      fullUrl: "https://soundcloud.com/williams-clifford-808002666",
    },
    {
      nickname: "user281981355 JOE D",
      url: "/user281981355-joe-d",
      fullUrl: "https://soundcloud.com/user281981355-joe-d",
    },
    {
      nickname: "BornToRage KP",
      url: "/btr-kp",
      fullUrl: "https://soundcloud.com/btr-kp",
    },
    {
      nickname: "🖤Tienna/Loona🖤",
      url: "/tienna-medeiros",
      fullUrl: "https://soundcloud.com/tienna-medeiros",
    },
    {
      nickname: "Malediven-Open-Air",
      url: "/tobias-thatje-366932509",
      fullUrl: "https://soundcloud.com/tobias-thatje-366932509",
    },
    {
      nickname: "gavin.c podgecast",
      url: "/gavin-c",
      fullUrl: "https://soundcloud.com/gavin-c",
    },
    {
      nickname: "My CaTo",
      url: "/user-90310331",
      fullUrl: "https://soundcloud.com/user-90310331",
    },
    {
      nickname: "Art 'n groov",
      url: "/artngroov",
      fullUrl: "https://soundcloud.com/artngroov",
    },
    {
      nickname: "Ivan Martinez(MEX)",
      url: "/ivan-martinez-850893659",
      fullUrl: "https://soundcloud.com/ivan-martinez-850893659",
    },
    {
      nickname: "SELESTIAL BEINGS",
      url: "/selestialbeings",
      fullUrl: "https://soundcloud.com/selestialbeings",
    },
    {
      nickname: "I3eatcode",
      url: "/i3eatcode",
      fullUrl: "https://soundcloud.com/i3eatcode",
    },
    {
      nickname: "Jaredita",
      url: "/user971502704",
      fullUrl: "https://soundcloud.com/user971502704",
    },
    {
      nickname: "Beetlecomet24",
      url: "/beetlecomet24",
      fullUrl: "https://soundcloud.com/beetlecomet24",
    },
    {
      nickname: "Terry Murphy",
      url: "/user737356424",
      fullUrl: "https://soundcloud.com/user737356424",
    },
    {
      nickname: "Richard Braxton",
      url: "/richarbraxton",
      fullUrl: "https://soundcloud.com/richarbraxton",
    },
    {
      nickname: "BELM",
      url: "/belmofficial",
      fullUrl: "https://soundcloud.com/belmofficial",
    },
    {
      nickname: "Deech",
      url: "/francesco-lombardo-9",
      fullUrl: "https://soundcloud.com/francesco-lombardo-9",
    },
    {
      nickname: "Dejan Jorgacevic",
      url: "/dejan-jorgacevic",
      fullUrl: "https://soundcloud.com/dejan-jorgacevic",
    },
    {
      nickname: "Will Stanton (@notwillstanton)",
      url: "/will-stanton-1919",
      fullUrl: "https://soundcloud.com/will-stanton-1919",
    },
    {
      nickname: "kargos",
      url: "/carg0s",
      fullUrl: "https://soundcloud.com/carg0s",
    },
    {
      nickname: "Marcella DJ",
      url: "/marcella-mm",
      fullUrl: "https://soundcloud.com/marcella-mm",
    },
    {
      nickname: "chiitake.fungi",
      url: "/chaitanya-talegaonkar-25430952",
      fullUrl: "https://soundcloud.com/chaitanya-talegaonkar-25430952",
    },
    {
      nickname: "collapsicon",
      url: "/collapsicon",
      fullUrl: "https://soundcloud.com/collapsicon",
    },
    {
      nickname: "Duby 87",
      url: "/duby-87",
      fullUrl: "https://soundcloud.com/duby-87",
    },
    {
      nickname: "❤️‍🔥Mukke_Mit_Herz❤️‍🔥",
      url: "/mukke_mit_herz",
      fullUrl: "https://soundcloud.com/mukke_mit_herz",
    },
    {
      nickname: "EddLee",
      url: "/eddlee",
      fullUrl: "https://soundcloud.com/eddlee",
    },
    {
      nickname: "Renan Ignácio",
      url: "/renan-ign-cio",
      fullUrl: "https://soundcloud.com/renan-ign-cio",
    },
    {
      nickname: "DJG & MIK!",
      url: "/djg_mik",
      fullUrl: "https://soundcloud.com/djg_mik",
    },
    {
      nickname: "Amijke Marado",
      url: "/amijkeramado",
      fullUrl: "https://soundcloud.com/amijkeramado",
    },
    {
      nickname: "B.Wayne NYC",
      url: "/bwayne_nyc",
      fullUrl: "https://soundcloud.com/bwayne_nyc",
    },
    {
      nickname: "オ",
      url: "/olo-rin",
      fullUrl: "https://soundcloud.com/olo-rin",
    },
    {
      nickname: "SOLOBRO",
      url: "/solo-bro",
      fullUrl: "https://soundcloud.com/solo-bro",
    },
    {
      nickname: "Guillaume Debo",
      url: "/debo3752",
      fullUrl: "https://soundcloud.com/debo3752",
    },
    {
      nickname: "Cosmen",
      url: "/cosmen88",
      fullUrl: "https://soundcloud.com/cosmen88",
    },
    {
      nickname: "Pig Snatchers",
      url: "/pig-snatchers",
      fullUrl: "https://soundcloud.com/pig-snatchers",
    },
    {
      nickname: "DJ LEO EN EL PARAISO",
      url: "/djleo2024",
      fullUrl: "https://soundcloud.com/djleo2024",
    },
    {
      nickname: "GABRIEL NAZKA",
      url: "/gabrielnazka",
      fullUrl: "https://soundcloud.com/gabrielnazka",
    },
    {
      nickname: "DJ #SamuelONE3",
      url: "/djsamone3",
      fullUrl: "https://soundcloud.com/djsamone3",
    },
    {
      nickname: "D8th",
      url: "/d8th",
      fullUrl: "https://soundcloud.com/d8th",
    },
    {
      nickname: "Deep House Only Radio",
      url: "/dream-line-records",
      fullUrl: "https://soundcloud.com/dream-line-records",
    },
    {
      nickname: "QueuedMusic",
      url: "/sharique",
      fullUrl: "https://soundcloud.com/sharique",
    },
    {
      nickname: "Agustín Soto",
      url: "/agustin-soto-2",
      fullUrl: "https://soundcloud.com/agustin-soto-2",
    },
    {
      nickname: "jetsol",
      url: "/soleilj",
      fullUrl: "https://soundcloud.com/soleilj",
    },
    {
      nickname: "Authenticity",
      url: "/buckleuphuntsman",
      fullUrl: "https://soundcloud.com/buckleuphuntsman",
    },
    {
      nickname: "groovy ahmad",
      url: "/ahmad-orabi-514572741",
      fullUrl: "https://soundcloud.com/ahmad-orabi-514572741",
    },
    {
      nickname: "Floyo",
      url: "/florian-pelivani-floyo",
      fullUrl: "https://soundcloud.com/florian-pelivani-floyo",
    },
    {
      nickname: "PABLO MONTES",
      url: "/pablo-montes-15",
      fullUrl: "https://soundcloud.com/pablo-montes-15",
    },
    {
      nickname: "IF I WAS",
      url: "/ifiwasmusic",
      fullUrl: "https://soundcloud.com/ifiwasmusic",
    },
    {
      nickname: "Tom S.",
      url: "/tom-straub",
      fullUrl: "https://soundcloud.com/tom-straub",
    },
    {
      nickname: "GuessChicago (Rezon8events)",
      url: "/edwin-viteri-1",
      fullUrl: "https://soundcloud.com/edwin-viteri-1",
    },
    {
      nickname: "Sr. Mosi",
      url: "/mosi-official",
      fullUrl: "https://soundcloud.com/mosi-official",
    },
    {
      nickname: "s.i.m.o.n.s.i.t.a",
      url: "/cassey-7",
      fullUrl: "https://soundcloud.com/cassey-7",
    },
    {
      nickname: "AASSI",
      url: "/aassi",
      fullUrl: "https://soundcloud.com/aassi",
    },
    {
      nickname: "In The Mix At 6",
      url: "/inthemixat6",
      fullUrl: "https://soundcloud.com/inthemixat6",
    },
    {
      nickname: "dj avi mishan",
      url: "/avi-mishan",
      fullUrl: "https://soundcloud.com/avi-mishan",
    },
    {
      nickname: "Andy Fryer",
      url: "/fryer-1",
      fullUrl: "https://soundcloud.com/fryer-1",
    },
    {
      nickname: "Adriik",
      url: "/adrian-rocha-781371774",
      fullUrl: "https://soundcloud.com/adrian-rocha-781371774",
    },
    {
      nickname: "Brannon Casey",
      url: "/user846375918",
      fullUrl: "https://soundcloud.com/user846375918",
    },
    {
      nickname: "Sean Pierre",
      url: "/sean-pierre-449385982",
      fullUrl: "https://soundcloud.com/sean-pierre-449385982",
    },
    {
      nickname: "guillaume peix",
      url: "/phakobill",
      fullUrl: "https://soundcloud.com/phakobill",
    },
    {
      nickname: "ESER (TR)(FR)",
      url: "/eserk",
      fullUrl: "https://soundcloud.com/eserk",
    },
    {
      nickname: "Sukka_Punch74",
      url: "/christopher-b-cesko",
      fullUrl: "https://soundcloud.com/christopher-b-cesko",
    },
    {
      nickname: "Robin Snackers (a.K.a. tHEmAInMoTheRsNackeR)",
      url: "/themainmothersnacker",
      fullUrl: "https://soundcloud.com/themainmothersnacker",
    },
    {
      nickname: "Pablo Martin",
      url: "/pabllomartin",
      fullUrl: "https://soundcloud.com/pabllomartin",
    },
    {
      nickname: "DJ Peter K",
      url: "/piotr-kowalski-777414916",
      fullUrl: "https://soundcloud.com/piotr-kowalski-777414916",
    },
    {
      nickname: "Mickey Goldcoaster",
      url: "/mickeygoldcoaster",
      fullUrl: "https://soundcloud.com/mickeygoldcoaster",
    },
    {
      nickname: "wilmar",
      url: "/pirulito-wiillmar",
      fullUrl: "https://soundcloud.com/pirulito-wiillmar",
    },
    {
      nickname: "DJ@LT",
      url: "/user-205367302",
      fullUrl: "https://soundcloud.com/user-205367302",
    },
    {
      nickname: "MY PLANET RECORDS",
      url: "/myplanetrecords",
      fullUrl: "https://soundcloud.com/myplanetrecords",
    },
    {
      nickname: "emkoblues.official",
      url: "/emkoblues-official",
      fullUrl: "https://soundcloud.com/emkoblues-official",
    },
    {
      nickname: "David Wathier.",
      url: "/david-wathier",
      fullUrl: "https://soundcloud.com/david-wathier",
    },
    {
      nickname: "ROGERAGUIA",
      url: "/rogeriovaldirdonascimento",
      fullUrl: "https://soundcloud.com/rogeriovaldirdonascimento",
    },
    {
      nickname: "madgab",
      url: "/madgab808",
      fullUrl: "https://soundcloud.com/madgab808",
    },
    {
      nickname: "KILO",
      url: "/djkilo_official",
      fullUrl: "https://soundcloud.com/djkilo_official",
    },
    {
      nickname: "patobwai",
      url: "/novahiwa-kaipa",
      fullUrl: "https://soundcloud.com/novahiwa-kaipa",
    },
    {
      nickname: "Dëmian Vel",
      url: "/demian-veleda",
      fullUrl: "https://soundcloud.com/demian-veleda",
    },
    {
      nickname: "NEL",
      url: "/nelartt",
      fullUrl: "https://soundcloud.com/nelartt",
    },
    {
      nickname: "Paul Herdman",
      url: "/paulherdman",
      fullUrl: "https://soundcloud.com/paulherdman",
    },
    {
      nickname: "vkal",
      url: "/user-859561061",
      fullUrl: "https://soundcloud.com/user-859561061",
    },
    {
      nickname: "DLaCuesta",
      url: "/delacuesta87",
      fullUrl: "https://soundcloud.com/delacuesta87",
    },
    {
      nickname: "Lukas Benci",
      url: "/lukasbenci",
      fullUrl: "https://soundcloud.com/lukasbenci",
    },
    {
      nickname: "macgueryy",
      url: "/macgueryy",
      fullUrl: "https://soundcloud.com/macgueryy",
    },
    {
      nickname: "Leonety",
      url: "/leonety_music",
      fullUrl: "https://soundcloud.com/leonety_music",
    },
    {
      nickname: "Furcy",
      url: "/rems-doo",
      fullUrl: "https://soundcloud.com/rems-doo",
    },
    {
      nickname: "coxon",
      url: "/jimcoxon",
      fullUrl: "https://soundcloud.com/jimcoxon",
    },
    {
      nickname: "CeZco",
      url: "/housecezco",
      fullUrl: "https://soundcloud.com/housecezco",
    },
    {
      nickname: "el_ga4o.2",
      url: "/aleksandr-gaevish",
      fullUrl: "https://soundcloud.com/aleksandr-gaevish",
    },
    {
      nickname: "RAVAGE",
      url: "/user-581829537",
      fullUrl: "https://soundcloud.com/user-581829537",
    },
    {
      nickname: "C.R.P.",
      url: "/surcio007",
      fullUrl: "https://soundcloud.com/surcio007",
    },
    {
      nickname: "Amy Johnson",
      url: "/amy-johnson-298919253",
      fullUrl: "https://soundcloud.com/amy-johnson-298919253",
    },
    {
      nickname: "Genesis.Music",
      url: "/prescilla-urquidi",
      fullUrl: "https://soundcloud.com/prescilla-urquidi",
    },
    {
      nickname: "KLAY_WILL",
      url: "/clayton-l-j-williams",
      fullUrl: "https://soundcloud.com/clayton-l-j-williams",
    },
    {
      nickname: "Melissa Vergara 3",
      url: "/melissa-vergara-2",
      fullUrl: "https://soundcloud.com/melissa-vergara-2",
    },
    {
      nickname: "Oliver Osti",
      url: "/oliverosti",
      fullUrl: "https://soundcloud.com/oliverosti",
    },
    {
      nickname: "NOVA [IT]",
      url: "/novamusicit",
      fullUrl: "https://soundcloud.com/novamusicit",
    },
    {
      nickname: "Giovane Foltran",
      url: "/giovane-foltran",
      fullUrl: "https://soundcloud.com/giovane-foltran",
    },
    {
      nickname: "Benno_B[ass]",
      url: "/benno_b",
      fullUrl: "https://soundcloud.com/benno_b",
    },
    {
      nickname: "Mintyfressh",
      url: "/stephen-minter-464015609",
      fullUrl: "https://soundcloud.com/stephen-minter-464015609",
    },
    {
      nickname: "TheUnheardOfDJ",
      url: "/theunheardofdj",
      fullUrl: "https://soundcloud.com/theunheardofdj",
    },
    {
      nickname: "Dreambɘatz",
      url: "/timarroland",
      fullUrl: "https://soundcloud.com/timarroland",
    },
    {
      nickname: "USAM",
      url: "/user342069563",
      fullUrl: "https://soundcloud.com/user342069563",
    },
    {
      nickname: "Clavie",
      url: "/clavie666",
      fullUrl: "https://soundcloud.com/clavie666",
    },
    {
      nickname: "ELEM3NTS",
      url: "/officialelem3ntsmusic",
      fullUrl: "https://soundcloud.com/officialelem3ntsmusic",
    },
    {
      nickname: "Ravmusicdj",
      url: "/ravmusicdj-54610847",
      fullUrl: "https://soundcloud.com/ravmusicdj-54610847",
    },
    {
      nickname: "LAIRD",
      url: "/roblairddj",
      fullUrl: "https://soundcloud.com/roblairddj",
    },
    {
      nickname: "F.U DJ",
      url: "/huribemendez",
      fullUrl: "https://soundcloud.com/huribemendez",
    },
    {
      nickname: "djuank",
      url: "/jhon-charles-geven",
      fullUrl: "https://soundcloud.com/jhon-charles-geven",
    },
    {
      nickname: "BRENO",
      url: "/breno-luis-493105139",
      fullUrl: "https://soundcloud.com/breno-luis-493105139",
    },
    {
      nickname: "Liz Dreher",
      url: "/liz-dreher",
      fullUrl: "https://soundcloud.com/liz-dreher",
    },
    {
      nickname: "Silvia More",
      url: "/silviamore",
      fullUrl: "https://soundcloud.com/silviamore",
    },
    {
      nickname: "CSAD",
      url: "/christian-sadler-2",
      fullUrl: "https://soundcloud.com/christian-sadler-2",
    },
    {
      nickname: "TiTi",
      url: "/thierrynguyen",
      fullUrl: "https://soundcloud.com/thierrynguyen",
    },
    {
      nickname: "Edoo",
      url: "/eduardons",
      fullUrl: "https://soundcloud.com/eduardons",
    },
    {
      nickname: "Amozon",
      url: "/amozonwarrior",
      fullUrl: "https://soundcloud.com/amozonwarrior",
    },
    {
      nickname: "𝓔𝓵 𝓷𝓲ñ𝓸 🧒🏻‼",
      url: "/cesar-gomez-417763891",
      fullUrl: "https://soundcloud.com/cesar-gomez-417763891",
    },
    {
      nickname: "Balenciaga musik",
      url: "/nozipho-majuqulwana",
      fullUrl: "https://soundcloud.com/nozipho-majuqulwana",
    },
    {
      nickname: "Y-NOT?🌀",
      url: "/y-not-official",
      fullUrl: "https://soundcloud.com/y-not-official",
    },
    {
      nickname: "AM!CO",
      url: "/c_amico",
      fullUrl: "https://soundcloud.com/c_amico",
    },
    {
      nickname: "RAFAEL MEDINA",
      url: "/rafael_vm",
      fullUrl: "https://soundcloud.com/rafael_vm",
    },
    {
      nickname: "L I S A ||",
      url: "/djingsince1995",
      fullUrl: "https://soundcloud.com/djingsince1995",
    },
    {
      nickname: "Whiteout",
      url: "/eftosice",
      fullUrl: "https://soundcloud.com/eftosice",
    },
    {
      nickname: "ʙᴇʏᴏɴᴅ ʀᴀᴅɪᴏ",
      url: "/beyond_radio",
      fullUrl: "https://soundcloud.com/beyond_radio",
    },
    {
      nickname: "Mission Bass",
      url: "/james-macduff",
      fullUrl: "https://soundcloud.com/james-macduff",
    },
    {
      nickname: "Ostos",
      url: "/ostosbro",
      fullUrl: "https://soundcloud.com/ostosbro",
    },
    {
      nickname: "ARYO",
      url: "/aryo_music",
      fullUrl: "https://soundcloud.com/aryo_music",
    },
    {
      nickname: "Kevin McGrath",
      url: "/kevin-mcgrath-171856455",
      fullUrl: "https://soundcloud.com/kevin-mcgrath-171856455",
    },
    {
      nickname: "Phá Gia Chi Tử",
      url: "/ph-gia-chi-t-137393043",
      fullUrl: "https://soundcloud.com/ph-gia-chi-t-137393043",
    },
    {
      nickname: "LARIOS",
      url: "/lariostakinardy",
      fullUrl: "https://soundcloud.com/lariostakinardy",
    },
    {
      nickname: "flaxos",
      url: "/flaxos",
      fullUrl: "https://soundcloud.com/flaxos",
    },
    {
      nickname: "Whitenoise",
      url: "/bogdan-vasilenco",
      fullUrl: "https://soundcloud.com/bogdan-vasilenco",
    },
    {
      nickname: "DJ ROGY",
      url: "/flora-kelvin",
      fullUrl: "https://soundcloud.com/flora-kelvin",
    },
    {
      nickname: "Q",
      url: "/quinten-05-81",
      fullUrl: "https://soundcloud.com/quinten-05-81",
    },
    {
      nickname: "Nalitta AL-Deibany",
      url: "/manal-deibany",
      fullUrl: "https://soundcloud.com/manal-deibany",
    },
    {
      nickname: "Heather Effie",
      url: "/heather-effie",
      fullUrl: "https://soundcloud.com/heather-effie",
    },
    {
      nickname: "Stixxer",
      url: "/stixxer-821472390",
      fullUrl: "https://soundcloud.com/stixxer-821472390",
    },
    {
      nickname: "ZwiebelVONallenWelten",
      url: "/bettnachbarin",
      fullUrl: "https://soundcloud.com/bettnachbarin",
    },
    {
      nickname: "S A M P A T",
      url: "/samuel-patte",
      fullUrl: "https://soundcloud.com/samuel-patte",
    },
    {
      nickname: "Nico Rodriguez (UY)",
      url: "/slooow_sounds",
      fullUrl: "https://soundcloud.com/slooow_sounds",
    },
    {
      nickname: "bendit-kneppdrigger-DDJ-400",
      url: "/theis-ben",
      fullUrl: "https://soundcloud.com/theis-ben",
    },
    {
      nickname: "KARAERKEKmusic",
      url: "/canberk-karaerkek",
      fullUrl: "https://soundcloud.com/canberk-karaerkek",
    },
    {
      nickname: "ZEUS.ZERØ",
      url: "/zeuszero",
      fullUrl: "https://soundcloud.com/zeuszero",
    },
    {
      nickname: "Moc",
      url: "/tom-moc-935273494",
      fullUrl: "https://soundcloud.com/tom-moc-935273494",
    },
    {
      nickname: "DJ NAMÜ",
      url: "/namsq",
      fullUrl: "https://soundcloud.com/namsq",
    },
    {
      nickname: "DIABLO’s Music!!✨",
      url: "/jessie-rodriquez",
      fullUrl: "https://soundcloud.com/jessie-rodriquez",
    },
    {
      nickname: "Global House",
      url: "/globalhouse1",
      fullUrl: "https://soundcloud.com/globalhouse1",
    },
    {
      nickname: "Muhammed",
      url: "/muhammeddeshina",
      fullUrl: "https://soundcloud.com/muhammeddeshina",
    },
    {
      nickname: "daywalkker",
      url: "/daywalkker",
      fullUrl: "https://soundcloud.com/daywalkker",
    },
    {
      nickname: "Rwert",
      url: "/rwert",
      fullUrl: "https://soundcloud.com/rwert",
    },
    {
      nickname: "jeeqkyle7",
      url: "/jeeq-kylez",
      fullUrl: "https://soundcloud.com/jeeq-kylez",
    },
    {
      nickname: "ANDY CHANCE",
      url: "/andychance",
      fullUrl: "https://soundcloud.com/andychance",
    },
    {
      nickname: "KMO STYLE",
      url: "/kevin-748583660",
      fullUrl: "https://soundcloud.com/kevin-748583660",
    },
    {
      nickname: "Any.LerDJ",
      url: "/vll-877411070",
      fullUrl: "https://soundcloud.com/vll-877411070",
    },
    {
      nickname: "Chops Nguyen",
      url: "/chops-nguyen",
      fullUrl: "https://soundcloud.com/chops-nguyen",
    },
    {
      nickname: "Bendtsen",
      url: "/bendtsenrasmus",
      fullUrl: "https://soundcloud.com/bendtsenrasmus",
    },
    {
      nickname: "peter0587",
      url: "/peter0587",
      fullUrl: "https://soundcloud.com/peter0587",
    },
    {
      nickname: "David Correa",
      url: "/david-correa-945629964",
      fullUrl: "https://soundcloud.com/david-correa-945629964",
    },
    {
      nickname: "3kuf0",
      url: "/knightmarezzzanddreamzzz",
      fullUrl: "https://soundcloud.com/knightmarezzzanddreamzzz",
    },
    {
      nickname: "D1V",
      url: "/friss-1",
      fullUrl: "https://soundcloud.com/friss-1",
    },
    {
      nickname: "Brian Mackenzie(audiorla)",
      url: "/bri2010",
      fullUrl: "https://soundcloud.com/bri2010",
    },
    {
      nickname: "SERRA M",
      url: "/sergei-m",
      fullUrl: "https://soundcloud.com/sergei-m",
    },
    {
      nickname: "heenrryson",
      url: "/henrry-alejandro-37934929",
      fullUrl: "https://soundcloud.com/henrry-alejandro-37934929",
    },
    {
      nickname: "AJ 🏴󠁧󠁢󠁳󠁣󠁴󠁿",
      url: "/user-849781216",
      fullUrl: "https://soundcloud.com/user-849781216",
    },
    {
      nickname: "Rasponsable",
      url: "/rasponsable",
      fullUrl: "https://soundcloud.com/rasponsable",
    },
    {
      nickname: "Jessica Mitchell19",
      url: "/jm624274",
      fullUrl: "https://soundcloud.com/jm624274",
    },
    {
      nickname: "Nephros",
      url: "/nephros-920799316",
      fullUrl: "https://soundcloud.com/nephros-920799316",
    },
    {
      nickname: "GEHINOM",
      url: "/ghnm_ofc",
      fullUrl: "https://soundcloud.com/ghnm_ofc",
    },
    {
      nickname: "DJ Jimmy Inferno",
      url: "/djjimmyinferno",
      fullUrl: "https://soundcloud.com/djjimmyinferno",
    },
    {
      nickname: "Zoran Georgijev",
      url: "/zoran-georgijev-675247006",
      fullUrl: "https://soundcloud.com/zoran-georgijev-675247006",
    },
    {
      nickname: "E4RW!G",
      url: "/e4rwig",
      fullUrl: "https://soundcloud.com/e4rwig",
    },
    {
      nickname: "Evo",
      url: "/user-26340496",
      fullUrl: "https://soundcloud.com/user-26340496",
    },
    {
      nickname: "HoodFisherMan",
      url: "/slbacler3",
      fullUrl: "https://soundcloud.com/slbacler3",
    },
    {
      nickname: "Kissye Howze",
      url: "/kissye-howze",
      fullUrl: "https://soundcloud.com/kissye-howze",
    },
    {
      nickname: "Doc House",
      url: "/doc_house",
      fullUrl: "https://soundcloud.com/doc_house",
    },
    {
      nickname: "FDR-Sound",
      url: "/fdr-sound",
      fullUrl: "https://soundcloud.com/fdr-sound",
    },
    {
      nickname: "schön soo....",
      url: "/hoerttechno",
      fullUrl: "https://soundcloud.com/hoerttechno",
    },
    {
      nickname: "David Rodriguez",
      url: "/houseofdaro",
      fullUrl: "https://soundcloud.com/houseofdaro",
    },
    {
      nickname: "NYKX.wav",
      url: "/nicolas-kukovicic",
      fullUrl: "https://soundcloud.com/nicolas-kukovicic",
    },
    {
      nickname: "pouya",
      url: "/cafedesali",
      fullUrl: "https://soundcloud.com/cafedesali",
    },
    {
      nickname: "VINYLIQUE SysTĚmE",
      url: "/user-814023040",
      fullUrl: "https://soundcloud.com/user-814023040",
    },
    {
      nickname: "DAROW.G",
      url: "/mr-darow",
      fullUrl: "https://soundcloud.com/mr-darow",
    },
    {
      nickname: "Diego Amico",
      url: "/diego-amicone",
      fullUrl: "https://soundcloud.com/diego-amicone",
    },
    {
      nickname: "WIMT",
      url: "/wimt-music",
      fullUrl: "https://soundcloud.com/wimt-music",
    },
    {
      nickname: "MiLu Lotus ✫ Cover & Attempt ✫",
      url: "/milu-lotus88",
      fullUrl: "https://soundcloud.com/milu-lotus88",
    },
    {
      nickname: "ABDJ",
      url: "/alexis-bonneau-295574269",
      fullUrl: "https://soundcloud.com/alexis-bonneau-295574269",
    },
    {
      nickname: "Todd Tokashiki",
      url: "/toddtokashiki",
      fullUrl: "https://soundcloud.com/toddtokashiki",
    },
    {
      nickname: "Ryder Hoy",
      url: "/ryder-hoy-348590736",
      fullUrl: "https://soundcloud.com/ryder-hoy-348590736",
    },
    {
      nickname: "DRoig",
      url: "/dj-darche",
      fullUrl: "https://soundcloud.com/dj-darche",
    },
    {
      nickname: "Lois Aaron",
      url: "/lois-aaron-154998998",
      fullUrl: "https://soundcloud.com/lois-aaron-154998998",
    },
    {
      nickname: "~The Prodigal~",
      url: "/peter-britz-676677444",
      fullUrl: "https://soundcloud.com/peter-britz-676677444",
    },
    {
      nickname: "Karol 37",
      url: "/karol-ek-63917791",
      fullUrl: "https://soundcloud.com/karol-ek-63917791",
    },
    {
      nickname: "Dorsia",
      url: "/dorsiasydney",
      fullUrl: "https://soundcloud.com/dorsiasydney",
    },
    {
      nickname: "Damian Bedzinski",
      url: "/damian-b-dzi-ski",
      fullUrl: "https://soundcloud.com/damian-b-dzi-ski",
    },
    {
      nickname: "Red Roaring Lion",
      url: "/red-roaring-lion",
      fullUrl: "https://soundcloud.com/red-roaring-lion",
    },
    {
      nickname: "James Wilkey",
      url: "/jamescw",
      fullUrl: "https://soundcloud.com/jamescw",
    },
    {
      nickname: "Zoë K",
      url: "/user-78691794",
      fullUrl: "https://soundcloud.com/user-78691794",
    },
    {
      nickname: "LOU-LAW",
      url: "/loulaw23",
      fullUrl: "https://soundcloud.com/loulaw23",
    },
    {
      nickname: "deejay Joshyray",
      url: "/joshua-raybould-1",
      fullUrl: "https://soundcloud.com/joshua-raybould-1",
    },
    {
      nickname: "TABOSA MUSIC",
      url: "/tabosamusic",
      fullUrl: "https://soundcloud.com/tabosamusic",
    },
    {
      nickname: "AstralDreaming",
      url: "/astraldreaming",
      fullUrl: "https://soundcloud.com/astraldreaming",
    },
    {
      nickname: "¡¡lal¡¡~",
      url: "/dev-dssah",
      fullUrl: "https://soundcloud.com/dev-dssah",
    },
    {
      nickname: "DJKE",
      url: "/djke14",
      fullUrl: "https://soundcloud.com/djke14",
    },
    {
      nickname: "Jonas Karma",
      url: "/jonaskarma",
      fullUrl: "https://soundcloud.com/jonaskarma",
    },
    {
      nickname: "Trepsino",
      url: "/trepsino",
      fullUrl: "https://soundcloud.com/trepsino",
    },
    {
      nickname: "AKSet",
      url: "/piccoli-dimitri",
      fullUrl: "https://soundcloud.com/piccoli-dimitri",
    },
    {
      nickname: "SAVVY",
      url: "/savluv",
      fullUrl: "https://soundcloud.com/savluv",
    },
    {
      nickname: "ℳ𝒾𝓈𝓈𝒶𝓂𝒾𝓈𝓈𝒶",
      url: "/user-513944570",
      fullUrl: "https://soundcloud.com/user-513944570",
    },
    {
      nickname: "joe mangle",
      url: "/user-437018193",
      fullUrl: "https://soundcloud.com/user-437018193",
    },
    {
      nickname: "DJ Wennstone",
      url: "/alex-wennersten",
      fullUrl: "https://soundcloud.com/alex-wennersten",
    },
    {
      nickname: "Trixxx",
      url: "/trixxxofficial",
      fullUrl: "https://soundcloud.com/trixxxofficial",
    },
    {
      nickname: "JilloBird",
      url: "/jill-orent-1",
      fullUrl: "https://soundcloud.com/jill-orent-1",
    },
    {
      nickname: "Pan, Thy Everlasting",
      url: "/pan-thy-everlasting",
      fullUrl: "https://soundcloud.com/pan-thy-everlasting",
    },
    {
      nickname: "Tggfg Ryghhh",
      url: "/tggfg-ryghhh",
      fullUrl: "https://soundcloud.com/tggfg-ryghhh",
    },
    {
      nickname: "Cédric Hard Tech-Punk Prieur",
      url: "/cedrichardpunkprieur",
      fullUrl: "https://soundcloud.com/cedrichardpunkprieur",
    },
    {
      nickname: "XXperiencia",
      url: "/xxperiencia",
      fullUrl: "https://soundcloud.com/xxperiencia",
    },
    {
      nickname: "Melania Rincón",
      url: "/melani-rincon",
      fullUrl: "https://soundcloud.com/melani-rincon",
    },
    {
      nickname: "Ciko",
      url: "/francesco-calcagno-1",
      fullUrl: "https://soundcloud.com/francesco-calcagno-1",
    },
    {
      nickname: "Maëlle Ø",
      url: "/user-564272145-537837209",
      fullUrl: "https://soundcloud.com/user-564272145-537837209",
    },
    {
      nickname: "Magdalena Agostini",
      url: "/magdalena-agostini",
      fullUrl: "https://soundcloud.com/magdalena-agostini",
    },
    {
      nickname: "LEE CUSHION",
      url: "/mirko-straube",
      fullUrl: "https://soundcloud.com/mirko-straube",
    },
    {
      nickname: "J-Funk",
      url: "/johnnyshorthouse",
      fullUrl: "https://soundcloud.com/johnnyshorthouse",
    },
    {
      nickname: "Psycho Sam",
      url: "/samantha-porter-609292064",
      fullUrl: "https://soundcloud.com/samantha-porter-609292064",
    },
    {
      nickname: "EVOO",
      url: "/ivoevoo",
      fullUrl: "https://soundcloud.com/ivoevoo",
    },
    {
      nickname: "DJ Chris Ring",
      url: "/electricorange",
      fullUrl: "https://soundcloud.com/electricorange",
    },
    {
      nickname: "Almighty Red Knight",
      url: "/almightyredknight",
      fullUrl: "https://soundcloud.com/almightyredknight",
    },
    {
      nickname: "FKA (Formerly Known As)",
      url: "/fka_ofc",
      fullUrl: "https://soundcloud.com/fka_ofc",
    },
    {
      nickname: "SIERRA MYST",
      url: "/sierramystmusic",
      fullUrl: "https://soundcloud.com/sierramystmusic",
    },
    {
      nickname: "Jon Y Beats",
      url: "/ye-ye-beats",
      fullUrl: "https://soundcloud.com/ye-ye-beats",
    },
    {
      nickname: "L4nti",
      url: "/lanti511",
      fullUrl: "https://soundcloud.com/lanti511",
    },
    {
      nickname: "Volkan Aktas",
      url: "/volkan-aktas-vlknnklv",
      fullUrl: "https://soundcloud.com/volkan-aktas-vlknnklv",
    },
    {
      nickname: "DJ Emat",
      url: "/ematdj",
      fullUrl: "https://soundcloud.com/ematdj",
    },
    {
      nickname: "HoangDaddy",
      url: "/hoangdaddy",
      fullUrl: "https://soundcloud.com/hoangdaddy",
    },
    {
      nickname: "roney edlyna",
      url: "/roney-edlyna",
      fullUrl: "https://soundcloud.com/roney-edlyna",
    },
    {
      nickname: "DjSicRic Phreak Recordings",
      url: "/djsicric",
      fullUrl: "https://soundcloud.com/djsicric",
    },
    {
      nickname: "Paul Lloyd",
      url: "/paul-lloyd-419798297",
      fullUrl: "https://soundcloud.com/paul-lloyd-419798297",
    },
    {
      nickname: "VRBΛ",
      url: "/connor-vrba",
      fullUrl: "https://soundcloud.com/connor-vrba",
    },
    {
      nickname: "CESS DUBZ",
      url: "/cwss-mp3",
      fullUrl: "https://soundcloud.com/cwss-mp3",
    },
    {
      nickname: "JORDAN-A",
      url: "/user-35991480",
      fullUrl: "https://soundcloud.com/user-35991480",
    },
    {
      nickname: "Manu Lessor",
      url: "/driblingmusic",
      fullUrl: "https://soundcloud.com/driblingmusic",
    },
    {
      nickname: "ShawnMac",
      url: "/shawn-mac-wyne",
      fullUrl: "https://soundcloud.com/shawn-mac-wyne",
    },
    {
      nickname: "Såvvas",
      url: "/savvasmusik",
      fullUrl: "https://soundcloud.com/savvasmusik",
    },
    {
      nickname: "Out Of Control",
      url: "/officialoutofcontrol",
      fullUrl: "https://soundcloud.com/officialoutofcontrol",
    },
    {
      nickname: "HEALTHPACKBUNNYBOY😎🔌💕/EL PLUGUE😎🇯🇲🇩🇴",
      url: "/bunny-boy-233551597",
      fullUrl: "https://soundcloud.com/bunny-boy-233551597",
    },
    {
      nickname: "Rich Rapid",
      url: "/richrapid",
      fullUrl: "https://soundcloud.com/richrapid",
    },
    {
      nickname: "Mr Silkys LoFi Beats",
      url: "/mrsilkyslofi",
      fullUrl: "https://soundcloud.com/mrsilkyslofi",
    },
    {
      nickname: "Painho Du Trance",
      url: "/painho-dus-et",
      fullUrl: "https://soundcloud.com/painho-dus-et",
    },
    {
      nickname: "Didac Delgado Navines",
      url: "/rowdidac",
      fullUrl: "https://soundcloud.com/rowdidac",
    },
    {
      nickname: "Kalamity Kaos",
      url: "/natasha-searle-739262401",
      fullUrl: "https://soundcloud.com/natasha-searle-739262401",
    },
    {
      nickname: "SUNII",
      url: "/djsunii",
      fullUrl: "https://soundcloud.com/djsunii",
    },
    {
      nickname: "jjsmass",
      url: "/jjsmags",
      fullUrl: "https://soundcloud.com/jjsmags",
    },
    {
      nickname: "Bousha 👾",
      url: "/rana-hany",
      fullUrl: "https://soundcloud.com/rana-hany",
    },
    {
      nickname: "ROCKSTARGOYARD",
      url: "/user-526668445",
      fullUrl: "https://soundcloud.com/user-526668445",
    },
    {
      nickname: "vvs",
      url: "/vvs40x",
      fullUrl: "https://soundcloud.com/vvs40x",
    },
    {
      nickname: "lilpoundd",
      url: "/user-494138497",
      fullUrl: "https://soundcloud.com/user-494138497",
    },
    {
      nickname: "4tf Courtney",
      url: "/dz-gaming-zo",
      fullUrl: "https://soundcloud.com/dz-gaming-zo",
    },
    {
      nickname: "BEEMØDAI",
      url: "/user-8212216",
      fullUrl: "https://soundcloud.com/user-8212216",
    },
    {
      nickname: "Tortank93",
      url: "/tortank93",
      fullUrl: "https://soundcloud.com/tortank93",
    },
    {
      nickname: "rhythmikk",
      url: "/rhythmikkmusic",
      fullUrl: "https://soundcloud.com/rhythmikkmusic",
    },
    {
      nickname: "MARCOSTRAPPHONE",
      url: "/demarco-lawrence-2",
      fullUrl: "https://soundcloud.com/demarco-lawrence-2",
    },
    {
      nickname: "Digital Soul Collector",
      url: "/peterwoodbonbon",
      fullUrl: "https://soundcloud.com/peterwoodbonbon",
    },
    {
      nickname: "…",
      url: "/user-366565860",
      fullUrl: "https://soundcloud.com/user-366565860",
    },
    {
      nickname: "herenotrllyhere",
      url: "/herenotrllyhere",
      fullUrl: "https://soundcloud.com/herenotrllyhere",
    },
    {
      nickname: "Carmy",
      url: "/carmyonair",
      fullUrl: "https://soundcloud.com/carmyonair",
    },
    {
      nickname: "theunknownusername",
      url: "/alexander-sandoval-453104363",
      fullUrl: "https://soundcloud.com/alexander-sandoval-453104363",
    },
    {
      nickname: "Aubrey Tan",
      url: "/thetanman96",
      fullUrl: "https://soundcloud.com/thetanman96",
    },
    {
      nickname: "Nior",
      url: "/niormusic",
      fullUrl: "https://soundcloud.com/niormusic",
    },
    {
      nickname: "Argonath",
      url: "/eftosaga",
      fullUrl: "https://soundcloud.com/eftosaga",
    },
    {
      nickname: "DOOK",
      url: "/lukelangan89",
      fullUrl: "https://soundcloud.com/lukelangan89",
    },
    {
      nickname: "femme-fleur",
      url: "/femme-fleur",
      fullUrl: "https://soundcloud.com/femme-fleur",
    },
    {
      nickname: "raffyClub",
      url: "/user-196695202",
      fullUrl: "https://soundcloud.com/user-196695202",
    },
    {
      nickname: "Dj Vivre",
      url: "/dj-vivre",
      fullUrl: "https://soundcloud.com/dj-vivre",
    },
    {
      nickname: "Yaro",
      url: "/yaro-576001449",
      fullUrl: "https://soundcloud.com/yaro-576001449",
    },
    {
      nickname: "Ekka",
      url: "/ekka_official",
      fullUrl: "https://soundcloud.com/ekka_official",
    },
    {
      nickname: "🔥🎶🎙gRiMeZ🎙🎶🔥",
      url: "/adam-shaw-857557225",
      fullUrl: "https://soundcloud.com/adam-shaw-857557225",
    },
    {
      nickname: "Colorhat",
      url: "/colorehat",
      fullUrl: "https://soundcloud.com/colorehat",
    },
    {
      nickname: "⚡️SirRosenthal ⚡️",
      url: "/sir-rosenthal",
      fullUrl: "https://soundcloud.com/sir-rosenthal",
    },
    {
      nickname: "Liam Torrie",
      url: "/liam-torrie-71010057",
      fullUrl: "https://soundcloud.com/liam-torrie-71010057",
    },
    {
      nickname: 'TALIBAN KING FINESSE GUTTA" BACK UP PAGE!!!',
      url: "/user-977278790",
      fullUrl: "https://soundcloud.com/user-977278790",
    },
    {
      nickname: "YAACHII",
      url: "/itsyaachii",
      fullUrl: "https://soundcloud.com/itsyaachii",
    },
    {
      nickname: "DJ Andy Rx",
      url: "/andy-rx-465870725",
      fullUrl: "https://soundcloud.com/andy-rx-465870725",
    },
    {
      nickname: "tiffy brutal",
      url: "/tiffybrutal",
      fullUrl: "https://soundcloud.com/tiffybrutal",
    },
    {
      nickname: "Karl Rushford",
      url: "/user-263508633",
      fullUrl: "https://soundcloud.com/user-263508633",
    },
    {
      nickname: "Alder osvaldo",
      url: "/alder-osvaldo-595888124",
      fullUrl: "https://soundcloud.com/alder-osvaldo-595888124",
    },
    {
      nickname: "Kofi Simons",
      url: "/user-879713229",
      fullUrl: "https://soundcloud.com/user-879713229",
    },
    {
      nickname: "Tomi🎱🥊❤️",
      url: "/tomasz-jan-szegda",
      fullUrl: "https://soundcloud.com/tomasz-jan-szegda",
    },
    {
      nickname: "VSP | Victor Peixoto",
      url: "/victorspeixoto",
      fullUrl: "https://soundcloud.com/victorspeixoto",
    },
    {
      nickname: "Pobeda",
      url: "/psychedelicpobeda",
      fullUrl: "https://soundcloud.com/psychedelicpobeda",
    },
    {
      nickname: "Trance Majic",
      url: "/trancemajic",
      fullUrl: "https://soundcloud.com/trancemajic",
    },
    {
      nickname: "Mitsi_Beaver",
      url: "/mc-terra-b",
      fullUrl: "https://soundcloud.com/mc-terra-b",
    },
    {
      nickname: "Shelby Zyxx",
      url: "/shelby-zyxx",
      fullUrl: "https://soundcloud.com/shelby-zyxx",
    },
    {
      nickname: "Javas",
      url: "/javier-alonso-852119444",
      fullUrl: "https://soundcloud.com/javier-alonso-852119444",
    },
    {
      nickname: "Ryan McCall",
      url: "/user-219822492",
      fullUrl: "https://soundcloud.com/user-219822492",
    },
    {
      nickname: "Steve Bates Music",
      url: "/djstevebates",
      fullUrl: "https://soundcloud.com/djstevebates",
    },
    {
      nickname: "DJ TASTY-D",
      url: "/user-870258962",
      fullUrl: "https://soundcloud.com/user-870258962",
    },
    {
      nickname: "MRGN",
      url: "/mrgnoo",
      fullUrl: "https://soundcloud.com/mrgnoo",
    },
    {
      nickname: "REECE BURROWS",
      url: "/reece-burrows-1",
      fullUrl: "https://soundcloud.com/reece-burrows-1",
    },
    {
      nickname: "Nerau",
      url: "/smaicol",
      fullUrl: "https://soundcloud.com/smaicol",
    },
    {
      nickname: "Megzislit",
      url: "/m-m-gd",
      fullUrl: "https://soundcloud.com/m-m-gd",
    },
    {
      nickname: "¡《☆••☆》¿",
      url: "/horny_soundscapes",
      fullUrl: "https://soundcloud.com/horny_soundscapes",
    },
    {
      nickname: "AG Ku$h",
      url: "/ag-kush-739609723",
      fullUrl: "https://soundcloud.com/ag-kush-739609723",
    },
    {
      nickname: "Lo-Key(US)",
      url: "/julio-lee-valdes",
      fullUrl: "https://soundcloud.com/julio-lee-valdes",
    },
    {
      nickname: "Ross Strong",
      url: "/user-487759012",
      fullUrl: "https://soundcloud.com/user-487759012",
    },
    {
      nickname: "Its A Joke (with Larry Prester)",
      url: "/itsajoke",
      fullUrl: "https://soundcloud.com/itsajoke",
    },
    {
      nickname: "CashpumpBeats",
      url: "/user-156691606-35324509",
      fullUrl: "https://soundcloud.com/user-156691606-35324509",
    },
    {
      nickname: "Korcid",
      url: "/user-258052417",
      fullUrl: "https://soundcloud.com/user-258052417",
    },
    {
      nickname: "Of the Chosen",
      url: "/fromgodfrfr",
      fullUrl: "https://soundcloud.com/fromgodfrfr",
    },
    {
      nickname: "ELETRONIC CLUB",
      url: "/eletronic_club",
      fullUrl: "https://soundcloud.com/eletronic_club",
    },
    {
      nickname: "DJ SoFakt",
      url: "/xslikex-1",
      fullUrl: "https://soundcloud.com/xslikex-1",
    },
    {
      nickname: "James Bolton",
      url: "/james-bolton-5",
      fullUrl: "https://soundcloud.com/james-bolton-5",
    },
    {
      nickname: "Ritsjert",
      url: "/user-107699",
      fullUrl: "https://soundcloud.com/user-107699",
    },
    {
      nickname: "Philipp",
      url: "/philippolo",
      fullUrl: "https://soundcloud.com/philippolo",
    },
    {
      nickname: "Mafaka.Music",
      url: "/mafakamusic",
      fullUrl: "https://soundcloud.com/mafakamusic",
    },
    {
      nickname: "Partito Di Casa",
      url: "/partitodicasa",
      fullUrl: "https://soundcloud.com/partitodicasa",
    },
    {
      nickname: "dj #3055",
      url: "/dav_game",
      fullUrl: "https://soundcloud.com/dav_game",
    },
    {
      nickname: "SLOANSLAKEGHOSTFACE",
      url: "/sloanslakeghostface",
      fullUrl: "https://soundcloud.com/sloanslakeghostface",
    },
    {
      nickname: "Kal Phanavong",
      url: "/kal-phanavong",
      fullUrl: "https://soundcloud.com/kal-phanavong",
    },
    {
      nickname: "DJ Raw Deal - Music Discovery",
      url: "/dj_rawdeal_musicdiscovery",
      fullUrl: "https://soundcloud.com/dj_rawdeal_musicdiscovery",
    },
    {
      nickname: "/bin/music",
      url: "/binali-rustamov",
      fullUrl: "https://soundcloud.com/binali-rustamov",
    },
    {
      nickname: "Fionarose",
      url: "/fionarose-allan",
      fullUrl: "https://soundcloud.com/fionarose-allan",
    },
    {
      nickname: "Heartless Playa",
      url: "/heartlessplaya",
      fullUrl: "https://soundcloud.com/heartlessplaya",
    },
    {
      nickname: "Suc Can | Produce",
      url: "/succanproduce",
      fullUrl: "https://soundcloud.com/succanproduce",
    },
    {
      nickname: "Crazy Monkey",
      url: "/crazymonkeymixes",
      fullUrl: "https://soundcloud.com/crazymonkeymixes",
    },
    {
      nickname: "Kosta V",
      url: "/kosta-v",
      fullUrl: "https://soundcloud.com/kosta-v",
    },
    {
      nickname: "SerbProd",
      url: "/serbprod",
      fullUrl: "https://soundcloud.com/serbprod",
    },
    {
      nickname: "LocoMic622",
      url: "/locomic622",
      fullUrl: "https://soundcloud.com/locomic622",
    },
    {
      nickname: "Seva Zykov",
      url: "/urxseva",
      fullUrl: "https://soundcloud.com/urxseva",
    },
    {
      nickname: "SoraTheProdigy",
      url: "/soratheprodigy",
      fullUrl: "https://soundcloud.com/soratheprodigy",
    },
    {
      nickname: "DJONYL",
      url: "/djonylmusic",
      fullUrl: "https://soundcloud.com/djonylmusic",
    },
    {
      nickname: "J.D. WALTERS",
      url: "/jdwaltersmusic",
      fullUrl: "https://soundcloud.com/jdwaltersmusic",
    },
    {
      nickname: "Ментальный Алхимик",
      url: "/dima-ivanov-179188273",
      fullUrl: "https://soundcloud.com/dima-ivanov-179188273",
    },
    {
      nickname: "Murda",
      url: "/user-204836350",
      fullUrl: "https://soundcloud.com/user-204836350",
    },
    {
      nickname: "Klangkosmetik",
      url: "/klangkosmetik",
      fullUrl: "https://soundcloud.com/klangkosmetik",
    },
    {
      nickname: "𝔼𝕨𝕝𝕝𝕖𝕩",
      url: "/6y6rllir61kp",
      fullUrl: "https://soundcloud.com/6y6rllir61kp",
    },
    {
      nickname: "SUPERSONIC",
      url: "/5gwh1dbveiui",
      fullUrl: "https://soundcloud.com/5gwh1dbveiui",
    },
    {
      nickname: "wahtzup.weirdoz",
      url: "/wahtzup-weirdoz",
      fullUrl: "https://soundcloud.com/wahtzup-weirdoz",
    },
    {
      nickname: "RKD.rec",
      url: "/rkdrecords",
      fullUrl: "https://soundcloud.com/rkdrecords",
    },
    {
      nickname: "CYBRPLUGGG",
      url: "/whowannadie",
      fullUrl: "https://soundcloud.com/whowannadie",
    },
    {
      nickname: "Vertigo Attack",
      url: "/vertigoattack",
      fullUrl: "https://soundcloud.com/vertigoattack",
    },
    {
      nickname: "Bluemystic❄️",
      url: "/ogbluemystic",
      fullUrl: "https://soundcloud.com/ogbluemystic",
    },
    {
      nickname: "Patrick leupelt",
      url: "/patrick-leupelt-254787834",
      fullUrl: "https://soundcloud.com/patrick-leupelt-254787834",
    },
    {
      nickname: "Mark C. Bess",
      url: "/abiodun-ameenah-735877463",
      fullUrl: "https://soundcloud.com/abiodun-ameenah-735877463",
    },
    {
      nickname: "RVRE",
      url: "/user-986269369",
      fullUrl: "https://soundcloud.com/user-986269369",
    },
    {
      nickname: "Brendon Duffield",
      url: "/brendonuffield",
      fullUrl: "https://soundcloud.com/brendonuffield",
    },
    {
      nickname: "VOLLTON",
      url: "/vollton",
      fullUrl: "https://soundcloud.com/vollton",
    },
    {
      nickname: "ORION",
      url: "/ryanintihar",
      fullUrl: "https://soundcloud.com/ryanintihar",
    },
    {
      nickname: "JEICKI",
      url: "/jeickirf",
      fullUrl: "https://soundcloud.com/jeickirf",
    },
    {
      nickname: "Plan M",
      url: "/planmmusic",
      fullUrl: "https://soundcloud.com/planmmusic",
    },
    {
      nickname: "DJ Elation",
      url: "/djelation",
      fullUrl: "https://soundcloud.com/djelation",
    },
    {
      nickname: "Schmidte",
      url: "/sebastian-4579219",
      fullUrl: "https://soundcloud.com/sebastian-4579219",
    },
    {
      nickname: "𝕬𝖓𝖐𝖍𝖔𝖙𝖆𝖕𝖊 ☥",
      url: "/yxungankhotape",
      fullUrl: "https://soundcloud.com/yxungankhotape",
    },
    {
      nickname: "eleni anastasiou",
      url: "/elena-anastasiou-gkouma",
      fullUrl: "https://soundcloud.com/elena-anastasiou-gkouma",
    },
    {
      nickname: "N/A N°",
      url: "/nan0_0",
      fullUrl: "https://soundcloud.com/nan0_0",
    },
    {
      nickname: "The outsider",
      url: "/joachim-karlik",
      fullUrl: "https://soundcloud.com/joachim-karlik",
    },
    {
      nickname: "CLEOPATRA SD",
      url: "/sandra-de-dios-102840286",
      fullUrl: "https://soundcloud.com/sandra-de-dios-102840286",
    },
    {
      nickname: "Robert Kimi J",
      url: "/robertjoel170",
      fullUrl: "https://soundcloud.com/robertjoel170",
    },
    {
      nickname: "Losbol",
      url: "/designerflash",
      fullUrl: "https://soundcloud.com/designerflash",
    },
    {
      nickname: "Boogie Block",
      url: "/regank97",
      fullUrl: "https://soundcloud.com/regank97",
    },
    {
      nickname: "SniFFlA",
      url: "/didja",
      fullUrl: "https://soundcloud.com/didja",
    },
    {
      nickname: "serge",
      url: "/sergio00o",
      fullUrl: "https://soundcloud.com/sergio00o",
    },
    {
      nickname: "Alby Fantastix",
      url: "/alby-dj-fantastix",
      fullUrl: "https://soundcloud.com/alby-dj-fantastix",
    },
    {
      nickname: "Shepperd",
      url: "/shepper_d",
      fullUrl: "https://soundcloud.com/shepper_d",
    },
    {
      nickname: "E-Static",
      url: "/e-static-1",
      fullUrl: "https://soundcloud.com/e-static-1",
    },
    {
      nickname: "Blackbird",
      url: "/blackbirdmusicconnect",
      fullUrl: "https://soundcloud.com/blackbirdmusicconnect",
    },
    {
      nickname: "Mokko",
      url: "/djmokko",
      fullUrl: "https://soundcloud.com/djmokko",
    },
    {
      nickname: "Daz Stanyon",
      url: "/darren-stanyon-20840826",
      fullUrl: "https://soundcloud.com/darren-stanyon-20840826",
    },
    {
      nickname: "Andreas Orthodoxou",
      url: "/andreas-orthodoxou",
      fullUrl: "https://soundcloud.com/andreas-orthodoxou",
    },
    {
      nickname: "Dyfraxx",
      url: "/dyfraxx-etc",
      fullUrl: "https://soundcloud.com/dyfraxx-etc",
    },
    {
      nickname: "Noël Ernesto",
      url: "/noel_ernesto",
      fullUrl: "https://soundcloud.com/noel_ernesto",
    },
    {
      nickname: "PIETERSUN B.",
      url: "/peter-brandt-774356617",
      fullUrl: "https://soundcloud.com/peter-brandt-774356617",
    },
    {
      nickname: "ᚫ尺ⓘĐªƳᥫ᭡⑧②⁴4(ツ゚)",
      url: "/user-57410484",
      fullUrl: "https://soundcloud.com/user-57410484",
    },
    {
      nickname: "Scoina Ritual",
      url: "/scoina_ritual",
      fullUrl: "https://soundcloud.com/scoina_ritual",
    },
    {
      nickname: "LoWCut",
      url: "/mastercraft",
      fullUrl: "https://soundcloud.com/mastercraft",
    },
    {
      nickname: "JoneZ_DnB_za",
      url: "/jonez_dnb_za",
      fullUrl: "https://soundcloud.com/jonez_dnb_za",
    },
    {
      nickname: "WOLFFY",
      url: "/wlfyyboy",
      fullUrl: "https://soundcloud.com/wlfyyboy",
    },
    {
      nickname: "Running Thread",
      url: "/runningthread",
      fullUrl: "https://soundcloud.com/runningthread",
    },
    {
      nickname: "HDMY.",
      url: "/emeline-judith-her",
      fullUrl: "https://soundcloud.com/emeline-judith-her",
    },
    {
      nickname: "Muescher",
      url: "/michael-pfitzner-2",
      fullUrl: "https://soundcloud.com/michael-pfitzner-2",
    },
    {
      nickname: "Ahmed Guitara",
      url: "/ahmed-guitara",
      fullUrl: "https://soundcloud.com/ahmed-guitara",
    },
    {
      nickname: "NRG 2",
      url: "/nathan-goode-2",
      fullUrl: "https://soundcloud.com/nathan-goode-2",
    },
    {
      nickname: "Tim Schubert",
      url: "/timschubert",
      fullUrl: "https://soundcloud.com/timschubert",
    },
    {
      nickname: "Karl",
      url: "/chads2014",
      fullUrl: "https://soundcloud.com/chads2014",
    },
    {
      nickname: "Bloody Adventure",
      url: "/bloodyadventure",
      fullUrl: "https://soundcloud.com/bloodyadventure",
    },
    {
      nickname: "NIKKI",
      url: "/nicole-jordan-20161088",
      fullUrl: "https://soundcloud.com/nicole-jordan-20161088",
    },
    {
      nickname: "Violet",
      url: "/violet-281314140",
      fullUrl: "https://soundcloud.com/violet-281314140",
    },
    {
      nickname: "Kariké",
      url: "/karik3",
      fullUrl: "https://soundcloud.com/karik3",
    },
    {
      nickname: "Davidee",
      url: "/dj-davidee",
      fullUrl: "https://soundcloud.com/dj-davidee",
    },
    {
      nickname: "Laura!",
      url: "/loz-mush",
      fullUrl: "https://soundcloud.com/loz-mush",
    },
    {
      nickname: "Kokimusic",
      url: "/kokimusic-190489303",
      fullUrl: "https://soundcloud.com/kokimusic-190489303",
    },
    {
      nickname: "djnathann",
      url: "/pb8yh92uo0qo",
      fullUrl: "https://soundcloud.com/pb8yh92uo0qo",
    },
    {
      nickname: "manickaiizer / lulu kartier",
      url: "/lulukartier",
      fullUrl: "https://soundcloud.com/lulukartier",
    },
    {
      nickname: "Houssein BAH",
      url: "/houssein-bah",
      fullUrl: "https://soundcloud.com/houssein-bah",
    },
    {
      nickname: "Scott RJC",
      url: "/scottrjc",
      fullUrl: "https://soundcloud.com/scottrjc",
    },
    {
      nickname: "FST4U",
      url: "/camilo-v-zquez",
      fullUrl: "https://soundcloud.com/camilo-v-zquez",
    },
    {
      nickname: "VES:T",
      url: "/vest-878448796",
      fullUrl: "https://soundcloud.com/vest-878448796",
    },
    {
      nickname: "Tyler M",
      url: "/tylermjax",
      fullUrl: "https://soundcloud.com/tylermjax",
    },
    {
      nickname: "cecilia5",
      url: "/cecilia5",
      fullUrl: "https://soundcloud.com/cecilia5",
    },
    {
      nickname: "Ivan Cobos Dj",
      url: "/ivan-cobos-dj",
      fullUrl: "https://soundcloud.com/ivan-cobos-dj",
    },
    {
      nickname: "NIK GAIN",
      url: "/nikgain",
      fullUrl: "https://soundcloud.com/nikgain",
    },
    {
      nickname: "WEST",
      url: "/robbert-westmaas",
      fullUrl: "https://soundcloud.com/robbert-westmaas",
    },
    {
      nickname: "JDog",
      url: "/jonathan-smith-589047243",
      fullUrl: "https://soundcloud.com/jonathan-smith-589047243",
    },
    {
      nickname: "DIVBLO",
      url: "/djdivblo",
      fullUrl: "https://soundcloud.com/djdivblo",
    },
    {
      nickname: "Amilcar Ximenes",
      url: "/amilcar-ximenes",
      fullUrl: "https://soundcloud.com/amilcar-ximenes",
    },
    {
      nickname: "Pedro Almeida",
      url: "/pedro-almeida-176222962",
      fullUrl: "https://soundcloud.com/pedro-almeida-176222962",
    },
    {
      nickname: "Antonio Escobar",
      url: "/gil-torres-3",
      fullUrl: "https://soundcloud.com/gil-torres-3",
    },
    {
      nickname: "HBG",
      url: "/nkidj",
      fullUrl: "https://soundcloud.com/nkidj",
    },
    {
      nickname: "Procopis Gkouklias",
      url: "/procopis-gkouklias-693854058",
      fullUrl: "https://soundcloud.com/procopis-gkouklias-693854058",
    },
    {
      nickname: "MacKenzzi",
      url: "/mackenzzi",
      fullUrl: "https://soundcloud.com/mackenzzi",
    },
    {
      nickname: "ZZØFRENIC♡",
      url: "/nicolas-perea-jaramillo",
      fullUrl: "https://soundcloud.com/nicolas-perea-jaramillo",
    },
    {
      nickname: "Kitbuilders",
      url: "/kitbuilders",
      fullUrl: "https://soundcloud.com/kitbuilders",
    },
    {
      nickname: "Olarewaju Muhammed",
      url: "/abdullateefyusuf093",
      fullUrl: "https://soundcloud.com/abdullateefyusuf093",
    },
    {
      nickname: "Dannetega",
      url: "/dannetega",
      fullUrl: "https://soundcloud.com/dannetega",
    },
    {
      nickname: "Riky Lopez",
      url: "/rikilopez",
      fullUrl: "https://soundcloud.com/rikilopez",
    },
    {
      nickname: "DiSCORD",
      url: "/discord-4",
      fullUrl: "https://soundcloud.com/discord-4",
    },
    {
      nickname: "Kitchen & Waffles",
      url: "/user-315109442",
      fullUrl: "https://soundcloud.com/user-315109442",
    },
    {
      nickname: "Babaganouschka",
      url: "/cdr1k",
      fullUrl: "https://soundcloud.com/cdr1k",
    },
    {
      nickname: "Omen",
      url: "/vlad-nemosh",
      fullUrl: "https://soundcloud.com/vlad-nemosh",
    },
    {
      nickname: "Gabriela",
      url: "/gabbyz40",
      fullUrl: "https://soundcloud.com/gabbyz40",
    },
    {
      nickname: "Vixen",
      url: "/vickyw88-1",
      fullUrl: "https://soundcloud.com/vickyw88-1",
    },
    {
      nickname: "MUTT",
      url: "/user-732147320-408762077",
      fullUrl: "https://soundcloud.com/user-732147320-408762077",
    },
    {
      nickname: "floridian slip",
      url: "/floridian-slip",
      fullUrl: "https://soundcloud.com/floridian-slip",
    },
    {
      nickname: "TYPE ZERO",
      url: "/1-type-0",
      fullUrl: "https://soundcloud.com/1-type-0",
    },
    {
      nickname: "d3_ffeCt",
      url: "/dede8024",
      fullUrl: "https://soundcloud.com/dede8024",
    },
    {
      nickname: "savage_radio_野蠻電台",
      url: "/yue-shih",
      fullUrl: "https://soundcloud.com/yue-shih",
    },
    {
      nickname: "Yenny Skev",
      url: "/yennyskev",
      fullUrl: "https://soundcloud.com/yennyskev",
    },
    {
      nickname: "Șerban",
      url: "/erban-406863209",
      fullUrl: "https://soundcloud.com/erban-406863209",
    },
    {
      nickname: "David Benito",
      url: "/srdomokun",
      fullUrl: "https://soundcloud.com/srdomokun",
    },
    {
      nickname: "house of RA ॐ",
      url: "/houseofra",
      fullUrl: "https://soundcloud.com/houseofra",
    },
    {
      nickname: "Rol[s]an",
      url: "/rolsan",
      fullUrl: "https://soundcloud.com/rolsan",
    },
    {
      nickname: "Replay me/ody",
      url: "/christian-tautz-36171614",
      fullUrl: "https://soundcloud.com/christian-tautz-36171614",
    },
    {
      nickname: "Sub.marine",
      url: "/sub_marine_dub",
      fullUrl: "https://soundcloud.com/sub_marine_dub",
    },
    {
      nickname: "Norae",
      url: "/noraesounds",
      fullUrl: "https://soundcloud.com/noraesounds",
    },
    {
      nickname: "RBJ90",
      url: "/rbj90",
      fullUrl: "https://soundcloud.com/rbj90",
    },
    {
      nickname: "DjFabDiØt",
      url: "/fabien-34",
      fullUrl: "https://soundcloud.com/fabien-34",
    },
    {
      nickname: "Israel Amar",
      url: "/israel-amar-3",
      fullUrl: "https://soundcloud.com/israel-amar-3",
    },
    {
      nickname: "Gemski",
      url: "/gemskixxxx",
      fullUrl: "https://soundcloud.com/gemskixxxx",
    },
    {
      nickname: "nivrambo",
      url: "/nivrambo",
      fullUrl: "https://soundcloud.com/nivrambo",
    },
    {
      nickname: "Corematicdj_",
      url: "/tcorematichc",
      fullUrl: "https://soundcloud.com/tcorematichc",
    },
    {
      nickname: "Joyce Nguyễn",
      url: "/nguy-n-o-804816328",
      fullUrl: "https://soundcloud.com/nguy-n-o-804816328",
    },
    {
      nickname: "Tota 2008 Mazen zoka",
      url: "/tota-2008-mazen-zoka",
      fullUrl: "https://soundcloud.com/tota-2008-mazen-zoka",
    },
    {
      nickname: "Dj Psyko Warrior",
      url: "/danieladler-1",
      fullUrl: "https://soundcloud.com/danieladler-1",
    },
    {
      nickname: "TerryBoiii",
      url: "/terrybhoy-brewer",
      fullUrl: "https://soundcloud.com/terrybhoy-brewer",
    },
    {
      nickname: "Anna de Abaitua",
      url: "/anna-de-abaitua-467310053",
      fullUrl: "https://soundcloud.com/anna-de-abaitua-467310053",
    },
    {
      nickname: "Ростислав Пожарко",
      url: "/rostislav-pozharko",
      fullUrl: "https://soundcloud.com/rostislav-pozharko",
    },
    {
      nickname: "Collins",
      url: "/user-908708604",
      fullUrl: "https://soundcloud.com/user-908708604",
    },
    {
      nickname: "Lachsnacken",
      url: "/lachsnacken",
      fullUrl: "https://soundcloud.com/lachsnacken",
    },
    {
      nickname: "YaskóŁ d-_-b",
      url: "/mariusz-yaskol",
      fullUrl: "https://soundcloud.com/mariusz-yaskol",
    },
    {
      nickname: "DEVILE",
      url: "/john-semmler-873108462",
      fullUrl: "https://soundcloud.com/john-semmler-873108462",
    },
    {
      nickname: "Xensibilia",
      url: "/sensibiliaa",
      fullUrl: "https://soundcloud.com/sensibiliaa",
    },
    {
      nickname: "SLAYY",
      url: "/dj-slayyy",
      fullUrl: "https://soundcloud.com/dj-slayyy",
    },
    {
      nickname: "Netrucho",
      url: "/netrucho",
      fullUrl: "https://soundcloud.com/netrucho",
    },
    {
      nickname: "Anh Thư",
      url: "/tr-n-ti-n-m-nh-221962140",
      fullUrl: "https://soundcloud.com/tr-n-ti-n-m-nh-221962140",
    },
    {
      nickname: "AIONIOS DJ",
      url: "/hamesondj",
      fullUrl: "https://soundcloud.com/hamesondj",
    },
    {
      nickname: "Horny Rhino",
      url: "/hornyrhino",
      fullUrl: "https://soundcloud.com/hornyrhino",
    },
    {
      nickname: "DJ HƯNG NEIL  ( 0933813760 )",
      url: "/djhungbounce",
      fullUrl: "https://soundcloud.com/djhungbounce",
    },
    {
      nickname: "GFJ",
      url: "/gfj",
      fullUrl: "https://soundcloud.com/gfj",
    },
    {
      nickname: "Gdrghfdt",
      url: "/gdrghfdt",
      fullUrl: "https://soundcloud.com/gdrghfdt",
    },
    {
      nickname: "Girafe450",
      url: "/giulianagori",
      fullUrl: "https://soundcloud.com/giulianagori",
    },
    {
      nickname: "DelighTsToDarkNoTes",
      url: "/user-darknotes",
      fullUrl: "https://soundcloud.com/user-darknotes",
    },
    {
      nickname: "Meesillee Vick (lost original)",
      url: "/teddy-343495032",
      fullUrl: "https://soundcloud.com/teddy-343495032",
    },
    {
      nickname: "marcoszeus",
      url: "/marcos-antonio-365195412",
      fullUrl: "https://soundcloud.com/marcos-antonio-365195412",
    },
    {
      nickname: "Jorge Morales Ortiz",
      url: "/jorge-morales-ortiz",
      fullUrl: "https://soundcloud.com/jorge-morales-ortiz",
    },
    {
      nickname: "Ross Wood.",
      url: "/rosswoodmusic",
      fullUrl: "https://soundcloud.com/rosswoodmusic",
    },
    {
      nickname: "LexiSapphireRose",
      url: "/user-804550807",
      fullUrl: "https://soundcloud.com/user-804550807",
    },
    {
      nickname: "Lê Hiếu",
      url: "/minhhiei",
      fullUrl: "https://soundcloud.com/minhhiei",
    },
    {
      nickname: "Đức o",
      url: "/user-290779269",
      fullUrl: "https://soundcloud.com/user-290779269",
    },
    {
      nickname: "Andres",
      url: "/hu-gas",
      fullUrl: "https://soundcloud.com/hu-gas",
    },
    {
      nickname: "J.Izley",
      url: "/jizzobeats412",
      fullUrl: "https://soundcloud.com/jizzobeats412",
    },
    {
      nickname: "Flippi",
      url: "/phil-319551917",
      fullUrl: "https://soundcloud.com/phil-319551917",
    },
    {
      nickname: "LUDCIO",
      url: "/ludcio",
      fullUrl: "https://soundcloud.com/ludcio",
    },
    {
      nickname: "Akash Pillai",
      url: "/akash-pillai-1",
      fullUrl: "https://soundcloud.com/akash-pillai-1",
    },
    {
      nickname: "Instinct Vibes Network",
      url: "/instinctvibes-music",
      fullUrl: "https://soundcloud.com/instinctvibes-music",
    },
    {
      nickname: "DJ KIK LANA",
      url: "/kiqlana",
      fullUrl: "https://soundcloud.com/kiqlana",
    },
    {
      nickname: "Dj Wickey Music",
      url: "/djwickeyofficialmusic",
      fullUrl: "https://soundcloud.com/djwickeyofficialmusic",
    },
    {
      nickname: "AIRIC",
      url: "/airic_wav",
      fullUrl: "https://soundcloud.com/airic_wav",
    },
    {
      nickname: "DoriYuster",
      url: "/doriyuster",
      fullUrl: "https://soundcloud.com/doriyuster",
    },
    {
      nickname: "DJ Andrew Scott",
      url: "/djandrewscott",
      fullUrl: "https://soundcloud.com/djandrewscott",
    },
    {
      nickname: "Juan Time 🎧🔊",
      url: "/user-145546617",
      fullUrl: "https://soundcloud.com/user-145546617",
    },
    {
      nickname: "DJ ELAD BEN ITACH",
      url: "/dj-elad-ben-itach",
      fullUrl: "https://soundcloud.com/dj-elad-ben-itach",
    },
    {
      nickname: "mcbuda",
      url: "/johnmcbuda",
      fullUrl: "https://soundcloud.com/johnmcbuda",
    },
    {
      nickname: "Techno_dad",
      url: "/james-bevo-beveridge",
      fullUrl: "https://soundcloud.com/james-bevo-beveridge",
    },
    {
      nickname: "Lauren Alfonso",
      url: "/lauren-alfonso-656779763",
      fullUrl: "https://soundcloud.com/lauren-alfonso-656779763",
    },
    {
      nickname: "Andy McGowan",
      url: "/andy-mcgowm",
      fullUrl: "https://soundcloud.com/andy-mcgowm",
    },
    {
      nickname: "RNunes",
      url: "/rnunesmusic",
      fullUrl: "https://soundcloud.com/rnunesmusic",
    },
    {
      nickname: "CYNERGY",
      url: "/djcynergy",
      fullUrl: "https://soundcloud.com/djcynergy",
    },
    {
      nickname: "thatamirguy",
      url: "/amir4king",
      fullUrl: "https://soundcloud.com/amir4king",
    },
    {
      nickname: "John Mello DJ",
      url: "/johnlmello",
      fullUrl: "https://soundcloud.com/johnlmello",
    },
    {
      nickname: "aviatrix",
      url: "/a_viatrix",
      fullUrl: "https://soundcloud.com/a_viatrix",
    },
    {
      nickname: "TT sin Eee",
      url: "/antonio-rodriguez-bote",
      fullUrl: "https://soundcloud.com/antonio-rodriguez-bote",
    },
    {
      nickname: "Wender Donato Ribeiro",
      url: "/wenderdonatoribeiro",
      fullUrl: "https://soundcloud.com/wenderdonatoribeiro",
    },
    {
      nickname: "LDB Prod 77",
      url: "/laurent-david-bibas",
      fullUrl: "https://soundcloud.com/laurent-david-bibas",
    },
    {
      nickname: "Jorge Luis Lara Abella",
      url: "/jorge-luis-lara-abella",
      fullUrl: "https://soundcloud.com/jorge-luis-lara-abella",
    },
    {
      nickname: "#boostmusic",
      url: "/user-648993918",
      fullUrl: "https://soundcloud.com/user-648993918",
    },
    {
      nickname: "Beast Mode Chi-Town",
      url: "/user-665320571",
      fullUrl: "https://soundcloud.com/user-665320571",
    },
    {
      nickname: "ThoNoiZe",
      url: "/thonoizemusic",
      fullUrl: "https://soundcloud.com/thonoizemusic",
    },
    {
      nickname: "Chrissie Fletcher",
      url: "/chrissie-fletcher1",
      fullUrl: "https://soundcloud.com/chrissie-fletcher1",
    },
    {
      nickname: "DJ Gaspar SG",
      url: "/gaspar-cesar",
      fullUrl: "https://soundcloud.com/gaspar-cesar",
    },
    {
      nickname: "DJ Beto Santos",
      url: "/betobsb",
      fullUrl: "https://soundcloud.com/betobsb",
    },
    {
      nickname: "Milad Moradi larki",
      url: "/milad-moradi-larki",
      fullUrl: "https://soundcloud.com/milad-moradi-larki",
    },
    {
      nickname: "AlaII_Dj",
      url: "/alaiidj",
      fullUrl: "https://soundcloud.com/alaiidj",
    },
    {
      nickname: "DJ GHABBE",
      url: "/gabriel-scheis-277965225",
      fullUrl: "https://soundcloud.com/gabriel-scheis-277965225",
    },
    {
      nickname: "zolti_",
      url: "/bfzoli",
      fullUrl: "https://soundcloud.com/bfzoli",
    },
    {
      nickname: "babadjinn",
      url: "/babadschinni",
      fullUrl: "https://soundcloud.com/babadschinni",
    },
    {
      nickname: "Rapido Ratz 49 Fan Fun Radio 2",
      url: "/rapido-ratz-49",
      fullUrl: "https://soundcloud.com/rapido-ratz-49",
    },
    {
      nickname: "Morzen",
      url: "/david-brumleve",
      fullUrl: "https://soundcloud.com/david-brumleve",
    },
    {
      nickname: "Dj Rahal",
      url: "/dj-rahal",
      fullUrl: "https://soundcloud.com/dj-rahal",
    },
    {
      nickname: "djraphaellayani",
      url: "/djraphaellayani",
      fullUrl: "https://soundcloud.com/djraphaellayani",
    },
    {
      nickname: "Magick Man",
      url: "/sbfan1971",
      fullUrl: "https://soundcloud.com/sbfan1971",
    },
    {
      nickname: "RAIFF",
      url: "/dj-raiff",
      fullUrl: "https://soundcloud.com/dj-raiff",
    },
    {
      nickname: "Wali Khan💊",
      url: "/wail-khan-745338500",
      fullUrl: "https://soundcloud.com/wail-khan-745338500",
    },
    {
      nickname: "J.N",
      url: "/jarek-nowakowski-814293736",
      fullUrl: "https://soundcloud.com/jarek-nowakowski-814293736",
    },
    {
      nickname: "dj jordi ruiz",
      url: "/jordi-ruiz",
      fullUrl: "https://soundcloud.com/jordi-ruiz",
    },
    {
      nickname: "henry2.7",
      url: "/henrique-bresciane",
      fullUrl: "https://soundcloud.com/henrique-bresciane",
    },
    {
      nickname: "Delroy Smith's",
      url: "/delroy-smiths-2625101",
      fullUrl: "https://soundcloud.com/delroy-smiths-2625101",
    },
    {
      nickname: "Des",
      url: "/des-dore-256290363",
      fullUrl: "https://soundcloud.com/des-dore-256290363",
    },
    {
      nickname: "Hummingbird",
      url: "/h-b-403243864",
      fullUrl: "https://soundcloud.com/h-b-403243864",
    },
    {
      nickname: "_iamjoremixesofficial",
      url: "/joremixesofficial23",
      fullUrl: "https://soundcloud.com/joremixesofficial23",
    },
    {
      nickname: "alejandrodragundj",
      url: "/dragundj92",
      fullUrl: "https://soundcloud.com/dragundj92",
    },
    {
      nickname: "Axxon",
      url: "/user-509994794",
      fullUrl: "https://soundcloud.com/user-509994794",
    },
    {
      nickname: "Salim Jr.",
      url: "/salimjr",
      fullUrl: "https://soundcloud.com/salimjr",
    },
    {
      nickname: "petitchatperché",
      url: "/petitchatperche",
      fullUrl: "https://soundcloud.com/petitchatperche",
    },
    {
      nickname: "☆Некада давно на Звездари☆ и јопет!",
      url: "/draganbrdar",
      fullUrl: "https://soundcloud.com/draganbrdar",
    },
    {
      nickname: "Chicos Tribaleros Chile",
      url: "/chicos-tribaleros-chile",
      fullUrl: "https://soundcloud.com/chicos-tribaleros-chile",
    },
    {
      nickname: "PETE BASS",
      url: "/pete-baxter-3",
      fullUrl: "https://soundcloud.com/pete-baxter-3",
    },
    {
      nickname: "Adi",
      url: "/adi-ostrovsky",
      fullUrl: "https://soundcloud.com/adi-ostrovsky",
    },
    {
      nickname: "David Georges Christian Heurteur",
      url: "/david-heurteur-365860194",
      fullUrl: "https://soundcloud.com/david-heurteur-365860194",
    },
    {
      nickname: "V4R13TY",
      url: "/user-397056981",
      fullUrl: "https://soundcloud.com/user-397056981",
    },
    {
      nickname: "Mihau22",
      url: "/user-219598923",
      fullUrl: "https://soundcloud.com/user-219598923",
    },
    {
      nickname: "𝘽𝙀𝙇𝙐𝙂𝘼",
      url: "/beluga-2",
      fullUrl: "https://soundcloud.com/beluga-2",
    },
    {
      nickname: "Technico E",
      url: "/user-469244820",
      fullUrl: "https://soundcloud.com/user-469244820",
    },
    {
      nickname: "Chris Toc-Toc",
      url: "/christoctoc",
      fullUrl: "https://soundcloud.com/christoctoc",
    },
    {
      nickname: "Dee Omee",
      url: "/deeomee",
      fullUrl: "https://soundcloud.com/deeomee",
    },
    {
      nickname: "DJZined Notenschrauber",
      url: "/dj-zined",
      fullUrl: "https://soundcloud.com/dj-zined",
    },
    {
      nickname: "Sascha Frohsinn",
      url: "/saschafrohsinn",
      fullUrl: "https://soundcloud.com/saschafrohsinn",
    },
    {
      nickname: "Of Gods and Monsters",
      url: "/of-gods-and-monsters",
      fullUrl: "https://soundcloud.com/of-gods-and-monsters",
    },
    {
      nickname: "The White Crow production",
      url: "/the-white-crow-beatmaker",
      fullUrl: "https://soundcloud.com/the-white-crow-beatmaker",
    },
    {
      nickname: "Bekah23",
      url: "/rebekahmooney12",
      fullUrl: "https://soundcloud.com/rebekahmooney12",
    },
    {
      nickname: "Dj.Able Archer",
      url: "/djablearcher",
      fullUrl: "https://soundcloud.com/djablearcher",
    },
    {
      nickname: "Fabioffedj aka Zenonix",
      url: "/fabioferro1986",
      fullUrl: "https://soundcloud.com/fabioferro1986",
    },
    {
      nickname: "Utopia Sound Labs",
      url: "/utopiasoundlabs",
      fullUrl: "https://soundcloud.com/utopiasoundlabs",
    },
    {
      nickname: "Ghostdoginc",
      url: "/ghostdoginc",
      fullUrl: "https://soundcloud.com/ghostdoginc",
    },
    {
      nickname: "Mooky Musik Recordings",
      url: "/mookymusik",
      fullUrl: "https://soundcloud.com/mookymusik",
    },
    {
      nickname: "The Ruff Mate",
      url: "/ruff-mate",
      fullUrl: "https://soundcloud.com/ruff-mate",
    },
    {
      nickname: "YEAHMOZZA",
      url: "/yeahmozza",
      fullUrl: "https://soundcloud.com/yeahmozza",
    },
    {
      nickname: "dataMorgana",
      url: "/datamorgana",
      fullUrl: "https://soundcloud.com/datamorgana",
    },
    {
      nickname: "Nadia Black",
      url: "/mises-bli-black",
      fullUrl: "https://soundcloud.com/mises-bli-black",
    },
    {
      nickname: "Tamer Fawzy Fawzy",
      url: "/tamer-fawzy-fawzy",
      fullUrl: "https://soundcloud.com/tamer-fawzy-fawzy",
    },
    {
      nickname: "ChrisGarayOfficial",
      url: "/aniceto-molina-286645379",
      fullUrl: "https://soundcloud.com/aniceto-molina-286645379",
    },
    {
      nickname: "Graf Prahl",
      url: "/grafzahl-2",
      fullUrl: "https://soundcloud.com/grafzahl-2",
    },
    {
      nickname: "Al Musuf",
      url: "/heitort",
      fullUrl: "https://soundcloud.com/heitort",
    },
    {
      nickname: "Abstyl3",
      url: "/djabstyle",
      fullUrl: "https://soundcloud.com/djabstyle",
    },
    {
      nickname: "Thor-Lor (Official)",
      url: "/lladyka",
      fullUrl: "https://soundcloud.com/lladyka",
    },
    {
      nickname: "Bohotoys.eu [X]",
      url: "/bohotoys",
      fullUrl: "https://soundcloud.com/bohotoys",
    },
    {
      nickname: "DMTRY",
      url: "/dmtrymusic",
      fullUrl: "https://soundcloud.com/dmtrymusic",
    },
    {
      nickname: "Viturgoboss",
      url: "/viturgobossdj",
      fullUrl: "https://soundcloud.com/viturgobossdj",
    },
    {
      nickname: "Berlin Cox",
      url: "/user-825214037",
      fullUrl: "https://soundcloud.com/user-825214037",
    },
    {
      nickname: "John Closey",
      url: "/john-closey-171659444",
      fullUrl: "https://soundcloud.com/john-closey-171659444",
    },
    {
      nickname: "mawkingjohn",
      url: "/mawkingjohn",
      fullUrl: "https://soundcloud.com/mawkingjohn",
    },
    {
      nickname: "Kanãxam",
      url: "/maxime-lbn",
      fullUrl: "https://soundcloud.com/maxime-lbn",
    },
    {
      nickname: "Soul Shaq",
      url: "/shaun-knipp",
      fullUrl: "https://soundcloud.com/shaun-knipp",
    },
    {
      nickname: "Razal Mohammed",
      url: "/razal-mohammed",
      fullUrl: "https://soundcloud.com/razal-mohammed",
    },
    {
      nickname: "DJ Meowy Mack",
      url: "/eman-rimawi-225962563",
      fullUrl: "https://soundcloud.com/eman-rimawi-225962563",
    },
    {
      nickname: "Where Is Tamlyn",
      url: "/whereistamlyn",
      fullUrl: "https://soundcloud.com/whereistamlyn",
    },
    {
      nickname: "Kaviyo",
      url: "/kaviyo",
      fullUrl: "https://soundcloud.com/kaviyo",
    },
    {
      nickname: "artisnotacrime",
      url: "/schlepphoden",
      fullUrl: "https://soundcloud.com/schlepphoden",
    },
    {
      nickname: "Зорик Сариев",
      url: "/amfy6qu5fnnd",
      fullUrl: "https://soundcloud.com/amfy6qu5fnnd",
    },
    {
      nickname: "Hype Music Toronto",
      url: "/user-804090610",
      fullUrl: "https://soundcloud.com/user-804090610",
    },
    {
      nickname: "Adam Brozek",
      url: "/adam-brozek",
      fullUrl: "https://soundcloud.com/adam-brozek",
    },
    {
      nickname: "denn15",
      url: "/den1288",
      fullUrl: "https://soundcloud.com/den1288",
    },
    {
      nickname: "DaSilva Soraia",
      url: "/dasilva-soraia",
      fullUrl: "https://soundcloud.com/dasilva-soraia",
    },
    {
      nickname: "Dr. StrehLove",
      url: "/rs160680",
      fullUrl: "https://soundcloud.com/rs160680",
    },
    {
      nickname: "Rouz boy",
      url: "/anozie-francis",
      fullUrl: "https://soundcloud.com/anozie-francis",
    },
    {
      nickname: "einfach ich",
      url: "/einfach-ich-876506896",
      fullUrl: "https://soundcloud.com/einfach-ich-876506896",
    },
    {
      nickname: "San Dy_",
      url: "/san-dy-1",
      fullUrl: "https://soundcloud.com/san-dy-1",
    },
    {
      nickname: "Jonathan Akbari",
      url: "/jonathan-akbari",
      fullUrl: "https://soundcloud.com/jonathan-akbari",
    },
    {
      nickname: "Akusuma",
      url: "/aditiya-eka-kusuma",
      fullUrl: "https://soundcloud.com/aditiya-eka-kusuma",
    },
    {
      nickname: "nøble",
      url: "/edeltobi",
      fullUrl: "https://soundcloud.com/edeltobi",
    },
    {
      nickname: "1%",
      url: "/user-908141079",
      fullUrl: "https://soundcloud.com/user-908141079",
    },
    {
      nickname: "carlo",
      url: "/pascalgassmann31",
      fullUrl: "https://soundcloud.com/pascalgassmann31",
    },
    {
      nickname: "(13)QuesTionTheNORM!(13)",
      url: "/questionthenorm",
      fullUrl: "https://soundcloud.com/questionthenorm",
    },
    {
      nickname: "Sascha M",
      url: "/sascha_m_music",
      fullUrl: "https://soundcloud.com/sascha_m_music",
    },
    {
      nickname: "VIACHESLAV KOSHELEV",
      url: "/lckbwthgjx0e",
      fullUrl: "https://soundcloud.com/lckbwthgjx0e",
    },
    {
      nickname: "bit:bot",
      url: "/bit-bot-records",
      fullUrl: "https://soundcloud.com/bit-bot-records",
    },
    {
      nickname: "mARTIN VV",
      url: "/marcin-wo-niak-140185718",
      fullUrl: "https://soundcloud.com/marcin-wo-niak-140185718",
    },
    {
      nickname: "synthia",
      url: "/syntia-dwornik-427300588",
      fullUrl: "https://soundcloud.com/syntia-dwornik-427300588",
    },
    {
      nickname: "JollyRoger",
      url: "/nolanhunderground",
      fullUrl: "https://soundcloud.com/nolanhunderground",
    },
    {
      nickname: "Saygin",
      url: "/ssuzen",
      fullUrl: "https://soundcloud.com/ssuzen",
    },
    {
      nickname: "Josh Aaron",
      url: "/user-812530122-262049473",
      fullUrl: "https://soundcloud.com/user-812530122-262049473",
    },
    {
      nickname: "Oddodj",
      url: "/oddodj",
      fullUrl: "https://soundcloud.com/oddodj",
    },
    {
      nickname: "tmac42oh",
      url: "/tmac42oh",
      fullUrl: "https://soundcloud.com/tmac42oh",
    },
    {
      nickname: "Joule",
      url: "/joulean",
      fullUrl: "https://soundcloud.com/joulean",
    },
    {
      nickname: "Olliknolli",
      url: "/olliknolli-621330624",
      fullUrl: "https://soundcloud.com/olliknolli-621330624",
    },
    {
      nickname: "Four to the Floor",
      url: "/user-390079855",
      fullUrl: "https://soundcloud.com/user-390079855",
    },
    {
      nickname: "FUNKMEISTER",
      url: "/tino-schulz-2",
      fullUrl: "https://soundcloud.com/tino-schulz-2",
    },
    {
      nickname: "jakeen",
      url: "/jakeen8",
      fullUrl: "https://soundcloud.com/jakeen8",
    },
    {
      nickname: "futuredirectionsmusic",
      url: "/futuredirectionsmusic",
      fullUrl: "https://soundcloud.com/futuredirectionsmusic",
    },
    {
      nickname: "plan84",
      url: "/plan84",
      fullUrl: "https://soundcloud.com/plan84",
    },
    {
      nickname: "the knight",
      url: "/eftosknight",
      fullUrl: "https://soundcloud.com/eftosknight",
    },
    {
      nickname: "dangnabitt",
      url: "/dangnab",
      fullUrl: "https://soundcloud.com/dangnab",
    },
    {
      nickname: "KEY ERA",
      url: "/key-era",
      fullUrl: "https://soundcloud.com/key-era",
    },
    {
      nickname: "KOKI",
      url: "/koki-l",
      fullUrl: "https://soundcloud.com/koki-l",
    },
    {
      nickname: "ANTAI",
      url: "/antaisound",
      fullUrl: "https://soundcloud.com/antaisound",
    },
    {
      nickname: "James Barry",
      url: "/james-f-barry",
      fullUrl: "https://soundcloud.com/james-f-barry",
    },
    {
      nickname: "THE SHARED TANK",
      url: "/the-shared-tank",
      fullUrl: "https://soundcloud.com/the-shared-tank",
    },
    {
      nickname: "Thornghost",
      url: "/thornghost",
      fullUrl: "https://soundcloud.com/thornghost",
    },
    {
      nickname: "anthonys delboroco",
      url: "/anthonys-delboroco",
      fullUrl: "https://soundcloud.com/anthonys-delboroco",
    },
    {
      nickname: "Craig Adams 30",
      url: "/craig-adams-30",
      fullUrl: "https://soundcloud.com/craig-adams-30",
    },
    {
      nickname: "[MADMUSE]",
      url: "/zmadzmusez",
      fullUrl: "https://soundcloud.com/zmadzmusez",
    },
    {
      nickname: "MDF",
      url: "/user-452880378",
      fullUrl: "https://soundcloud.com/user-452880378",
    },
    {
      nickname: "ralle.musik",
      url: "/rallemusik",
      fullUrl: "https://soundcloud.com/rallemusik",
    },
    {
      nickname: "Carlos Arresa",
      url: "/carlosarresadj1",
      fullUrl: "https://soundcloud.com/carlosarresadj1",
    },
    {
      nickname: "ROB-IMPACT OFFICIAL UK",
      url: "/rob-impact-official",
      fullUrl: "https://soundcloud.com/rob-impact-official",
    },
    {
      nickname: "VERDICT",
      url: "/msop1aqy9ksp",
      fullUrl: "https://soundcloud.com/msop1aqy9ksp",
    },
    {
      nickname: "Explore-Your-Sound",
      url: "/exploreyoursound",
      fullUrl: "https://soundcloud.com/exploreyoursound",
    },
    {
      nickname: "#OVERWAVE",
      url: "/user-997985684",
      fullUrl: "https://soundcloud.com/user-997985684",
    },
    {
      nickname: "KENA",
      url: "/djkena",
      fullUrl: "https://soundcloud.com/djkena",
    },
    {
      nickname: "saschameier",
      url: "/user-576760745-605190652",
      fullUrl: "https://soundcloud.com/user-576760745-605190652",
    },
    {
      nickname: "Krapman Hugger",
      url: "/krapman_hugger",
      fullUrl: "https://soundcloud.com/krapman_hugger",
    },
    {
      nickname: "Victoria Smirnoff",
      url: "/user-477824344-517349587",
      fullUrl: "https://soundcloud.com/user-477824344-517349587",
    },
    {
      nickname: "John Paolo",
      url: "/john-paolo-vibes",
      fullUrl: "https://soundcloud.com/john-paolo-vibes",
    },
    {
      nickname: "DarkForest Mix",
      url: "/darkforestmix2",
      fullUrl: "https://soundcloud.com/darkforestmix2",
    },
    {
      nickname: "Max Mayoubi",
      url: "/max-mayoubi",
      fullUrl: "https://soundcloud.com/max-mayoubi",
    },
    {
      nickname: "Ray K",
      url: "/user-144925657",
      fullUrl: "https://soundcloud.com/user-144925657",
    },
    {
      nickname: "STEVE COLE",
      url: "/steve-cole",
      fullUrl: "https://soundcloud.com/steve-cole",
    },
    {
      nickname: "Lignes de fuite",
      url: "/lignes-de-fuite",
      fullUrl: "https://soundcloud.com/lignes-de-fuite",
    },
    {
      nickname: "Julia Gart",
      url: "/julia-gart",
      fullUrl: "https://soundcloud.com/julia-gart",
    },
    {
      nickname: "Luu Sierra",
      url: "/luu-carretero-sierra",
      fullUrl: "https://soundcloud.com/luu-carretero-sierra",
    },
    {
      nickname: "Aku Chan",
      url: "/user-565114239",
      fullUrl: "https://soundcloud.com/user-565114239",
    },
    {
      nickname: "pandora",
      url: "/bine-henkel",
      fullUrl: "https://soundcloud.com/bine-henkel",
    },
  ];

  // ========== UTILITIES ==========
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

  // Create persistent log overlay
  let logOverlay = null;
  let logContainer = null;

  function createLogOverlay() {
    if (logOverlay) return;

    logOverlay = document.createElement("div");
    logOverlay.id = "sc-dm-log-overlay";
    logOverlay.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            max-height: 300px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 12px;
            z-index: 999999;
            font-family: monospace;
            font-size: 12px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        `;

    const header = document.createElement("div");
    header.style.cssText = `
            color: #10b981;
            font-weight: bold;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #10b981;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
    header.innerHTML = `
            <span>[SC-DM] Automation Log</span>
            <button id="sc-dm-close-log" style="
                background: #ef4444;
                border: none;
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            ">Close</button>
        `;

    logContainer = document.createElement("div");
    logContainer.id = "sc-dm-log-container";

    logOverlay.appendChild(header);
    logOverlay.appendChild(logContainer);
    document.body.appendChild(logOverlay);

    // Close button handler
    document.getElementById("sc-dm-close-log").addEventListener("click", () => {
      logOverlay.style.display = "none";
    });

    // Load recent logs from localStorage
    const recentLogs = JSON.parse(
      localStorage.getItem("sc_dm_recent_logs") || "[]"
    );
    recentLogs.forEach((item) => {
      addLogToOverlay(item.msg, item.color, false);
    });
  }

  function addLogToOverlay(msg, color, saveToStorage = true) {
    if (!logContainer) createLogOverlay();

    const logEntry = document.createElement("div");
    logEntry.style.cssText = `
            color: ${color};
            margin: 4px 0;
            padding: 4px;
            border-left: 2px solid ${color};
            padding-left: 8px;
        `;
    const timestamp = new Date().toLocaleTimeString();
    logEntry.textContent = `[${timestamp}] ${msg}`;
    logContainer.appendChild(logEntry);

    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;

    // Keep overlay visible
    if (logOverlay) logOverlay.style.display = "block";

    // Save to localStorage (keep last 50 logs)
    if (saveToStorage) {
      const recentLogs = JSON.parse(
        localStorage.getItem("sc_dm_recent_logs") || "[]"
      );
      recentLogs.push({ msg, color, timestamp });
      if (recentLogs.length > 50) recentLogs.shift();
      localStorage.setItem("sc_dm_recent_logs", JSON.stringify(recentLogs));
    }
  }

  function log(msg, color = "#3b82f6") {
    console.log(
      `%c[SC-DM] ${msg}`,
      `color: ${color}; font-weight: bold; font-size: 14px;`
    );
    addLogToOverlay(msg, color);
  }

  // Create overlay on script load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createLogOverlay);
  } else {
    createLogOverlay();
  }

  // ========== STATE MANAGEMENT ==========

  // Lock mechanism to prevent duplicate sends
  function acquireLock(url) {
    const locks = JSON.parse(localStorage.getItem("sc_dm_locks") || "{}");
    const now = Date.now();

    // Clean up old locks (> 5 minutes old)
    Object.keys(locks).forEach((key) => {
      if (now - locks[key] > 300000) {
        delete locks[key];
      }
    });

    // Check if locked
    if (locks[url] && now - locks[url] < 300000) {
      return false; // Already locked
    }

    // Acquire lock
    locks[url] = now;
    localStorage.setItem("sc_dm_locks", JSON.stringify(locks));
    return true;
  }

  function releaseLock(url) {
    const locks = JSON.parse(localStorage.getItem("sc_dm_locks") || "{}");
    delete locks[url];
    localStorage.setItem("sc_dm_locks", JSON.stringify(locks));
  }

  function loadQueue() {
    try {
      const data = localStorage.getItem("sc_dm_queue");
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  function saveQueue(queue) {
    localStorage.setItem("sc_dm_queue", JSON.stringify(queue));
  }

  function clearQueue() {
    localStorage.removeItem("sc_dm_queue");
  }

  function loadHistory() {
    try {
      const data = localStorage.getItem("sc_dm_history");
      if (!data) return new Set();
      const history = JSON.parse(data);
      return new Set(history.messaged || []);
    } catch (err) {
      return new Set();
    }
  }

  function saveToHistory(url, historySet) {
    historySet.add(url);
    const data = {
      lastUpdated: new Date().toISOString(),
      totalMessaged: historySet.size,
      messaged: Array.from(historySet),
    };
    localStorage.setItem("sc_dm_history", JSON.stringify(data));

    // CRITICAL: Verify the save actually worked
    const verification = localStorage.getItem("sc_dm_history");
    if (!verification || !verification.includes(url)) {
      log(
        "⚠️ WARNING: History save verification failed! Retrying...",
        "#ef4444"
      );
      localStorage.setItem("sc_dm_history", JSON.stringify(data));
    }
  }

  // ========== MESSAGE SENDING ==========
  async function typeHumanLike(element, text) {
    element.focus();
    element.value = "";

    for (const char of text) {
      element.value += char;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(rand(CONFIG.TYPING_DELAY_MIN, CONFIG.TYPING_DELAY_MAX));
    }
  }

  async function clickMessageButton() {
    await sleep(3000);

    const selectors = [
      ".sc-button-message",
      'button[title="Message"]',
      'button[aria-label="Message"]',
      'a[title="Message"]',
    ];

    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn && btn.offsetParent !== null) {
        // Use proper mouse events
        btn.dispatchEvent(
          new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        await sleep(50);
        btn.dispatchEvent(
          new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        await sleep(50);
        btn.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        await sleep(rand(1500, 2500));
        return true;
      }
    }

    const buttons = Array.from(document.querySelectorAll("button"));
    const messageBtn = buttons.find((b) => b.textContent.trim() === "Message");
    if (messageBtn && messageBtn.offsetParent !== null) {
      // Use proper mouse events
      messageBtn.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await sleep(50);
      messageBtn.dispatchEvent(
        new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await sleep(50);
      messageBtn.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await sleep(rand(1500, 2500));
      return true;
    }

    return false;
  }

  async function findAndFillComposer(message) {
    const selectors = [
      'textarea[placeholder*="message" i]',
      'textarea[placeholder*="Write" i]',
      'textarea[aria-label*="message" i]',
      "textarea",
    ];

    for (const selector of selectors) {
      const textarea = document.querySelector(selector);
      if (textarea && textarea.offsetParent !== null) {
        await typeHumanLike(textarea, message);
        return textarea;
      }
    }

    return null;
  }

  async function clickSendButton() {
    // Wait a bit for button to become enabled
    await sleep(1500);

    // NEW APPROACH: Try using Enter key on the textarea instead of clicking
    log("Trying to send with Enter key...", "#3b82f6");
    const composer = document.querySelector("textarea");

    if (composer) {
      composer.focus();
      await sleep(200);

      // Press Enter (Ctrl+Enter or just Enter to submit)
      composer.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
          ctrlKey: true, // Try Ctrl+Enter first (common for send)
        })
      );

      await sleep(500);

      composer.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
        })
      );

      await sleep(2000);

      // Check if it worked
      if (composer.value.trim() === "") {
        log("✅ Message sent with Ctrl+Enter!", "#10b981");
        return true;
      }

      log("Ctrl+Enter did not work, trying plain Enter...", "#f59e0b");

      // Try plain Enter
      composer.focus();
      await sleep(200);

      composer.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        })
      );

      await sleep(500);

      composer.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        })
      );

      await sleep(2000);

      if (composer.value.trim() === "") {
        log("✅ Message sent with Enter!", "#10b981");
        return true;
      }
    }

    // If keyboard didn't work, try clicking the button
    log("Keyboard send did not work, trying button click...", "#f59e0b");

    const selectors = [
      'button[type="submit"]',
      'button[aria-label*="Send" i]',
      "button.sc-button-send",
    ];

    // Try specific selectors first
    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn && btn.offsetParent !== null) {
        log(`Found Send button with selector: ${selector}`, "#3b82f6");

        // Check if disabled
        if (btn.disabled) {
          log("Send button is disabled, waiting...", "#f59e0b");
          await sleep(2000);

          if (btn.disabled) {
            log("Send button still disabled!", "#ef4444");
            continue;
          }
        }

        log("Clicking Send button...", "#10b981");

        // Focus first
        btn.focus();
        await sleep(200);

        // Try native .click() first
        btn.click();

        // Wait and verify the message was sent
        await sleep(3000);

        // Check if message composer is now empty (indicates message was sent)
        const checkComposer = document.querySelector("textarea");
        if (checkComposer && checkComposer.value.trim() === "") {
          log("✅ Message sent successfully (composer cleared)", "#10b981");
          await sleep(rand(2000, 3000));
          return true;
        }

        // Check if Send button is still there (if gone, message was sent)
        const checkBtn = document.querySelector('button[type="submit"]');
        if (!checkBtn || checkBtn.offsetParent === null) {
          log(
            "✅ Message sent successfully (send button disappeared)",
            "#10b981"
          );
          await sleep(rand(2000, 3000));
          return true;
        }

        log(
          "⚠️  Send button clicked but message might not have sent",
          "#f59e0b"
        );
        await sleep(rand(2000, 3000));
        return true;
      }
    }

    // Try finding by text content
    const buttons = Array.from(document.querySelectorAll("button"));
    log(`Searching through ${buttons.length} buttons for Send...`, "#3b82f6");

    const sendBtn = buttons.find((b) => {
      const text = b.textContent.trim();
      return (
        text === "Send" ||
        text === "Submit" ||
        text.toLowerCase().includes("send")
      );
    });

    if (sendBtn && sendBtn.offsetParent !== null) {
      log(
        `Found Send button by text: "${sendBtn.textContent.trim()}"`,
        "#10b981"
      );

      // Check if disabled
      if (sendBtn.disabled) {
        log("Send button is disabled, waiting...", "#f59e0b");
        await sleep(2000);

        if (sendBtn.disabled) {
          log("Send button still disabled!", "#ef4444");
          return false;
        }
      }

      log("Attempting to send message...", "#10b981");

      // Method 1: Try real mouse events
      log("Method 1: Mouse events", "#3b82f6");
      sendBtn.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await sleep(50);
      sendBtn.dispatchEvent(
        new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await sleep(50);
      sendBtn.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await sleep(2000);

      // Check if it worked
      let composer = document.querySelector("textarea");
      if (composer && composer.value.trim() === "") {
        log("✅ Message sent successfully (Method 1)", "#10b981");
        await sleep(rand(2000, 3000));
        return true;
      }

      // Method 2: Try focus + Enter key on textarea
      log("Method 1 failed, trying Method 2: Enter key", "#3b82f6");
      composer = document.querySelector("textarea");
      if (composer) {
        composer.focus();
        await sleep(200);
        composer.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            ctrlKey: true,
          })
        );
        await sleep(100);
        composer.dispatchEvent(
          new KeyboardEvent("keyup", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            ctrlKey: true,
          })
        );
        await sleep(2000);

        // Check if it worked
        if (composer.value.trim() === "") {
          log("✅ Message sent successfully (Method 2)", "#10b981");
          await sleep(rand(2000, 3000));
          return true;
        }
      }

      // Method 3: Try direct .click()
      log("Method 2 failed, trying Method 3: Direct click", "#3b82f6");
      sendBtn.click();
      await sleep(2000);

      // Final check
      composer = document.querySelector("textarea");
      if (composer && composer.value.trim() === "") {
        log("✅ Message sent successfully (Method 3)", "#10b981");
        await sleep(rand(2000, 3000));
        return true;
      }

      // Check if Send button disappeared (might indicate success)
      const checkBtn = document.querySelector('button[type="submit"]');
      if (!checkBtn || checkBtn.offsetParent === null) {
        log("✅ Message sent (send button disappeared)", "#10b981");
        await sleep(rand(2000, 3000));
        return true;
      }

      log("⚠️  All send methods failed - composer still has text", "#f59e0b");
      await sleep(rand(2000, 3000));
      return true;
    }

    log("❌ Could not find Send button!", "#ef4444");
    log("Available buttons:", "#f59e0b");
    buttons.slice(0, 10).forEach((b) => {
      console.log(
        `  - "${b.textContent.trim()}" (type: ${b.type}, disabled: ${
          b.disabled
        })`
      );
    });

    return false;
  }

  // ========== MAIN AUTOMATION ==========
  async function processCurrentProfile(queue) {
    const currentProfile = queue.profiles[0];
    const currentPath = window.location.pathname;

    // CRITICAL: Acquire lock to prevent duplicate sends from multiple tabs/instances
    if (!acquireLock(currentProfile)) {
      log(
        `⏭️  SKIPPED: ${currentProfile} is locked (another instance is processing)`,
        "#f59e0b"
      );
      queue.profiles.shift();
      queue.processed++;
      queue.skipped++;
      saveQueue(queue);
      await moveToNext(queue);
      return;
    }

    // CRITICAL: Double-check history before sending (prevent duplicates)
    const currentHistory = loadHistory();
    if (currentHistory.has(currentProfile)) {
      log(
        `⏭️  SKIPPED: ${currentProfile} already in history (duplicate prevention)`,
        "#f59e0b"
      );
      releaseLock(currentProfile);
      queue.profiles.shift();
      queue.processed++;
      queue.skipped++;
      saveQueue(queue);
      await moveToNext(queue);
      return;
    }

    // Find the follower object to get the real nickname
    const follower = FOLLOWERS.find((f) => f.url === currentProfile);
    const nickname = follower
      ? follower.nickname
      : currentProfile.replace(/^\//, "");

    log(
      `[${queue.processed + 1}/${queue.total}] Processing ${nickname}...`,
      "#3b82f6"
    );

    if (currentPath !== currentProfile) {
      log(
        `Wrong profile. Expected ${currentProfile}, got ${currentPath}`,
        "#f59e0b"
      );
      await sleep(2000);
      window.location.href = window.location.origin + currentProfile;
      return;
    }

    try {
      // Click Message button
      log("Looking for Message button...", "#3b82f6");
      const messageClicked = await clickMessageButton();

      if (!messageClicked) {
        log("Skipped: Message button not found", "#f59e0b");
        releaseLock(currentProfile);
        queue.profiles.shift();
        queue.processed++;
        queue.skipped++;
        saveQueue(queue);
        await moveToNext(queue);
        return;
      }

      log("Message button clicked", "#10b981");
      await sleep(2000);

      // Type message with real nickname
      const personalizedMessage = CONFIG.MESSAGE.replace(
        /\{nickname\}/gi,
        nickname
      )
        .replace(/\{username\}/gi, nickname)
        .replace(/\{name\}/gi, nickname)
        .replace(/\{user\}/gi, nickname);

      log("Typing message...", "#3b82f6");
      const composer = await findAndFillComposer(personalizedMessage);

      if (!composer) {
        log("Failed: Could not find composer", "#ef4444");
        releaseLock(currentProfile);
        queue.profiles.shift();
        queue.processed++;
        queue.failed++;
        saveQueue(queue);
        await moveToNext(queue);
        return;
      }

      log("Message typed", "#10b981");
      await sleep(1000);

      // Send
      log("Clicking Send button...", "#3b82f6");
      const sendClicked = await clickSendButton();

      if (!sendClicked) {
        log("Failed: Could not find Send button", "#ef4444");
        releaseLock(currentProfile);
        queue.profiles.shift();
        queue.processed++;
        queue.failed++;
        saveQueue(queue);
        await moveToNext(queue);
        return;
      }

      // CRITICAL: Wait longer and verify message was actually sent
      log("Waiting for message to send...", "#3b82f6");
      await sleep(3000);

      // Check if composer is cleared (message sent)
      const finalComposer = document.querySelector("textarea");
      if (finalComposer && finalComposer.value.trim() !== "") {
        log(
          "❌ ERROR: Message was NOT sent! Composer still has text.",
          "#ef4444"
        );
        log("Skipping this user to avoid errors.", "#f59e0b");
        releaseLock(currentProfile);
        queue.profiles.shift();
        queue.processed++;
        queue.failed++;
        saveQueue(queue);
        await moveToNext(queue);
        return;
      }

      log("✅ Message sent successfully!", "#10b981");

      // CRITICAL: Save to history IMMEDIATELY and verify
      const historySet = loadHistory();
      saveToHistory(currentProfile, historySet);

      // Force synchronous verification
      await sleep(500);
      const verifyHistory = loadHistory();
      if (!verifyHistory.has(currentProfile)) {
        log("❌ CRITICAL: History save failed! Saving again...", "#ef4444");
        saveToHistory(currentProfile, historySet);
        await sleep(500);
      }

      log(`✅ Verified save to history (total: ${historySet.size})`, "#10b981");

      // Release lock after successful send
      releaseLock(currentProfile);

      // Update queue
      queue.profiles.shift();
      queue.processed++;
      queue.sent++;
      saveQueue(queue);

      await moveToNext(queue);
    } catch (err) {
      log(`Error: ${err.message}`, "#ef4444");

      // Release lock on error
      releaseLock(currentProfile);
      queue.profiles.shift();
      queue.processed++;
      queue.failed++;
      saveQueue(queue);
      await moveToNext(queue);
    }
  }

  async function moveToNext(queue) {
    if (queue.profiles.length > 0) {
      const nextProfile = queue.profiles[0];
      log(
        `Moving to next profile in ${CONFIG.DELAY_BEFORE_NEXT / 1000}s...`,
        "#3b82f6"
      );
      await sleep(CONFIG.DELAY_BEFORE_NEXT);
      window.location.href = window.location.origin + nextProfile;
    } else {
      log("========================================", "#10b981");
      log("ALL DONE!", "#10b981");
      log(
        `Sent: ${queue.sent} | Skipped: ${queue.skipped} | Failed: ${queue.failed}`,
        "#3b82f6"
      );
      log("========================================", "#10b981");
      clearQueue();
    }
  }

  // ========== PUBLIC API ==========
  window.start = function (maxUsers) {
    log("🚀 Starting DM automation...", "#10b981");
    log(`Total followers: ${FOLLOWERS.length}`, "#3b82f6");

    if (FOLLOWERS.length === 0) {
      log("❌ No followers data! Check the script.", "#ef4444");
      return;
    }

    const historySet = loadHistory();
    if (historySet.size > 0) {
      log(`Found ${historySet.size} previously messaged users`, "#3b82f6");
    }

    const unmessaged = FOLLOWERS.filter((u) => !historySet.has(u.url));
    log(`${unmessaged.length} followers remaining to message`, "#10b981");

    if (unmessaged.length === 0) {
      log("✅ All followers already messaged!", "#10b981");
      return;
    }

    const limit = maxUsers || CONFIG.MAX_PER_RUN;
    const toProcess = unmessaged.slice(0, limit).map((u) => u.url);

    const queue = {
      profiles: toProcess,
      total: toProcess.length,
      processed: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
    };

    saveQueue(queue);
    log(`Queue created with ${toProcess.length} profiles`, "#10b981");
    log(`First profile: ${toProcess[0]}`, "#3b82f6");
    log(`Starting in ${CONFIG.DELAY_BEFORE_NEXT / 1000}s...`, "#3b82f6");

    setTimeout(() => {
      window.location.href = window.location.origin + toProcess[0];
    }, CONFIG.DELAY_BEFORE_NEXT);
  };

  window.stop = function () {
    clearQueue();
    log("❌ Automation stopped and queue cleared", "#f59e0b");
  };

  window.viewHistory = function () {
    const history = loadHistory();
    log(`📊 Total messaged: ${history.size}`, "#3b82f6");
    console.log("Users:", Array.from(history));
    return Array.from(history);
  };

  window.clearHistory = function () {
    if (confirm("⚠️  Are you sure you want to clear ALL message history?")) {
      localStorage.removeItem("sc_dm_history");
      log("✅ History cleared!", "#10b981");
      log("All users can now be messaged again.", "#3b82f6");
    } else {
      log("Cancelled", "#f59e0b");
    }
  };

  window.removeFromHistory = function (userUrl) {
    const historySet = loadHistory();

    if (!userUrl) {
      log('❌ Usage: removeFromHistory("/username")', "#ef4444");
      log('Example: removeFromHistory("/jawherr")', "#3b82f6");
      return;
    }

    // Support both with and without leading slash
    const url = userUrl.startsWith("/") ? userUrl : "/" + userUrl;

    if (historySet.has(url)) {
      historySet.delete(url);

      const data = {
        lastUpdated: new Date().toISOString(),
        totalMessaged: historySet.size,
        messaged: Array.from(historySet),
      };
      localStorage.setItem("sc_dm_history", JSON.stringify(data));

      log(`✅ Removed ${url} from history`, "#10b981");
      log(`Total messaged: ${historySet.size}`, "#3b82f6");
    } else {
      log(`❌ User ${url} not found in history`, "#ef4444");
      log("💡 Use viewHistory() to see all users", "#f59e0b");
    }
  };

  window.removeMultipleFromHistory = function (userUrls) {
    if (!Array.isArray(userUrls) || userUrls.length === 0) {
      log(
        '❌ Usage: removeMultipleFromHistory(["/user1", "/user2"])',
        "#ef4444"
      );
      return;
    }

    const historySet = loadHistory();
    let removed = 0;

    userUrls.forEach((userUrl) => {
      const url = userUrl.startsWith("/") ? userUrl : "/" + userUrl;
      if (historySet.has(url)) {
        historySet.delete(url);
        removed++;
      }
    });

    if (removed > 0) {
      const data = {
        lastUpdated: new Date().toISOString(),
        totalMessaged: historySet.size,
        messaged: Array.from(historySet),
      };
      localStorage.setItem("sc_dm_history", JSON.stringify(data));

      log(`✅ Removed ${removed} users from history`, "#10b981");
      log(`Total messaged: ${historySet.size}`, "#3b82f6");
    } else {
      log("❌ No users found in history", "#ef4444");
    }
  };

  window.checkStatus = function () {
    const queue = loadQueue();
    if (!queue) {
      log("No active queue", "#3b82f6");
      return;
    }
    log(`Queue: ${queue.processed}/${queue.total} processed`, "#3b82f6");
    log(
      `Sent: ${queue.sent} | Skipped: ${queue.skipped} | Failed: ${queue.failed}`,
      "#3b82f6"
    );
    log(`Remaining: ${queue.profiles.length}`, "#3b82f6");
  };

  // Manual test - Click Send button
  window.testSendClick = async function () {
    log("🧪 Testing Send button click...", "#3b82f6");

    const result = await clickSendButton();

    if (result) {
      log("✅ Click function returned true", "#10b981");

      // Wait and check if message was sent
      await sleep(3000);

      const composer = document.querySelector("textarea");
      if (composer && composer.value.trim() === "") {
        log("✅ SUCCESS: Message was sent! Composer is empty.", "#10b981");
      } else {
        log(
          "❌ FAILED: Composer still has text. Send did not work!",
          "#ef4444"
        );
        log(
          `   Composer value: "${composer ? composer.value : "not found"}"`,
          "#f59e0b"
        );
      }
    } else {
      log("❌ Click function returned false - button not found", "#ef4444");
    }
  };

  // Test function to find Send button manually
  window.findSendButton = function () {
    log("🔍 Looking for Send button...", "#3b82f6");

    const selectors = [
      'button[type="submit"]',
      'button[aria-label*="Send" i]',
      "button.sc-button-send",
    ];

    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn) {
        console.log(`✅ Found with selector: ${selector}`, btn);
        console.log(`   Visible: ${btn.offsetParent !== null}`);
        console.log(`   Disabled: ${btn.disabled}`);
        console.log(`   Text: "${btn.textContent.trim()}"`);
      }
    }

    const buttons = Array.from(document.querySelectorAll("button"));
    log(`Total buttons on page: ${buttons.length}`, "#3b82f6");

    const sendBtn = buttons.find((b) => {
      const text = b.textContent.trim();
      return (
        text === "Send" ||
        text === "Submit" ||
        text.toLowerCase().includes("send")
      );
    });

    if (sendBtn) {
      console.log("✅ Found Send button by text:", sendBtn);
      console.log(`   Text: "${sendBtn.textContent.trim()}"`);
      console.log(`   Disabled: ${sendBtn.disabled}`);
      console.log(`   Visible: ${sendBtn.offsetParent !== null}`);
      console.log(`   Type: ${sendBtn.type}`);
    } else {
      log("❌ Could not find Send button", "#ef4444");
      log("First 20 buttons on page:", "#f59e0b");
      buttons.slice(0, 20).forEach((b, i) => {
        console.log(
          `  ${i + 1}. "${b.textContent.trim()}" (type: ${b.type}, disabled: ${
            b.disabled
          })`
        );
      });
    }
  };

  // Log overlay controls
  window.showLogs = function () {
    if (logOverlay) {
      logOverlay.style.display = "block";
      log("✅ Log overlay shown", "#10b981");
    }
  };

  window.hideLogs = function () {
    if (logOverlay) {
      logOverlay.style.display = "none";
    }
    console.log(
      "%c[SC-DM] Log overlay hidden (use showLogs() to show again)",
      "color: #f59e0b; font-weight: bold;"
    );
  };

  window.clearLogs = function () {
    localStorage.removeItem("sc_dm_recent_logs");
    if (logContainer) {
      logContainer.innerHTML = "";
    }
    log("✅ Logs cleared!", "#10b981");
  };

  // ========== AUTO-PROCESS IF QUEUE EXISTS ==========
  const currentUrl = window.location.href;
  const queue = loadQueue();

  if (
    queue &&
    queue.profiles.length > 0 &&
    !currentUrl.includes("/followers")
  ) {
    processCurrentProfile(queue);
  } else if (!queue || queue.profiles.length === 0) {
    log("Commands:", "#3b82f6");
    log("  start() - Start sending messages (default: 2 users)", "#3b82f6");
    log("  start(10) - Send to 10 users", "#3b82f6");
    log("  stop() - Stop automation", "#3b82f6");
    log("  checkStatus() - View current progress", "#3b82f6");
    log("  viewHistory() - View message history", "#3b82f6");
    log("  clearHistory() - Clear ALL history", "#3b82f6");
    log('  removeFromHistory("/username") - Remove one user', "#3b82f6");
    log(
      '  removeMultipleFromHistory(["/user1", "/user2"]) - Remove multiple',
      "#3b82f6"
    );
    log("  showLogs() - Show log overlay", "#3b82f6");
    log("  hideLogs() - Hide log overlay", "#3b82f6");
    log("  clearLogs() - Clear log history", "#3b82f6");
    log("  findSendButton() - Test Send button detection", "#3b82f6");
    log("  testSendClick() - Test if Send button actually works", "#3b82f6");
  }
})();
