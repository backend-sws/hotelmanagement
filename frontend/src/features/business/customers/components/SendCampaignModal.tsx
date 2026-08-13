import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import api from '@/lib/api';

interface SendCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendCampaignModal({ isOpen, onClose }: SendCampaignModalProps) {
  const [target, setTarget] = useState('all');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message for the campaign.');
      return;
    }

    setIsSending(true);
    try {
      await api.post('/business/marketing/whatsapp-campaign', {
        target,
        message
      });
      toast.success('Campaign queued successfully. Messages will be sent in the background.');
      onClose();
      setMessage('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send campaign');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-emerald-600">
          <Send className="w-5 h-5" /> WhatsApp Campaign
        </div>
      }
      description="Send a bulk WhatsApp marketing message to your customers."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend} disabled={isSending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isSending ? 'Sending...' : 'Send Campaign'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label className="font-bold">Target Audience</Label>
          <Select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full">
            <option value="all">All Customers</option>
            <option value="with_dues">Only Customers with Outstanding Dues</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Message Content</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Dear customer, enjoy 10% off on your next visit..."
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-slate-500">
            Note: Customers must have a valid phone number to receive messages.
          </p>
        </div>
      </div>
    </Modal>
  );
}

