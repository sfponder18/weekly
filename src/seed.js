// Seed data for the prototype: one sample issue from a small circle of people.
// Photos are curated Unsplash images (mood over literal match). The .photo
// elements have a paper-coloured background, so any image that fails to load
// still reads as intentional.

const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

export const issue = {
  volume: 'I',
  number: 47,
  date: 'Sun · Apr 26 · 2026',
  nextDate: 'Sun · May 3',
}

// Each friend: a spread in this week's issue.
//  - photos: 1–3 image URLs (layout adapts)
//  - description: their short note for the week (the "editor's note")
//  - letterToYou: an optional private letter, shown below their spread
export const friends = [
  {
    id: 'maya',
    name: 'Maya Cordero',
    photos: [img('1502082553048-f009c37129b9'), img('1470071459604-3b5ec3a7fe05', 600), img('1500530855697-b586d89ba3ee', 600)],
    description:
      "Spent the weekend up in the Cairngorms with my brother — first time he's been over since I moved. Cold enough that the loch had a skin of ice on it in the mornings. We didn't talk much but we didn't need to.",
    letterToYou:
      "Saw your photo of the bookshop last week and it reminded me — did you ever finish the Borges? I think about that conversation we had about it more than I should admit.",
  },
  {
    id: 'jamie',
    name: 'Jamie Ruiz',
    photos: [img('1499415479124-43c32433a620')],
    description:
      'Quiet one. Just this — the light through the kitchen on Tuesday morning. Felt like enough to share.',
  },
  {
    id: 'august',
    name: 'August Pell',
    photos: [img('1447752875215-b2761acb3c5d', 600), img('1518495973542-4542c06a5843', 600)],
    description:
      "Finally moved into the place on Almond Street. Boxes everywhere, but the morning walk cuts through the old churchyard and I think I'll be alright here.",
  },
  {
    id: 'noor',
    name: 'Noor Rahimi',
    photos: [img('1490750967868-88aa4486c946'), img('1465146344425-f00d5f5c8f07', 600), img('1469474968028-56623f02e42e', 600)],
    description:
      'The garden did the thing it does in late April — everything at once, like it had been holding its breath. Cut the first sweet peas for the kitchen table. Cooked for eight on Sunday.',
  },
  {
    id: 'theo',
    name: 'Theo Bishop',
    photos: [img('1507525428034-b723cf961d3e')],
    description:
      'A short one. Swam before the cafés opened. The water was sharp enough to make me laugh out loud, alone, like a madman.',
    letterToYou: "Your quiet weeks are my favourite ones. Don't apologise for them. — T",
  },
  {
    id: 'wren',
    name: 'Wren Halloran',
    photos: [img('1441974231531-c6227db76b6e', 600), img('1495567720989-cebdbdd97913', 600)],
    description:
      'Back in the print studio after months away. Pulled a proof that was almost right and then ruined it on purpose to see what would happen. No regrets.',
  },
  {
    id: 'sol',
    name: 'Sol Ferreira',
    photos: [img('1501785888041-af3ef285b470'), img('1426604966848-d7adac402bff', 600), img('1518495973542-4542c06a5843', 600)],
    description:
      'Drove the coast road with no plan and too little petrol. Slept in the car once. Watched the fog come in over the water and decided some detours are the point.',
  },
]

// Connections who are in your circle but didn't write in this week — so the
// connections list is fuller than the issue (honest sparseness: not everyone
// publishes every week).
export const moreConnections = [
  { id: 'imogen', name: 'Imogen Vale' },
  { id: 'caleb', name: 'Caleb North' },
  { id: 'priya', name: 'Priya Anand' },
  { id: 'marlowe', name: 'Marlowe Quinn' },
  { id: 'dieter', name: 'Dieter Voss' },
  { id: 'saoirse', name: 'Saoirse Lynch' },
]

// Pending inbound requests — someone wants to connect (you accept or decline).
export const incomingRequests = [
  { id: 'rafael', name: 'Rafael Ortiz' },
  { id: 'hana', name: 'Hana Kim' },
]
