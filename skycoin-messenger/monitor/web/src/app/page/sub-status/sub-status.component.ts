import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, NodeServices, App } from '../../service';
import { MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-sub-status',
  templateUrl: './sub-status.component.html',
  styleUrls: ['./sub-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubStatusComponent implements OnInit, OnDestroy {
  displayedColumns = ['index', 'key', 'app'];
  dataSource: SubStatusDataSource = null;
  key = '';
  status: NodeServices = null;
  task = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.key = params.key;
      this.init();
      this.task = setInterval(() => {
        this.init();
      }, 10000);
    });
  }
  ngOnDestroy() {
    this.close();
  }
  refresh(ev: Event) {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    this.init();
    this.snackBar.open('Refreshed', 'Dismiss', {
      duration: 3000,
      verticalPosition: 'top',
      extraClasses: ['bg-success']
    });
  }
  close() {
    clearInterval(this.task);
  }
  init() {
    const data = new FormData();
    data.append('key', this.key);
    this.api.getNodeStatus(data).subscribe((nodeServices: NodeServices) => {
      if (nodeServices) {
        this.status = nodeServices;
        if (nodeServices.apps) {
          this.dataSource = new SubStatusDataSource(this.status.apps);
        }
      }
    });
  }
}
export class SubStatusDataSource extends DataSource<any> {
  size = 0;
  constructor(private apps: Array<App>) {
    super();
  }
  connect(): Observable<App[]> {
    return Observable.of(this.apps);
  }

  disconnect() { }
}