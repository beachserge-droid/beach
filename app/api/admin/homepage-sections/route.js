import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sanitizeInput, validateId, escapeHtml } from "@/lib/security"

export const runtime = "nodejs"

// GET: Fetch all homepage category sections
export async function GET() {
  try {
    const sections = await prisma.homepageCategorySection.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    })

    return NextResponse.json({ ok: true, sections })
  } catch (error) {
    console.error("Error fetching homepage sections:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to fetch sections" },
      { status: 500 }
    )
  }
}

// POST: Create or update homepage category sections
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    const sections = body && typeof body === "object" ? body.sections : null

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { ok: false, error: "Invalid sections data" },
        { status: 400 }
      )
    }

    const safeSections = sections.slice(0, 50)
    const normalized = safeSections
      .map((section) => {
        const categoryId = validateId(section?.categoryId)
        if (!categoryId) return null

        const rawTitle = section?.title != null ? sanitizeInput(String(section.title), 200) : ""
        const title = rawTitle ? escapeHtml(rawTitle) : null

        const productLimitRaw = section?.productLimit != null ? Number(section.productLimit) : 4
        const productLimit = Number.isNaN(productLimitRaw) ? 4 : Math.max(1, Math.min(24, productLimitRaw))

        const isVisible = section?.isVisible === false ? false : true

        return { categoryId, title, isVisible, productLimit }
      })
      .filter(Boolean)

    // Delete existing sections
    await prisma.homepageCategorySection.deleteMany()

    // Create new sections
    const createdSections = await prisma.$transaction(
      normalized.map((section, index) =>
        prisma.homepageCategorySection.create({
          data: {
            categoryId: section.categoryId,
            title: section.title,
            isVisible: section.isVisible,
            productLimit: section.productLimit,
            sortOrder: index,
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        })
      )
    )

    return NextResponse.json({
      ok: true,
      sections: createdSections,
      message: "Homepage sections updated successfully",
    })
  } catch (error) {
    console.error("Error updating homepage sections:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to update sections" },
      { status: 500 }
    )
  }
}

// PUT: Update specific section
export async function PUT(request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 })
    }
    const { id, title, isVisible, productLimit } = body

    const sectionId = validateId(id)
    if (!sectionId) {
      return NextResponse.json(
        { ok: false, error: "Section ID is required" },
        { status: 400 }
      )
    }

    const titleValue = title !== undefined ? sanitizeInput(String(title || ""), 200) : undefined
    const productLimitRaw = productLimit !== undefined ? Number(productLimit) : undefined
    const productLimitValue =
      productLimitRaw === undefined || Number.isNaN(productLimitRaw)
        ? undefined
        : Math.max(1, Math.min(24, productLimitRaw))

    const updatedSection = await prisma.homepageCategorySection.update({
      where: { id: sectionId },
      data: {
        title: titleValue !== undefined ? (titleValue ? escapeHtml(titleValue) : null) : undefined,
        isVisible: isVisible !== undefined ? (isVisible === false ? false : true) : undefined,
        productLimit: productLimitValue,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({
      ok: true,
      section: updatedSection,
      message: "Section updated successfully",
    })
  } catch (error) {
    console.error("Error updating section:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to update section" },
      { status: 500 }
    )
  }
}

// DELETE: Remove a section
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const sectionId = validateId(id)
    if (!sectionId) {
      return NextResponse.json(
        { ok: false, error: "Section ID is required" },
        { status: 400 }
      )
    }

    await prisma.homepageCategorySection.delete({
      where: { id: sectionId },
    })

    return NextResponse.json({
      ok: true,
      message: "Section deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting section:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to delete section" },
      { status: 500 }
    )
  }
}
