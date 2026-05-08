export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent direct status changes on PortCall instances',
    },
    schema: [],
  },

  create(context) {
    function isInStateMachinesFile() {
      const filename = context.filename || context.physicalFilename || ''
      return filename.includes('state_machines')
    }

    function isPortCallVariable(node) {
      const portCallPatterns = ['portCall', 'port_call', 'pc', 'call']
      return (
        node?.type === 'Identifier' &&
        portCallPatterns.some((pattern) => node.name.toLowerCase().includes(pattern))
      )
    }

    function reportIfNotAllowed(node, objectNode) {
      if (isInStateMachinesFile()) return
      if (!isPortCallVariable(objectNode)) return

      context.report({
        node,
        message: 'Do not set status directly. Use PortCallStateManager.transition() instead.',
      })
    }

    return {
      AssignmentExpression(node) {
        if (node.left.type === 'MemberExpression') {
          const property = node.left.property
          const isStatusProperty =
            (property.type === 'Identifier' &&
              ['status', 'operational_phase'].includes(property.name)) ||
            (property.type === 'Literal' &&
              ['status', 'operational_phase'].includes(property.value))

          if (isStatusProperty) {
            reportIfNotAllowed(node, node.left.object)
          }
        }
      },

      CallExpression(node) {
        if (node.callee.type === 'MemberExpression' && node.callee.property?.name === 'merge') {
          const hasStatusOrPhase = node.arguments[0]?.properties?.some((p) =>
            ['status', 'operational_phase'].includes(p.key?.name)
          )

          if (hasStatusOrPhase) {
            reportIfNotAllowed(node, node.callee.object)
          }
        }
      },
    }
  },
}
