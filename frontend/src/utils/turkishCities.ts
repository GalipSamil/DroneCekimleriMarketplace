import type { AppLanguage } from '../context/preferences';

export type TurkishCity = {
    value: string;
    label: {
        tr: string;
        en: string;
    };
    latitude: number;
    longitude: number;
};

export const TURKISH_CITIES: TurkishCity[] = [
    { value: 'adana', label: { tr: 'Adana', en: 'Adana' }, latitude: 37.0, longitude: 35.3213 },
    { value: 'adiyaman', label: { tr: 'Adiyaman', en: 'Adiyaman' }, latitude: 37.7648, longitude: 38.2786 },
    { value: 'afyonkarahisar', label: { tr: 'Afyonkarahisar', en: 'Afyonkarahisar' }, latitude: 38.7569, longitude: 30.5387 },
    { value: 'agri', label: { tr: 'Agri', en: 'Agri' }, latitude: 39.7191, longitude: 43.0503 },
    { value: 'aksaray', label: { tr: 'Aksaray', en: 'Aksaray' }, latitude: 38.3687, longitude: 34.0370 },
    { value: 'amasya', label: { tr: 'Amasya', en: 'Amasya' }, latitude: 40.6499, longitude: 35.8353 },
    { value: 'ankara', label: { tr: 'Ankara', en: 'Ankara' }, latitude: 39.9334, longitude: 32.8597 },
    { value: 'antalya', label: { tr: 'Antalya', en: 'Antalya' }, latitude: 36.8969, longitude: 30.7133 },
    { value: 'ardahan', label: { tr: 'Ardahan', en: 'Ardahan' }, latitude: 41.1105, longitude: 42.7022 },
    { value: 'artvin', label: { tr: 'Artvin', en: 'Artvin' }, latitude: 41.1828, longitude: 41.8183 },
    { value: 'aydin', label: { tr: 'Aydin', en: 'Aydin' }, latitude: 37.8450, longitude: 27.8396 },
    { value: 'balikesir', label: { tr: 'Balikesir', en: 'Balikesir' }, latitude: 39.6484, longitude: 27.8826 },
    { value: 'bartin', label: { tr: 'Bartin', en: 'Bartin' }, latitude: 41.6344, longitude: 32.3375 },
    { value: 'batman', label: { tr: 'Batman', en: 'Batman' }, latitude: 37.8812, longitude: 41.1351 },
    { value: 'bayburt', label: { tr: 'Bayburt', en: 'Bayburt' }, latitude: 40.2552, longitude: 40.2249 },
    { value: 'bilecik', label: { tr: 'Bilecik', en: 'Bilecik' }, latitude: 40.1506, longitude: 29.9833 },
    { value: 'bingol', label: { tr: 'Bingol', en: 'Bingol' }, latitude: 38.8847, longitude: 40.4983 },
    { value: 'bitlis', label: { tr: 'Bitlis', en: 'Bitlis' }, latitude: 38.4006, longitude: 42.1095 },
    { value: 'bolu', label: { tr: 'Bolu', en: 'Bolu' }, latitude: 40.7395, longitude: 31.6116 },
    { value: 'burdur', label: { tr: 'Burdur', en: 'Burdur' }, latitude: 37.7203, longitude: 30.2908 },
    { value: 'bursa', label: { tr: 'Bursa', en: 'Bursa' }, latitude: 40.1885, longitude: 29.0610 },
    { value: 'canakkale', label: { tr: 'Canakkale', en: 'Canakkale' }, latitude: 40.1553, longitude: 26.4142 },
    { value: 'cankiri', label: { tr: 'Cankiri', en: 'Cankiri' }, latitude: 40.6013, longitude: 33.6134 },
    { value: 'corum', label: { tr: 'Corum', en: 'Corum' }, latitude: 40.5506, longitude: 34.9556 },
    { value: 'denizli', label: { tr: 'Denizli', en: 'Denizli' }, latitude: 37.7765, longitude: 29.0864 },
    { value: 'diyarbakir', label: { tr: 'Diyarbakir', en: 'Diyarbakir' }, latitude: 37.9144, longitude: 40.2306 },
    { value: 'duzce', label: { tr: 'Duzce', en: 'Duzce' }, latitude: 40.8438, longitude: 31.1565 },
    { value: 'edirne', label: { tr: 'Edirne', en: 'Edirne' }, latitude: 41.6771, longitude: 26.5557 },
    { value: 'elazig', label: { tr: 'Elazig', en: 'Elazig' }, latitude: 38.6810, longitude: 39.2264 },
    { value: 'erzincan', label: { tr: 'Erzincan', en: 'Erzincan' }, latitude: 39.7500, longitude: 39.5000 },
    { value: 'erzurum', label: { tr: 'Erzurum', en: 'Erzurum' }, latitude: 39.9043, longitude: 41.2679 },
    { value: 'eskisehir', label: { tr: 'Eskisehir', en: 'Eskisehir' }, latitude: 39.7667, longitude: 30.5256 },
    { value: 'gaziantep', label: { tr: 'Gaziantep', en: 'Gaziantep' }, latitude: 37.0662, longitude: 37.3833 },
    { value: 'giresun', label: { tr: 'Giresun', en: 'Giresun' }, latitude: 40.9128, longitude: 38.3895 },
    { value: 'gumushane', label: { tr: 'Gumushane', en: 'Gumushane' }, latitude: 40.4603, longitude: 39.4810 },
    { value: 'hakkari', label: { tr: 'Hakkari', en: 'Hakkari' }, latitude: 37.5833, longitude: 43.7333 },
    { value: 'hatay', label: { tr: 'Hatay', en: 'Hatay' }, latitude: 36.2021, longitude: 36.1600 },
    { value: 'igdir', label: { tr: 'Igdir', en: 'Igdir' }, latitude: 39.9237, longitude: 44.0450 },
    { value: 'isparta', label: { tr: 'Isparta', en: 'Isparta' }, latitude: 37.7648, longitude: 30.5566 },
    { value: 'istanbul', label: { tr: 'Istanbul', en: 'Istanbul' }, latitude: 41.0082, longitude: 28.9784 },
    { value: 'izmir', label: { tr: 'Izmir', en: 'Izmir' }, latitude: 38.4237, longitude: 27.1428 },
    { value: 'kahramanmaras', label: { tr: 'Kahramanmaras', en: 'Kahramanmaras' }, latitude: 37.5858, longitude: 36.9371 },
    { value: 'karabuk', label: { tr: 'Karabuk', en: 'Karabuk' }, latitude: 41.2061, longitude: 32.6204 },
    { value: 'karaman', label: { tr: 'Karaman', en: 'Karaman' }, latitude: 37.1759, longitude: 33.2287 },
    { value: 'kars', label: { tr: 'Kars', en: 'Kars' }, latitude: 40.6013, longitude: 43.0975 },
    { value: 'kastamonu', label: { tr: 'Kastamonu', en: 'Kastamonu' }, latitude: 41.3887, longitude: 33.7827 },
    { value: 'kayseri', label: { tr: 'Kayseri', en: 'Kayseri' }, latitude: 38.7312, longitude: 35.4787 },
    { value: 'kilis', label: { tr: 'Kilis', en: 'Kilis' }, latitude: 36.7184, longitude: 37.1212 },
    { value: 'kirikkale', label: { tr: 'Kirikkale', en: 'Kirikkale' }, latitude: 39.8468, longitude: 33.5153 },
    { value: 'kirklareli', label: { tr: 'Kirklareli', en: 'Kirklareli' }, latitude: 41.7333, longitude: 27.2167 },
    { value: 'kirsehir', label: { tr: 'Kirsehir', en: 'Kirsehir' }, latitude: 39.1458, longitude: 34.1639 },
    { value: 'kocaeli', label: { tr: 'Kocaeli', en: 'Kocaeli' }, latitude: 40.8533, longitude: 29.8815 },
    { value: 'konya', label: { tr: 'Konya', en: 'Konya' }, latitude: 37.8746, longitude: 32.4932 },
    { value: 'kutahya', label: { tr: 'Kutahya', en: 'Kutahya' }, latitude: 39.4192, longitude: 29.9833 },
    { value: 'malatya', label: { tr: 'Malatya', en: 'Malatya' }, latitude: 38.3552, longitude: 38.3095 },
    { value: 'manisa', label: { tr: 'Manisa', en: 'Manisa' }, latitude: 38.6191, longitude: 27.4289 },
    { value: 'mardin', label: { tr: 'Mardin', en: 'Mardin' }, latitude: 37.3212, longitude: 40.7245 },
    { value: 'mersin', label: { tr: 'Mersin', en: 'Mersin' }, latitude: 36.8000, longitude: 34.6333 },
    { value: 'mugla', label: { tr: 'Mugla', en: 'Mugla' }, latitude: 37.2153, longitude: 28.3636 },
    { value: 'mus', label: { tr: 'Mus', en: 'Mus' }, latitude: 38.9462, longitude: 41.7539 },
    { value: 'nevsehir', label: { tr: 'Nevsehir', en: 'Nevsehir' }, latitude: 38.6244, longitude: 34.7240 },
    { value: 'nigde', label: { tr: 'Nigde', en: 'Nigde' }, latitude: 37.9698, longitude: 34.6766 },
    { value: 'ordu', label: { tr: 'Ordu', en: 'Ordu' }, latitude: 40.9862, longitude: 37.8797 },
    { value: 'osmaniye', label: { tr: 'Osmaniye', en: 'Osmaniye' }, latitude: 37.0742, longitude: 36.2461 },
    { value: 'rize', label: { tr: 'Rize', en: 'Rize' }, latitude: 41.0201, longitude: 40.5234 },
    { value: 'sakarya', label: { tr: 'Sakarya', en: 'Sakarya' }, latitude: 40.7569, longitude: 30.3781 },
    { value: 'samsun', label: { tr: 'Samsun', en: 'Samsun' }, latitude: 41.2867, longitude: 36.3300 },
    { value: 'siirt', label: { tr: 'Siirt', en: 'Siirt' }, latitude: 37.9333, longitude: 41.9500 },
    { value: 'sinop', label: { tr: 'Sinop', en: 'Sinop' }, latitude: 42.0264, longitude: 35.1517 },
    { value: 'sivas', label: { tr: 'Sivas', en: 'Sivas' }, latitude: 39.7477, longitude: 37.0179 },
    { value: 'sanliurfa', label: { tr: 'Sanliurfa', en: 'Sanliurfa' }, latitude: 37.1591, longitude: 38.7969 },
    { value: 'sirnak', label: { tr: 'Sirnak', en: 'Sirnak' }, latitude: 37.4187, longitude: 42.4918 },
    { value: 'tekirdag', label: { tr: 'Tekirdag', en: 'Tekirdag' }, latitude: 40.9781, longitude: 27.5117 },
    { value: 'tokat', label: { tr: 'Tokat', en: 'Tokat' }, latitude: 40.3167, longitude: 36.5500 },
    { value: 'trabzon', label: { tr: 'Trabzon', en: 'Trabzon' }, latitude: 41.0015, longitude: 39.7178 },
    { value: 'tunceli', label: { tr: 'Tunceli', en: 'Tunceli' }, latitude: 39.1079, longitude: 39.5401 },
    { value: 'usak', label: { tr: 'Usak', en: 'Usak' }, latitude: 38.6823, longitude: 29.4082 },
    { value: 'van', label: { tr: 'Van', en: 'Van' }, latitude: 38.4891, longitude: 43.4089 },
    { value: 'yalova', label: { tr: 'Yalova', en: 'Yalova' }, latitude: 40.6500, longitude: 29.2667 },
    { value: 'yozgat', label: { tr: 'Yozgat', en: 'Yozgat' }, latitude: 39.8181, longitude: 34.8147 },
    { value: 'zonguldak', label: { tr: 'Zonguldak', en: 'Zonguldak' }, latitude: 41.4564, longitude: 31.7987 },
];

export const getTurkishCityOptions = (language: AppLanguage) => (
    TURKISH_CITIES.map((city) => ({
        value: city.value,
        label: city.label[language],
        latitude: city.latitude,
        longitude: city.longitude,
    }))
);

export const getTurkishCityCoordinates = (value?: string) => (
    TURKISH_CITIES.find((city) => city.value === value) ?? null
);

export const findTurkishCityByCoordinates = (latitude?: number, longitude?: number) => {
    if (latitude === undefined || longitude === undefined || (latitude === 0 && longitude === 0)) {
        return null;
    }

    return TURKISH_CITIES.reduce<TurkishCity | null>((closest, city) => {
        if (!closest) {
            return city;
        }

        const currentScore = ((latitude - city.latitude) ** 2) + ((longitude - city.longitude) ** 2);
        const closestScore = ((latitude - closest.latitude) ** 2) + ((longitude - closest.longitude) ** 2);

        return currentScore < closestScore ? city : closest;
    }, null);
};
