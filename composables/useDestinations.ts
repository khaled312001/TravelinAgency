import { ref } from 'vue'
import type { Destination } from '~/types/destination'

export const useDestinations = () => {
  const saudiDestinations = ref<Destination[]>([
    {
      id: 'riyadh',
      name: {
        en: 'Riyadh',
        ar: 'الرياض'
      },
      description: {
        en: 'A modern metropolis rising from the desert, blending historical heritage with futuristic vision',
        ar: 'مدينة عصرية تنهض من الصحراء، تمزج بين التراث التاريخي والرؤية المستقبلية'
      },
      region: {
        en: 'Riyadh Region',
        ar: 'منطقة الرياض'
      },
      locationType: {
        id: 'urban',
        name: {
          en: 'Urban',
          ar: 'مدينة'
        }
      },
      destinationType: {
        id: 'metropolitan',
        name: {
          en: 'Metropolitan',
          ar: 'حضري'
        }
      },
      mainImage: '/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
      touristSpots: [
        {
          id: 'kingdom-centre',
          name: {
            en: 'Kingdom Centre',
            ar: 'برج المملكة'
          },
          description: {
            en: 'Iconic 99-floor skyscraper with sky bridge observation deck',
            ar: 'ناطحة سحاب أيقونية من 99 طابقاً مع جسر سماوي للمشاهدة'
          },
          image: 'https://images.pexels.com/photos/35761/pexels-photo.jpg'
        },
        {
          id: 'diriyah',
          name: {
            en: 'Diriyah',
            ar: 'الدرعية'
          },
          description: {
            en: 'UNESCO World Heritage site and the birthplace of the first Saudi state',
            ar: 'موقع تراث عالمي لليونسكو ومهد الدولة السعودية الأولى'
          },
          image: 'https://images.pexels.com/photos/1885720/pexels-photo-1885720.jpeg'
        },
        {
          id: 'edge-of-the-world',
          name: {
            en: 'Edge of the World',
            ar: 'حافة العالم'
          },
          description: {
            en: 'Dramatic cliffs offering stunning desert views and hiking trails',
            ar: 'منحدرات دراماتيكية توفر إطلالات خلابة على الصحراء ومسارات للمشي'
          },
          image: 'https://images.pexels.com/photos/7107495/pexels-photo-7107495.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'riyadh-season',
          title: {
            en: 'Riyadh Season 2025',
            ar: 'موسم الرياض 2025'
          },
          description: {
            en: 'Annual entertainment festival featuring concerts, shows, and cultural events',
            ar: 'مهرجان ترفيهي سنوي يتضمن حفلات موسيقية وعروض وفعاليات ثقافية'
          },
          date: '2025-10-15',
          image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg'
        },
        {
          id: 'saudi-national-day',
          title: {
            en: 'Saudi National Day Celebrations',
            ar: 'احتفالات اليوم الوطني السعودي'
          },
          description: {
            en: 'National celebrations featuring parades, fireworks, and cultural shows',
            ar: 'احتفالات وطنية تتضمن مسيرات وألعاب نارية وعروض ثقافية'
          },
          date: '2025-09-23',
          image: 'https://images.pexels.com/photos/461940/pexels-photo-461940.jpeg'
        }
      ],
      coordinates: {
        latitude: 24.7136,
        longitude: 46.6753
      }
    },
    {
      id: 'red-sea',
      name: {
        en: 'Red Sea',
        ar: 'البحر الأحمر'
      },
      description: {
        en: 'Pristine coastline with crystal-clear waters, coral reefs, and luxury resorts',
        ar: 'ساحل نقي بمياه صافية وشعاب مرجانية ومنتجعات فاخرة'
      },
      region: {
        en: 'Red Sea Region',
        ar: 'منطقة البحر الأحمر'
      },
      locationType: {
        id: 'coastal',
        name: {
          en: 'Coastal',
          ar: 'ساحلي'
        }
      },
      destinationType: {
        id: 'beach',
        name: {
          en: 'Beach',
          ar: 'شاطئي'
        }
      },
      mainImage: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
      touristSpots: [
        {
          id: 'coral-reefs',
          name: {
            en: 'Coral Reefs',
            ar: 'الشعاب المرجانية'
          },
          description: {
            en: 'Vibrant marine ecosystem with diverse coral species and sea life',
            ar: 'نظام بيئي بحري نابض بالحياة مع أنواع متنوعة من الشعاب المرجانية والحياة البحرية'
          },
          image: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg'
        },
        {
          id: 'diving-spots',
          name: {
            en: 'Premium Diving Spots',
            ar: 'مواقع الغوص المميزة'
          },
          description: {
            en: 'World-class diving locations with rich marine life and clear waters',
            ar: 'مواقع غوص عالمية المستوى مع حياة بحرية غنية ومياه صافية'
          },
          image: 'https://images.pexels.com/photos/3601426/pexels-photo-3601426.jpeg'
        }
      ],
      upcomingEvents: [//to be replaced with other events
        {
          id: 'red-sea-film-festival',
          title: {
            en: 'Red Sea International Film Festival',
            ar: 'مهرجان البحر الأحمر السينمائي الدولي'
          },
          description: {
            en: 'Annual film festival showcasing international and regional cinema',
            ar: 'مهرجان سينمائي سنوي يعرض السينما العالمية والإقليمية'
          },
          date: '2025-12-05',
          image: 'https://images.pexels.com/photos/3601427/pexels-photo-3601427.jpeg'
        }
      ],
      coordinates: {
        latitude: 23.2285,
        longitude: 38.9297
      }
    },
    {
      id: 'jeddah',
      name: {
        en: 'Jeddah',
        ar: 'جدة'
      },
      description: {
        en: 'Historic port city with a rich cultural heritage and modern waterfront',
        ar: 'مدينة ميناء تاريخية ذات تراث ثقافي غني وواجهة بحرية حديثة'
      },
      region: {
        en: 'Makkah Region',
        ar: 'منطقة مكة المكرمة'
      },
      locationType: {
        id: 'coastal',
        name: {
          en: 'Coastal',
          ar: 'ساحلي'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/saudi/jeddah/Jeddah1.jpeg',
      touristSpots: [
        {
          id: 'al-balad',
          name: {
            en: 'Al-Balad',
            ar: 'البلد'
          },
          description: {
            en: 'UNESCO World Heritage site featuring traditional architecture and bustling souks',
            ar: 'موقع تراث عالمي لليونسكو يضم العمارة التقليدية والأسواق النابضة بالحياة'
          },
          image: 'https://images.pexels.com/photos/28506244/pexels-photo-28506244.jpeg'
        },
        {
          id: 'corniche',
          name: {
            en: 'Jeddah Corniche',
            ar: 'كورنيش جدة'
          },
          description: {
            en: 'Stunning waterfront promenade with modern art sculptures and recreational areas',
            ar: 'متنزه ساحلي خلاب مع منحوتات فنية حديثة ومناطق ترفيهية'
          },
          image: 'https://images.pexels.com/photos/4614473/pexels-photo-4614473.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'jeddah-season',
          title: {
            en: 'Jeddah Season',
            ar: 'موسم جدة'
          },
          description: {
            en: 'Cultural and entertainment festival celebrating the city\'s heritage',
            ar: 'مهرجان ثقافي وترفيهي يحتفي بتراث المدينة'
          },
          date: '2025-06-01',
          image: 'https://images.pexels.com/photos/12692700/pexels-photo-12692700.jpeg'
        }
      ],
      coordinates: {
        latitude: 21.5433,
        longitude: 39.1728
      }
    },
    {
      id: 'makkah',
      name: {
        en: 'Makkah',
        ar: 'مكة المكرمة'
      },
      description: {
        en: 'The holiest city in Islam, home to the Grand Mosque and ancient religious sites',
        ar: 'أقدس مدينة في الإسلام، موطن المسجد الحرام والمواقع الدينية القديمة'
      },
      region: {
        en: 'Makkah Region',
        ar: 'منطقة مكة المكرمة'
      },
      locationType: {
        id: 'religious',
        name: {
          en: 'Religious',
          ar: 'ديني'
        }
      },
      destinationType: {
        id: 'spiritual',
        name: {
          en: 'Spiritual',
          ar: 'روحاني'
        }
      },
      mainImage: '/images/destinations/saudi/Makkah/Makkah1.jpeg',
      touristSpots: [
        {
          id: 'grand-mosque',
          name: {
            en: 'The Grand Mosque',
            ar: 'المسجد الحرام'
          },
          description: {
            en: 'The holiest site in Islam, featuring the Kaaba and historic architecture',
            ar: 'أقدس موقع في الإسلام، يضم الكعبة والعمارة التاريخية'
          },
          image: 'https://images.pexels.com/photos/18274181/pexels-photo-18274181.jpeg'
        },
        {
          id: 'jabal-al-nour',
          name: {
            en: 'Jabal Al-Nour',
            ar: 'جبل النور'
          },
          description: {
            en: 'Historic mountain featuring the Cave of Hira',
            ar: 'جبل تاريخي يضم غار حراء'
          },
          image: '/images/destinations/saudi/Makkah/JabalAlnour.png'
        }
      ],
      upcomingEvents: [
        {
          id: 'ramadan',
          title: {
            en: 'Ramadan in Makkah',
            ar: 'رمضان في مكة المكرمة'
          },
          description: {
            en: 'Special Ramadan programs and increased worship opportunities',
            ar: 'برامج رمضانية خاصة وفرص متزايدة للعبادة'
          },
          date: '2025-03-01',
          image: 'https://images.pexels.com/photos/5550014/pexels-photo-5550014.jpeg'
        }
      ],
      coordinates: {
        latitude: 21.4225,
        longitude: 39.8262
      }
    },
    {
      id: 'medina',
      name: {
        en: 'Medina',
        ar: 'المدينة المنورة'
      },
      description: {
        en: 'The second-holiest city in Islam, known for its peaceful atmosphere and historical mosques',
        ar: 'ثاني أقدس مدينة في الإسلام، معروفة بأجوائها الهادئة ومساجدها التاريخية'
      },
      region: {
        en: 'Medina Region',
        ar: 'منطقة المدينة المنورة'
      },
      locationType: {
        id: 'religious',
        name: {
          en: 'Religious',
          ar: 'ديني'
        }
      },
      destinationType: {
        id: 'spiritual',
        name: {
          en: 'Spiritual',
          ar: 'روحاني'
        }
      },
      mainImage: '/images/destinations/saudi/Medina/Medina1.jpeg',
      touristSpots: [
        {
          id: 'prophets-mosque',
          name: {
            en: "Prophet's Mosque",
            ar: 'المسجد النبوي'
          },
          description: {
            en: 'The second-holiest site in Islam, built by Prophet Muhammad',
            ar: 'ثاني أقدس موقع في الإسلام، بناه النبي محمد صلى الله عليه وسلم'
          },
          image: 'https://images.pexels.com/photos/19495539/pexels-photo-19495539.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'eid-al-fitr',
          title: {
            en: 'Eid Al-Fitr Celebrations',
            ar: 'احتفالات عيد الفطر'
          },
          description: {
            en: 'Traditional celebrations marking the end of Ramadan',
            ar: 'احتفالات تقليدية تحيي نهاية شهر رمضان'
          },
          date: '2025-04-20',
          image: 'https://images.pexels.com/photos/5550017/pexels-photo-5550017.jpeg'
        }
      ],
      coordinates: {
        latitude: 24.5247,
        longitude: 39.5692
      }
    },
    {
      id: 'alula',
      name: {
        en: 'Al Ula',
        ar: 'العلا'
      },
      description: {
        en: 'Ancient oasis city featuring Hegra, Saudi Arabia\'s first UNESCO World Heritage site, with stunning desert landscapes and rock formations',
        ar: 'واحة قديمة تضم الحجر، أول موقع للتراث العالمي في المملكة العربية السعودية، مع مناظر صحراوية خلابة وتشكيلات صخرية'
      },
      region: {
        en: 'Medina Region',
        ar: 'منطقة المدينة المنورة'
      },
      locationType: {
        id: 'historical',
        name: {
          en: 'Historical',
          ar: 'تاريخي'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/saudi/alula/AlUla1.jpeg',
      touristSpots: [
        {
          id: 'hegra',
          name: {
            en: 'Hegra Archaeological Site',
            ar: 'موقع الحجر الأثري'
          },
          description: {
            en: 'Ancient Nabataean city with over 100 well-preserved monumental tombs carved in rock formations',
            ar: 'مدينة نبطية قديمة تضم أكثر من 100 مقبرة أثرية محفوظة جيداً منحوتة في التكوينات الصخرية'
          },
          image: 'https://images.pexels.com/photos/11215342/pexels-photo-11215342.jpeg'
        },
        {
          id: 'elephant-rock',
          name: {
            en: 'Elephant Rock',
            ar: 'صخرة الفيل'
          },
          description: {
            en: 'Naturally weathered sandstone formation resembling an elephant, standing at a height of 52 meters',
            ar: 'تكوين من الحجر الرملي المتآكل طبيعياً يشبه الفيل، يبلغ ارتفاعه 52 متراً'
          },
          image: 'https://images.pexels.com/photos/17186685/pexels-photo-17186685.jpeg'
        },
        {
          id: 'old-town',
          name: {
            en: 'Al Ula Old Town',
            ar: 'البلدة القديمة في العلا'
          },
          description: {
            en: '12th-century medieval city with mud-brick buildings and ancient marketplace',
            ar: 'مدينة من القرون الوسطى تعود للقرن الثاني عشر تضم مباني من الطوب الطيني وسوقاً قديماً'
          },
          image: '/images/destinations/saudi/alula/AlulaOldTown.png'
        }
      ],
      upcomingEvents: [
        {
          id: 'winter-at-tantora',
          title: {
            en: 'Winter at Tantora 2025',
            ar: 'شتاء طنطورة 2025'
          },
          description: {
            en: 'Cultural festival featuring music performances, art exhibitions, and heritage experiences',
            ar: 'مهرجان ثقافي يتضمن عروضاً موسيقية ومعارض فنية وتجارب تراثية'
          },
          date: '2025-12-21',
          image: 'https://images.pexels.com/photos/12555627/pexels-photo-12555627.jpeg'
        },
        {
          id: 'alula-arts',
          title: {
            en: 'AlUla Arts Festival',
            ar: 'مهرجان العلا للفنون'
          },
          description: {
            en: 'Contemporary art festival showcasing local and international artists',
            ar: 'مهرجان للفن المعاصر يعرض أعمال فنانين محليين وعالميين'
          },
          date: '2025-02-28',
          image: 'https://images.pexels.com/photos/5550024/pexels-photo-5550024.jpeg'
        }
      ],
      coordinates: {
        latitude: 26.6162,
        longitude: 37.9159
      }
    }
  ])

  const globalDestinations = ref<Destination[]>([
    {
      id: 'barcelona',
      name: {
        en: 'Barcelona',
        ar: 'برشلونة'
      },
      description: {
        en: 'A vibrant Mediterranean city known for its stunning architecture, rich culture, and the unique blend of Gothic and Modernist landmarks',
        ar: 'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة وثقافتها الغنية ومزيج فريد من المعالم القوطية والحديثة'
      },
      region: {
        en: 'Catalonia',
        ar: 'كتالونيا'
      },
      locationType: {
        id: 'coastal',
        name: {
          en: 'Coastal',
          ar: 'ساحلي'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/global/Barcelona/Barcelona1.jpeg',
      gallery: [
        '/images/destinations/global/Barcelona/Barcelona1.jpeg',
        '/images/destinations/global/Barcelona/Barcelona2.jpeg'
      ],
      touristSpots: [
        {
          id: 'sagrada-familia',
          name: {
            en: 'Sagrada Familia',
            ar: 'ساغرادا فاميليا'
          },
          description: {
            en: "Gaudí's masterpiece and Barcelona's most iconic landmark, this stunning basilica has been under construction since 1882",
            ar: 'تحفة غاودي وأشهر معالم برشلونة، هذه الكنيسة المذهلة قيد الإنشاء منذ عام 1882'
          },
          image: '/images/destinations/global/Barcelona/Barcelona1.jpeg'
        },
        {
          id: 'park-guell',
          name: {
            en: 'Park Güell',
            ar: 'حديقة غويل'
          },
          description: {
            en: 'A magical park with amazing buildings, sculptures, and tile work designed by Gaudí',
            ar: 'حديقة سحرية تضم مباني ومنحوتات وأعمال بلاط رائعة من تصميم غاودي'
          },
          image: '/images/destinations/global/Barcelona/Barcelona2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'la-merce',
          title: {
            en: 'La Mercè Festival',
            ar: 'مهرجان لا ميرسي'
          },
          description: {
            en: 'Barcelona\'s biggest street festival featuring music, dance, and traditional Catalan culture',
            ar: 'أكبر مهرجان شوارع في برشلونة يضم الموسيقى والرقص والثقافة الكتالونية التقليدية'
          },
          date: '2025-09-24',
          image: '/images/destinations/global/Barcelona/Barcelona2.jpeg'
        }
      ],
      coordinates: {
        latitude: 41.3851,
        longitude: 2.1734
      }
    },
    {
      id: 'cairo',
      name: {
        en: 'Cairo',
        ar: 'القاهرة'
      },
      description: {
        en: 'The capital of Egypt, a city where ancient history meets modern life, home to the last remaining wonder of the ancient world',
        ar: 'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية، وموطن آخر عجائب العالم القديم المتبقية'
      },
      region: {
        en: 'Cairo Governorate',
        ar: 'محافظة القاهرة'
      },
      locationType: {
        id: 'urban',
        name: {
          en: 'Urban',
          ar: 'مدينة'
        }
      },
      destinationType: {
        id: 'historical',
        name: {
          en: 'Historical',
          ar: 'تاريخي'
        }
      },
      mainImage: '/images/destinations/global/Cairo/Cairo1.jpeg',
      gallery: [
        '/images/destinations/global/Cairo/Cairo1.jpeg',
        '/images/destinations/global/Cairo/Cairo2.jpeg'
      ],
      touristSpots: [
        {
          id: 'pyramids',
          name: {
            en: 'Giza Pyramids',
            ar: 'أهرامات الجيزة'
          },
          description: {
            en: 'The last remaining wonder of the ancient world, built as tombs for the mighty Pharaohs',
            ar: 'آخر عجائب العالم القديم المتبقية، بنيت كمقابر للفراعنة العظماء'
          },
          image: '/images/destinations/global/Cairo/Cairo1.jpeg'
        },
        {
          id: 'egyptian-museum',
          name: {
            en: 'The Egyptian Museum',
            ar: 'المتحف المصري'
          },
          description: {
            en: 'Home to the world\'s largest collection of ancient Egyptian antiquities',
            ar: 'موطن أكبر مجموعة من الآثار المصرية القديمة في العالم'
          },
          image: '/images/destinations/global/Cairo/Cairo2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'cairo-film-festival',
          title: {
            en: 'Cairo International Film Festival',
            ar: 'مهرجان القاهرة السينمائي الدولي'
          },
          description: {
            en: 'One of the oldest and most celebrated cultural events in the Arab world',
            ar: 'أحد أقدم وأشهر الفعاليات الثقافية في العالم العربي'
          },
          date: '2025-11-20',
          image: '/images/destinations/global/Cairo/Cairo2.jpeg'
        }
      ],
      coordinates: {
        latitude: 30.0444,
        longitude: 31.2357
      }
    },
    {
      id: 'georgia',
      name: {
        en: 'Georgia',
        ar: 'جورجيا'
      },
      description: {
        en: 'A country at the intersection of Eastern Europe and Western Asia, known for its diverse landscapes, rich history, and renowned wine culture',
        ar: 'دولة في مفترق طرق أوروبا الشرقية وغرب آسيا، معروفة بمناظرها الطبيعية المتنوعة وتاريخها الغني وثقافة النبيذ الشهيرة'
      },
      region: {
        en: 'Caucasus',
        ar: 'القوقاز'
      },
      locationType: {
        id: 'diverse',
        name: {
          en: 'Diverse',
          ar: 'متنوع'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/global/Georgia/Georgia1.jpeg',
      gallery: [
        '/images/destinations/global/Georgia/Georgia1.jpeg',
        '/images/destinations/global/Georgia/Georgia2.jpeg',
        '/images/destinations/global/Georgia/Georgia3.jpeg'
      ],
      touristSpots: [
        {
          id: 'old-tbilisi',
          name: {
            en: 'Old Tbilisi',
            ar: 'تبليسي القديمة'
          },
          description: {
            en: 'Historic district featuring colorful houses, ancient churches, and traditional Georgian architecture',
            ar: 'حي تاريخي يضم منازل ملونة وكنائس قديمة وعمارة جورجية تقليدية'
          },
          image: '/images/destinations/global/Georgia/Georgia1.jpeg'
        },
        {
          id: 'kazbegi',
          name: {
            en: 'Mount Kazbegi',
            ar: 'جبل كازبيجي'
          },
          description: {
            en: 'Stunning mountain peak with the iconic Gergeti Trinity Church at its base',
            ar: 'قمة جبلية مذهلة مع كنيسة الثالوث جيرجيتي الأيقونية عند سفحها'
          },
          image: '/images/destinations/global/Georgia/Georgia2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'tbilisoba',
          title: {
            en: 'Tbilisoba Festival',
            ar: 'مهرجان تبيليسوبا'
          },
          description: {
            en: 'Annual festival celebrating the diversity and history of Tbilisi with wine, food, and music',
            ar: 'مهرجان سنوي يحتفل بتنوع وتاريخ تبليسي مع النبيذ والطعام والموسيقى'
          },
          date: '2025-10-15',
          image: '/images/destinations/global/Georgia/Georgia3.jpeg'
        }
      ],
      coordinates: {
        latitude: 41.7151,
        longitude: 44.8271
      }
    },
    {
      id: 'istanbul',
      name: {
        en: 'Istanbul',
        ar: 'إسطنبول'
      },
      description: {
        en: 'Where East meets West, a city straddling two continents with rich history',
        ar: 'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني'
      },
      region: {
        en: 'Marmara',
        ar: 'مرمرة'
      },
      locationType: {
        id: 'coastal',
        name: {
          en: 'Coastal',
          ar: 'ساحلي'
        }
      },
      destinationType: {
        id: 'historical',
        name: {
          en: 'Historical',
          ar: 'تاريخي'
        }
      },
      mainImage: '/images/destinations/global/Istanbul/Istanbul1.jpeg',
      gallery: [
        '/images/destinations/global/Istanbul/Istanbul1.jpeg',
        '/images/destinations/global/Istanbul/Istanbul2.jpeg',
        '/images/destinations/global/Istanbul/Istanbul3.jpeg'
      ],
      touristSpots: [
        {
          id: 'hagia-sophia',
          name: {
            en: 'Hagia Sophia',
            ar: 'آيا صوفيا'
          },
          description: {
            en: 'A masterpiece of Byzantine architecture, now a mosque, showcasing incredible mosaics and massive dome',
            ar: 'تحفة معمارية بيزنطية، تحولت إلى مسجد، تعرض فسيفساء مذهلة وقبة ضخمة'
          },
          image: '/images/destinations/global/Istanbul/Istanbul1.jpeg'
        },
        {
          id: 'grand-bazaar',
          name: {
            en: 'Grand Bazaar',
            ar: 'السوق الكبير'
          },
          description: {
            en: 'One of the world\'s oldest and largest covered markets, with over 4,000 shops',
            ar: 'أحد أقدم وأكبر الأسواق المغطاة في العالم، يضم أكثر من 4,000 متجر'
          },
          image: '/images/destinations/global/Istanbul/Istanbul2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'istanbul-biennial',
          title: {
            en: 'Istanbul Biennial',
            ar: 'بينالي إسطنبول'
          },
          description: {
            en: 'International contemporary art exhibition showcasing works from around the world',
            ar: 'معرض دولي للفن المعاصر يعرض أعمالاً من جميع أنحاء العالم'
          },
          date: '2025-09-14',
          image: '/images/destinations/global/Istanbul/Istanbul3.jpeg'
        }
      ],
      coordinates: {
        latitude: 41.0082,
        longitude: 28.9784
      }
    },
    {
      id: 'london',
      name: {
        en: 'London',
        ar: 'لندن'
      },
      description: {
        en: 'A diverse metropolis blending history and modernity, known for its iconic landmarks, world-class museums, and vibrant cultural scene',
        ar: 'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية ومتاحفها العالمية ومشهدها الثقافي النابض بالحياة'
      },
      region: {
        en: 'Greater London',
        ar: 'لندن الكبرى'
      },
      locationType: {
        id: 'urban',
        name: {
          en: 'Urban',
          ar: 'مدينة'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/global/London/London1.jpeg',
      gallery: [
        '/images/destinations/global/London/London1.jpeg',
        '/images/destinations/global/London/London2.jpeg',
        '/images/destinations/global/London/London3.jpeg'
      ],
      touristSpots: [
        {
          id: 'tower-bridge',
          name: {
            en: 'Tower Bridge',
            ar: 'جسر البرج'
          },
          description: {
            en: 'Iconic Victorian bridge with high-level walkways and stunning views of the Thames',
            ar: 'جسر فيكتوري أيقوني مع ممرات مرتفعة وإطلالات مذهلة على نهر التايمز'
          },
          image: '/images/destinations/global/London/London1.jpeg'
        },
        {
          id: 'british-museum',
          name: {
            en: 'British Museum',
            ar: 'المتحف البريطاني'
          },
          description: {
            en: 'World-famous museum of human history and culture, home to millions of works',
            ar: 'متحف عالمي شهير للتاريخ والثقافة البشرية، يضم ملايين القطع الأثرية'
          },
          image: '/images/destinations/global/London/London2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'notting-hill-carnival',
          title: {
            en: 'Notting Hill Carnival',
            ar: 'كرنفال نوتينج هيل'
          },
          description: {
            en: 'Europe\'s biggest street festival celebrating Caribbean culture and traditions',
            ar: 'أكبر مهرجان شوارع في أوروبا يحتفل بالثقافة والتقاليد الكاريبية'
          },
          date: '2025-08-25',
          image: '/images/destinations/global/London/London3.jpeg'
        }
      ],
      coordinates: {
        latitude: 51.5074,
        longitude: -0.1278
      }
    },
    {
      id: 'madrid',
      name: {
        en: 'Madrid',
        ar: 'مدريد'
      },
      description: {
        en: 'Spain\'s central capital, a city of elegant boulevards, expansive parks, and world-renowned art museums',
        ar: 'عاصمة إسبانيا المركزية، مدينة الشوارع الأنيقة والحدائق الواسعة ومتاحف الفن المشهورة عالمياً'
      },
      region: {
        en: 'Community of Madrid',
        ar: 'مجتمع مدريد'
      },
      locationType: {
        id: 'urban',
        name: {
          en: 'Urban',
          ar: 'مدينة'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/global/Madrid/Madrid1.jpeg',
      gallery: [
        '/images/destinations/global/Madrid/Madrid1.jpeg',
        '/images/destinations/global/Madrid/Madrid2.jpeg',
        '/images/destinations/global/Madrid/Madrid3.jpeg'
      ],
      touristSpots: [
        {
          id: 'prado-museum',
          name: {
            en: 'Prado Museum',
            ar: 'متحف برادو'
          },
          description: {
            en: 'Spain\'s national art museum housing one of the finest collections of European art',
            ar: 'متحف الفن الوطني الإسباني الذي يضم واحدة من أفضل مجموعات الفن الأوروبي'
          },
          image: '/images/destinations/global/Madrid/Madrid1.jpeg'
        },
        {
          id: 'retiro-park',
          name: {
            en: 'Retiro Park',
            ar: 'حديقة ريتيرو'
          },
          description: {
            en: 'Historic park and gardens with a boating lake, cafes, and exhibition venues',
            ar: 'حديقة وحدائق تاريخية تضم بحيرة للقوارب ومقاهي وأماكن للمعارض'
          },
          image: '/images/destinations/global/Madrid/Madrid2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'san-isidro',
          title: {
            en: 'San Isidro Festival',
            ar: 'مهرجان سان إيسيدرو'
          },
          description: {
            en: 'Traditional festival honoring Madrid\'s patron saint with music, dance, and food',
            ar: 'مهرجان تقليدي يكرم قديس مدريد مع الموسيقى والرقص والطعام'
          },
          date: '2025-05-15',
          image: '/images/destinations/global/Madrid/Madrid3.jpeg'
        }
      ],
      coordinates: {
        latitude: 40.4168,
        longitude: -3.7038
      }
    },
    {
      id: 'morocco',
      name: {
        en: 'Morocco',
        ar: 'المغرب'
      },
      description: {
        en: 'A North African country offering a blend of Arab, Berber, and European cultural influences, featuring ancient medinas, stunning deserts, and vibrant markets',
        ar: 'دولة في شمال أفريقيا تقدم مزيجاً من التأثيرات الثقافية العربية والأمازيغية والأوروبية، وتتميز بالمدن القديمة والصحاري الخلابة والأسواق النابضة بالحياة'
      },
      region: {
        en: 'North Africa',
        ar: 'شمال أفريقيا'
      },
      locationType: {
        id: 'diverse',
        name: {
          en: 'Diverse',
          ar: 'متنوع'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/global/Morocco/Morocco1.jpeg',
      gallery: [
        '/images/destinations/global/Morocco/Morocco1.jpeg',
        '/images/destinations/global/Morocco/Morocco2.jpeg',
        '/images/destinations/global/Morocco/Morocco3.jpeg'
      ],
      touristSpots: [
        {
          id: 'marrakech-medina',
          name: {
            en: 'Marrakech Medina',
            ar: 'مدينة مراكش القديمة'
          },
          description: {
            en: 'UNESCO World Heritage site featuring traditional markets, palaces, and the famous Djemaa el-Fna square',
            ar: 'موقع تراث عالمي يضم الأسواق التقليدية والقصور وساحة جامع الفنا الشهيرة'
          },
          image: '/images/destinations/global/Morocco/Morocco1.jpeg'
        },
        {
          id: 'sahara-desert',
          name: {
            en: 'Sahara Desert',
            ar: 'الصحراء الكبرى'
          },
          description: {
            en: 'Vast desert offering camel treks, overnight camping, and stunning stargazing experiences',
            ar: 'صحراء شاسعة تقدم رحلات الجمال والتخييم الليلي وتجارب مشاهدة النجوم المذهلة'
          },
          image: '/images/destinations/global/Morocco/Morocco2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'fes-festival',
          title: {
            en: 'Fes Festival of World Sacred Music',
            ar: 'مهرجان فاس للموسيقى الروحية العالمية'
          },
          description: {
            en: 'Annual festival celebrating spiritual music from around the world',
            ar: 'مهرجان سنوي يحتفي بالموسيقى الروحية من جميع أنحاء العالم'
          },
          date: '2025-06-14',
          image: '/images/destinations/global/Morocco/Morocco3.jpeg'
        }
      ],
      coordinates: {
        latitude: 31.7917,
        longitude: -7.0926
      }
    },
    {
      id: 'paris',
      name: {
        en: 'Paris',
        ar: 'باريس'
      },
      description: {
        en: 'The City of Light, a global center for art, fashion, gastronomy, and culture, famous for its iconic landmarks and romantic atmosphere',
        ar: 'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة، مشهورة بمعالمها الأيقونية وأجوائها الرومانسية'
      },
      region: {
        en: 'Île-de-France',
        ar: 'إيل دو فرانس'
      },
      locationType: {
        id: 'urban',
        name: {
          en: 'Urban',
          ar: 'مدينة'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/global/Paris/Paris1.jpeg',
      gallery: [
        '/images/destinations/global/Paris/Paris1.jpeg',
        '/images/destinations/global/Paris/Paris2.jpeg',
        '/images/destinations/global/Paris/Paris3.jpeg'
      ],
      touristSpots: [
        {
          id: 'eiffel-tower',
          name: {
            en: 'Eiffel Tower',
            ar: 'برج إيفل'
          },
          description: {
            en: 'Iconic iron lattice tower offering stunning views of Paris from its observation decks',
            ar: 'برج شبكي حديدي أيقوني يوفر إطلالات مذهلة على باريس من منصات المراقبة'
          },
          image: '/images/destinations/global/Paris/Paris1.jpeg'
        },
        {
          id: 'louvre-museum',
          name: {
            en: 'Louvre Museum',
            ar: 'متحف اللوفر'
          },
          description: {
            en: 'World\'s largest art museum, home to thousands of works including the Mona Lisa',
            ar: 'أكبر متحف فني في العالم، يضم آلاف الأعمال بما في ذلك الموناليزا'
          },
          image: '/images/destinations/global/Paris/Paris2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'bastille-day',
          title: {
            en: 'Bastille Day',
            ar: 'يوم الباستيل'
          },
          description: {
            en: 'National celebration featuring military parades, fireworks, and public festivities',
            ar: 'احتفال وطني يتضمن العروض العسكرية والألعاب النارية والاحتفالات العامة'
          },
          date: '2025-07-14',
          image: '/images/destinations/global/Paris/Paris3.jpeg'
        }
      ],
      coordinates: {
        latitude: 48.8566,
        longitude: 2.3522
      }
    },
    {
      id: 'sharm-el-sheikh',
      name: {
        en: 'Sharm El Sheikh',
        ar: 'شرم الشيخ'
      },
      description: {
        en: 'A coastal paradise known for its pristine beaches, vibrant coral reefs, and world-class diving spots',
        ar: 'جنة ساحلية معروفة بشواطئها النقية والشعاب المرجانية النابضة بالحياة ومواقع الغوص العالمية'
      },
      region: {
        en: 'South Sinai',
        ar: 'جنوب سيناء'
      },
      locationType: {
        id: 'coastal',
        name: {
          en: 'Coastal',
          ar: 'ساحلي'
        }
      },
      destinationType: {
        id: 'beach',
        name: {
          en: 'Beach',
          ar: 'شاطئ'
        }
      },
      mainImage: '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
      gallery: [
        '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
        '/images/destinations/global/SharmElSheikh/SharmElSheikh2.jpeg',
        '/images/destinations/global/SharmElSheikh/SharmElSheikh3.jpeg'
      ],
      touristSpots: [
        {
          id: 'naama-bay',
          name: {
            en: 'Naama Bay',
            ar: 'خليج نعمة'
          },
          description: {
            en: 'Vibrant tourist hub with a palm tree-lined promenade, restaurants, and diving centers',
            ar: 'مركز سياحي نابض بالحياة مع ممشى مصطف بأشجار النخيل ومطاعم ومراكز غوص'
          },
          image: '/images/destinations/global/SharmElSheikh/SharmElSheikh2.jpeg'
        },
        {
          id: 'ras-mohammed',
          name: {
            en: 'Ras Mohammed National Park',
            ar: 'محمية رأس محمد'
          },
          description: {
            en: 'Protected area known for its extraordinary marine life and coral reefs',
            ar: 'منطقة محمية معروفة بحياتها البحرية الاستثنائية والشعاب المرجانية'
          },
          image: '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'diving-festival',
          title: {
            en: 'International Diving Festival',
            ar: 'مهرجان الغوص الدولي'
          },
          description: {
            en: 'Annual festival celebrating the underwater beauty of the Red Sea',
            ar: 'مهرجان سنوي يحتفي بجمال البحر الأحمر تحت الماء'
          },
          date: '2025-05-20',
          image: '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg'
        }
      ],
      coordinates: {
        latitude: 27.9158,
        longitude: 34.3300
      }
    },
    {
      id: 'thailand',
      name: {
        en: 'Thailand',
        ar: 'تايلاند'
      },
      description: {
        en: 'Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins, and ornate temples displaying figures of Buddha',
        ar: 'دولة في جنوب شرق آسيا معروفة بشواطئها الاستوائية والقصور الملكية الفخمة والآثار القديمة والمعابد المزخرفة التي تعرض تماثيل بوذا'
      },
      region: {
        en: 'Southeast Asia',
        ar: 'جنوب شرق آسيا'
      },
      locationType: {
        id: 'diverse',
        name: {
          en: 'Diverse',
          ar: 'متنوع'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          en: 'Cultural',
          ar: 'ثقافي'
        }
      },
      mainImage: '/images/destinations/global/Thailand/Thailand1.jpeg',
      gallery: [
        '/images/destinations/global/Thailand/Thailand1.jpeg',
        '/images/destinations/global/Thailand/Thailand2.jpeg',
        '/images/destinations/global/Thailand/Thailand3.jpeg'
      ],
      touristSpots: [
        {
          id: 'grand-palace',
          name: {
            en: 'Grand Palace',
            ar: 'القصر الكبير'
          },
          description: {
            en: 'Former residence of Thai kings, featuring stunning architecture and sacred temples',
            ar: 'المقر السابق لملوك تايلاند، يتميز بهندسة معمارية مذهلة ومعابد مقدسة'
          },
          image: '/images/destinations/global/Thailand/Thailand1.jpeg'
        },
        {
          id: 'phi-phi-islands',
          name: {
            en: 'Phi Phi Islands',
            ar: 'جزر في في'
          },
          description: {
            en: 'Tropical paradise with crystal-clear waters, limestone cliffs, and white sandy beaches',
            ar: 'جنة استوائية بمياه صافية وجروف حجرية وشواطئ رملية بيضاء'
          },
          image: '/images/destinations/global/Thailand/Thailand2.jpeg'
        }
      ],
      upcomingEvents: [
        {
          id: 'songkran',
          title: {
            en: 'Songkran Festival',
            ar: 'مهرجان سونكران'
          },
          description: {
            en: 'Thai New Year celebration featuring water fights and traditional ceremonies',
            ar: 'احتفال رأس السنة التايلاندية يتميز بمعارك المياه والطقوس التقليدية'
          },
          date: '2025-04-13',
          image: '/images/destinations/global/Thailand/Thailand3.jpeg'
        }
      ],
      coordinates: {
        latitude: 15.8700,
        longitude: 100.9925
      }
    }
  ])

  // Get destination by ID
  const getDestinationById = (id: string): Destination | null => {
    const destination = [...saudiDestinations.value, ...globalDestinations.value]
      .find(d => d.id === id)
    
    if (!destination) return null
    return destination
  }

  // Get localized name
  const getLocalizedName = (destination: Destination): string => {
    const { locale } = useI18n()
    return destination.name[locale.value as keyof typeof destination.name] || destination.name.en
  }

  // Get localized description
  const getLocalizedDescription = (destination: Destination): string => {
    const { locale } = useI18n()
    return destination.description[locale.value as keyof typeof destination.description] || destination.description.en
  }

  return {
    saudiDestinations,
    globalDestinations,
    getDestinationById,
    getLocalizedName,
    getLocalizedDescription
  }
}
