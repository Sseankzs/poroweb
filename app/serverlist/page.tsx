"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useServers, useRefreshServers, useBotInstallation } from "@/lib/use-servers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useQueries } from "@tanstack/react-query";

interface Subscription {
  game_id: number;
  game_name: string;
  enabled: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  subscriptions?: Subscription[];
}

interface Server {
  id: string;
  name: string;
  icon: string | null;
  channels: Channel[];
}

interface Game {
  id: number;
  name: string;
  enabled: boolean;
  comingSoon?: boolean;
}

const GAMES: Game[] = [
  { id: 1, name: "League of Legends", enabled: true },
  { id: 2, name: "Valorant", enabled: false, comingSoon: true },
  { id: 3, name: "Teamfight Tactics", enabled: false, comingSoon: true },
  { id: 4, name: "Legends of Runeterra", enabled: false, comingSoon: true },
];

interface ServerCardProps {
  server: Server;
  isLoggedIn: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onInviteBot: (guildId: string) => Promise<void>;
}

function ChannelGameSettings({ channel, serverId, serverName }: { channel: Channel; serverId: string; serverName: string }) {
  const [expandedChannel, setExpandedChannel] = useState(false);
  
  // Initialize game settings from channel subscriptions
  const [gameSettings, setGameSettings] = useState<Record<number, boolean>>(() => {
    const settings: Record<number, boolean> = {};
    if (channel.subscriptions) {
      channel.subscriptions.forEach((sub) => {
        settings[sub.game_id] = sub.enabled;
      });
    }
    return settings;
  });
  
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const toggleGame = async (game: Game) => {
    const newState = !gameSettings[game.id];
    
    // Optimistically update UI
    setGameSettings((prev) => ({
      ...prev,
      [game.id]: newState,
    }));
    
    setLoading((prev) => ({ ...prev, [game.id]: true }));

    try {
      const response = await fetch("http://localhost:2000/api/subscriptions/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          server_id: serverId,
          server_name: serverName,
          channel_id: channel.id,
          channel_name: channel.name,
          game_id: game.id,
          enabled: newState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle subscription");
      }

      const data = await response.json();
      
      // Update with server response
      if (data.ok) {
        setGameSettings((prev) => ({
          ...prev,
          [data.game_id]: data.enabled,
        }));
      } else {
        // Revert on failure
        setGameSettings((prev) => ({
          ...prev,
          [game.id]: !newState,
        }));
      }
    } catch (error) {
      console.error("Failed to toggle game subscription:", error);
      // Revert on error
      setGameSettings((prev) => ({
        ...prev,
        [game.id]: !newState,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [game.id]: false }));
    }
  };

  return (
    <div className="rounded-md border border-border/50">
      <button
        onClick={() => setExpandedChannel(!expandedChannel)}
        className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-accent/10"
      >
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
          <span className="text-sm font-medium">{channel.name}</span>
        </div>
        <svg
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            expandedChannel ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expandedChannel && (
        <div className="border-t border-border/50 bg-card/30 px-3 py-3">
          <div className="space-y-2">
            {GAMES.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/5"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!game.enabled ? "text-muted-foreground" : ""}`}>
                    {game.name}
                  </span>
                  {game.comingSoon && (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </div>
                <button
                  onClick={() => game.enabled && toggleGame(game)}
                  disabled={!game.enabled || loading[game.id]}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    game.enabled
                      ? gameSettings[game.id]
                        ? "bg-accent"
                        : "bg-accent/30"
                      : "cursor-not-allowed bg-accent/10"
                  }`}
                  aria-label={`Toggle ${game.name}`}
                >
                  {loading[game.id] ? (
                    <div className="mx-auto h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        gameSettings[game.id] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ServerCard({ server, isLoggedIn, isExpanded, onToggle, onInviteBot }: ServerCardProps) {
  const { data: botData, isLoading: botLoading } = useBotInstallation(server.id, isLoggedIn);
  const isInstalled = botData?.isInstalled ?? false;

  if (botLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-accent/50">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            {server.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                alt={server.name}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
                {server.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{server.name}</h3>
              <p className="text-sm text-muted-foreground">Checking bot status...</p>
            </div>
          </div>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-accent/50">
      {isInstalled ? (
        <>
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-accent/5"
          >
            <div className="flex items-center gap-4">
              {server.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                  alt={server.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
                  {server.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{server.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {server.channels.length} channel
                  {server.channels.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <svg
              className={`h-5 w-5 text-muted-foreground transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isExpanded && (
            <div className="border-t border-border bg-card/50 px-6 py-4">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Channel Settings
              </h4>
              <div className="space-y-2">
                {server.channels.map((channel) => (
                  <ChannelGameSettings
                    key={channel.id}
                    channel={channel}
                    serverId={server.id}
                    serverName={server.name}
                  />
                ))}
                {server.channels.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No text channels found
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            {server.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                alt={server.name}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
                {server.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{server.name}</h3>
              <p className="text-sm text-muted-foreground">
                Bot not installed
              </p>
            </div>
          </div>
          <button
            onClick={() => onInviteBot(server.id)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Invite Bot
          </button>
        </div>
      )}
    </div>
  );
}

export default function ServerList() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const { data, isLoading, error } = useServers(isLoggedIn);
  const refreshServers = useRefreshServers();
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());

  const servers = data?.servers ?? [];

  // Use useQueries to fetch bot installation status for all servers
  const botInstallationQueries = useQueries({
    queries: servers.map((server) => ({
      queryKey: ["bot-installation", server.id],
      queryFn: async () => {
        const response = await fetch(
          `http://localhost:2000/api/guilds/${server.id}/bot-installed`,
          {
            credentials: "include",
            mode: "cors",
          }
        );
        if (response.ok) {
          return await response.json();
        }
        return false;
      },
      enabled: isLoggedIn && !!server.id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Sort servers based on loaded bot installation status
  const sortedServers = useMemo(() => {
    return [...servers].sort((a, b) => {
      const aQuery = botInstallationQueries.find(
        (q) => q.data !== undefined && servers.find((s) => s.id === a.id)
      );
      const bQuery = botInstallationQueries.find(
        (q) => q.data !== undefined && servers.find((s) => s.id === b.id)
      );
      
      const aInstalled = aQuery?.data ?? false;
      const bInstalled = bQuery?.data ?? false;
      
      // Sort installed first (true > false)
      if (aInstalled === bInstalled) return 0;
      return bInstalled ? 1 : -1;
    });
  }, [servers, botInstallationQueries]);

  const toggleServer = (serverId: string) => {
    setExpandedServers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serverId)) {
        newSet.delete(serverId);
      } else {
        newSet.add(serverId);
      }
      return newSet;
    });
  };

  const handleInviteBot = async (guildId: string) => {
    try {
      const response = await fetch(
        `http://localhost:2000/api/guilds/${guildId}/bot-invite`,
        {
          credentials: "include",
          mode: "cors",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const inviteWindow = window.open(data.invite_url, "_blank");
        
        // Poll to check if the invite window is closed
        if (inviteWindow) {
          const checkWindowClosed = setInterval(() => {
            if (inviteWindow.closed) {
              clearInterval(checkWindowClosed);
              
              // Window closed, refresh server data using React Query
              refreshServers.mutate(guildId);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Failed to get bot invite:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        username={user?.username}
        avatarUrl={user?.avatarUrl}
        onLogin={login}
        onLogout={logout}
      />

      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Your Servers</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your Discord servers and configure PoroBot
            </p>
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <svg
                  className="h-8 w-8 text-accent-foreground"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Login Required</h2>
              <p className="mt-2 text-muted-foreground">
                Please log in with Discord to view and manage your servers
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
            </div>
          ) : servers.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                No servers found. Make sure PoroBot is added to your Discord servers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedServers.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  isLoggedIn={isLoggedIn}
                  isExpanded={expandedServers.has(server.id)}
                  onToggle={() => toggleServer(server.id)}
                  onInviteBot={handleInviteBot}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
