import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";

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

async function fetchGuilds(): Promise<Server[]> {
  const response = await fetch(`${API_URL}/me/guilds`, {
    credentials: "include",
    mode: "cors",
  });
  if (!response.ok) throw new Error("Failed to fetch guilds");
  const guilds = await response.json();
  return guilds.map((guild: any) => ({ ...guild, channels: [] }));
}

export async function checkBotInstalled(guildId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_URL}/api/guilds/${guildId}/bot-installed`,
      { credentials: "include", mode: "cors" }
    );
    if (response.ok) {
      const data = await response.json();
      return data.installed === true;
    }
  } catch (error) {
    console.error(`Failed to check bot installation for guild ${guildId}:`, error);
  }
  return false;
}

export async function fetchChannels(guildId: string): Promise<Channel[]> {
  try {
    const response = await fetch(
      `${API_URL}/me/guilds/${guildId}/channels`,
      { credentials: "include", mode: "cors" }
    );
    if (response.ok) return await response.json();
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
      return { servers: guilds };
    },
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRefreshServers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guildId: string) => Promise.resolve(guildId),
    onSuccess: (guildId) => {
      queryClient.invalidateQueries({ queryKey: ["bot-installation", guildId] });
    },
  });
}
