'use client';

import type {User} from 'firebase/auth';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Bot, MessageSquare, BookText, HeartPulse, LineChart, Camera, Map, Bell, History} from 'lucide-react';

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
      <Sidebar className="sidebar-blue-accent">
        <SidebarHeader className="border-b border-blue-500/20">
          <div className="flex h-16 items-center gap-3 p-2 pr-4">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Bot className="h-6 w-6 shrink-0 text-primary" />
            </div>
                          <div className="flex-1 overflow-hidden">
                <h1 className="truncate text-lg font-semibold text-foreground group-data-[collapsible=icon]:opacity-0 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  AI Chat
                </h1>
                <p className="text-xs text-blue-300 truncate group-data-[collapsible=icon]:opacity-0">
                  Your personal AI-powered health assistant.
                </p>
              </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/chat'}
                tooltip={{children: 'Chat'}}
                className="hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500/50 transition-all"
              >
                <Link href="/chat">
                  <MessageSquare className="text-blue-400" />
                  <span>Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/chat-history'}
                tooltip={{children: 'Chat History'}}
                className="hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500/50 transition-all"
              >
                <Link href="/chat-history">
                  <History className="text-blue-400" />
                  <span>Chat History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator className="bg-blue-500/20" />
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-300 font-medium">Tools</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/terminology-simplifier'}
                  tooltip={{children: 'Explain Terms'}}
                  className="hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500/50 transition-all"
                >
                  <Link href="/tools/terminology-simplifier">
                    <BookText className="text-blue-400" />
                    <span>Explain Terms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/symptom-condition-mapper'}
                  tooltip={{children: 'Check Symptoms'}}
                  className="hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500/50 transition-all"
                >
                  <Link href="/tools/symptom-condition-mapper">
                    <HeartPulse className="text-blue-400" />
                    <span>Check Symptoms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/skin-analyzer'}
                  tooltip={{children: 'Skin Analyzer'}}
                  className="hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500/50 transition-all"
                >
                  <Link href="/tools/skin-analyzer">
                    <Camera className="text-blue-400" />
                    <span>Skin Analyzer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/health-services-finder'}
                  tooltip={{children: 'Find Services'}}
                  className="hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500/50 transition-all"
                >
                  <Link href="/tools/health-services-finder">
                    <Map className="text-blue-400" />
                    <span>Find Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/health-reminders'}
                  tooltip={{children: 'Reminders'}}
                  className="hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500/50 transition-all"
                >
                  <Link href="/tools/health-reminders">
                    <Bell className="text-blue-400" />
                    <span>Reminders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-blue-500/20 bg-background px-4 shadow-sm md:px-6">
          <SidebarTrigger className="text-blue-400 hover:text-blue-300 transition-colors" />
        </header>
        <main className="flex flex-1 flex-col overflow-auto blue-gradient">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
