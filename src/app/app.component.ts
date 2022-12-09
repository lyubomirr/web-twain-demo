import { Component } from '@angular/core';
import { WebTwain } from 'dwt/dist/types/WebTwain';
import { DynamsoftStatic } from 'dwt/dist/types/Dynamsoft';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private static readonly WebTwainId = 'dwtId';
  private Dynamsoft: typeof DynamsoftStatic;
  private webTwainInstance: WebTwain | null;

  setup(): void {
    this.Dynamsoft.DWT.UseDefaultViewer = false;
    this.Dynamsoft.DWT.ResourcesPath = 'assets/dwt-resources';
    this.Dynamsoft.DWT.ProductKey = environment.key;

    this.Dynamsoft.DWT.OnWebTwainPreExecute = () => {};
    this.Dynamsoft.DWT.OnWebTwainPostExecute = () => {};

    (this.Dynamsoft as any).OnWebTwainNotFoundOnMacCallback = () => {};
    (this.Dynamsoft as any).OnWebTwainNotFoundOnWindowsCallback = () => {};
    (this.Dynamsoft as any).OnWebTwainNotFoundOnLinuxCallback = () => {};
    (this.Dynamsoft as any).OnRemoteWebTwainNotFoundCallback = () => {};                                                     
  }

  private initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      import('dwt').then(
        (dynamsoftModule: any) => {
          this.Dynamsoft = dynamsoftModule.default;
          this.setup();

          this.Dynamsoft.DWT.CreateDWTObjectEx(
            { WebTwainId: AppComponent.WebTwainId },
            (instance: WebTwain) => {
              this.webTwainInstance = instance;
              resolve();
            },
            (err: any) => {
              reject(err);
            }
          );
        },
        (err) => reject(err)
      );
    });
  }


  acquireImage(): void {
    this.initialize().then(
      () => {
        this.webTwainInstance?.AcquireImage(
          {
            IfShowUI: false,
            IfFeederEnabled: true,
            SelectSourceByIndex: 0,
            Resolution: 300,
          },
          () => {
            this.webTwainInstance?.CloseSource();
          },
          (err) => {
            console.log(err)
            this.webTwainInstance?.CloseSource();
          }
        );
      },
      (err: any) => console.log(err)
    );
  }
}
