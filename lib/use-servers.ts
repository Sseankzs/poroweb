import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Channel {
  id: string;
  name: string;
  type: string;
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
      `http://localhost:2000/me/guilds/${guildId}/channels`,
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
      const guilds = await fetchGuilds();
      
      // Check bot installation for all guilds
      const installationChecks = await Promise.all(
        guilds.map(async (guild) => ({
          guildId: guild.id,
          isInstalled: await checkBotInstalled(guild.id),
        }))
      );

      const installationMap = new Map(
        installationChecks.map((result) => [result.guildId, result.isInstalled])
      );

      // Fetch channels for guilds where bot is installed
      const channelResults = await Promise.all(
        installationChecks
          .filter((result) => result.isInstalled)
          .map(async (result) => ({
            guildId: result.guildId,
            channels: await fetchChannels(result.guildId),
          }))
      );

      // Merge channels into servers
      const serversWithChannels = guilds.map((server) => {
        const channelData = channelResults.find((r) => r.guildId === server.id);
        return channelData ? { ...server, channels: channelData.channels } : server;
      });

      return {
        servers: serversWithChannels,
        botInstalled: installationMap,
      };
    },
    enabled: isLoggedIn, // Only fetch when logged in
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
