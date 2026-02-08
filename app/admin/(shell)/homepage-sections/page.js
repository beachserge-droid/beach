"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Eye, EyeOff, Save, Plus, Trash2, AlertCircle, Check } from "lucide-react"

// Sortable Section Item Component
function SortableSectionItem({ section, category, onUpdate, onRemove }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(section.title || "")
  const [editLimit, setEditLimit] = useState(section.productLimit || 4)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.tempId || section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSave = () => {
    onUpdate({
      ...section,
      title: editTitle || null,
      productLimit: parseInt(editLimit) || 4,
    })
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border ${isDragging ? "border-blue-400 shadow-lg" : "border-gray-200"} p-4 mb-3`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded touch-none"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>

        {/* Visibility Toggle */}
        <button
          onClick={() => onUpdate({ ...section, isVisible: !section.isVisible })}
          className={`p-2 rounded transition-colors ${
            section.isVisible ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
          }`}
          title={section.isVisible ? "Gizle" : "Göster"}
        >
          {section.isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bölüm Başlığı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={category?.name || "Kategori Adı"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Boş bırakırsanız kategori adı kullanılır: "{category?.name}"
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gösterilecek Ürün Sayısı
                </label>
                <select
                  value={editLimit}
                  onChange={(e) => setEditLimit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} ürün
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setEditTitle(section.title || "")
                    setEditLimit(section.productLimit || 4)
                    setIsEditing(false)
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {section.title || category?.name || "Bilinmeyen Kategori"}
                </h3>
                {section.title && (
                  <span className="text-xs text-gray-500">
                    (Orijinal: {category?.name})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{section.productLimit || 4}</span> ürün gösterilecek
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${section.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {section.isVisible ? "Görünür" : "Gizli"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Düzenle
            </button>
          )}
          <button
            onClick={() => onRemove(section.tempId || section.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Kaldır"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Category Selector Component
function CategorySelector({ categories, selectedIds, onSelect }) {
  const availableCategories = categories.filter((cat) => !selectedIds.includes(cat.id))

  if (availableCategories.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Tüm kategoriler zaten eklenmiş.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Eklenebilecek Kategoriler</h4>
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
        {availableCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors flex items-center justify-between"
          >
            <span className="font-medium text-gray-800">{category.name}</span>
            <Plus className="w-5 h-5 text-blue-600" />
          </button>
        ))}
      </div>
    </div>
  )
}

// Main Component
export default function HomepageSectionsPage() {
  const router = useRouter()
  const [sections, setSections] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeId, setActiveId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch sections and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/homepage-sections"),
          fetch("/api/categories"),
        ])

        const sectionsData = await sectionsRes.json()
        const categoriesData = await categoriesRes.json()

        if (categoriesData.ok) {
          setCategories(categoriesData.categories || [])
        }

        if (sectionsData.ok) {
          // Add tempId for new items that don't have an ID yet
          const sectionsWithTempId = (sectionsData.sections || []).map((s, index) => ({
            ...s,
            tempId: s.id || `temp-${index}`,
          }))
          setSections(sectionsWithTempId)
        } else {
          // If no sections exist yet, initialize from top-level categories
          const topCategories = (categoriesData.categories || []).filter((c) => !c.parentId)
          const initialSections = topCategories.slice(0, 10).map((cat, index) => ({
            tempId: `temp-${index}`,
            categoryId: cat.id,
            title: null,
            isVisible: true,
            productLimit: 4,
            category: cat,
          }))
          setSections(initialSections)
        }
      } catch (err) {
        setError("Veriler yüklenirken hata oluştu.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => (item.tempId || item.id) === active.id)
        const newIndex = items.findIndex((item) => (item.tempId || item.id) === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }, [])

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id)
  }, [])

  // Update section
  const handleUpdateSection = useCallback((updatedSection) => {
    setSections((items) =>
      items.map((item) =>
        (item.tempId || item.id) === (updatedSection.tempId || updatedSection.id)
          ? updatedSection
          : item
      )
    )
  }, [])

  // Remove section
  const handleRemoveSection = useCallback((id) => {
    setSections((items) => items.filter((item) => (item.tempId || item.id) !== id))
  }, [])

  // Add section
  const handleAddSection = useCallback((category) => {
    const newSection = {
      tempId: `temp-${Date.now()}`,
      categoryId: category.id,
      title: null,
      isVisible: true,
      productLimit: 4,
      category: category,
    }
    setSections((items) => [...items, newSection])
    setShowAddModal(false)
  }, [])

  // Save all sections
  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/homepage-sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sections: sections.map((s) => ({
            categoryId: s.categoryId,
            title: s.title,
            isVisible: s.isVisible,
            productLimit: s.productLimit,
          })),
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setSuccess("Ayarlar başarıyla kaydedildi!")
        // Update sections with server-generated IDs
        const sectionsWithTempId = (data.sections || []).map((s, index) => ({
          ...s,
          tempId: s.id || `temp-${index}`,
        }))
        setSections(sectionsWithTempId)
        router.refresh()
      } else {
        setError(data.error || "Kaydetme sırasında hata oluştu.")
      }
    } catch (err) {
      setError("Kaydetme sırasında hata oluştu.")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-muted">Yükleniyor...</div>
    )
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Anasayfa Bölümleri</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Anasayfada görüntülenecek kategori bölümlerini sürükle-bırak ile sırala.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <button onClick={() => setShowAddModal(true)} className="admin-btn" type="button">
            Bölüm Ekle
          </button>
          <button onClick={handleSave} disabled={saving} className="admin-btn" type="button">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error ? (
        <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div>
      ) : null}

      {success ? (
        <div className="admin-success" style={{ marginTop: 12 }}>{success}</div>
      ) : null}

      {/* Info Card */}
      <div className="admin-card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Bilgi</div>
        <div className="admin-muted" style={{ fontSize: 13 }}>
          Bölümleri sürükleyip bırakarak sıralayabilir, görünürlüğünü ve ürün sayısını ayarlayabilirsin.
        </div>
      </div>

      {/* Sections Count */}
      <div className="admin-muted" style={{ fontSize: 13, marginTop: 12 }}>
        Toplam {sections.length} bölüm ({sections.filter((s) => s.isVisible).length} görünür)
      </div>

      {/* Drag and Drop List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.tempId || s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ marginTop: 12 }}>
            {sections.map((section) => (
              <SortableSectionItem
                key={section.tempId || section.id}
                section={section}
                category={section.category || categories.find((c) => c.id === section.categoryId)}
                onUpdate={handleUpdateSection}
                onRemove={handleRemoveSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {sections.length === 0 ? (
        <div className="admin-card" style={{ marginTop: 12 }}>
          <div className="admin-muted" style={{ fontSize: 13 }}>Henüz bölüm eklenmemiş.</div>
        </div>
      ) : null}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Kategori Ekle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <CategorySelector
                categories={categories}
                selectedIds={sections.map((s) => s.categoryId)}
                onSelect={handleAddSection}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
