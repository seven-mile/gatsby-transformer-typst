const { NodeCompiler, DynLayoutCompiler } = require('@myriaddreamin/typst-ts-node-compiler');

class Compiler {
  constructor() {
    const compileArgs = {
      ...NodeCompiler.defaultCompileArgs(),
      // workspace should be cwd
    };
    this.base = NodeCompiler.create(compileArgs);
    this.dyn = DynLayoutCompiler.fromBoxed(NodeCompiler.create(compileArgs).intoBoxed());
  }

  title(path) {
    return this.base.compile({
        mainFilePath: path
    }).result.title;
  }

  date(path) {
    return this.base.compile({
        mainFilePath: path
    }).result.date;
  }

  description(path) {
    return this.base.compile({
        mainFilePath: path
    }).result.authors?.[0];
  }

  vector(path) {
    try {
      return this.dyn.vector({
        mainFilePath: path
    });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

}

module.exports = Compiler;
