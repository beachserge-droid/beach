import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

// GET: Fetch visible homepage category sections for public display
export async function GET() {
  try {
    const sections = await prisma.homepageCategorySection.findMany({
      where: {
        isVisible: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconImage: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    })

    // Format the response
    const formattedSections = sections.map((section) => ({
      id: section.id,
      categoryId: section.categoryId,
      title: section.title || section.category.name,
      slug: section.category.slug,
      productLimit: section.productLimit,
      sortOrder: section.sortOrder,
      category: section.category,
    }))

    return NextResponse.json({ ok: true, sections: formattedSections })
  } catch (error) {
    console.error("Error fetching homepage sections:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to fetch sections" },
      { status: 500 }
    )
  }
}
