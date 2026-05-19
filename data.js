// NFFL War Room — data

// Generate dates: Sun Aug 23 → Wed Sep 9 2026, excluding Fridays & Saturdays
function generateNFFLDates() {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const start = new Date(2026, 7, 23); // Aug 23 2026
  const end = new Date(2026, 8, 9); // Sep 9 2026
  const dates = [];
  let i = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow !== 5 && dow !== 6) {
      // skip Fri/Sat
      dates.push({
        id: "d" + i,
        day: dayNames[dow],
        short: cur.getMonth() + 1 + "/" + cur.getDate(),
        full:
          dayNames[dow] +
          ", " +
          monthNames[cur.getMonth()] +
          " " +
          cur.getDate(),
      });
      i++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const NFFL_DATES = generateNFFLDates();

window.LEAGUES = {
  wags: {
    id: "wags",
    name: "NFFL Wags",
    badge: "Wags",
    est: "EST · 1995",
    logo: "assets/nffl-wags.png",
    sub: "12 managers · The OG",
    managers: [
      { name: "DJ", team: "Delusional Jokers" },
      { name: "Ken", team: "Blue Suede Shoestring Tackles" },
      { name: "Rob", team: "Timmy Turner" },
      { name: "Craig", team: "Mo Often Than Not" },
      { name: "Tolva", team: "BTTDLGEAOSBCBWSOP" },
      { name: "Rich", team: "Biggus Dickus" },
      { name: "Bill", team: "GrubHub" },
      { name: "Manish", team: "Manny Handled" },
      { name: "Chris", team: "Bud Lightyear" },
      { name: "John", team: "Meister Irrelevant" },
      { name: "Greg", team: "Mulligan Makers" },
      { name: "Todd", team: "Go Frech Yourself" },
    ],
    dates: NFFL_DATES,
  },
  fex: {
    id: "fex",
    name: "NFFL Fex",
    badge: "Fex",
    est: "EST · 1998",
    logo: "assets/nffl-wags.png", // TODO: replace with assets/nffl-fex.png when provided
    logoPlaceholder: true,
    sub: "12 managers · The Sequel",
    managers: [
      { name: "Ken", team: "Four Sure" },
      { name: "Dan", team: "Let The Wookie Win" },
      { name: "Merim", team: "Busts Cuts and Garbage" },
      { name: "Rob", team: "Muskegon Mohawks" },
      { name: "Megan", team: "Quettabytes" },
      { name: "KMac", team: "Wor Machine" },
      { name: "Kush", team: "Fantasy Jhawarma" },
      { name: "Mark", team: "Caleb Due" },
      { name: "Tom", team: "Watch and Learn" },
      { name: "Sean", team: "Live Free Baby" },
      { name: "Mike", team: "Ulta-mate Underachievers" },
      { name: "Kristian", team: "Parsons' Pack" },
    ],
    dates: NFFL_DATES,
  },
};

// Empty seed — users will build up responses themselves
window.SEED_RESPONSES = {
  wags: Object.fromEntries(
    window.LEAGUES.wags.managers.map((m) => [m.name, { note: "" }]),
  ),
  fex: Object.fromEntries(
    window.LEAGUES.fex.managers.map((m) => [m.name, { note: "" }]),
  ),
};

// Only "Ken" is commissioner. Same in both leagues.
window.ADMIN_NAME = "Ken";
