pesacheck.directive("pesacheckTimeline", [
  "$timeout","$animate","$stateParams", "$Story","$sce",
  function($timeout, $animate, $stateParams, $Story, $sce){
    return {
      restrict: "A",
      replace: false,
      link: function(scope, element, attrs, controller, transcludeFn){
        scope.layout= "loading-layout.html";

        var story;
        scope.$watch(
          function(){
            return attrs['story']
          },
          function(newVal, oldVal){
            story = $Story.get(newVal);

            story.$loaded(
              function(data) {
                // slide 1
                slides[0].data.imageUri = data.headlineImage;
                slides[0].data.headline = data.headline;
                slides[0].timeout = data.introDuration;
                // slide 2
                slides[1].timeout = data.explanationDuration;
                slides[1].data.stats = data.explanations;
                slides[1].data.title = data.explanationTitle;
                slides[1].layout = data.ExplanationLayout;
                slides[1].data.tweet = data.ExplanationTweet;


                // Slide 3
                slides[2].data.question = data.meterQuestion;
                slides[2].timeout = data.meterDuration;
                // slide 4
                slides[3].timeout = data.findingsDuration;
                slides[3].layout = data.findingsLayout;
                slides[3].data.stats = data.findings;
                slides[3].data.title = data.FindingsTitle;
                slides[3].data.chartUri = $sce.trustAsResourceUrl(data.findingsChart);
                // Slide 5
                slides[4].data.question = data.meterQuestion;
                slides[4].data.verdict = translateVerdict(data.meterVerdict);


                changeContext();
                // changeSlide();
              },
              function(error) {
                console.error("Error:", error);
              }
            );
          }
        );
        var slides = [
          {
            name: "slide1",
            tag: "intro",
            position: 1,
            layout: "image-headline",
            data: {
              imageUri: "http://www.kenya-today.com/wp-content/uploads/2015/10/179.jpg",
              headline: "the Former Prime Minister accuses the government of failing to account for some funds received from the Eurobond issued in June 2014."
            },
            timeout: 5
          },
          {
            name: "slide2",
            tag: "claim",
            position: 2,
            layout: "numbers",
            data: {
              title: "",
              stats: []
            },
            timeout: 5
          },
          {
            name: "slide3",
            tag: "question",
            position: 3,
            layout: "pesacheck-meter",
            data: {
              question: ""
            },
            timeout: 5
          },
          {
            name: "slide4",
            tag: "facts",
            position: 4,
            layout: "numbers",
            data: {
              title: "PesaCheck's findings",
              stats: [
                {
                  heading: "Proceeds deposited in Sep and Dec 2014",
                  description: "Amount transferred by the Government into a Sovereign Bond account at Central Bank",
                  figure: "88.46",
                  figureMeta: "Billion Kenya Shillings"
                }
                /*{
                  heading: "Athletes",
                  description: "Participants in the olympics 2016",
                  figure: "80",
                  figureMeta: "Billion Kenya Shillings"
                }*/
              ]
            },
            timeout: 5
          },
          {
            name: "slide5",
            tag: "verdict",
            position: 5,
            layout: "pesacheck-meter",
            data: {
              question: "is Mr. Raila Odinga justified in warning investors off a potential second Eurobond Issue?",
              verdict: 0
            },
            timeout: 5
          }
        ];


        scope.count = 0;
        scope.slides = slides;
        function translateVerdict(verdict){
          if(verdict == 'false'){
            return 0;
          }else if(verdict == 'partlytrue'){
            return 1;
          }else if(verdict == 'plausible'){
            return 2;
          }else if(verdict == 'true'){
            return 3;
          }
        }

        function changeContext () {
          scope.layout= slides[scope.count].layout + "-layout.html";
          scope.data = slides[scope.count].data;
          scope.tag = slides[scope.count].tag;
          scope.timeout = slides[scope.count].timeout;
          scope.position = slides[scope.count].position;
          // count++;
        }

        function changeSlide () {
          $timeout(function () {
             changeContext();
             if (scope.count < slides.length) {
                changeSlide();
             }
          }, slides[scope.count].timeout * 1000);
        }

        scope.nextSlide = function(){
          scope.count++;
          changeContext();
        }

        scope.previousSlide = function(){
          scope.count--;
          changeContext();
        }

        $animate.on('enter', element,
           function callback(el, phase) {
             $(element).addClass('animated fadeIn');
           }
        );

        $animate.on('leave', element,
           function callback(el, phase) {
             $(el).addClass('animated fadeOutLeft');
           }
        );
    }
  }
}]);

pesacheck.directive("bgImage", [
  function(){
    return {
      restrict: "A",
      replace: false,
      link: function(scope, element, attrs, controller, transcludeFn){

        var url = attrs.bgImage;
        console.log(url)
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
      }
    }
  }
]);
