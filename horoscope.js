/* ============================================================
   THE COSMIC RESET · MONTHLY HOROSCOPE
   Written from the real sky (computed by chart.js), in plain,
   friend-to-friend language. To publish a new month:
     1) update `month`, `updated`, and the `sky` events,
     2) rewrite each sign's sections.
   Everything here is editable text. No code changes needed.
   ============================================================ */
window.TCR_HOROSCOPE = {
  month: "August 2026",
  monthShort: "August",
  updated: "2026-08-01",
  intro: "No fortune-cookie lines here. This is your month read from where the planets actually are, told the way a friend who knows astrology would tell you over coffee.",

  /* The real sky this month (from the site's own engine). Shown as a strip. */
  sky: [
    { icon: "jupiter",  title: "Jupiter in Leo",       when: "All month", body: "The planet astrologers tie to luck and growth stays in bold, warm Leo, quietly expanding whatever part of your life it's touching." },
    { icon: "newmoon",  title: "New Moon in Leo",      when: "Aug 12",    body: "The cleanest fresh-start window of the month. What you begin near this date has room to grow." },
    { icon: "venus",    title: "Venus enters Libra",   when: "Aug 7",     body: "Love, money and beauty get easier and more diplomatic. Relationships want balance, not drama." },
    { icon: "mars",     title: "Mars enters Cancer",   when: "Aug 11",    body: "Your drive turns protective and personal. You act from the gut, and home pulls focus." },
    { icon: "sun",      title: "Sun enters Virgo",     when: "Aug 23",    body: "The mood shifts from play to practical. A good stretch to tidy, plan and get real." },
    { icon: "fullmoon", title: "Full Moon in Pisces",  when: "Aug 28",    body: "An emotional high tide. Something that's been building comes to a head, gets clear, then releases." }
  ],

  signs: [
    {
      id: "aries", name: "Aries", glyph: "♈", dates: "Mar 21 – Apr 19", element: "Fire", img: "assets/graphics/g07.jpg",
      keyword: "Play is the point", mood: "Flirty, creative, a little restless",
      ratings: { love: 4, career: 3, health: 3 },
      overall: "Lighten up on purpose this month, Aries. Lucky Jupiter is sitting in your zone of romance, creativity and plain fun, so the more you let yourself play, the more doors open. Saturn has slipped back into your sign, though, so under the fun runs a quieter question: who am I becoming this year? Let both be true.",
      love: "Venus moves into your partnership zone on the 7th and it's genuinely sweet. Coupled up, things feel more balanced and affectionate. Single, someone who meets you as an equal beats a chase right now. Around the New Moon on the 12th, say the flirty thing out loud.",
      career: "Work isn't the headline, and that's fine. After the 23rd the Sun lights up your daily-work and health zone, so the last week is for tidying your systems, clearing the backlog and getting back into rhythm. Before that, don't force a big push.",
      health: "Mars is firing up your home zone, so a lot of energy goes to family and house stuff. The Full Moon on the 28th lands in your rest zone, your cue to actually stop, sleep, and let something emotional move through instead of powering past it.",
      purpose: "Saturn back in your sign is the long game: get honest about the version of you you're building. Less 'what should I do', more 'who am I willing to become'. Small, steady choices count more than grand gestures now.",
      lucky: { dates: ["Aug 3", "Aug 4", "Aug 12", "Aug 30"], note: "On the 3rd–4th (and again the 30th) the Moon is in your sign and you feel like yourself. The 12th New Moon is perfect for starting something creative or saying yes to romance." }
    },
    {
      id: "taurus", name: "Taurus", glyph: "♉", dates: "Apr 20 – May 20", element: "Earth", img: "assets/graphics/g08.jpg",
      keyword: "Home is everything", mood: "Nesting, steady, quietly warm",
      ratings: { love: 3, career: 3, health: 4 },
      overall: "Your focus comes home this month, Taurus. Lucky Jupiter is expanding your home-and-family zone all August, so it's a beautiful window to nest, move, redecorate, host, or just make your space feel like yours. Foundations you lay now tend to hold.",
      love: "Your ruler Venus spends the month in your work-and-health zone, so love shows up as care: someone useful, who helps, who makes your days run smoother. Less fireworks, more 'you look after me and I look after you'. After the 23rd, romance and fun get a fresh spark.",
      career: "Mars is buzzing through your communication zone, so days fill with messages, errands and quick decisions. Great for negotiating, pitching and getting the word out; just watch a tendency to snap when you're overloaded. Say the important thing clearly and early.",
      health: "One of your more grounded stretches. The Full Moon on the 28th lights up your friendship-and-community zone and may bring a social matter to a head; protect your energy and don't say yes out of guilt. Rest is productive for you right now.",
      purpose: "Saturn is doing quiet work in your zone of rest and the subconscious, asking you to release an old story before your next chapter properly begins. Journaling, therapy, slower mornings, this is inner maintenance, and it matters.",
      lucky: { dates: ["Aug 5", "Aug 6", "Aug 12", "Aug 22"], note: "The 5th–6th the Moon is in your sign and everything feels more solid. The 12th New Moon is ideal for a home intention: a move, a project, a fresh start under your own roof." }
    },
    {
      id: "gemini", name: "Gemini", glyph: "♊", dates: "May 21 – Jun 20", element: "Air", img: "assets/graphics/g09.jpg",
      keyword: "Ideas on fire", mood: "Curious, magnetic, mid-reinvention",
      ratings: { love: 4, career: 4, health: 3 },
      overall: "This is your kind of month, Gemini. Lucky Jupiter is parked in your zone of ideas, words and connection, so conversations, writing, learning and local adventures all carry a golden thread. And Uranus is now moving through your sign for the first time in decades, quietly reinventing how you show up. You're becoming a fresher version of yourself; let it happen.",
      love: "Venus in your romance-and-fun zone makes you the charming one this month. Dates feel playful, flirting comes easy, and fun-first energy is what draws people in. Say yes to what sounds enjoyable rather than what sounds 'sensible'.",
      career: "Mars fires up your money zone, so there's real drive to earn, ask and hustle. Paired with Jupiter blessing your communication, it's a strong month to pitch, publish, launch or negotiate. The Full Moon on the 28th brings a career matter to a visible peak, so a result or recognition may land near month's end.",
      health: "Your mind is running fast, which is exciting but can fray the nerves. Watch overcommitting; your calendar will happily overflow. After the 23rd, energy pulls toward home, and slowing down there is exactly what your system needs.",
      purpose: "Uranus in your sign is a multi-year invitation to stop performing an old identity and experiment with the real one. If you feel restless or 'not who you used to be', that's the point. Follow the curiosity that scares you a little.",
      lucky: { dates: ["Aug 7", "Aug 8", "Aug 12", "Aug 20"], note: "The 7th–8th the Moon is in your sign and you're magnetic. Use the 12th New Moon to start writing, pitch an idea, or launch anything word-driven." }
    },
    {
      id: "cancer", name: "Cancer", glyph: "♋", dates: "Jun 21 – Jul 22", element: "Water", img: "assets/graphics/g10.jpg",
      keyword: "Money and momentum", mood: "Determined, warm at home, fired-up",
      ratings: { love: 3, career: 3, health: 3 },
      overall: "Your season just ended, and the focus turns practical, Cancer. Lucky Jupiter is expanding your money-and-self-worth zone, so this is a genuinely strong month to grow your income, raise your rates, or invest in something lasting. From the 11th, Mars enters your sign and hands you a surge of drive; you'll feel more like acting and less like waiting.",
      love: "Venus warms your home zone, so love lives close to the nest: cosy nights in, tending your people, making your space safe. Single, connections that feel like home appeal more than anything flashy. Just watch that the Mars-in-your-sign spark doesn't turn into snapping at the people you love.",
      career: "Saturn is retrograde in your career zone, so the theme is 'restructure, don't rush'. Something about your ambition or public role is being rebuilt on firmer ground. Revisit, refine and get clear on what you actually want before you push forward after the 23rd.",
      health: "With Mars entering your sign, energy comes back online after the 11th; use it, but channel it so it doesn't turn into irritability or a short fuse. Movement burns off the extra charge. The Full Moon on the 28th may bring a travel or big-picture realisation.",
      purpose: "The New Moon on the 12th lands in your money zone, a clean moment to set an intention around worth, not just wealth. What would it look like to value yourself the way Jupiter is trying to? Start there.",
      lucky: { dates: ["Aug 9", "Aug 10", "Aug 11", "Aug 12"], note: "The 9th–10th the Moon is in your sign. On the 11th Mars enters Cancer and hands you drive; the 12th New Moon is perfect for a money or self-worth intention." }
    },
    {
      id: "leo", name: "Leo", glyph: "♌", dates: "Jul 23 – Aug 22", element: "Fire", img: "assets/graphics/g11.jpg",
      keyword: "Your moment", mood: "Radiant, expansive, magnetic",
      ratings: { love: 4, career: 4, health: 3 },
      overall: "This is your year, Leo, and August is the heart of it. Lucky Jupiter is in your sign for the first time in twelve years, expanding your confidence, your opportunities and the space you take up in a room. The New Moon on the 12th falls in your sign too, giving you a personal reset near your birthday season. Set the intention now; the next twelve months are built to grow it.",
      love: "Venus in your communication zone turns your words to honey; you charm through conversation, wit and attention. Dating, a good talker or someone local catches your eye. Coupled, say the warm thing out loud, it lands beautifully.",
      career: "With Jupiter and the Sun in your sign, you are the brand this month; people are drawn to you, so be visible and ask for what you want. After the 23rd the Sun moves into your money zone, turning that visibility into real conversations about pay and worth. Time your big ask for the last week.",
      health: "Honest note: Mars is in your rest-and-retreat zone, so under all the shine you tire more easily than you think. Don't confuse momentum with limitless energy. Book the early nights and protect a little solitude, and you'll sustain the glow instead of burning it.",
      purpose: "Jupiter in your sign once every twelve years is a doorway. The question isn't 'what can I get' but 'who do I want to become while it's open'. Saturn retrograde in your zone of meaning nudges you to grow with substance, not just shine.",
      lucky: { dates: ["Aug 11", "Aug 12", "Aug 15"], note: "The 11th–12th the Moon joins the Sun and Jupiter in your sign; the 12th New Moon is your personal new year. Make a wish and back it with a plan." }
    },
    {
      id: "virgo", name: "Virgo", glyph: "♍", dates: "Aug 23 – Sep 22", element: "Earth", img: "assets/graphics/g12.jpg",
      keyword: "Quiet reset, then bloom", mood: "Reflective early, then rising",
      ratings: { love: 4, career: 3, health: 4 },
      overall: "August is a month of two halves for you, Virgo. Until the 23rd, lucky Jupiter and the Sun sit in your zone of rest and closure, so the first three weeks are for finishing, releasing and recharging rather than launching. Then the Sun enters your sign on the 23rd and your ruler Mercury follows on the 25th; your season begins and you step back into the light with clarity.",
      love: "Venus glides through your money-and-values zone, so love and self-worth are linked this month: you attract more when you feel settled and valued. The Full Moon on the 28th lights up your partnership zone, bringing a relationship to an honest peak, a defining talk, a decision, or a lovely moment of clarity.",
      career: "The first three weeks aren't for big pushes; they're for wrapping loose ends and resting so you don't start your season depleted. Mars in your community zone keeps your network active, so a friend or group could open a door. Save your real launches for after the 25th, when Mercury sharpens your thinking in your own sign.",
      health: "A restorative window if you let it be. Jupiter in your rest zone genuinely rewards sleep, gentleness and letting go of what's done. Don't guilt yourself for a slower few weeks; you're refilling the tank right before your busiest, brightest season.",
      purpose: "Saturn retrograde in your intimacy-and-shared-resources zone asks for honest inner work around trust, control and letting people in. Closure now clears the runway. By your birthday you'll feel lighter and more yourself.",
      lucky: { dates: ["Aug 13", "Aug 14", "Aug 23", "Aug 25"], note: "The 13th–15th the Moon is in your sign for an early reset. The 23rd (Sun) and 25th (Mercury) enter Virgo, your real fresh start, so plan your big moves then." }
    },
    {
      id: "libra", name: "Libra", glyph: "♎", dates: "Sep 23 – Oct 22", element: "Air", img: "assets/graphics/g13.jpg",
      keyword: "Your glow-up", mood: "Magnetic, social, in demand",
      ratings: { love: 5, career: 4, health: 3 },
      overall: "Good things are pointed your way, Libra. Your ruler Venus comes home to your sign on the 7th, and for about three weeks you're more magnetic, more sure of yourself and more able to attract what (and who) you want. Meanwhile lucky Jupiter is expanding your friendships and community; say yes to invitations, because the right rooms lead somewhere.",
      love: "One of your best love windows of the year. With Venus in your sign, you draw people in just by being yourself; single, put yourself out there between the 7th and month's end. Coupled, expect a warmth-and-attraction refresh. Saturn retrograde in your partnership zone asks the deeper question underneath: is this built to last? Answer it honestly.",
      career: "Mars is powering through your career zone, so your ambition is switched on and you've got the drive to chase a real goal. The New Moon on the 12th supports a fresh start with friends or a network that can lift your work. Push, but pace the intensity so it doesn't tip into friction with colleagues.",
      health: "With Venus making you want to say yes to everything, your calendar can outrun your body. The Full Moon on the 28th lands in your health-and-routine zone, a clear signal to reset your habits: sleep, food, movement. Beauty starts with rest right now.",
      purpose: "Saturn retrograde in your relationship zone is teaching you about commitment, to others and to yourself. The lesson: harmony that costs you your truth isn't harmony. Choosing yourself is allowed.",
      lucky: { dates: ["Aug 7", "Aug 16", "Aug 17"], note: "The 7th Venus enters your sign and your glow-up window opens. The 16th–17th the Moon is in Libra; put yourself forward, ask, flirt, shine." }
    },
    {
      id: "scorpio", name: "Scorpio", glyph: "♏", dates: "Oct 23 – Nov 21", element: "Water", img: "assets/graphics/g14.jpg",
      keyword: "Career takes off", mood: "Ambitious, focused, quietly magnetic",
      ratings: { love: 3, career: 5, health: 3 },
      overall: "Eyes up, Scorpio, this is a landmark month for your ambitions. Lucky Jupiter is at the very top of your chart in your career-and-reputation zone, the best placement for professional growth you get in twelve years. Doors open, people with influence notice you, and a bigger role or public win is genuinely possible. Show up like it's happening, because it is.",
      love: "Venus tucks into your most private zone, so love runs quiet and inward this month: a secret crush, a slow-burning feeling, or simply time enjoying your own company. Then the Full Moon on the 28th ignites your romance-and-creativity zone; something you've felt building in your heart, or a creative project, reaches a beautiful peak.",
      career: "This is the headline. The New Moon on the 12th lands in your career zone, an ideal moment to launch, apply, pitch or claim a goal you want the world to see. Mars in your zone of vision and study gives you the drive to learn and widen your reach. Aim high and put your name forward.",
      health: "Saturn retrograde in your work-and-health zone asks you to rebuild routines on something sustainable, not sheer willpower. With this much career fire, your body needs guardrails. Protect sleep and don't let ambition eat the basics.",
      purpose: "Jupiter crowning your chart is a rare, expansive window to grow into a bigger public version of yourself. Ask: what do I want to be known for? This is the year to build it, and August is where it accelerates.",
      lucky: { dates: ["Aug 12", "Aug 18", "Aug 19"], note: "The 12th New Moon is your career launchpad, use it to start or ask for something big. The 18th–19th the Moon is in your sign, sharpening your instincts and presence." }
    },
    {
      id: "sagittarius", name: "Sagittarius", glyph: "♐", dates: "Nov 22 – Dec 21", element: "Fire", img: "assets/graphics/g15.jpg",
      keyword: "Wanderlust and luck", mood: "Expansive, hungry for meaning, lucky",
      ratings: { love: 3, career: 4, health: 4 },
      overall: "Your ruler is throwing you a party, Sagittarius. Lucky Jupiter sits in your zone of travel, learning and big-picture meaning all month, the most 'you' placement there is, opening doors to adventure, study, publishing, teaching, or a belief that reshapes your life. Follow what expands you. This is a horizons-widening month if you say yes.",
      love: "Venus warms your friendship zone, so love may grow from friendship, or a partner feels more like your favourite person to hang out with. Socially you're in demand. Mars in your intimacy zone turns up the heat and the depth, though: desire, shared money and 'let's get real' talks all intensify. Passion runs hot; keep it honest.",
      career: "The New Moon on the 12th supports a fresh start around study, travel or putting your ideas into the world. Then the Sun enters your career zone on the 23rd, so the last week shifts focus to ambition and status, a good stretch to be seen by the right people. Momentum builds toward month's end.",
      health: "You're in a good energy cycle, especially if you're moving your body and feeding your need for adventure. The Full Moon on the 28th lands in your home zone and may pull you back to family or roots for a moment; let yourself land before you launch again.",
      purpose: "Jupiter in your zone of meaning is a once-in-twelve-years invitation to grow your world: travel, learn, teach, believe bigger. The question this month is simple, what would make my life feel larger? Then take one real step toward it.",
      lucky: { dates: ["Aug 12", "Aug 20", "Aug 21"], note: "The 12th New Moon is perfect for booking the trip or starting the course. The 20th–22nd the Moon is in your sign and luck follows your enthusiasm, so be bold." }
    },
    {
      id: "capricorn", name: "Capricorn", glyph: "♑", dates: "Dec 22 – Jan 19", element: "Earth", img: "assets/graphics/g16.jpg",
      keyword: "Power-couple energy", mood: "Strategic, magnetic, deepening",
      ratings: { love: 4, career: 4, health: 3 },
      overall: "A month of deepening and leverage, Capricorn. Lucky Jupiter is expanding your zone of shared resources and intimacy, so support, an investment, a bonus, or a genuinely deeper bond can grow now; you don't have to do it all alone. Meanwhile Venus lifts your career zone, adding charm and warmth to how the world sees you.",
      love: "Two strong love signals. Venus in your career zone makes you attractive in a 'poise and power' way, so romance may mix with ambition or status. From the 11th, Mars enters your partnership zone and turns up both heat and honesty; passion rises, and so can friction if something's gone unsaid. Use the charge to get closer, not to spar.",
      career: "Venus in your reputation zone is a lovely time to ask, negotiate or be seen; people are inclined to like you and say yes. Jupiter in your shared-money zone favours financial conversations, funding and joining forces. After the 23rd the Sun expands your horizons zone, opening travel or learning tied to work.",
      health: "With Mars entering your relationship zone, interpersonal intensity can spike your stress. Watch the clenched-jaw, take-it-all-on pattern. The Full Moon on the 28th lights up your communication zone; something you need to say reaches a peak, so speak it and release the pressure.",
      purpose: "Saturn retrograde in your home-and-roots zone is quietly rebuilding your foundation: family, belonging, where you feel safe. Do the inner-foundation work now; everything you build on top holds better for it.",
      lucky: { dates: ["Aug 12", "Aug 23", "Aug 24"], note: "The 12th New Moon favours a money or partnership fresh start, an investment, a joining of forces. The 23rd–24th the Moon is in your sign, sharpening your focus and timing." }
    },
    {
      id: "aquarius", name: "Aquarius", glyph: "♒", dates: "Jan 20 – Feb 18", element: "Air", img: "assets/graphics/g17.jpg",
      keyword: "The relationship year", mood: "Open-hearted, magnetic to others, transforming",
      ratings: { love: 5, career: 3, health: 3 },
      overall: "Relationships are where your growth lives this month, Aquarius. Lucky Jupiter sits in your partnership zone, the best window in twelve years for a significant one-to-one: a partner, a collaborator, a person who changes your trajectory. The New Moon on the 12th also lands here, so a fresh start with someone is strongly supported. Meanwhile Pluto in your sign keeps quietly rebuilding who you are at the core.",
      love: "Genuinely one of your standout love months. Jupiter blesses commitment: meeting someone, deepening a bond, or a relationship levelling up. Venus in your zone of travel and belief adds a taste for connection that broadens your world, long-distance, someone from a different background, or love that comes with an adventure. Say yes to the introduction.",
      career: "Career isn't the loudest theme, but from the 11th Mars powers your daily-work zone, giving you drive to push through tasks and get productive. Just pace it; this placement can tip into overwork or burnout if you don't build in breaks. Steady effort beats sprinting.",
      health: "With Mars in your health-and-routine zone, movement feels good and you can build real momentum with your habits, but the same energy can run you into the ground if you ignore rest. The Full Moon on the 28th spotlights your money zone; a financial matter peaks, so tie up the loose thread.",
      purpose: "Pluto in your sign is a long, deep reinvention of your identity, and it's non-negotiable; the old self is being composted to make the real one. Let relationships this month mirror back who you're becoming. You're not who you were, and that's exactly right.",
      lucky: { dates: ["Aug 12", "Aug 25", "Aug 26"], note: "The 12th New Moon is powerful for a relationship fresh start, so make the move or have the talk. The 25th–27th the Moon is in your sign and you feel clear and magnetic." }
    },
    {
      id: "pisces", name: "Pisces", glyph: "♓", dates: "Feb 19 – Mar 20", element: "Water", img: "assets/graphics/g18.jpg",
      keyword: "Feelings peak, life aligns", mood: "Tender, creative, coming into focus",
      ratings: { love: 4, career: 4, health: 4 },
      overall: "Life gets more workable this month, Pisces. Lucky Jupiter is improving your daily-work and health zone, so a better job, smoother routines, or a body that finally feels supported are all on the table; the ordinary parts of life start going your way. And the month ends on a big personal note: the Full Moon on the 28th falls in your own sign, bringing a wave of emotional clarity about who you are and what you need.",
      love: "From the 11th, Mars lights up your romance-and-creativity zone, so passion, flirtation, dating and creative play all get energised; you're bolder about chasing what delights you. Venus deepens your intimacy zone, sweetening closeness and shared vulnerability. After the 23rd the Sun moves into your partnership zone, turning focus toward a key relationship.",
      career: "Jupiter in your work zone is a quietly lucky place to be, favouring a new role, a helpful routine, or recognition for the practical value you bring. The New Moon on the 12th is ideal for starting a healthier work rhythm or applying for something. Steady, useful effort is rewarded now.",
      health: "One of your stronger months for your body, with Jupiter supporting your health zone, use it to build a routine that actually fits you. The Full Moon in your sign on the 28th is emotionally potent: something you've felt building comes to a head. Let the feelings crest and move through; clarity is on the other side.",
      purpose: "Saturn retrograde in your money-and-worth zone is teaching you to value yourself in concrete terms, not just to give endlessly. The Full Moon in your sign is a check-in with your own heart: are you living as you, or as what everyone needs you to be? Answer gently, and adjust.",
      lucky: { dates: ["Aug 1", "Aug 2", "Aug 28", "Aug 29"], note: "The 1st–2nd the Moon is in your sign to start the month centred. The 28th Full Moon in Pisces is your emotional high point, powerful for release, clarity and honouring how you really feel." }
    }
  ]
};
