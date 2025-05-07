import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChartComponent } from '../components/chart/chart.component';
import { BannerComponent } from '../components/banner/banner.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatSidenavModule, ChartComponent, BannerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'graphs-final';
}
