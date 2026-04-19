"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Search, 
    Star, 
    Archive, 
    Trash2, 
    Reply, 
    Forward, 
    MoreHorizontal,
    Paperclip,
    Clock,
    Mail,
    Send,
    User
} from "lucide-react";

// Mock email data
const mockEmails = [
    {
        id: 1,
        from: "john.doe@example.com",
        fromName: "John Doe",
        subject: "Project Update - Q2 2024",
        preview: "Hi team, I wanted to share the latest updates on our Q2 project milestones...",
        content: "Hi team,\n\nI wanted to share the latest updates on our Q2 project milestones. We've made significant progress on the following areas:\n\n1. Frontend Development: 85% complete\n2. Backend API: 92% complete\n3. Testing: 67% complete\n4. Documentation: 45% complete\n\nPlease review the attached documents and let me know if you have any questions.\n\nBest regards,\nJohn",
        date: "2024-04-19T10:30:00",
        read: false,
        starred: true,
        hasAttachment: true,
        category: "work"
    },
    {
        id: 2,
        from: "sarah.smith@company.com",
        fromName: "Sarah Smith",
        subject: "Meeting Rescheduled - Tomorrow 2PM",
        preview: "The meeting scheduled for today has been rescheduled to tomorrow at 2PM...",
        content: "Hi,\n\nThe meeting scheduled for today has been rescheduled to tomorrow at 2PM. Please update your calendars accordingly.\n\nAgenda items:\n- Budget review\n- Timeline adjustments\n- Resource allocation\n\nSee you tomorrow!\nSarah",
        date: "2024-04-19T09:15:00",
        read: true,
        starred: false,
        hasAttachment: false,
        category: "work"
    },
    {
        id: 3,
        from: "newsletter@techblog.com",
        fromName: "Tech Blog",
        subject: "Weekly Tech Newsletter - AI Trends",
        preview: "This week's top stories: AI breakthroughs, new frameworks, and more...",
        content: "This week in tech:\n\n1. Major AI breakthrough in natural language processing\n2. New JavaScript framework gains popularity\n3. Cloud computing costs drop by 15%\n4. Cybersecurity threats on the rise\n\nRead more on our website!",
        date: "2024-04-18T08:00:00",
        read: true,
        starred: false,
        hasAttachment: false,
        category: "newsletter"
    },
    {
        id: 4,
        from: "alex.johnson@client.com",
        fromName: "Alex Johnson",
        subject: "Proposal Review Request",
        preview: "Could you please review the attached proposal and provide feedback by EOD...",
        content: "Hi,\n\nCould you please review the attached proposal and provide feedback by EOD? We need to submit this to the client by tomorrow morning.\n\nKey points to review:\n- Pricing structure\n- Timeline\n- Deliverables\n- Terms and conditions\n\nThanks!\nAlex",
        date: "2024-04-18T14:45:00",
        read: false,
        starred: true,
        hasAttachment: true,
        category: "client"
    },
    {
        id: 5,
        from: "system@notifications.com",
        fromName: "System Notification",
        subject: "Security Alert - New Login",
        preview: "A new login to your account was detected from a new device...",
        content: "A new login to your account was detected:\n\nDevice: Chrome on Windows\nLocation: New York, USA\nTime: 2024-04-18 16:30:00\n\nIf this was you, no action is needed. If not, please secure your account immediately.",
        date: "2024-04-18T16:30:00",
        read: true,
        starred: false,
        hasAttachment: false,
        category: "system"
    },
    {
        id: 6,
        from: "emma.wilson@team.com",
        fromName: "Emma Wilson",
        subject: "Code Review Comments",
        preview: "I've reviewed your latest pull request and have some suggestions...",
        content: "Hi,\n\nI've reviewed your latest pull request and have some suggestions:\n\n1. Consider breaking down the large function into smaller ones\n2. Add more unit tests for edge cases\n3. Update the documentation\n4. Fix the ESLint warnings\n\nOverall, great work! Let me know if you need help with any of these.\n\nEmma",
        date: "2024-04-17T11:20:00",
        read: false,
        starred: false,
        hasAttachment: false,
        category: "work"
    },
    {
        id: 7,
        from: "marketing@ecommerce.com",
        fromName: "ECommerce Store",
        subject: "Flash Sale - 50% Off Everything!",
        preview: "Limited time offer! Get 50% off on all items for the next 24 hours...",
        content: "Flash Sale Alert!\n\nGet 50% off on all items for the next 24 hours only.\n\nUse code: FLASH50\n\nShop now before it's too late!",
        date: "2024-04-17T06:00:00",
        read: true,
        starred: false,
        hasAttachment: false,
        category: "promotion"
    },
    {
        id: 8,
        from: "david.brown@hr.com",
        fromName: "David Brown",
        subject: "Holiday Schedule Update",
        preview: "Please note the updated holiday schedule for the upcoming month...",
        content: "Team,\n\nPlease note the updated holiday schedule:\n\nMay 1: Labor Day (Office Closed)\nMay 15: Company Meeting (Half Day)\nMay 25: Team Building Event\n\nPlan accordingly!\n\nDavid\nHR Department",
        date: "2024-04-16T15:30:00",
        read: true,
        starred: false,
        hasAttachment: true,
        category: "hr"
    }
];

