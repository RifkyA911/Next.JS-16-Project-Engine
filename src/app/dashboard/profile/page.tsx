"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Shield, 
    Edit,
    Camera,
    Save,
    Bell
} from "lucide-react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        bio: "Senior Software Engineer with 5+ years of experience in full-stack development.",
        department: "Engineering",
        role: "Senior Developer",
        joinDate: "2022-03-15",
        lastActive: "2024-04-19",
        notifications: true,
    });

    const handleSave = () => {
        console.log("Saving profile:", formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto p-6 max-w-[1200px]">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Manage your personal information and preferences
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                                            <AvatarFallback className="text-lg">
                                                JD
                                            </AvatarFallback>
                                        </Avatar>
                                        {isEditing && (
                                            <Button
                                                size="sm"
                                                className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {formData.firstName} {formData.lastName}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {formData.role}
                                        </p>
                                        <Badge variant="secondary" className="mt-2">
                                            {formData.department}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {formData.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {formData.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {formData.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Joined {formData.joinDate}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Professional Information
                                </CardTitle>
                                <CardDescription>
                                    Your work-related details and permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            value={formData.department}
                                            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input
                                            id="role"
                                            value={formData.role}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        className="w-full min-h-[100px] p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-background text-foreground resize-none"
                                        value={formData.bio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                        disabled={!isEditing}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Preferences
                                </CardTitle>
                                <CardDescription>
                                    Manage your notification and display preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Receive email updates about your account activity
                                        </p>
                                    </div>
                                    <Button
                                        variant={formData.notifications ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFormData(prev => ({ ...prev, notifications: !prev.notifications }))}
                                        disabled={!isEditing}
                                    >
                                        {formData.notifications ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Summary</CardTitle>
                                <CardDescription>
                                    Your recent account activity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            127
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Total Logins
                                        </p>
                                    </div>
                                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            45
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Projects Completed
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        <strong>Last Active:</strong> {formData.lastActive}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
