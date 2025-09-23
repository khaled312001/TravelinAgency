export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/helloworld') {
      return new Response('Hello, world!', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    // Handle /api/packages GET request
    if (url.pathname === '/api/packages' && request.method === 'GET') {
      const SUPABASE_URL = env.SUPABASE_URL;
      const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return new Response(JSON.stringify({ error: 'Supabase environment variables missing.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const supabaseUrl = `${SUPABASE_URL}/rest/v1/packages?select=id,image_url,title_ar,title_en,description_ar,description_en,travel_period,duration_days,price,max_persons,featured,package_options:package_options(flight,hotel,transportation,hotel_grade)&order=created_at.desc`;

      const res = await fetch(supabaseUrl, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch packages' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await res.json();

      const packages = (data || []).map((pkg: any) => ({
        id: pkg.id,
        image_url: pkg.image_url,
        title_ar: pkg.title_ar,
        title_en: pkg.title_en,
        description_ar: pkg.description_ar,
        description_en: pkg.description_en,
        travel_period: pkg.travel_period,
        duration_days: pkg.duration_days,
        price: pkg.price,
        max_persons: pkg.max_persons,
        featured: pkg.featured,
        included_options: pkg.package_options
          ? {
              flight: pkg.package_options.flight,
              hotel: pkg.package_options.hotel,
              transportation: pkg.package_options.transportation,
              hotelGrade: pkg.package_options.hotel_grade,
            }
          : undefined,
      }));

      return new Response(JSON.stringify({ packages }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fallback to static assets
    // @ts-ignore
    return env.ASSETS.fetch(request);
  },
};
