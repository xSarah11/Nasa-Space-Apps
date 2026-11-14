import type { Rover } from "./types";

// ReliQ focuses on ONE vehicle per world:
//   • Moon → Surveyor 3 (NASA lander, 1967)
//   • Mars → Opportunity (NASA rover, 2004–2018)
//
// FACT POLICY — every number and event below comes ONLY from these NASA sources:
//   1. NASA NSSDCA (nssdc.gsfc.nasa.gov) — spacecraft, experiment, image-catalog and fact-sheet pages
//   2. NASA Science — Surveyor 3:        https://science.nasa.gov/mission/surveyor-3/
//   3. NASA Science — Spirit & Opportunity: https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/
//      (and its "Science Highlights" sub-page)
// Facts that are popular online but NOT in these sources were removed on purpose
// (e.g. the naming-contest story, "Purgatory" dune, Heat Shield Rock, the 32° slope record, the exact eclipse date).
// The same facts feed the chatbot through data/nasa_knowledge.json — keep both files in sync.

const NSSDC_S3 = "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A";
const NSSDC_OPP = "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A";

export const rovers: Rover[] = [
  // ───────────────────────────── MOON ─────────────────────────────
  {
    id: "surveyor-3",
    planet: "moon",
    kind: "lander",
    name: { ar: "سيرفيور ٣", en: "Surveyor 3" },
    agency: { ar: "ناسا (مختبر الدفع النفاث JPL)", en: "NASA (Jet Propulsion Laboratory)" },
    country: { ar: "الولايات المتحدة", en: "United States" },
    flag: "🇺🇸",
    landingDate: "1967-04-20",
    landingSite: { ar: "جنوب شرق محيط العواصف", en: "Southeastern Oceanus Procellarum (Ocean of Storms)" },
    // NSSDCA: 3.0162° S, 336.582° E (from LRO images) → 23.418° W
    lat: -3.0162,
    lng: -23.418,
    model: "surveyor",
    massKg: 296,
    nasaImagesQuery: "Surveyor 3",
    accent: "#8fd3ff",
    summary: {
      ar: "المركبة التي اختبرت تربة القمر قبل رواد أبولو — ثم زارها رائدا فضاء بعد نحو سنتين ونصف!",
      en: "The lander that tested the Moon's soil before the Apollo astronauts — and was visited by two of them about 2½ years later!",
    },
    story: {
      ar: "انطلقت سيرفيور ٣ في ١٧ أبريل ١٩٦٧ لتساعد ناسا في التحضير لهبوط رواد أبولو. أربكت انعكاسات لامعة رادارها، فلمست السطح ثلاث مرات قبل أن تستقر في ٢٠ أبريل داخل فوهة بعرض نحو ٢٠٠ متر. أرسلت ٦٣٢٦ صورة، وحفرت خنادق بمجرفتها، وأثبتت أن التربة قوية بما يكفي لتحمل المركبة القمرية لأبولو. وفي ٢٠ نوفمبر ١٩٦٩ مشى إليها رائدا أبولو ١٢ وأعادا نحو ١٠ كغ من أجزائها إلى الأرض، ومنها كاميرتها.",
      en: "Surveyor 3 launched on 17 April 1967 to help NASA prepare for the Apollo landings. Bright reflections confused its radar, so it touched the surface three times before settling on 20 April inside a crater about 200 m wide. It sent 6,326 pictures, dug trenches with its scoop, and showed the soil was strong enough to hold an Apollo Lunar Module. On 20 November 1969, two Apollo 12 astronauts walked over to it and brought about 10 kg of its parts — including its camera — back to Earth.",
    },
    persona: [
      {
        icon: "👋",
        date: "1967",
        title: { ar: "من أنا؟", en: "Who am I?" },
        text: {
          ar: "مرحبًا، أنا سيرفيور ٣! لست مركبة جوالة بعجلات، بل مركبة هبوط بثلاث أرجل، طولي نحو ٣ أمتار. كنت المركبة الثانية من سلسلة سيرفيور التي تهبط بنعومة على القمر. أرسلتني ناسا لأساعد في التحضير لرحلات أبولو: هل سطح القمر آمن لهبوط البشر؟ كنت الكشّاف الذي يسبقهم.",
          en: "Hi, I'm Surveyor 3! I'm not a rover with wheels — I'm a three-legged lander, about 3 metres tall. I was the second Surveyor to make a soft landing on the Moon. NASA sent me to help prepare for the Apollo flights: was the Moon's surface safe for humans to land on? I was the scout that went first.",
        },
      },
      {
        icon: "🚀",
        date: "1967-04-17",
        title: { ar: "الانطلاق", en: "Liftoff" },
        text: {
          ar: "في ١٧ أبريل ١٩٦٧ الساعة ٠٧:٠٥:٠١ بالتوقيت العالمي انطلقت على صاروخ أطلس-سنتور من مجمع الإطلاق 36B في كيب كانافيرال. وضعتني مرحلة سنتور أولًا في مدار انتظار حول الأرض على ارتفاع ١٦٧ كم، ثم اشتعلت مرة ثانية ودفعتني نحو القمر. كانت كتلتي ١٠٢٦ كغ عند الإطلاق.",
          en: "On 17 April 1967 at 07:05:01 UT I lifted off on an Atlas-Centaur rocket from Launch Complex 36B at Cape Canaveral. The Centaur stage first put me in a 167 km parking orbit around Earth, then fired a second time to send me to the Moon. I weighed 1,026 kg at launch.",
        },
      },
      {
        icon: "🔥",
        date: "1967-04-20",
        title: { ar: "الفرملة فوق القمر", en: "Braking above the Moon" },
        text: {
          ar: "على ارتفاع ٧٦ كم كنت أندفع بسرعة ٢٦٢٦ مترًا في الثانية! أشعل الرادار صاروخي الكابح الرئيسي فخفّض سرعتي إلى ١٣٧ م/ث، ثم تخلّصت منه وتابعت النزول بثلاثة محركات صغيرة قابلة للتحكم. بعد الهبوط صارت كتلتي ٢٩٦ كغ فقط.",
          en: "At 76 km altitude I was rushing along at 2,626 metres per second! My radar fired my main braking rocket, which slowed me to 137 m/s. Then I dropped it and kept descending on three small throttleable engines. After landing I weighed only 296 kg.",
        },
      },
      {
        icon: "😵‍💫",
        date: "1967-04-20",
        title: { ar: "هبوط مرتبك… ثلاث مرات!", en: "A bumpy landing… three times!" },
        text: {
          ar: "قبل لحظات من الهبوط أربكت انعكاسات لامعة من الصخور رادارَيّ، فلم تتوقف محركاتي على ارتفاع ٤٫٣ متر كما خُطط. لمست السطح وارتفعت نحو ١٠ أمتار، ثم لمسته مرة ثانية وارتفعت نحو ٣ أمتار! أوقف الفريق محركاتي بأمر من الأرض بعد ٣٤ ثانية من أول لمسة. لمست السطح أول مرة الساعة ٠٠:٠٤:١٧ واستقررت نهائيًا الساعة ٠٠:٠٤:٥٣ بالتوقيت العالمي، على منحدر ميله ١٤ درجة داخل فوهة بعرض نحو ٢٠٠ متر.",
          en: "Just before touchdown, bright reflections from the rocks confused my radars, so my engines didn't shut off at 4.3 m as planned. I touched the ground and rose about 10 m, then touched again and rose about 3 m! The team shut my engines off by command from Earth, 34 seconds after the first touch. My first touchdown was at 00:04:17 UT and my final one at 00:04:53 UT — on a 14° slope inside a crater about 200 m wide.",
        },
      },
      {
        icon: "📷",
        date: "1967-04",
        title: { ar: "عيني على القمر", en: "My eye on the Moon" },
        text: {
          ar: "بعد أقل من ساعة من هبوطي وصلت أولى صوري إلى الأرض. كاميرتي التلفزيونية لها عدستان (٢٥ و١٠٠ ملم) وتنظر عبر مرآة تتحرك أفقيًا وعموديًا. الصورة الواحدة (٢٠٠ سطر) كانت تحتاج نحو ٢٠ ثانية لتُرسل، ومع ذلك أرسلت ٦٣٢٦ صورة!",
          en: "Less than an hour after landing, my first pictures reached Earth. My TV camera has two lenses (25 mm and 100 mm) and looks through a mirror that moves sideways and up-and-down. One 200-line picture took about 20 seconds to send — and still I sent 6,326 of them!",
        },
      },
      {
        icon: "⛏️",
        date: "1967-04-22",
        title: { ar: "أول حفرة لي", en: "My first dig" },
        text: {
          ar: "أفخر ما عندي هو مجرفتي: مغرفة طولها ١٢ سم وعرضها ٥ سم على ذراع تمتد ١٫٥ متر. بدأت العمل بعد يومين من هبوطي، واشتغلت ١٨ ساعة و٢٢ دقيقة. بأوامر من الأرض حفرت ٤ خنادق بعمق يصل إلى ١٨ سم، وأجريت ٤ اختبارات ضغط و١٣ اختبار طرق. النتيجة؟ التربة تشبه الرمل المبلل وتتحمل نحو ٠٫٧ كغ لكل سم² — أي أنها تكفي لحمل المركبة القمرية لأبولو!",
          en: "My proudest tool is my scoop: 12 cm long and 5 cm wide, on an arm that reaches 1.5 m. I started using it two days after landing and worked it for 18 hours 22 minutes. Following commands from Earth, I dug 4 trenches up to 18 cm deep and ran 4 bearing tests and 13 impact tests. The result? The soil behaves like wet sand and can bear about 0.7 kg per cm² — strong enough to hold an Apollo Lunar Module!",
        },
      },
      {
        icon: "🌘",
        date: "1967",
        title: { ar: "كسوف رأيته من القمر", en: "An eclipse seen from the Moon" },
        text: {
          ar: "خلال مهمتي مرّت الأرض أمام الشمس كما أراها من مكاني على القمر. التقطت صورًا لهذا الكسوف — كسوف الشمس بالأرض — وسجلت قياسات حرارية أثناءه. منظر لا يمكن رؤيته من الأرض نفسها!",
          en: "During my mission, Earth passed in front of the Sun as seen from my spot on the Moon. I took pictures of this eclipse of the Sun by Earth and recorded temperature measurements during it — a view you can't get from Earth itself!",
        },
      },
      {
        icon: "🌑",
        date: "1967-05-04",
        title: { ar: "ليلة القمر الطويلة", en: "The long lunar night" },
        text: {
          ar: "طاقتي تأتي من لوح شمسي فيه ٧٩٢ خلية، يولد حتى ٨٥ واط ويخزن الطاقة في بطاريات فضة-زنك. عملت طوال النهار القمري حتى ما بعد غروب الشمس يوم ٣ مايو، وأرسلت آخر بياناتي يوم ٤ مايو ١٩٦٧ الساعة ٠٠:٠٤ بالتوقيت العالمي. بعد الليل القمري الذي يدوم أسبوعين لم أستيقظ مرة أخرى.",
          en: "My power comes from a solar panel with 792 cells that makes up to 85 watts and stores it in silver-zinc batteries. I worked through the whole lunar day until after sunset on 3 May, and sent my last data on 4 May 1967 at 00:04 UT. After the two-week lunar night, I never woke up again.",
        },
      },
      {
        icon: "👨‍🚀",
        date: "1969-11-20",
        title: { ar: "زوّار من الأرض!", en: "Visitors from Earth!" },
        text: {
          ar: "في ١٩ نوفمبر ١٩٦٩ (بالتوقيت العالمي) هبطت المركبة القمرية «إنتربيد» لرحلة أبولو ١٢ على بعد نحو ١٨٠ مترًا مني! وفي اليوم التالي، خلال جولتهما الثانية على السطح، مشى إليّ رائدا الفضاء بيت كونراد وآلان بين، وصوّراني، وأخذا نحو ١٠ كغ من أجزائي — منها كاميرتي ومجرفتي — ليدرس العلماء أثر بقائها نحو سنتين ونصف على القمر. كاميرتي معروضة اليوم في متحف سميثسونيان الوطني للطيران والفضاء في واشنطن.",
          en: "On 19 November 1969 (UT), Apollo 12's lunar module Intrepid landed about 180 m from me! The next day, on their second moonwalk, astronauts Pete Conrad and Alan Bean walked over, photographed me and removed about 10 kg of my parts — including my camera and my scoop — so scientists could study the effects of nearly 2½ years on the Moon. My camera is now on display at the Smithsonian National Air and Space Museum in Washington, D.C.",
        },
      },
    ],
    achievements: [
      { ar: "أثبتت أن تربة القمر تتحمل المركبة القمرية لأبولو", en: "Showed that lunar soil could support an Apollo Lunar Module" },
      { ar: "أول مركبة سيرفيور تحمل مجرفة، وحفرت بها ٤ خنادق حتى عمق ١٨ سم", en: "First Surveyor to carry a scoop — it dug 4 trenches up to 18 cm deep" },
      { ar: "أرسلت ٦٣٢٦ صورة تلفزيونية من سطح القمر", en: "Sent 6,326 TV pictures from the lunar surface" },
      { ar: "زارها رائدا أبولو ١٢ وأعادا نحو ١٠ كغ من أجزائها إلى الأرض", en: "Visited by the Apollo 12 crew, who brought about 10 kg of its parts back to Earth" },
    ],
    stats: [
      { label: { ar: "الكتلة عند الهبوط", en: "Landed mass" }, value: { ar: "٢٩٦ كغ", en: "296 kg" } },
      { label: { ar: "الصور", en: "Pictures" }, value: { ar: "٦٣٢٦ صورة", en: "6,326" } },
      { label: { ar: "الخنادق", en: "Trenches dug" }, value: { ar: "٤ (حتى ١٨ سم)", en: "4 (up to 18 cm)" } },
      { label: { ar: "العمل على السطح", en: "Surface operations" }, value: { ar: "٢٠ أبريل – ٤ مايو ١٩٦٧", en: "20 Apr – 4 May 1967" } },
    ],
    parts: [
      {
        id: "camera",
        mesh: "camera",
        icon: "📷",
        name: { ar: "الكاميرا التلفزيونية", en: "TV Camera" },
        role: {
          ar: "كاميرا بعدستين (٢٥ و١٠٠ ملم) تحت مرآة تتحرك أفقيًا وعموديًا، فتلتقط صورًا في كل الاتجاهات دون أن تتحرك الكاميرا نفسها.",
          en: "A camera with two lenses (25 mm and 100 mm) under a mirror that moves sideways and up-and-down, so it can photograph in every direction without moving itself.",
        },
        funFact: {
          ar: "أعادها رائدا أبولو ١٢ إلى الأرض، وهي اليوم معروضة في متحف سميثسونيان للطيران والفضاء.",
          en: "The Apollo 12 astronauts brought it back to Earth — it's now on display at the Smithsonian Air and Space Museum.",
        },
      },
      {
        id: "sampler",
        mesh: "arm",
        icon: "⛏️",
        name: { ar: "المجرفة (جهاز أخذ العينات)", en: "Surface Sampler (Scoop)" },
        role: {
          ar: "مغرفة ١٢×٥ سم على ذراع تمتد ١٫٥ متر. حفرت الخنادق واختبرت صلابة التربة بالضغط عليها وطرقها.",
          en: "A 12 × 5 cm scoop on an arm that reached 1.5 m. It dug trenches and tested how firm the soil was by pressing and tapping it.",
        },
        funFact: {
          ar: "اكتشفت أن تربة القمر تتصرف مثل الرمل المبلل!",
          en: "It found that lunar soil behaves like wet sand!",
        },
      },
      {
        id: "legs",
        mesh: "legs",
        icon: "🦵",
        name: { ar: "أرجل الهبوط الثلاث", en: "Three Landing Legs" },
        role: {
          ar: "ثلاث أرجل مفصلية فيها ممتصات صدمات وكتل ألمنيوم قابلة للانضغاط، وتنتهي بوسائد قدم ذات قيعان قابلة للانضغاط تمتص صدمة الهبوط.",
          en: "Three hinged legs with shock absorbers and crushable aluminium blocks, ending in footpads with crushable bottoms that soak up the landing shock.",
        },
        funFact: {
          ar: "لأن الرادار ارتبك، لمست المركبة السطح ثلاث مرات (ارتدت نحو ١٠ م ثم نحو ٣ م) قبل أن تستقر.",
          en: "Because its radar got confused, the lander touched down three times (bouncing about 10 m, then about 3 m) before settling.",
        },
      },
    ],
    sources: [
      { title: "NASA Science — Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/" },
      { title: "NASA NSSDCA — Surveyor 3 (1967-035A)", url: NSSDC_S3 },
      { title: "NASA NSSDCA — Surveyor 3 Television experiment", url: "https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1967-035A-01" },
      { title: "NASA NSSDCA — Apollo 12 Lunar Module (visit to Surveyor 3)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C" },
    ],
    mission: {
      title: { ar: "مهمة: هل القمر آمن للبشر؟", en: "Mission: Is the Moon Safe for Humans?" },
      intro: {
        ar: "أنت في فريق سيرفيور ٣ عام ١٩٦٧. رحلات أبولو تنتظر إجابتك!",
        en: "You're on the Surveyor 3 team in 1967. The Apollo flights are waiting for your answer!",
      },
      steps: [
        {
          situation: {
            ar: "أثناء الهبوط أربكت انعكاسات لامعة الرادار، ولم تتوقف المحركات على ارتفاع ٤٫٣ م. ماذا حدث للمركبة؟",
            en: "During landing, bright reflections confused the radar and the engines didn't stop at 4.3 m. What happened to the lander?",
          },
          options: [
            { text: { ar: "تحطمت على السطح", en: "It crashed into the surface" }, correct: false },
            { text: { ar: "لمست السطح ثلاث مرات ثم استقرت بأمان", en: "It touched down three times, then settled safely" }, correct: true },
            { text: { ar: "عادت إلى مدار القمر", en: "It flew back into lunar orbit" }, correct: false },
          ],
          explanation: {
            ar: "ارتفعت نحو ١٠ أمتار ثم نحو ٣ أمتار، وأوقف الفريق المحركات بأمر من الأرض بعد ٣٤ ثانية، فاستقرت في المرة الثالثة.",
            en: "It rose about 10 m, then about 3 m; the team shut the engines off by command from Earth after 34 seconds, and it settled on the third touch.",
          },
        },
        {
          situation: {
            ar: "ناسا تريد أن تعرف: هل التربة قوية بما يكفي لتحمل مركبة رواد الفضاء؟ أي جزء تستخدم؟",
            en: "NASA needs to know: is the soil strong enough to hold the astronauts' lander? Which part do you use?",
          },
          options: [
            { text: { ar: "المجرفة: أحفر وأضغط على التربة وأطرقها", en: "The scoop: dig, press and tap the soil" }, correct: true },
            { text: { ar: "الكاميرا فقط", en: "Only the camera" }, correct: false },
            { text: { ar: "أنتظر رواد الفضاء ليجربوا بأنفسهم", en: "Wait for the astronauts to try it themselves" }, correct: false },
          ],
          explanation: {
            ar: "حفرت المجرفة ٤ خنادق وأجرت ٤ اختبارات ضغط و١٣ اختبار طرق: التربة تشبه الرمل المبلل وتتحمل المركبة القمرية.",
            en: "The scoop dug 4 trenches and ran 4 bearing tests and 13 impact tests: the soil behaved like wet sand and could hold the Lunar Module.",
          },
        },
        {
          situation: {
            ar: "في نوفمبر ١٩٦٩ وصل رائدا أبولو ١٢ بجانب المركبة. ماذا يأخذان معهما إلى الأرض؟",
            en: "In November 1969 the Apollo 12 astronauts arrive next to the lander. What do they take back to Earth?",
          },
          options: [
            { text: { ar: "المركبة كلها", en: "The whole lander" }, correct: false },
            { text: { ar: "لا شيء، يصورانها فقط", en: "Nothing — they just take photos" }, correct: false },
            { text: { ar: "نحو ١٠ كغ من أجزائها، منها الكاميرا والمجرفة", en: "About 10 kg of its parts, including the camera and scoop" }, correct: true },
          ],
          explanation: {
            ar: "أعاد كونراد وبين نحو ١٠ كغ من الأجزاء ليدرس العلماء أثر بقائها قرابة سنتين ونصف على سطح القمر.",
            en: "Conrad and Bean brought back about 10 kg of parts so scientists could study the effects of nearly 2½ years on the lunar surface.",
          },
        },
      ],
    },
  },

  // ───────────────────────────── MARS ─────────────────────────────
  {
    id: "opportunity",
    planet: "mars",
    kind: "rover",
    name: { ar: "أوبورتيونيتي", en: "Opportunity" },
    agency: { ar: "ناسا (مختبر الدفع النفاث JPL)", en: "NASA (Jet Propulsion Laboratory)" },
    country: { ar: "الولايات المتحدة", en: "United States" },
    flag: "🇺🇸",
    landingDate: "2004-01-25",
    landingSite: { ar: "سهل ميريدياني — فوهة «إيغل»", en: "Meridiani Planum — Eagle crater" },
    // NSSDCA: 1.946° S, 354.473° E → 5.527° W
    lat: -1.946,
    lng: -5.527,
    model: "mer",
    massKg: 185,
    nasaImagesQuery: "Opportunity rover",
    accent: "#9fe3b0",
    summary: {
      ar: "صُممت لمهمة مدتها ثلاثة أشهر… فاستكشفت المريخ أكثر من ١٤ سنة!",
      en: "Built for a three-month mission… it explored Mars for more than 14 years!",
    },
    story: {
      ar: "أوبورتيونيتي هي التوأم الثاني للمركبة «سبيريت»، ومهمتهما البحث عن علامات ماء قديم على المريخ. هبطت في ٢٥ يناير ٢٠٠٤ داخل فوهة صغيرة في سهل ميريدياني، ووجدت كريات غنية بالهيماتيت سُميت «التوت الأزرق»، وهو معدن يتكون عادة في الماء. ثم وجدت عند فوهة إنديفور عروق جبس ومعادن طينية تكوّنت في ماء متعادل. قطعت ٤٥٫١٦ كم، حتى غطّت عاصفة غبار عالمية موقعها وصمتت في يونيو ٢٠١٨.",
      en: "Opportunity was the second of the twin rovers with Spirit, sent to look for signs of past water on Mars. It landed on 25 January 2004 inside a small crater in Meridiani Planum and found hematite-rich balls nicknamed 'blueberries' — a mineral that typically forms in water. Later, at Endeavour crater, it found gypsum veins and clay minerals formed in neutral water. It drove 45.16 km before a planet-wide dust storm covered its location and it fell silent in June 2018.",
    },
    persona: [
      {
        icon: "👋",
        date: "2003",
        title: { ar: "من أنا؟", en: "Who am I?" },
        text: {
          ar: "أهلًا، أنا أوبورتيونيتي! اسمي الرسمي «مركبة استكشاف المريخ B»، ولي توأم مطابق اسمه «سبيريت». مهمتنا: البحث في الصخور والتربة عن أدلة على ماء جرى على المريخ قديمًا. عندي ست عجلات لكل منها محرك خاص، وجناحان شمسيان، وذراع تحمل أدوات علمية.",
          en: "Hi, I'm Opportunity! My official name is Mars Exploration Rover B, and I have an identical twin called Spirit. Our job: search rocks and soil for evidence of water that flowed on Mars long ago. I have six wheels, each with its own motor, two solar wings, and an arm full of science tools.",
        },
      },
      {
        icon: "🚀",
        date: "2003-07-07",
        title: { ar: "الرحلة إلى الكوكب الأحمر", en: "Off to the Red Planet" },
        text: {
          ar: "انطلقت من كيب كانافيرال على صاروخ دلتا ٢ الثقيل (7925H) ليلة ٧ يوليو ٢٠٠٣ بالتوقيت الأمريكي الشرقي — أي ٨ يوليو الساعة ٠٣:١٨ بالتوقيت العالمي. كنت مطويّة داخل منصة هبوط ودرع حراري. كتلتي أنا، المركبة الجوالة، ١٨٥ كغ.",
          en: "I launched from Cape Canaveral on a heavy Delta II (7925H) on the night of 7 July 2003 Eastern time — that's 8 July at 03:18 UT. I was folded up inside a landing platform and a heat shield. I, the rover, weigh 185 kg.",
        },
      },
      {
        icon: "🔥",
        date: "2004-01-25",
        title: { ar: "الدخول والهبوط", en: "Entry and landing" },
        text: {
          ar: "دخلت غلاف المريخ بسرعة ١٩٣٠٠ كم/ساعة! أبطأني الدرع الحراري إلى ١٦٠٠ كم/ساعة خلال نحو أربع دقائق، ثم فُتحت المظلة فصارت سرعتي نحو ٣٠٠ كم/ساعة. على ارتفاع نحو ١٠٠ متر اشتعلت صواريخ الفرملة وانتفخت الوسائد الهوائية حولي. اصطدمت بالأرض بسرعة نحو ٥٠ كم/ساعة، فارتددت وتدحرجت… حتى توقفت داخل فوهة صغيرة قطرها نحو ٢٠ مترًا!",
          en: "I hit the Martian atmosphere at 19,300 km/h! My heat shield slowed me to 1,600 km/h in about four minutes, then my parachute opened and brought me to about 300 km/h. At about 100 m, braking rockets fired and airbags inflated around me. I hit the ground at roughly 50 km/h, bounced and rolled… and stopped inside a small crater about 20 m across!",
        },
      },
      {
        icon: "🕳️",
        date: "2004-01",
        title: { ar: "داخل فوهة «إيغل»", en: "Inside Eagle crater" },
        text: {
          ar: "كان ذلك يوم ٢٥ يناير ٢٠٠٤ بالتوقيت العالمي (٢٤ يناير بتوقيت المحيط الهادئ)، في ظهيرة صيف جنوبي على المريخ. خلال أول ٤ أيام رفعت ساريتي ووقفت ثم نزلت عن منصة الهبوط. أمامي كانت صخور طبقية لا يتجاوز ارتفاعها ١٠ سم — وكانت بداية القصة كلها!",
          en: "That was 25 January 2004 UT (24 January Pacific time), early afternoon in the southern summer on Mars. During my first 4 days I raised my mast, stood up and drove off my landing platform. In front of me were layered rocks only 10 cm tall — and they were the beginning of the whole story!",
        },
      },
      {
        icon: "🫐",
        date: "2004-02-23",
        title: { ar: "التوت الأزرق", en: "The 'blueberries'" },
        text: {
          ar: "في الصخور حولي كانت كريات صغيرة بحجم ١ إلى ٢ ملم، سماها فريقي «التوت الأزرق». في يومي المريخي الثلاثين (٢٣ فبراير ٢٠٠٤) كشطت صخرة اسمها «ماكيتريك» بعمق ٤ ملم، فانقسمت فيها حبتان من التوت إلى نصفين! تبيّن أنها غنية بالهيماتيت، وهو معدن يتكون عادة في الماء. ودلّت صخور فوهتي على مياه مالحة تبخرت قديمًا.",
          en: "In the rocks around me were tiny balls 1 to 2 mm across — my team nicknamed them 'blueberries'. On my 30th sol (23 February 2004) I ground 4 mm into a rock called 'McKittrick' and sliced two blueberries in half! They turned out to be rich in hematite, a mineral that typically forms in water. And the rocks of my crater pointed to a body of salty water that had evaporated long ago.",
        },
      },
      {
        icon: "🏟️",
        date: "2004-06",
        title: { ar: "نافذة على الماضي: فوهة إنديورانس", en: "A window to the past: Endurance crater" },
        text: {
          ar: "فوهة «إيغل» لم تكن عميقة بما يكفي لتخبرنا بما حدث قبل الماء، فقدت إلى فوهة أكبر اسمها «إنديورانس» ودخلتها في يونيو ٢٠٠٤. جدرانها المكشوفة كانت نافذة على ما تحت السطح، وفيها ثلاث طبقات صخرية مختلفة على الأقل.",
          en: "Eagle crater wasn't deep enough to show what came before the water, so I drove to a bigger crater called Endurance and entered it in June 2004. Its exposed walls were a window into what lies beneath the surface, with at least three distinct bands of rock.",
        },
      },
      {
        icon: "🧭",
        date: "2011-08",
        title: { ar: "فوهة عملاقة اسمها إنديفور", en: "A giant crater called Endeavour" },
        text: {
          ar: "زرت أكثر من ١٠٠ فوهة بكل الأحجام، لكن أكبر رحلاتي كانت إلى فوهة «إنديفور» بعرض ٢٢ كم، وبدأت دراستها في أغسطس ٢٠١١ من حافتها الغربية. هناك وجدت عروقًا لامعة من الجبس — علامة على ماء جرى في شقوق تحت الأرض — ومعادن طينية تكوّنت في ماء متعادل الحموضة. كانت أكثر بيئة ملائمة لحياة ميكروبية قديمة بين كل الأماكن التي درستها.",
          en: "I visited well over 100 craters of all sizes, but my biggest journey was to Endeavour crater, 22 km across. I began studying its western rim in August 2011. There I found bright gypsum veins — a sign water flowed through underground cracks — and clay minerals formed in neutral-pH water. It was the friendliest setting for ancient microbial life of all the places I studied.",
        },
      },
      {
        icon: "🏅",
        date: "2015-03-24",
        title: { ar: "ماراثون على المريخ", en: "A marathon on Mars" },
        text: {
          ar: "في ٢٤ مارس ٢٠١٥ (يومي المريخي ٣٩٦٨) قدت ٤٦٫٥ مترًا فصار مجموع ما قطعته ٤٢٫١٩٨ كم — مسافة ماراثون كاملة! وفي ٢٠١٤ نظّفت الرياح كثيرًا من الغبار عن ألواحي الشمسية، فظهرت لامعة في صورتي الذاتية.",
          en: "On 24 March 2015 (my sol 3968) I drove 46.5 m, bringing my total to 42.198 km — a full marathon distance! And in 2014 the wind had cleaned a lot of dust off my solar panels — you can see them shining in my self-portrait.",
        },
      },
      {
        icon: "🌪️",
        date: "2018-06-10",
        title: { ar: "العاصفة الأخيرة", en: "The last storm" },
        text: {
          ar: "في يونيو ٢٠١٨ غطّت عاصفة غبار عالمية المريخ كله وحجبت الشمس عن موقعي، وأنا أعمل بالطاقة الشمسية. كان آخر اتصال لي مع الأرض يوم ١٠ يونيو ٢٠١٨، بعد أكثر من ١٤ سنة من الاستكشاف و٤٥٫١٦ كم من القيادة. ظل رقمي كأطول مسافة قطعتها مركبة خارج الأرض صامدًا حتى ١١ أكتوبر ٢٠٢٦، حين وصلت Perseverance إلى ٤٥٫٢٢ كم. صُممت لثلاثة أشهر فقط… لكن الفرصة لا تضيع أبدًا!",
          en: "In June 2018 a planet-wide dust storm covered Mars and blocked the sunlight at my location — and I run on solar power. My last contact with Earth was on 10 June 2018, after more than 14 years of exploring and 45.16 km of driving. My record as the farthest-driving vehicle beyond Earth stood until 11 October 2026, when Perseverance reached 45.22 km. I was built for just three months… but an opportunity is never wasted!",
        },
      },
    ],
    achievements: [
      { ar: "قطعت ٤٥٫١٦ كم — رقم قياسي خارج الأرض صمد حتى أكتوبر ٢٠٢٦", en: "Drove 45.16 km — an off-Earth distance record that stood until October 2026" },
      { ar: "وجدت كريات الهيماتيت «التوت الأزرق» التي تتكون عادة في الماء", en: "Found hematite 'blueberries', which typically form in water" },
      { ar: "وجدت عروق الجبس والمعادن الطينية عند فوهة إنديفور", en: "Found gypsum veins and clay minerals at Endeavour crater" },
      { ar: "عملت أكثر من ١٤ سنة بدل ثلاثة أشهر، وزارت أكثر من ١٠٠ فوهة", en: "Worked more than 14 years instead of three months, visiting well over 100 craters" },
    ],
    stats: [
      { label: { ar: "كتلة المركبة الجوالة", en: "Rover mass" }, value: { ar: "١٨٥ كغ", en: "185 kg" } },
      { label: { ar: "المسافة", en: "Distance" }, value: { ar: "٤٥٫١٦ كم", en: "45.16 km" } },
      { label: { ar: "المخطط", en: "Planned" }, value: { ar: "≈ ٣ أشهر", en: "≈ 3 months" } },
      { label: { ar: "الفعلي", en: "Actual" }, value: { ar: "أكثر من ١٤ سنة", en: "14+ years" } },
    ],
    parts: [
      {
        id: "solar",
        mesh: "solar",
        icon: "☀️",
        name: { ar: "الألواح الشمسية", en: "Solar Panels" },
        role: {
          ar: "جناحان شمسيان يولدان حتى ١٤٠ واط تحت شمس كاملة، وتُخزَّن الطاقة في بطاريتين قابلتين للشحن. الغبار المتراكم عليها كان أكبر خطر على المركبة.",
          en: "Solar wings that make up to 140 W in full sunlight, storing the energy in two rechargeable batteries. Dust piling up on them was the rover's biggest danger.",
        },
        funFact: {
          ar: "في صورتها الذاتية عام ٢٠١٤ ظهرت الألواح نظيفة لأن الرياح أزالت عنها كثيرًا من الغبار.",
          en: "In its 2014 self-portrait the panels looked clean, because the wind had blown much of the dust away.",
        },
      },
      {
        id: "mast",
        mesh: "mast",
        icon: "📷",
        name: { ar: "سارية الكاميرات (Pancam)", en: "Camera Mast (Pancam)" },
        role: {
          ar: "سارية ترتفع نحو ١٫٤ متر عن قاعدة العجلات، فوقها الكاميرا البانورامية (Pancam) وكاميرات الملاحة، وتعمل أيضًا كمنظار لمطياف Mini-TES الذي يقرأ الحرارة المنبعثة من الصخور.",
          en: "A mast about 1.4 m above the wheels, topped by the panoramic camera (Pancam) and navigation cameras. It also works as a periscope for the Mini-TES spectrometer, which reads the heat glowing from rocks.",
        },
        funFact: {
          ar: "بانوراما «الأسد الملك» تتكون من ٥٥٨ صورة، وكانت أكبر بانوراما التقطتها المركبتان في ٢٠٠٤.",
          en: "The 'Lion King' panorama is made of 558 images — the largest panorama either rover took in 2004.",
        },
      },
      {
        id: "arm",
        mesh: "arm",
        icon: "🦾",
        name: { ar: "الذراع وأداة الكشط (RAT)", en: "Arm & Rock Grinder (RAT)" },
        role: {
          ar: "ذراع مفصلية في نهايتها أربع أدوات: أداة كشط الصخور (RAT)، ومطياف APXS، ومطياف موسباور، وكاميرا مجهرية.",
          en: "A hinged arm carrying four tools at its end: the Rock Abrasion Tool (RAT), the APXS spectrometer, a Mössbauer spectrometer and a Microscopic Imager.",
        },
        funFact: {
          ar: "أول كشط لها كان لصخرة «ماكيتريك»: عمق ٤ ملم وقطر ٤٥٫٥ ملم، وقسم حبتين من «التوت الأزرق» إلى نصفين.",
          en: "Its first grind was on the rock 'McKittrick': 4 mm deep, 45.5 mm wide — and it sliced two 'blueberries' in half.",
        },
      },
    ],
    sources: [
      { title: "NASA Science — Mars Exploration Rovers: Spirit and Opportunity", url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/" },
      { title: "NASA Science — Spirit & Opportunity: Science Highlights", url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/" },
      { title: "NASA NSSDCA — Opportunity (2003-032A)", url: NSSDC_OPP },
      { title: "NASA NSSDCA — Mars Rover \"Opportunity\" Images", url: "https://nssdc.gsfc.nasa.gov/planetary/mars/mars_exploration_rovers/merb_images.html" },
    ],
    mission: {
      title: { ar: "مهمة: صياد الماء", en: "Mission: Water Hunter" },
      intro: {
        ar: "أنت في فريق قيادة أوبورتيونيتي. ابحث عن دليل الماء وحافظ على الطاقة.",
        en: "You're on Opportunity's driving team. Find evidence of water and save your power.",
      },
      steps: [
        {
          situation: {
            ar: "الغبار تراكم على الألواح الشمسية والطاقة تنخفض. ما القرار الأذكى؟",
            en: "Dust has piled on the solar panels and power is dropping. What's the smartest call?",
          },
          options: [
            { text: { ar: "أقلل الأنشطة وأوفر الطاقة، فالرياح قد تنظف الألواح", en: "Cut activities and save power — the wind may clean the panels" }, correct: true },
            { text: { ar: "أقود بسرعة لأنفض الغبار", en: "Drive fast to shake the dust off" }, correct: false },
            { text: { ar: "أشغّل كل الأجهزة معًا", en: "Turn on all instruments at once" }, correct: false },
          ],
          explanation: {
            ar: "الألواح الشمسية هي مصدر الطاقة الوحيد. وقد سجّلت المركبة فعلًا أن الرياح أزالت كثيرًا من الغبار عن ألواحها بحلول أوائل ٢٠١٤.",
            en: "The solar panels are the only power source — and the rover really recorded that wind had cleared much of the dust from its panels by early 2014.",
          },
        },
        {
          situation: {
            ar: "تريد أن ترى ما داخل صخرة، لا سطحها المغبر فقط. أي أداة تستخدم؟",
            en: "You want to see inside a rock, not just its dusty surface. Which tool do you use?",
          },
          options: [
            { text: { ar: "الكاميرا البانورامية من بعيد", en: "The panoramic camera from far away" }, correct: false },
            { text: { ar: "أداة كشط الصخور (RAT) على الذراع", en: "The Rock Abrasion Tool (RAT) on the arm" }, correct: true },
            { text: { ar: "أدهس الصخرة بالعجلات", en: "Run the rock over with the wheels" }, correct: false },
          ],
          explanation: {
            ar: "في أول كشط لها كشطت الأداة صخرة «ماكيتريك» بعمق ٤ ملم، فكشفت مادة جديدة لتدرسها الكاميرا المجهرية والمطيافان.",
            en: "On its first grind, the RAT cut 4 mm into 'McKittrick', exposing fresh rock for the microscopic imager and the two spectrometers.",
          },
        },
        {
          situation: {
            ar: "وجدت كريات صغيرة غنية بالهيماتيت. ماذا تخبرنا؟",
            en: "You found tiny balls rich in hematite. What do they tell us?",
          },
          options: [
            { text: { ar: "أنها دليل على أن الماء كان موجودًا هنا", en: "That water was once present here" }, correct: true },
            { text: { ar: "أنها بذور نباتات", en: "That they are plant seeds" }, correct: false },
            { text: { ar: "أنها سقطت من مركبة سابقة", en: "That they fell off an earlier spacecraft" }, correct: false },
          ],
          explanation: {
            ar: "الهيماتيت يتكون عادة في الماء، ولهذا كان «التوت الأزرق» من أهم أدلة الماضي المائي في سهل ميريدياني.",
            en: "Hematite typically forms in water, which is why the 'blueberries' were key evidence of a watery past at Meridiani Planum.",
          },
        },
      ],
    },
  },
];

export function getRover(id: string): Rover | undefined {
  return rovers.find((r) => r.id === id);
}

export function getRoversByPlanet(planet: string): Rover[] {
  return rovers.filter((r) => r.planet === planet);
}
