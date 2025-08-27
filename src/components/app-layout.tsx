'use client';

import type {User} from 'firebase/auth';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Bot, MessageSquare, BookText, HeartPulse, LineChart, Camera, Map, Bell} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({children}: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-16 items-center gap-3 p-2 pr-4">
            <Bot className="h-8 w-8 shrink-0 text-primary" />
            <div className="flex-1 overflow-hidden">
              <h1 className="truncate text-xl font-semibold text-foreground group-data-[collapsible=icon]:opacity-0">
                HealthAssist AI
              </h1>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip={{children: 'Symptom Checker'}}
              >
                <Link href="/">
                  <MessageSquare />
                  <span>Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/terminology-simplifier'}
                  tooltip={{children: 'Terminology Simplifier'}}
                >
                  <Link href="/tools/terminology-simplifier">
                    <BookText />
                    <span>Explain Terms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/symptom-condition-mapper'}
                  tooltip={{children: 'Symptom Mapper'}}
                >
                  <Link href="/tools/symptom-condition-mapper">
                    <HeartPulse />
                    <span>Check Symptoms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/health-progress-tracker'}
                  tooltip={{children: 'Progress Tracker'}}
                >
                  <Link href="/tools/health-progress-tracker">
                    <LineChart />
                    <span>Health Tracker</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/skin-analyzer'}
                  tooltip={{children: 'Skin Analyzer'}}
                >
                  <Link href="/tools/skin-analyzer">
                    <Camera />
                    <span>Skin Analyzer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/health-services-finder'}
                  tooltip={{children: 'Find Services'}}
                >
                  <Link href="/tools/health-services-finder">
                    <Map />
                    <span>Find Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/health-reminders'}
                  tooltip={{children: 'Reminders'}}
                >
                  <Link href="/tools/health-reminders">
                    <Bell />
                    <span>Reminders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
          <SidebarTrigger />
        </header>
        <main className="flex flex-1 flex-col overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
