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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Settings,
    Globe,
    Bell,
    Shield,
    Palette,
    Monitor,
    Moon,
    Sun,
    Save
} from "lucide-react";

export default function SettingsGeneralPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        siteName: "NextJS Project Engine",
        siteDescription: "Production-ready Next.js 16 template with modern features",
        defaultLanguage: "en",
        timezone: "UTC-8",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12-hour",
        theme: "system",
        notifications: {
            email: true,
            push: false,
            sms: false,
            desktop: true,
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
            allowDirectMessages: true,
        },
        security: {
            twoFactorAuth: true,
            sessionTimeout: "30 minutes",
            loginAlerts: true,
            apiAccess: "limited",
        },
    });

    const handleSave = () => {
        console.log("Saving settings:", formData);
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
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">General Settings</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Configure your application preferences and general settings
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
                                <Settings className="h-4 w-4" />
                                Edit Settings
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Basic Settings
                            </CardTitle>
                            <CardDescription>
                                Configure your basic application preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    value={formData.siteName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Site Description</Label>
                                <textarea
                                    id="siteDescription"
                                    className="w-full min-h-[80px] p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-background text-foreground resize-none"
                                    value={formData.siteDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="Describe your site..."
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="defaultLanguage">Default Language</Label>
                                    <Select
                                        value={formData.defaultLanguage}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, defaultLanguage: value }))}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                            <SelectItem value="fr">Français</SelectItem>
                                            <SelectItem value="de">Deutsch</SelectItem>
                                            <SelectItem value="zh">中文</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select
                                        value={formData.timezone}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                                            <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                                            <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                                            <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                                            <SelectItem value="UTC+8">UTC+8 (Beijing)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateFormat">Date Format</Label>
                                    <Select
                                        value={formData.dateFormat}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, dateFormat: value }))}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timeFormat">Time Format</Label>
                                    <Select
                                        value={formData.timeFormat}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, timeFormat: value }))}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="12-hour">12-hour</SelectItem>
                                            <SelectItem value="24-hour">24-hour</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of your application
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme Preference</Label>
                                <Select
                                    value={formData.theme}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="h-4 w-4" />
                                                System Default
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="light">
                                            <div className="flex items-center gap-2">
                                                <Sun className="h-4 w-4" />
                                                Light
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <div className="flex items-center gap-2">
                                                <Moon className="h-4 w-4" />
                                                Dark
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>
                                Configure how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Receive updates via email
                                        </p>
                                    </div>
                                    <Switch
                                        id="emailNotifications"
                                        checked={formData.notifications.email}
                                        onCheckedChange={(checked) => setFormData(prev => ({
                                            ...prev,
                                            notifications: { ...prev.notifications, email: checked }
                                        }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Browser push notifications
                                        </p>
                                    </div>
                                    <Switch
                                        id="pushNotifications"
                                        checked={formData.notifications.push}
                                        onCheckedChange={(checked) => setFormData(prev => ({
                                            ...prev,
                                            notifications: { ...prev.notifications, push: checked }
                                        }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Receive updates via SMS
                                        </p>
                                    </div>
                                    <Switch
                                        id="smsNotifications"
                                        checked={formData.notifications.sms}
                                        onCheckedChange={(checked) => setFormData(prev => ({
                                            ...prev,
                                            notifications: { ...prev.notifications, sms: checked }
                                        }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            In-app desktop notifications
                                        </p>
                                    </div>
                                    <Switch
                                        id="desktopNotifications"
                                        checked={formData.notifications.desktop}
                                        onCheckedChange={(checked) => setFormData(prev => ({
                                            ...prev,
                                            notifications: { ...prev.notifications, desktop: checked }
                                        }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Privacy Settings
                            </CardTitle>
                            <CardDescription>
                                Control your privacy and data sharing preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                                    <Select
                                        value={formData.privacy.profileVisibility}
                                        onValueChange={(value) => setFormData(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, profileVisibility: value }
                                        }))}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                            <SelectItem value="friends">Friends Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="showEmail">Show Email Address</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Display email on your profile
                                        </p>
                                    </div>
                                    <Switch
                                        id="showEmail"
                                        checked={formData.privacy.showEmail}
                                        onCheckedChange={(checked) => setFormData(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, showEmail: checked }
                                        }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="showPhone">Show Phone Number</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Display phone on your profile
                                        </p>
                                    </div>
                                    <Switch
                                        id="showPhone"
                                        checked={formData.privacy.showPhone}
                                        onCheckedChange={(checked) => setFormData(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, showPhone: checked }
                                        }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="allowDirectMessages">Allow Direct Messages</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Let others message you directly
                                        </p>
                                    </div>
                                    <Switch
                                        id="allowDirectMessages"
                                        checked={formData.privacy.allowDirectMessages}
                                        onCheckedChange={(checked) => setFormData(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, allowDirectMessages: checked }
                                        }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Security Settings */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security Settings
                        </CardTitle>
                        <CardDescription>
                            Configure your security and authentication preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Add an extra layer of security
                                    </p>
                                </div>
                                <Switch
                                    id="twoFactorAuth"
                                    checked={formData.security.twoFactorAuth}
                                    onCheckedChange={(checked) => setFormData(prev => ({
                                        ...prev,
                                        security: { ...prev.security, twoFactorAuth: checked }
                                    }))}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sessionTimeout">Session Timeout</Label>
                                <Select
                                    value={formData.security.sessionTimeout}
                                    onValueChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        security: { ...prev.security, sessionTimeout: value }
                                    }))}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15 minutes">15 minutes</SelectItem>
                                        <SelectItem value="30 minutes">30 minutes</SelectItem>
                                        <SelectItem value="1 hour">1 hour</SelectItem>
                                        <SelectItem value="4 hours">4 hours</SelectItem>
                                        <SelectItem value="24 hours">24 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="loginAlerts">Login Alerts</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Get notified of new logins
                                    </p>
                                </div>
                                <Switch
                                    id="loginAlerts"
                                    checked={formData.security.loginAlerts}
                                    onCheckedChange={(checked) => setFormData(prev => ({
                                        ...prev,
                                        security: { ...prev.security, loginAlerts: checked }
                                    }))}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="apiAccess">API Access Level</Label>
                            <Select
                                value={formData.security.apiAccess}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    security: { ...prev.security, apiAccess: value }
                                }))}
                                disabled={!isEditing}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Access</SelectItem>
                                    <SelectItem value="read">Read Only</SelectItem>
                                    <SelectItem value="limited">Limited Access</SelectItem>
                                    <SelectItem value="full">Full Access</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
