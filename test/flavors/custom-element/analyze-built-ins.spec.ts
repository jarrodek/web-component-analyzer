import { join } from 'path'
import { test } from '@japa/runner'
import { analyzeSourceFile } from '../../../src/analyze/analyze-source-file.js'
import { getCurrentTsModule, getCurrentTsModuleDirectory } from '../../helpers/ts-test.js'

test('analyzeSourceFile on lib.dom.ts returns correct result', ({ assert }) => {
  const tsModule = getCurrentTsModule()
  const program = tsModule.createProgram([join(getCurrentTsModuleDirectory(), 'lib.dom.d.ts')], {})

  const endsWithLibDom = 'lib.dom.d.ts'

  const domLibSourceFile = program.getSourceFiles().find((sf) => sf.fileName.endsWith(endsWithLibDom))
  if (domLibSourceFile == null) {
    throw new Error(`Couldn't find '${endsWithLibDom}'. Have you included the 'dom' lib in your tsconfig?`)
  }

  const result = analyzeSourceFile(domLibSourceFile, {
    program,
    ts: tsModule,
    config: {
      features: ['event', 'member', 'slot', 'csspart', 'cssproperty'],
      analyzeGlobalFeatures: false, // Don't analyze global features in lib.dom.d.ts
      analyzeDefaultLib: true,
      analyzeDependencies: true,
      analyzeAllDeclarations: false,
      excludedDeclarationNames: ['HTMLElement'],
    },
  })

  assert.isDefined(result)

  const scriptDefinition = result.componentDefinitions?.find((d) => d.tagName === 'script')
  assert.isDefined(scriptDefinition)

  const srcProperty = scriptDefinition!.declaration?.members.find((m) => m.kind === 'property' && m.propName === 'src')

  assert.isDefined(srcProperty)
  assert.isTrue(
    srcProperty!.visibility === undefined || srcProperty!.visibility === 'public',
    `srcProperty!.visibility is "${srcProperty!.visibility}"`
  )
})
