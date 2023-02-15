import { GuildMember, Snowflake } from 'discord.js';
import { CommandContext, CommandHook } from '..';

interface CommandRan {
	user: Snowflake;
	last: Date;
}

export function cooldown<DB = undefined>(seconds: number, error: any = null): CommandHook<DB> {
	const history: CommandRan[] = [];

	// eslint-disable-next-line @typescript-eslint/require-await
	return async (ctx: CommandContext<DB>) => {
		const member = ctx.interaction.member as GuildMember | null;
		if (member === null) {
			throw ctx;
		}

		if (await ctx.getPermissionLevel(member) >= 3) {
			return ctx;
		}

		const last = history.find((c) => c.user === member.id);

		if (!last) {
			history.push({
				user: member.id,
				last: new Date(),
			});
			return ctx;
		}

		const limit = new Date();
		limit.setSeconds(limit.getSeconds() - seconds);

		if (limit < last.last) {
			if (error) {
				throw error;
			}
			ctx.skip = true;
			return ctx;
		}

		last.last = new Date();

		return ctx;
	};
}
