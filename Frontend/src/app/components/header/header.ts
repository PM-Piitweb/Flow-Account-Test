import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  sidebarOpen = signal(false);

  tabs = [
    { name: 'Home', path: '/' }
  ];

  constructor(public router: Router) {}

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  navigate(tab: { name: string; path: string }) {
    this.router.navigate([tab.path]);
    this.closeSidebar();
  }

  isActive(tab: { name: string; path: string }) {
    return this.router.url === tab.path;
  }
}
