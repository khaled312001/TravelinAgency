export default defineEventHandler(async (event) => {
  try {
    // في التطبيق الحقيقي، ستأتي هذه البيانات من قاعدة البيانات
    // هنا نستخدم بيانات وهمية للعرض
    
    const contentData = {
      typeDistribution: {
        labels: ['صفحة', 'مقال', 'أخبار'],
        data: [15, 8, 12]
      },
      statusDistribution: {
        labels: ['منشور', 'مسودة', 'مؤرشف'],
        data: [25, 8, 2]
      },
      monthlyPublishing: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        data: [3, 5, 4, 6, 7, 8]
      },
      stats: {
        totalPages: 35,
        publishedPages: 25,
        draftPages: 8,
        archivedPages: 2,
        todayPages: 2
      }
    }

    return {
      success: true,
      data: contentData
    }
  } catch (error) {
    console.error('خطأ في تحميل بيانات المحتوى:', error)
    return {
      success: false,
      error: 'فشل في تحميل بيانات المحتوى'
    }
  }
})
