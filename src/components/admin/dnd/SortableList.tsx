"use client";

import React from "react";
import {
 DndContext,
 closestCenter,
 KeyboardSensor,
 PointerSensor,
 useSensor,
 useSensors,
 DragEndEvent,
} from "@dnd-kit/core";
import {
 arrayMove,
 SortableContext,
 sortableKeyboardCoordinates,
 verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface SortableListProps<T> {
 items: T[];
 onReorder: (newItems: T[]) => void;
 renderItem: (item: T, index: number) => React.ReactNode;
 keyExtractor: (item: T) => string;
}

export function SortableList<T>({ items, onReorder, renderItem, keyExtractor }: SortableListProps<T>) {
 const sensors = useSensors(
 useSensor(PointerSensor, {
 activationConstraint: {
 distance: 5,
 },
 }),
 useSensor(KeyboardSensor, {
 coordinateGetter: sortableKeyboardCoordinates,
 })
 );

 const handleDragEnd = (event: DragEndEvent) => {
 const { active, over } = event;
 if (over && active.id !== over.id) {
 const oldIndex = items.findIndex((i) => keyExtractor(i) === active.id);
 const newIndex = items.findIndex((i) => keyExtractor(i) === over.id);
 const newItems = arrayMove(items, oldIndex, newIndex);
 onReorder(newItems);
 }
 };

 return (
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}> <SortableContext items={items.map(keyExtractor)} strategy={verticalListSortingStrategy}> <div className="space-y-3">
 {items.map((item, index) => renderItem(item, index))}
 </div> </SortableContext> </DndContext>
 );
}
