import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

interface BotInstallationResult {
  guildId: string;
  isInstalled: boolean;
}

interface ChannelResult {
  guildId: string;
  channels: Channel[];
}

// Fetch all user guilds
async function fetchGuilds(): Promise<Server[]> {
  const response = await fetch("http://localhost:2000/me/guilds", {
    credentials: "include",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch guilds");
  }

  const guilds = await response.json();
  return guilds.map((guild: any) => ({
    ...guild,
    channels: [],
  }));
}

// Check bot installation for a guild
async function checkBotInstalled(guildId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `http://localhost:2000/api/guilds/${guildId}/bot-installed`,
      {
        credentials: "include",
        mode: "cors",
      }
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Failed to check bot installation for guild ${guildId}:`, error);
  }
  return false;
}

// Fetch channels for a guild
async function fetchChannels(guildId: string): Promise<Channel[]> {
  try {
    const response = await fetch(
      `http://localhost:2000/me/guilds/${guildId}`,
      {
        credentials: "include",
        mode: "cors",
      }
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Failed to fetch channels for guild ${guildId}:`, error);
  }
  return [];
}

export function useServers(isLoggedIn: boolean) {
  return useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      // First, fetch and return guilds immediately
      const guilds = await fetchGuilds();
      
      return {
        servers: guilds,
        botInstalled: new Map<string, boolean>(),
      };
    },
    enabled: isLoggedIn, // Only fetch when logged in
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Hook to check bot installation status for each server
export function useBotInstallation(guildId: string, isLoggedIn: boolean) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ["bot-installation", guildId],
    queryFn: async () => {
      const isInstalled = await checkBotInstalled(guildId);
      
      // If bot is installed, also fetch channels
      if (isInstalled) {
        const channels = await fetchChannels(guildId);
        
        // Update the server data in cache with channels
        queryClient.setQueryData(["servers"], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            servers: oldData.servers.map((server: Server) =>
              server.id === guildId ? { ...server, channels } : server
            ),
          };
        });
        
        return { isInstalled, channels };
      }
      
      return { isInstalled, channels: [] };
    },
    enabled: isLoggedIn && !!guildId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRefreshServers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guildId: string) => {
      // Check if bot is now installed
      const isInstalled = await checkBotInstalled(guildId);
      
      if (isInstalled) {
        // Fetch channels
        const channels = await fetchChannels(guildId);
        return { guildId, isInstalled, channels };
      }
      
      return { guildId, isInstalled, channels: [] };
    },
    onSuccess: () => {
      // Invalidate and refetch servers
      queryClient.invalidateQueries({ queryKey: ["servers"] });
    },
  });
}
