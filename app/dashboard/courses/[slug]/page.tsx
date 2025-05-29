export default function CourseDetailPage({ params }: { params: { slug: string } }) {
    return (
      <div>
        <h1>Halaman Detail Kursus</h1>
        <p>Slug: {params.slug}</p>
      </div>
    );
  }