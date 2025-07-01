export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return (
      <div>
        <h1>Halaman Detail Kursus</h1>
        <p>Slug: {slug}</p>
      </div>
    );
  }