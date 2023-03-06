import { GuildMember, Snowflake } from 'discord.js';
import { CommandContext, CommandHook } from '..';

interface CommandRan {
	user: Snowflake;
	last: Date;
}

/**
 * Checks if the command was already ran by the same user within the last x seconds as provided by the param.
 * If it was, it throws an error if provided, or else sets ctx.skip to true.
 * If the ctx.getPermissionLevel method returns a number higher than the given bypass param, or the command was ran in dms, this cooldown is ignored
 */
export function cooldown<DB = undefined>(seconds: number, error: any = null, bypass = 3): CommandHook<DB> {
	const history: CommandRan[] = [];

	// eslint-disable-next-line @typescript-eslint/require-await
	return async (ctx: CommandContext<DB>) => {
		const member = ctx.interaction.member as GuildMember | null;
		if (member === null) {
			return ctx;
		}

		if (await ctx.getPermissionLevel(member) >= bypass) {
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
