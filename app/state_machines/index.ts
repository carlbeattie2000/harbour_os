import { InvalidStateTransitionException } from '#errors/state_machine'

export function assertValidTransition<T extends string>(
  transitions: Record<T, T[]>,
  from: T,
  to: T
) {
  const allowed = transitions[from]
  if (!allowed.includes(to)) {
    throw new InvalidStateTransitionException()
  }
}
