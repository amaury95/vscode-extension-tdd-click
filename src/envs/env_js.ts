import * as vscode from "vscode";
import { Utils } from "vscode-uri";
import * as _ from "lodash";

import TestSuite from "../interface";

export default class Jest implements TestSuite {
  private _allowedExtensions = [".ts", ".js", ".tsx", ".jsx"];
  private _testNameIndicator = [".test.", ".spec."];
  private _testPathIndicator = ["__tests__", "__mocks__"];

  isSet(): boolean {
    return true;
  }

  isCodeFile(file: vscode.Uri): boolean {
    const extension = Utils.extname(file);
    if (!_.includes(this._allowedExtensions, extension)) {
      return false;
    }

    const location = Utils.dirname(file);
    if (_.some(this._testPathIndicator, (p) => location.path.includes(p))) {
      return false;
    }

    const filename = Utils.basename(file);
    if (_.some(this._testNameIndicator, (p) => filename.includes(p))) {
      return false;
    }

    return true;
  }

  getTestFile(file: vscode.Uri): vscode.Uri {
    const extension = Utils.extname(file);
    const filename = Utils.basename(file);
    const location = Utils.dirname(file).path;

    return vscode.Uri.file(
      location +
        "/__tests__/" +
        filename.replace(extension, ".test" + extension)
    );
  }
}
