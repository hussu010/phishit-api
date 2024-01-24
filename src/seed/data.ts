import { faker } from "@faker-js/faker";

const adventures = [
  {
    title: "Everest",
    description:
      "Embark on an unforgettable adventure with the Everest Base Camp Trek, a classic trekking experience that beckons adventure enthusiasts to the heart of the Himalayas. As you traverse the iconic trail through the Sagarmatha National Park, you'll witness breathtaking vistas of majestic snowcapped peaks. The trek offers encounters with the warm hospitality of local teahouses scattered along the route, providing essential shelter and nourishment. Immerse yourself in the rich culture of the mountainous region, home to Sherpas, revered for their mountaineering prowess. The journey encompasses not only the famed Everest Base Camp but also stunning detours like the Everest Gokyo Lake Trek, revealing the wild beauty of lush slopes, rocky summits, and the serene Gokyo Lakes. This trek promises an awe-inspiring exploration of the world's highest peaks and the unique landscapes of the Everest region.",
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    },
    imageUrl: faker.image.urlLoremFlickr({ category: "nature" }),
    imageAlt: faker.lorem.words(3),
    images: [
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 1,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 2,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 3,
      },
    ],
    packages: [
      {
        title: "Everest Base Camp Trek",
        description:
          "The Everest Base Camp Trek is a famous trek in Nepal that offers a unique and unforgettable experience. The trek begins and concludes in Lukla, a small town in the Khumbu region. The trail passes through the Sagarmatha National Park, a UNESCO World Heritage Site, and offers a glimpse into the Sherpa culture and lifestyle. The trail also provides stunning views of the Himalayan ranges, including Mt. Everest, Mt. Lhotse, Mt. Nuptse, Mt. Ama Dablam, Mt. Thamserku, and Mt. Pumori. The difficulty level varies from moderate to difficult, making it suitable for those who are physically fit and can handle moderate to difficult challenges.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 7, max: 15 }),
      },
      {
        title: "Everest High Passes Trek",
        description:
          "For enthusiasts of mountain landscapes, the Everest High Pass Trek is the pinnacle of adventure! An extended version of the Everest Base Camp (EBC) trek, it distinguishes itself by incorporating three high passes into the usual EBC itinerary. Renowned as the Three Pass Trek, this journey provides the ultimate Everest experience, reaching heights of 5,000 meters above sea level. With technical challenges and strenuous terrain, you'll traverse the Himalayan passes of Renjo La (5,345 m), Kongma La (5,535 m), and Cho La (5,420m), while marveling at Everest, Cho Oyu, Makalu, and Lhotse. Destinations like Everest Base Camp, Gokyo lakes, Kala Patthar, Gokyo Ri, and the world's largest glacier, Ngozumpa, await exploration on this mountain delight.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 12, max: 15 }),
      },
      {
        title: "Everest Gokyo Lake Trek",
        description:
          "The Everest Gokyo Lake Trek seamlessly combines the classic Everest Base Camp route with a side trip to the stunning Gokyo Lake. Journeying through the Sagarmatha National Park, you'll immerse yourself in the heart of the Himalayas, treated to unparalleled views of snowcapped peaks. The trail is dotted with cozy teahouses providing essential shelter and nourishment. Along the way, you'll explore remote mountain villages, home to the skilled Sherpas, renowned mountaineers. The trek's highlights include the towering mountains surrounding Gokyo Valley and the captivating landscapes of lush slopes and rocky summits.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 14, max: 15 }),
      },
    ],
  },
  {
    title: "Annapurna",
    description:
      "Embark on a mesmerizing journey through the Annapurna region, a trekker's paradise in Nepal. The Annapurna Trek offers a diverse range of landscapes, from lush forests and terraced fields to charming villages and high-altitude mountain vistas. Home to iconic peaks like Annapurna and Machhapuchhre, the trail takes you through picturesque villages, where you can immerse yourself in local culture and hospitality. With a variety of trekking routes catering to different fitness levels, the Annapurna region beckons adventurers seeking both breathtaking scenery and a cultural experience. Whether you choose the Annapurna Circuit or opt for a shorter trek like Ghorepani Poon Hill, the Annapurna region promises an unforgettable trekking adventure.",
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    },
    imageUrl: faker.image.urlLoremFlickr({ category: "nature" }),
    imageAlt: faker.lorem.words(3),
    images: [
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 1,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 2,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 3,
      },
    ],
    packages: [
      {
        title: "Annapurna Base Camp Trek",
        description:
          "The Annapurna Base Camp Trek, a renowned trek in Nepal, begins and concludes in Pokhara, a popular tourist spot nestled by Phewa Lake. This trek offers a journey through the Himalayan terrain, providing stunning views of Dhaulagiri, Annapurna, Machhepuchhre, and Hiunchuli. Along the way, you will encounter Gurung villages such as Ulleri, Ghorepani, and Chhomrong, providing insights into Gurung lifestyle and traditions. The trail also unveils breathtaking glaciers, pristine rivers, and mountain pastures. The difficulty level varies from easy to moderate, making it suitable for those who are physically fit and can handle moderate challenges.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 7, max: 14 }),
      },
      {
        title: "Annapurna Circuit Trek",
        description:
          "The Annapurna Circuit Trek leads through high-altitude villages like Manang, Chame, Pisang, Jomsom, and others. Explore remote communities, ancient monasteries, and the world's deepest gorge, Kali Gandaki (5,571 m). This high-altitude trek is challenging, requiring physical fitness and proper preparation for endurance.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 7, max: 15 }),
      },
      {
        title: "Annapurna Panorama Trek",
        description:
          "The Annapurna Panorama Trek, also known as Ghorepani Poon Hill trek, is an easy and short trek suitable for all ages and fitness levels, making it ideal for first-time trekkers. It offers an exciting and much-hyped trekking experience in Nepal. The trek takes you to Poon Hill (3,210 m), a stunning viewpoint in the Gandaki district, where you'll witness the beauty of Himalayan peaks like Machhapuchhre, Annapurna, and Dhaulagiri. The best time for this trek is in spring when the rhododendron is in full bloom. Don't miss out on this opportunity to experience your first trek in the wilderness of Gandaki!",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 7, max: 15 }),
      },
    ],
  },
  {
    title: "Mustang",
    description:
      "Nepal's Upper Mustang, often referred to as the 'Last Forbidden Kingdom', is a region of captivating beauty and cultural richness. Tucked away in the rain shadow of the Annapurna and Dhaulagiri ranges, Mustang boasts a distinctive arid landscape characterized by deep gorges, eroded canyons, and towering cliffs. Renowned for its ancient Tibetan-influenced culture, visitors to Mustang encounter medieval walled towns, centuries-old monasteries, and intricately adorned chortens. The Upper Mustang Trek takes adventurers through this mystical land, offering a glimpse into a bygone era. The stark, otherworldly terrain, combined with the region's unique cultural heritage, makes Upper Mustang a captivating destination for those seeking an off-the-beaten-path experience in the heart of the Himalayas.",
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    },
    imageUrl: faker.image.urlLoremFlickr({ category: "nature" }),
    imageAlt: faker.lorem.words(3),
    images: [
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 1,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 2,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 3,
      },
    ],
    packages: [
      {
        title: "Upper Mustang Trek",
        description:
          "The Upper Mustang Trek is a popular trek in Nepal that offers a unique and unforgettable experience. The trek begins and concludes in Pokhara, a popular tourist spot nestled by Phewa Lake. The trail passes through the Annapurna Conservation Area, a UNESCO World Heritage Site, and offers a glimpse into the Tibetan culture and lifestyle. The trail also provides stunning views of the Himalayan ranges, including Mt. Dhaulagiri, Mt. Annapurna, Mt. Nilgiri, and Mt. Machhapuchhre. The difficulty level varies from moderate to difficult, making it suitable for those who are physically fit and can handle moderate to difficult challenges.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 10, max: 17 }),
      },
    ],
  },
  {
    title: "Langtang",
    description:
      "Langtang, a region in Nepal, is a mesmerizing destination that captivates visitors with its stunning landscapes and cultural richness. Nestled in the Himalayas, the Langtang Valley is renowned for its picturesque beauty, featuring alpine meadows, dense forests, and majestic snow-capped peaks. The Langtang National Park, home to diverse flora and fauna, adds to the region's allure. The indigenous Tamang and Sherpa communities, with their unique traditions and hospitality, offer a glimpse into the rich cultural tapestry of Langtang. The Langtang Valley Trek is a popular choice for trekkers, providing an immersive experience in this Himalayan paradise. With its serene ambiance, breathtaking vistas, and warm local hospitality, Langtang stands as a testament to Nepal's natural and cultural treasures.",
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    },
    imageUrl: faker.image.urlLoremFlickr({ category: "nature" }),
    imageAlt: faker.lorem.words(3),
    images: [
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 1,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 2,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 3,
      },
    ],
    packages: [
      {
        title: "Langtang Valley Trek",
        description:
          "The Langtang Valley Trek, another easy option in Nepal, is particularly favored by first-time trekkers. It serves as an excellent warm-up for those gearing up for more strenuous adventures.\nSet against the backdrop of the stunning Langtang Himalayas, the trail winds through rhododendron forests, high alpine meadows, and bamboo forests. At 3,830 meters, Kyanjin Gompa is the landmark village, inhabited by locals from Tibetan and Lama ethnic groups, who migrated from Tibet generations ago.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 7, max: 8 }),
      },
      {
        title: "Langtang Gosaikunda Trek",
        description:
          "The Langtang Gosaikunda Helambu Trek stands as one of Nepal's most breathtaking journeys, offering a moderate difficulty level. The picturesque Langtang River valley and the enchanting Gosaikunda Lake provide a serene escape from urban life. As you traverse this stunning trail, you'll encounter magnificent freshwater lakes nestled amidst snow-capped peaks. Renowned as one of the most beautiful routes, the trek guides you from the banks of the Bhote Kosi River to the remote Hyolmo villages of Helambu, showcasing the diverse landscapes and cultural richness of the region.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 12, max: 16 }),
      },
    ],
  },
  {
    title: "Rara Lake",
    description:
      "Nestled in the far-western region of Nepal, Rara Lake stands as a serene gem, captivating all who venture to its shores. Surrounded by the Himalayas and embraced by the tranquility of Rara National Park, this pristine freshwater lake is a shimmering spectacle. Established in 1976 for conservation purposes, the park showcases a diverse ecosystem with over a thousand species of flowers and a variety of wildlife, including musk deer, leopards, and the majestic Danfe, Nepal's national bird. Rara Lake offers a peaceful retreat for nature enthusiasts, with its crystal-clear waters reflecting the beauty of the surrounding coniferous forests and snow-capped peaks.",
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    },
    imageUrl: faker.image.urlLoremFlickr({ category: "nature" }),
    imageAlt: faker.lorem.words(3),
    images: [
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 1,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 2,
      },
      {
        url: faker.image.urlLoremFlickr({ category: "nature" }),
        position: 3,
      },
    ],
    packages: [
      {
        title: "Rara Lake Trek",
        description:
          "Embark on the Rara Lake Trek in Nepal's far-western region, a mesmerizing journey off the beaten track. Encounter the wilderness of mountains and the serene beauty of shimmering lakes, with Rara Lake captivating you amidst the Himalayan backdrop. Established in 1976, Rara National Park preserves the pristine Rara Lake, surrounded by a rich variety of flora and fauna, making it a haven for nature lovers.\nThe park's coniferous forest shelters diverse wildlife, including musk deer, Himalayan black deer, leopards, and the national bird of Nepal, the Danfe. Rara Lake Trek offers solitude seekers and nature enthusiasts a unique experience, unveiling the splendor of Nepal largest lake in a lush forest beneath sparkling white mountains.",
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        duration: faker.number.int({ min: 15, max: 16 }),
      },
    ],
  },
];

const users = [
  {
    phoneNumber: "9848000000",
    username: "user1",
    roles: ["GENERAL", "GUIDE"],
    isActive: true,
  },
  {
    phoneNumber: "9863299610",
    username: "user2",
    roles: ["GENERAL", "ADMIN", "SUPER_ADMIN"],
    isActive: true,
  },
  {
    googleId: "105438825981277363287",
    username: "user3",
    roles: ["GENERAL", "GUIDE"],
    isActive: true,
  },
  {
    googleId: "106959373406842225543",
    username: "user4",
    roles: ["GENERAL", "ADMIN", "SUPER_ADMIN"],
    isActive: true,
  },
];

export { adventures, users };
