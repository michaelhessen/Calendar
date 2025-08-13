"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PlannerDiff, PlannerAction } from '@/types';
import { ArrowRight, PlusCircle, Trash2, Edit } from 'lucide-react';

const getActionIcon = (action: PlannerAction) => {
    switch(action) {
        case 'CREATE': return <PlusCircle className="h-5 w-5 text-green-400" />;
        case 'DELETE': return <Trash2 className="h-5 w-5 text-red-400" />;
        case 'MOVE': return <ArrowRight className="h-5 w-5 text-blue-400" />;
        case 'UPDATE': return <Edit className="h-5 w-5 text-yellow-400" />;
    }
}

const getBadgeVariant = (action: PlannerAction): "success" | "destructive" | "info" | "warning" => {
    switch (action) {
        case 'CREATE': return 'success';
        case 'DELETE': return 'destructive';
        case 'MOVE': return 'info';
        case 'UPDATE': return 'warning';
    }
}

interface PlannerDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  diff: PlannerDiff[];
}

const PlannerDiffModal = ({ isOpen, onClose, onApply, diff }: PlannerDiffModalProps) => {
  if (!isOpen) return null;

  return (
    <DialogPortal>
        <DialogOverlay onClick={onClose}/>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Proposed Plan</DialogTitle>
          <DialogDescription>
            The AI has generated the following plan. Review the changes and confirm to apply them to your calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-3 p-1">
          {diff.map((item, index) => (
            <div key={index} className="p-3 bg-secondary rounded-md flex items-start gap-4">
              <div className="pt-1">{getActionIcon(item.action)}</div>
              <div>
                <Badge variant={getBadgeVariant(item.action)}>{item.action}</Badge>
                <p className="font-semibold mt-1">{item.summary || item.event.summary}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={onApply}>Accept & Apply</Button>
        </DialogFooter>
        <DialogClose onClick={onClose} />
      </DialogContent>
    </DialogPortal>
  );
};

export default PlannerDiffModal;