export default function InboxPage() {
    const [emails, setEmails] = useState(mockEmails);
    const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedEmail, setSelectedEmail] = useState<typeof mockEmails[0] | null>(null);

    const categories = [
        { id: "all", label: "All Mail", count: emails.length },
        { id: "work", label: "Work", count: emails.filter(e => e.category === "work").length },
        { id: "client", label: "Client", count: emails.filter(e => e.category === "client").length },
        { id: "newsletter", label: "Newsletter", count: emails.filter(e => e.category === "newsletter").length },
        { id: "system", label: "System", count: emails.filter(e => e.category === "system").length },
        { id: "promotion", label: "Promotion", count: emails.filter(e => e.category === "promotion").length },
        { id: "hr", label: "HR", count: emails.filter(e => e.category === "hr").length },
    ];

    const filteredEmails = emails.filter(email => {
        const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            email.preview.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || email.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSelectEmail = (emailId: number) => {
        setSelectedEmails(prev => 
            prev.includes(emailId) 
                ? prev.filter(id => id !== emailId)
                : [...prev, emailId]
        );
    };

    const handleSelectAll = () => {
        if (selectedEmails.length === filteredEmails.length) {
            setSelectedEmails([]);
        } else {
            setSelectedEmails(filteredEmails.map(e => e.id));
        }
    };

    const handleStarEmail = (emailId: number) => {
        setEmails(prev => prev.map(email => 
            email.id === emailId 
                ? { ...email, starred: !email.starred }
                : email
        ));
    };

    const handleMarkAsRead = (emailId: number) => {
        setEmails(prev => prev.map(email => 
            email.id === emailId 
                ? { ...email, read: true }
                : email
        ));
    };

    const handleDeleteEmails = () => {
        setEmails(prev => prev.filter(email => !selectedEmails.includes(email.id)));
        setSelectedEmails([]);
        setSelectedEmail(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="h-full flex">
            {/* Email List */}
            <div className="w-96 border-r flex flex-col">
                {/* Search and Actions */}
                <div className="p-4 border-b space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search emails..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
                                onCheckedChange={handleSelectAll}
                            />
                            <Button variant="ghost" size="sm" disabled={selectedEmails.length === 0}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Categories */}
                <div className="p-4 border-b">
                    <div className="space-y-1">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                                    selectedCategory === category.id 
                                        ? "bg-blue-50 text-blue-600" 
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <span className="text-sm font-medium">{category.label}</span>
                                <Badge variant="secondary" className="text-xs">
                                    {category.count}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Email List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredEmails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Mail className="h-12 w-12 mb-2" />
                            <p>No emails found</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredEmails.map(email => (
                                <div
                                    key={email.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !email.read ? "bg-blue-50" : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedEmail(email);
                                        handleMarkAsRead(email.id);
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={selectedEmails.includes(email.id)}
                                            onCheckedChange={() => handleSelectEmail(email.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(email.fromName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm ${!email.read ? "font-semibold" : ""}`}>
                                                    {email.fromName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(email.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-sm truncate ${!email.read ? "font-semibold" : ""}`}>
                                                    {email.subject}
                                                </span>
                                                {email.hasAttachment && (
                                                    <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                )}
                                                {email.starred && (
                                                    <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 truncate">
                                                {email.preview}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 flex flex-col">
                {selectedEmail ? (
                    <>
                        {/* Email Header */}
                        <div className="border-b p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                        <Reply className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Forward className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Archive className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleStarEmail(selectedEmail.id)}
                                    >
                                        <Star className={`h-4 w-4 ${selectedEmail.starred ? "fill-current text-yellow-500" : ""}`} />
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                        {getInitials(selectedEmail.fromName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{selectedEmail.fromName}</span>
                                        <span className="text-sm text-gray-500">&lt;{selectedEmail.from}&gt;</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>To: me</span>
                                        <span>{new Date(selectedEmail.date).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Body */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="whitespace-pre-wrap text-sm">
                                {selectedEmail.content}
                            </div>
                            
                            {selectedEmail.hasAttachment && (
                                <div className="mt-6 p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <Paperclip className="h-4 w-4" />
                                        Attachments
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 border rounded">
                                            <span className="text-sm">document.pdf</span>
                                            <Button variant="ghost" size="sm">Download</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reply Section */}
                        <div className="border-t p-4">
                            <div className="flex gap-2">
                                <Input placeholder="Type your reply..." className="flex-1" />
                                <Button>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <Mail className="h-16 w-16 mx-auto mb-4" />
                            <p>Select an email to read</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
